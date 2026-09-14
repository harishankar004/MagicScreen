'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBookingStore } from '@/hooks/useBooking';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import BookingStepIndicator from '@/components/booking/BookingStepIndicator';
import { Cake, ArrowRight, ArrowLeft } from 'lucide-react';

const BOOKING_STEPS = ['Decoration', 'Date & Slot', 'Occasion', 'Cake', 'Add-Ons', 'Food', 'Details', 'Summary'];

export default function CakeSelectionPage() {
  const params = useParams();
  const router = useRouter();
  const theaterId = params.id as string;
  const store = useBookingStore() as any;

  const [selectedCakeId, setSelectedCakeId] = useState<string | null>(store.cakeId || null);

  const { data: rawCakes, isLoading: isCakesLoading, error } = useQuery({
    queryKey: ['cakes'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/api/addons/cakes');
        return res.data;
      } catch {
        return [];
      }
    },
  });

  const formattedCakes = (rawCakes || []).map((c: any) => ({
    id: c.id?.toString() || 'unknown',
    name: c.name || 'Unnamed Cake',
    base_price: Number(c.price || 0),
    imageUrl: c.imageUrl || '',
  }));

  const currentSelectedCake = formattedCakes.find((c: any) => c.id === selectedCakeId);
  const dynamicCakePrice = currentSelectedCake ? currentSelectedCake.base_price : 0;

  // Always read from store — never from theater API
  const basePrice       = store.basePrice       || 0;
  const guestSurcharge  = store.guestSurcharge  || 0;
  const decorationPrice = store.decorationPrice || 0;
  const subtotal        = basePrice + guestSurcharge + decorationPrice + dynamicCakePrice;

  const handleBack = () => router.push(`/theater/${theaterId}/occasion`);

  const handleContinue = () => {
    store.setCake({
      cakeId: selectedCakeId,
      cakeName: currentSelectedCake?.name || '',
      cakePrice: dynamicCakePrice,
    });
    router.push(`/theater/${theaterId}/addons`);
  };

  return (
    <main className="booking-page min-h-screen bg-[#0D0D0D] text-white pb-12">
      <BookingStepIndicator steps={BOOKING_STEPS} currentStep={4} />
      <div className="booking-container max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="page-heading border-b border-white/5 pb-4">
            <h1 className="text-3xl font-extrabold flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
              <Cake className="text-[#D4A017]" /> Select Celebration Cake
            </h1>
            <p className="text-[#888] text-sm mt-1">Choose a cake or skip to continue.</p>
          </div>

          <div className="space-y-3">
            {isCakesLoading ? (
              <div className="text-[#888]">Loading cakes...</div>
            ) : error ? (
              <div className="text-red-500">Error loading cakes.</div>
            ) : formattedCakes.length === 0 ? (
              <div className="text-[#888]">No cakes available.</div>
            ) : (
              formattedCakes.map((c: any) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCakeId(selectedCakeId === c.id ? null : c.id)}
                  className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${
                    selectedCakeId === c.id
                      ? 'border-[#D4A017] bg-[#D4A017]/5'
                      : 'border-white/5 bg-[#1A1A1A] hover:border-white/20'
                  }`}
                >
                  {c.imageUrl ? (
                    <img src={c.imageUrl} alt={c.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-[#0D0D0D] border border-white/10 flex items-center justify-center text-2xl shrink-0">🎂</div>
                  )}
                  <div className="text-left flex-1">
                    <h4 className="font-bold">{c.name}</h4>
                    <p className="text-xs text-[#888]">Artisanal celebration cake</p>
                  </div>
                  <span className="font-mono font-bold shrink-0">₹{c.base_price}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Invoice Sidebar */}
        <div className="invoice-card p-6 rounded-2xl border border-white/10 bg-[#1A1A1A] sticky top-6 space-y-5">
          <h3 className="font-bold border-b border-white/5 pb-3">Invoice Overview</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-[#888]">
              <span>Base Screen Fee:</span>
              <span className="text-white font-mono">₹{basePrice}</span>
            </div>
            {decorationPrice > 0 && (
              <div className="flex justify-between text-[#888]">
                <span>Decoration ({store.decorationName}):</span>
                <span className="text-[#D4A017] font-mono">+₹{decorationPrice}</span>
              </div>
            )}
            {guestSurcharge > 0 && (
              <div className="flex justify-between text-[#888]">
                <span>Guest Surcharge:</span>
                <span className="text-[#D4A017] font-mono">+₹{guestSurcharge}</span>
              </div>
            )}
            {dynamicCakePrice > 0 && (
              <div className="flex justify-between text-[#888]">
                <span>Cake:</span>
                <span className="text-white font-mono">₹{dynamicCakePrice}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-white/5 pt-2">
              <span className="text-[#888]">Subtotal:</span>
              <span className="text-[#D4A017] font-black font-mono">₹{subtotal}</span>
            </div>
          </div>
          <div className="booking-actions grid grid-cols-3 gap-2 pt-2">
            <button onClick={handleBack}
              className="px-4 py-4 bg-[#0D0D0D] border border-white/10 hover:bg-white/5 transition-all rounded-2xl text-[#888] hover:text-white flex items-center justify-center">
              <ArrowLeft size={18} />
            </button>
            <button onClick={handleContinue}
              className="col-span-2 flex items-center justify-center gap-2 px-6 py-4 bg-[#D4A017] text-black font-bold text-sm rounded-2xl hover:bg-[#D4A017]/90 transition-all">
              {selectedCakeId ? 'Select Add-Ons' : 'Skip Cake'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}