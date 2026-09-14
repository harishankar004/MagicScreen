'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBookingStore } from '@/store/bookingStore';
import { useCreateBooking } from '@/hooks/useBooking';
import { BookingSchema } from '@/lib/schema';
import BookingStepIndicator from '@/components/booking/BookingStepIndicator';
import {
  Film, Calendar, Clock, Users, Cake, Sparkles, Utensils,
  CheckCircle2, ArrowLeft, CreditCard, Shield, ChevronRight, Baby
} from 'lucide-react';

// Use this same array in ALL booking step pages
const BOOKING_STEPS = ['Decoration', 'Date & Slot', 'Occasion', 'Cake', 'Add-Ons', 'Food', 'Details', 'Summary'];

const THEATER_FALLBACKS: Record<string, number> = {
  '1': 799, '2': 999, '3': 1199
};

export default function SummaryPage() {
  const params = useParams();
  const router = useRouter();
  const theaterId = (params?.id as string) || '';
  const store = useBookingStore() as any;
  const { mutate: createBooking, isPending } = useCreateBooking();

  const basePrice      = store.basePrice || THEATER_FALLBACKS[store.theaterId || ''] || 0;
  const cakePrice      = store.cakePrice || 0;
  const addonTotal     = (store.addonItems || []).reduce((sum: number, item: any) => sum + item.price, 0);
  const foodTotal      = (store.foodItems  || []).reduce((sum: number, item: any) => sum + (item.unit_price * item.quantity), 0);
  const guestSurcharge  = store.guestSurcharge  || 0;
  const decorationPrice = store.decorationPrice || 0;
  const grandTotal     = basePrice + cakePrice + addonTotal + foodTotal + guestSurcharge + decorationPrice;
  const advanceAmount  = Math.ceil(grandTotal * 0.5);
  const balanceAmount  = grandTotal - advanceAmount;

  const handleConfirm = () => {
    const payload = {
      slotId:       store.slotId     ? Number(store.slotId)     : 0,
      occasionId:   store.occasionId ? Number(store.occasionId) : 0,
      totalGuests:  Number(store.totalGuests) || 2,
      customerName:  store.customerName  || '',
      customerEmail: store.customerEmail || '',
      customerPhone: store.customerPhone || '',
    };

    const result = BookingSchema.safeParse(payload);
    if (!result.success) {
      console.error('Zod Validation Failed:', result.error.format());
      alert('Please complete all required booking steps before confirming.');
      return;
    }

    createBooking(result.data);
  };

  const Section = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
    <div className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-[#D4A017]/10 flex items-center justify-center shrink-0">
        <Icon size={14} className="text-[#D4A017]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-[#555] uppercase tracking-wider font-bold">{label}</p>
        <p className="text-sm text-white font-semibold truncate mt-0.5">{value}</p>
      </div>
    </div>
  );

  const LineItem = ({ label, amount, highlight = false }: { label: string; amount: number; highlight?: boolean }) => (
    <div className={`flex justify-between items-center text-sm ${highlight ? '' : 'text-[#888]'}`}>
      <span className="truncate mr-2">{label}</span>
      <span className={`font-mono font-medium shrink-0 ${highlight ? 'text-[#D4A017] font-black text-base' : 'text-white'}`}>
        ₹{amount.toLocaleString('en-IN')}
      </span>
    </div>
  );

  return (
    <main className="booking-page min-h-screen bg-[#0D0D0D] text-white pb-16">
      <BookingStepIndicator steps={BOOKING_STEPS} currentStep={8} />

      <div className="booking-container max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D4A017]/10 border border-[#D4A017]/20 rounded-full text-xs text-[#D4A017] font-bold tracking-wider mb-4">
            <CheckCircle2 size={12} /> FINAL REVIEW
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Confirm Your Reservation
          </h1>
          <p className="text-[#555] text-sm mt-2">Review all details before confirming. 50% advance secures your slot.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left — Booking Details */}
          <div className="lg:col-span-3 space-y-5">

            {/* Core Booking Info */}
            <div className="booking-card bg-[#1A1A1A] border border-white/10 rounded-2xl p-6">
              <h2 className="text-xs text-[#D4A017] font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <Film size={12} /> Booking Details
              </h2>
              <Section icon={Film}     label="Private Theater" value={store.theaterName || '—'} />
              <Section icon={Calendar} label="Date" value={store.date ? new Date(store.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '—'} />
              <Section icon={Clock}    label="Time Slot"  value={store.slotName  || '—'} />
              <Section icon={Sparkles} label="Occasion"   value={store.occasionName || store.occasion || '—'} />
            </div>

            {/* Decoration */}
            {decorationPrice > 0 && (
              <div className="booking-card bg-[#1A1A1A] border border-white/10 rounded-2xl p-6">
                <h2 className="text-xs text-[#D4A017] font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                  ✨ Decoration Package
                </h2>
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-[#888]">✨ {store.decorationName || 'Decoration'}</span>
                  <span className="text-white font-mono">₹{decorationPrice}</span>
                </div>
              </div>
            )}

            {/* Extra Guests */}
            {(store.extraAdults > 0 || store.extraChildren > 0) && (
              <div className="booking-card bg-[#1A1A1A] border border-white/10 rounded-2xl p-6">
                <h2 className="text-xs text-[#D4A017] font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Users size={12} /> Extra Guests
                </h2>
                {store.extraAdults > 0 && (
                  <div className="flex items-center justify-between py-2 text-sm border-b border-white/5">
                    <span className="text-[#888] flex items-center gap-2">
                      <Users size={13} /> {store.extraAdults} Extra Adult{store.extraAdults > 1 ? 's' : ''}
                    </span>
                    <span className="text-white font-mono">₹{store.extraAdults * 150}</span>
                  </div>
                )}
                {store.extraChildren > 0 && (
                  <div className="flex items-center justify-between py-2 text-sm">
                    <span className="text-[#888] flex items-center gap-2">
                      <Baby size={13} /> {store.extraChildren} Child{store.extraChildren > 1 ? 'ren' : ''}
                    </span>
                    <span className="text-white font-mono">₹{store.extraChildren * 100}</span>
                  </div>
                )}
              </div>
            )}

            {/* Cake & Add-Ons */}
            {(cakePrice > 0 || addonTotal > 0) && (
              <div className="booking-card bg-[#1A1A1A] border border-white/10 rounded-2xl p-6">
                <h2 className="text-xs text-[#D4A017] font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Cake size={12} /> Extras & Add-Ons
                </h2>
                {cakePrice > 0 && (
                  <div className="flex justify-between py-2 text-sm border-b border-white/5">
                    <span className="text-[#888]">🎂 {store.cakeName || 'Celebration Cake'}</span>
                    <span className="text-white font-mono">₹{cakePrice}</span>
                  </div>
                )}
                {(store.addonItems || []).map((a: any) => (
                  <div key={a.id} className="flex justify-between py-2 text-sm border-b border-white/5 last:border-0">
                    <span className="text-[#888]">✨ {a.name}</span>
                    <span className="text-white font-mono">₹{a.price}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Food */}
            {foodTotal > 0 && (
              <div className="booking-card bg-[#1A1A1A] border border-white/10 rounded-2xl p-6">
                <h2 className="text-xs text-[#D4A017] font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Utensils size={12} /> Food & Beverages
                </h2>
                {(store.foodItems || []).map((item: any) => (
                  <div key={item.food_item_id} className="flex justify-between py-2 text-sm border-b border-white/5 last:border-0">
                    <span className="text-[#888]">
                      {item.food_item?.name || 'Item'} <span className="text-[#555] text-xs">x{item.quantity}</span>
                    </span>
                    <span className="text-white font-mono">₹{item.unit_price * item.quantity}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Contact Info */}
            <div className="booking-card bg-[#1A1A1A] border border-white/10 rounded-2xl p-6">
              <h2 className="text-xs text-[#D4A017] font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <Users size={12} /> Contact Details
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#555]">Name</span><span className="text-white">{store.customerName || '—'}</span></div>
                <div className="flex justify-between"><span className="text-[#555]">Phone</span><span className="text-white">{store.customerPhone || '—'}</span></div>
                <div className="flex justify-between"><span className="text-[#555]">Email</span><span className="text-white truncate max-w-[200px]">{store.customerEmail || '—'}</span></div>
              </div>
            </div>

            <button
              onClick={() => router.push(`/theater/${theaterId || store.theaterId}/details`)}
              className="text-xs text-[#555] hover:text-[#D4A017] flex items-center gap-1 transition-colors"
            >
              <ArrowLeft size={12} /> Edit Details
            </button>
          </div>

          {/* Right — Payment Sidebar */}
          <div className="lg:col-span-2 space-y-5">
            <div className="booking-card bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 sticky top-6 space-y-5">
              <h3 className="font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
                <CreditCard size={15} className="text-[#D4A017]" /> Payment Breakdown
              </h3>

              <div className="space-y-3">
                <LineItem label="Base Screen Fee" amount={basePrice} />
                {guestSurcharge > 0 && <LineItem label="Guest Surcharge" amount={guestSurcharge} />}
                {decorationPrice > 0 && <LineItem label={`Decoration (${store.decorationName || ''})`} amount={decorationPrice} />}
                {cakePrice > 0 && <LineItem label="Cake" amount={cakePrice} />}
                {addonTotal > 0 && <LineItem label="Add-Ons" amount={addonTotal} />}
                {foodTotal > 0 && <LineItem label="Food & Beverages" amount={foodTotal} />}
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#888] text-sm">Grand Total</span>
                  <span className="text-white font-mono font-bold text-lg">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* 50% Advance Box */}
              <div className="rounded-xl overflow-hidden border border-[#D4A017]/30">
                <div className="bg-[#D4A017]/10 px-4 py-3 flex items-center gap-2">
                  <Shield size={14} className="text-[#D4A017]" />
                  <span className="text-[#D4A017] text-xs font-bold uppercase tracking-wider">50% Advance Required</span>
                </div>
                <div className="p-4 space-y-3 bg-[#0D0D0D]">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#888]">Pay Now (50%)</span>
                    <span className="text-[#D4A017] font-mono font-black text-xl">₹{advanceAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#555]">Balance at Venue</span>
                    <span className="text-[#555] font-mono text-sm">₹{balanceAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="border-t border-white/5 pt-2 space-y-1.5">
                    <div className="flex justify-between text-[10px] text-[#444]">
                      <span>Grand Total</span>
                      <span className="font-mono">₹{grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-[#444]">
                      <span>Advance (50%)</span>
                      <span className="font-mono text-[#D4A017]">₹{advanceAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-[#444]">
                      <span>Balance due at venue</span>
                      <span className="font-mono">₹{balanceAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-[10px] text-[#444] leading-relaxed pt-1">
                      Your slot is confirmed instantly after advance payment.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 py-4 bg-[#D4A017] text-black font-bold text-base rounded-2xl hover:bg-[#D4A017]/90 transition-all hover:scale-[1.01] shadow-[0_0_30px_rgba(212,160,23,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Pay ₹{advanceAmount.toLocaleString('en-IN')} & Confirm <ChevronRight size={16} /></>
                )}
              </button>

              <p className="text-[10px] text-center text-[#444]">
                Secure payment · Slot confirmed instantly after payment
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}