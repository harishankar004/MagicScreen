'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBookingStore } from '@/hooks/useBooking';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import BookingStepIndicator from '@/components/booking/BookingStepIndicator';
import { Cake, Heart, Sparkles, Tv, Clapperboard, PartyPopper, ArrowRight, ArrowLeft } from 'lucide-react';

const BOOKING_STEPS = ['Decoration', 'Date & Slot', 'Occasion', 'Cake', 'Add-Ons', 'Food', 'Details', 'Summary'];

const OCCASION_PRESETS = [
  { id: 'birthday',        label: 'Birthday Bash',     icon: Cake,        desc: 'Balloons, spotlight entries, and custom wishes.' },
  { id: 'anniversary',     label: 'Anniversary',       icon: Heart,       desc: 'Elegant setups with romantic instrumental background ambience.' },
  { id: 'proposal',        label: 'The Big Proposal',  icon: Sparkles,    desc: 'Ultra-luxurious premium lighting cue transitions.' },
  { id: 'date',            label: 'Date Night',        icon: Clapperboard,desc: 'Cosy intimate screening environment layout for two.' },
  { id: 'match_screening', label: 'Live Screening',    icon: Tv,          desc: 'High-octane tuning optimized for sports and stadium matches.' },
  { id: 'other',           label: 'Custom Party',      icon: PartyPopper, desc: 'Tailored setup mapped specifically to your requirements.' },
];

// Fallback IDs assuming a freshly-seeded DB (see DataSeeder.java) — only used if /api/occasions is unreachable
const OCCASION_ID_FALLBACK: Record<string, number> = {
  birthday: 1, anniversary: 2, proposal: 3, date: 4, match_screening: 5, other: 6,
};

// Keywords used to match each preset against the real occasion names returned by the backend
const OCCASION_KEYWORDS: Record<string, string> = {
  birthday: 'birthday',
  anniversary: 'anniversary',
  proposal: 'proposal',
  date: 'date night',
  match_screening: 'match',
  other: 'custom',
};

