'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBookingStore } from '@/hooks/useBooking';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import BookingStepIndicator from '@/components/booking/BookingStepIndicator';
import SlotPicker from '@/components/booking/SlotPicker';
import { Film, ArrowRight, Shield, Users, Plus, Minus, Baby, Heart, Lock } from 'lucide-react';

// Use this same array in ALL booking step pages
const BOOKING_STEPS = ['Decoration', 'Date & Slot', 'Occasion', 'Cake', 'Add-Ons', 'Food', 'Details', 'Summary'];

const THEATER_FALLBACKS: Record<string, { name: string; base_price: number; coupleOnly: boolean }> = {
  '1': { name: 'Blue',           base_price: 799,  coupleOnly: false },
  '2': { name: 'Gold',           base_price: 999,  coupleOnly: false },
  '3': { name: 'Red Love',       base_price: 1199, coupleOnly: true  },
  '4': { name: 'Jail Dark Cell', base_price: 1399, coupleOnly: false },
};

// Parse time strings like "09:00", "21:00", "9:00 AM", "9:00 PM" into hours+minutes
function parseSlotTime(timeStr: string): { hours: number; minutes: number } | null {
  if (!timeStr) return null;
  // Format: "HH:MM" 24hr
  const match24 = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) return { hours: parseInt(match24[1]), minutes: parseInt(match24[2]) };
  // Format: "HH:MM AM/PM"
  const match12 = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match12) {
    let hours = parseInt(match12[1]);
    const minutes = parseInt(match12[2]);
    const period = match12[3].toUpperCase();
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return { hours, minutes };
  }
  return null;
}

function isSlotInPast(slotStartTime: string, slotDate: string): boolean {
  const todayStr = new Date().toISOString().split('T')[0];
  if (slotDate !== todayStr) return false; // Only grey out for today

  const parsed = parseSlotTime(slotStartTime);
  if (!parsed) return false;

  const now = new Date();
  const slotDateTime = new Date();
  slotDateTime.setHours(parsed.hours, parsed.minutes, 0, 0);

  return slotDateTime <= now;
}

export default function BookSlotPage() {
  const params = useParams();
  const router = useRouter();
  const theaterId = params.id as string;
  const store = useBookingStore() as any;

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(store.date || todayStr);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(
    store.slotId ? String(store.slotId) : null
  );
  const [extraAdults, setExtraAdults] = useState<number>(store.extraAdults || 0);
  const [extraChildren, setExtraChildren] = useState<number>(store.extraChildren || 0);

  const ADULT_SURCHARGE = 150;
  const CHILD_SURCHARGE = 100;
  const guestSurcharge = extraAdults * ADULT_SURCHARGE + extraChildren * CHILD_SURCHARGE;

  const { data: theater, isLoading: isTheaterLoading } = useQuery({
    queryKey: ['theater', theaterId],
    queryFn: async () => {
      try {
        const res = await apiClient.get(`/api/theaters/${theaterId}`);
        return res.data;
      } catch {
        return { id: theaterId, ...(THEATER_FALLBACKS[theaterId] || { name: 'Private Theater', base_price: 799, coupleOnly: false }) };
      }
    },
    enabled: !!theaterId,
  });

  const { data: rawSlots, isLoading: isSlotsLoading } = useQuery({
    queryKey: ['slots', theaterId, selectedDate],
    queryFn: async () => {
      try {
        const res = await apiClient.get(`/api/slots?theaterId=${theaterId}&date=${selectedDate}`);
        return res.data && res.data.length > 0 ? res.data : [];
      } catch {
        return [];
      }
    },
    enabled: !!theaterId && !!selectedDate,
  });

  const formattedSlots = (rawSlots || []).map((s: any) => {
    const isBooked = s.status === 'BOOKED';
    const isHeld = s.status === 'HELD' && s.held_until && new Date(s.held_until) > new Date();
    const startTime = s.start_time || s.startTime || '';
    const endTime = s.end_time || s.endTime || '';
    const timeRange = s.time_range || ((startTime && endTime) ? `${startTime} - ${endTime}` : 'Time TBD');
    const slotName = s.name && s.name !== timeRange ? s.name : timeRange;

    // Grey out past slots for today
    const isPast = isSlotInPast(startTime, selectedDate);

    return {
      slot_id: String(s.id),
      name: slotName,
      time_range: timeRange,
      status: (isBooked || isHeld || isPast) ? 'booked' : 'available',
      isPast,
    };
  });

  const isCoupleOnly = THEATER_FALLBACKS[theaterId]?.coupleOnly || theater?.coupleOnly || theater?.couple_only || false;

  useEffect(() => {
    if (theater) {
      store.setTheater({
        theaterId: String(theater.id),
        theaterName: theater.name,
        basePrice: Number(theater.base_price ?? theater.basePrice ?? THEATER_FALLBACKS[theaterId]?.base_price ?? 0),
      });
    }
  }, [theater]);

  useEffect(() => {
    if (isCoupleOnly) { setExtraAdults(0); setExtraChildren(0); }
  }, [isCoupleOnly]);

  useEffect(() => { setSelectedSlotId(null); }, [selectedDate]);

  const handleContinue = () => {
    if (!selectedSlotId) return;
    const matchingSlot = formattedSlots.find((s: any) => s.slot_id === selectedSlotId);
    store.setDate(selectedDate);
    store.setDuration('standard');
    store.setSlot({ slotId: String(selectedSlotId), slotName: matchingSlot ? matchingSlot.name : 'Selected Slot' });
    store.setGuestCounts({
      extraAdults: isCoupleOnly ? 0 : extraAdults,
      extraChildren: isCoupleOnly ? 0 : extraChildren,
    });
    // Go to decoration page next
    router.push(`/theater/${theaterId}/occasion`);
  };

  const basePrice = store.basePrice || theater?.base_price || THEATER_FALLBACKS[theaterId]?.base_price || 0;
  const totalWithGuests = basePrice + guestSurcharge;

  if (isTheaterLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#D4A017] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <main className="booking-page min-h-screen bg-[#0D0D0D] text-white pb-12">
      <BookingStepIndicator steps={BOOKING_STEPS} currentStep={2} />

      <div className="booking-container max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="page-heading border-b border-white/5 pb-4">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
                <Film className="text-[#D4A017]" /> Reserve Screen Profile
              </h1>
              {isCoupleOnly && (
                <span className="px-3 py-1 bg-[#D4A017] text-black text-xs font-bold rounded-full flex items-center gap-1">
                  <Heart size={10} fill="black" /> COUPLE ONLY
                </span>
              )}
            </div>
            <p className="text-[#888] text-sm mt-1">
              Configure your slot for: <span className="text-white font-semibold">{theater?.name || store.theaterName}</span>
            </p>
          </div>

          <SlotPicker
            slots={formattedSlots}
            selectedSlotId={selectedSlotId}
            onSlotSelect={setSelectedSlotId}
            isLoading={isSlotsLoading}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />

          {/* Guest Section */}
          {isCoupleOnly ? (
            <div className="bg-[#1A1A1A] border border-[#D4A017]/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4A017]/10 flex items-center justify-center">
                  <Heart size={18} className="text-[#D4A017]" fill="#D4A017" />
                </div>
                <div>
                  <h2 className="font-bold text-white">Couple Only Theater</h2>
                  <p className="text-xs text-[#555]">This suite is exclusively designed for 2 guests</p>
                </div>
              </div>
              <div className="bg-[#0D0D0D] rounded-xl p-4 flex items-start gap-3 border border-white/5">
                <Lock size={14} className="text-[#D4A017] mt-0.5 shrink-0" />
                <p className="text-xs text-[#888] leading-relaxed">
                  The <span className="text-[#D4A017] font-semibold">Red Love</span> suite is crafted exclusively for couples. Additional guests are not permitted.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between p-3 bg-[#D4A017]/5 border border-[#D4A017]/20 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-[#888]">
                  <Users size={14} className="text-[#D4A017]" />
                  <span>Fixed Guest Count:</span>
                </div>
                <span className="text-white font-bold font-mono">2 Guests (Couple)</span>
              </div>
            </div>
          ) : (
            <div className="booking-card bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                <Users size={18} className="text-[#D4A017]" />
                <h2 className="font-bold text-white">Extra Guests</h2>
                <span className="text-xs text-[#555] ml-1">(Base booking includes default guests)</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Extra Adults</p>
                  <p className="text-xs text-[#555] mt-0.5">Age 18+ · <span className="text-[#D4A017]">+₹{ADULT_SURCHARGE} per person</span></p>
                </div>
                <div className="flex items-center gap-3 bg-[#0D0D0D] border border-white/10 rounded-xl px-2 py-1">
                  <button type="button" onClick={() => setExtraAdults(Math.max(0, extraAdults - 1))} disabled={extraAdults === 0}
                    className="p-2 rounded-lg text-[#D4A017] hover:bg-white/5 disabled:text-[#333] disabled:cursor-not-allowed transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-white">{extraAdults}</span>
                  <button type="button" onClick={() => setExtraAdults(extraAdults + 1)}
                    className="p-2 rounded-lg text-[#D4A017] hover:bg-white/5 transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                    <Baby size={14} className="text-[#888]" /> Extra Children
                  </p>
                  <p className="text-xs text-[#555] mt-0.5">Age 5-17 · <span className="text-[#D4A017]">+₹{CHILD_SURCHARGE} per child</span></p>
                </div>
                <div className="flex items-center gap-3 bg-[#0D0D0D] border border-white/10 rounded-xl px-2 py-1">
                  <button type="button" onClick={() => setExtraChildren(Math.max(0, extraChildren - 1))} disabled={extraChildren === 0}
                    className="p-2 rounded-lg text-[#D4A017] hover:bg-white/5 disabled:text-[#333] disabled:cursor-not-allowed transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-white">{extraChildren}</span>
                  <button type="button" onClick={() => setExtraChildren(extraChildren + 1)}
                    className="p-2 rounded-lg text-[#D4A017] hover:bg-white/5 transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              {guestSurcharge > 0 && (
                <div className="bg-[#D4A017]/5 border border-[#D4A017]/20 rounded-xl p-3 flex justify-between items-center">
                  <span className="text-xs text-[#888]">Guest Surcharge</span>
                  <span className="text-sm font-mono font-bold text-[#D4A017]">+₹{guestSurcharge}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Invoice Sidebar */}
        <div className="space-y-4">
          <div className="invoice-card p-6 rounded-2xl border border-white/10 bg-[#1A1A1A] sticky top-6 space-y-6">
            <h3 className="text-lg font-bold tracking-wide border-b border-white/5 pb-3">Reservation Invoice Overview</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center text-[#888]">
                <span>Base Suite Booking Fee:</span>
                <span className="text-white font-mono font-medium">₹{basePrice}</span>
              </div>
              {isCoupleOnly ? (
                <div className="flex justify-between items-center text-[#888]">
                  <span>Guests:</span>
                  <span className="text-white font-mono flex items-center gap-1">
                    <Heart size={10} className="text-[#D4A017]" fill="#D4A017" /> 2 (Couple)
                  </span>
                </div>
              ) : (
                <>
                  {guestSurcharge > 0 && (
                    <div className="flex justify-between items-center text-[#888]">
                      <span>Guest Surcharge:</span>
                      <span className="text-[#D4A017] font-mono font-medium">+₹{guestSurcharge}</span>
                    </div>
                  )}
                  {(extraAdults > 0 || extraChildren > 0) && (
                    <div className="bg-[#0D0D0D] rounded-xl p-3 space-y-1.5 text-xs text-[#555]">
                      {extraAdults > 0 && <div className="flex justify-between"><span>{extraAdults} Adult{extraAdults > 1 ? 's' : ''} x ₹{ADULT_SURCHARGE}</span><span className="text-white">₹{extraAdults * ADULT_SURCHARGE}</span></div>}
                      {extraChildren > 0 && <div className="flex justify-between"><span>{extraChildren} Child{extraChildren > 1 ? 'ren' : ''} x ₹{CHILD_SURCHARGE}</span><span className="text-white">₹{extraChildren * CHILD_SURCHARGE}</span></div>}
                    </div>
                  )}
                </>
              )}
              <div className="flex justify-between items-center text-[#555] border-t border-white/5 pt-3 text-xs">
                <span>Decoration / Cake / Food:</span>
                <span>Added in next steps</span>
              </div>
              <div className="flex justify-between items-center font-bold border-t border-white/5 pt-3">
                <span className="text-[#888] text-sm">Subtotal so far:</span>
                <span className="text-[#D4A017] font-mono">₹{isCoupleOnly ? basePrice : totalWithGuests}</span>
              </div>
            </div>
            <div className="bg-[#0D0D0D] p-4 rounded-xl border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#888]">
                <Shield size={12} className="text-[#D4A017]" /> 50% Advance Required at Checkout
              </div>
              <p className="text-[11px] text-[#555] leading-relaxed">
                Half the total amount is collected upfront. Remaining 50% is due at the venue.
              </p>
            </div>
            <button type="button" disabled={!selectedSlotId} onClick={handleContinue}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#D4A017] text-black font-bold text-base rounded-2xl hover:bg-[#D4A017]/90 transition-all hover:scale-[1.02] shadow-[0_0_30px_rgba(212,160,23,0.15)] disabled:opacity-40 disabled:cursor-not-allowed">
                Configure Personalization <ArrowRight size={16} />

            </button>
          </div>
        </div>
      </div>
    </main>
  );
}