export default function OccasionPage() {
  const params = useParams();
  const router = useRouter();
  const theaterId = params.id as string;
  const store = useBookingStore() as any;

  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(store.occasion || null);
  const [occasionName, setOccasionName] = useState(store.occasionName || '');
  const [validationError, setValidationError] = useState<string | null>(null);

  const { data: occasions } = useQuery({
    queryKey: ['occasions'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/api/occasions');
        return Array.isArray(res.data) ? res.data : [];
      } catch {
        return [];
      }
    },
  });

  function resolveOccasionId(presetId: string): number | null {
    const keyword = OCCASION_KEYWORDS[presetId];
    const match = (occasions || []).find((o: any) =>
      keyword && (o.name || '').toLowerCase().includes(keyword)
    );
    if (match) return match.id;
    return OCCASION_ID_FALLBACK[presetId] ?? null;
  }

  // Always read from store — never from API on this page
  const basePrice       = store.basePrice       || 0;
  const guestSurcharge  = store.guestSurcharge  || 0;
  const decorationPrice = store.decorationPrice || 0;
  const subtotal        = basePrice + guestSurcharge + decorationPrice;

  const handleBack = () => router.push(`/theater/${theaterId}/book`);

  const handleContinue = () => {
    if (!selectedOccasion) { setValidationError('Please choose an experience variant.'); return; }
    const occasionId = resolveOccasionId(selectedOccasion);
    if (!occasionId) { setValidationError('Could not match occasion. Please try again.'); return; }
    store.setOccasion(selectedOccasion as any, occasionName.trim(), occasionId);
    setValidationError(null);
    router.push(`/theater/${theaterId}/cakes`);
  };

  return (
    <main className="booking-page min-h-screen bg-[#0D0D0D] text-white pb-12">
      <BookingStepIndicator steps={BOOKING_STEPS} currentStep={3} />

      <div className="booking-container max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="page-heading border-b border-white/5 pb-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
              Personalize Celebration Layout
            </h1>
            <p className="text-[#888] text-sm mt-1">
              Select your theme for <span className="text-white font-medium">{store.theaterName}</span>
            </p>
          </div>

          {validationError && (
            <div className="p-4 bg-red-950/40 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl">
              {validationError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {OCCASION_PRESETS.map((preset) => {
              const IconComponent = preset.icon;
              const isSelected = selectedOccasion === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => { setSelectedOccasion(preset.id); setValidationError(null); }}
                  className={`p-5 rounded-xl text-left border flex gap-4 transition-all duration-300 ${
                    isSelected
                      ? 'bg-[#D4A017]/10 border-[#D4A017] text-white shadow-[0_0_20px_rgba(212,160,23,0.05)]'
                      : 'bg-[#1A1A1A] border-white/5 hover:border-white/20 text-[#888] hover:text-white'
                  }`}
                >
                  <div className={`p-3 rounded-xl h-fit transition-colors ${isSelected ? 'bg-[#D4A017] text-black' : 'bg-[#0D0D0D] text-[#D4A017]'}`}>
                    <IconComponent size={20} />
                  </div>
                  <div className="space-y-1">
                    <h3 className={`font-bold text-sm tracking-wide ${isSelected ? 'text-[#D4A017]' : 'text-white'}`}>{preset.label}</h3>
                    <p className="text-xs text-[#888] leading-relaxed">{preset.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-6 rounded-2xl bg-[#1A1A1A] border border-white/10 space-y-3">
            <div>
              <label className="block text-sm font-bold tracking-wide text-white mb-1">Custom On-Screen Display Text</label>
              <p className="text-xs text-[#888]">Provide names or greetings to display on the main screen upon arrival.</p>
            </div>
            <div className="relative">
              <input
                type="text"
                maxLength={30}
                value={occasionName}
                onChange={(e) => setOccasionName(e.target.value)}
                placeholder="e.g., HAPPY BIRTHDAY RAHUL (Max 30 chars)"
                className="w-full rounded-xl border border-white/10 bg-[#0D0D0D] px-4 py-3.5 text-white font-mono text-sm uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#D4A017]/50 placeholder:text-[#444]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#555]">{occasionName.length}/30</span>
            </div>
          </div>
        </div>

        {/* Invoice Sidebar */}
        <div className="space-y-4">
          <div className="invoice-card p-6 rounded-2xl border border-white/10 bg-[#1A1A1A] sticky top-6 space-y-6">
            <h3 className="text-lg font-bold tracking-wide border-b border-white/5 pb-3">Reservation Invoice Overview</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center text-[#888]">
                <span>Screen:</span>
                <span className="text-white font-medium text-xs">{store.theaterName}</span>
              </div>
              <div className="flex justify-between items-center text-[#888]">
                <span>Date:</span>
                <span className="text-white font-mono text-xs">{store.date || 'Not selected'}</span>
              </div>
              <div className="flex justify-between items-center text-[#888]">
                <span>Slot:</span>
                <span className="text-white font-mono text-xs">{store.slotName || 'Not selected'}</span>
              </div>
              <div className="border-t border-white/5 pt-3 space-y-2">
                <div className="flex justify-between items-center text-[#888]">
                  <span>Base Screen Fee:</span>
                  <span className="text-white font-mono">₹{basePrice}</span>
                </div>
                {decorationPrice > 0 && (
                  <div className="flex justify-between items-center text-[#888]">
                    <span>Decoration ({store.decorationName}):</span>
                    <span className="text-[#D4A017] font-mono">+₹{decorationPrice}</span>
                  </div>
                )}
                {guestSurcharge > 0 && (
                  <div className="flex justify-between items-center text-[#888]">
                    <span>Guest Surcharge:</span>
                    <span className="text-[#D4A017] font-mono">+₹{guestSurcharge}</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t border-white/5 pt-2 font-bold">
                  <span className="text-[#888]">Subtotal:</span>
                  <span className="text-[#D4A017] font-mono">₹{subtotal}</span>
                </div>
              </div>
            </div>

            <div className="booking-actions grid grid-cols-3 gap-2 pt-2">
              <button type="button" onClick={handleBack}
                className="px-4 py-4 bg-[#0D0D0D] border border-white/10 hover:bg-white/5 transition-all rounded-2xl text-[#888] hover:text-white flex items-center justify-center">
                <ArrowLeft size={18} />
              </button>
              <button type="button" onClick={handleContinue}
                className="col-span-2 flex items-center justify-center gap-2 px-6 py-4 bg-[#D4A017] text-black font-bold text-sm rounded-2xl hover:bg-[#D4A017]/90 transition-all hover:scale-[1.01]">
                Select Cake <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}