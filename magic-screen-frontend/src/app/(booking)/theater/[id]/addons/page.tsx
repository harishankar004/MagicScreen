'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBookingStore } from '@/hooks/useBooking';
import BookingStepIndicator from '@/components/booking/BookingStepIndicator';
import { Sparkles, Gift, Camera, PartyPopper, Flame, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { IMAGES } from '@/lib/images';

const BOOKING_STEPS = ['Decoration', 'Date & Slot', 'Occasion', 'Cake', 'Add-Ons', 'Food', 'Details', 'Summary'];

const MOCK_ADDONS_CATALOG = [
  { id: 'addons-01', name: 'Rose Bouquet',                price: 399,  desc: 'A stunning arrangement of 10 fresh red roses.',                          icon: Gift,        imageUrl: IMAGES.addons.roseBouquet },
  { id: 'addons-02', name: 'Photography Service',         price: 999,  desc: 'Professional coverage of your celebration (20+ digital copies).',        icon: Camera,      imageUrl: IMAGES.addons.photography },
  { id: 'addons-03', name: 'Premium Balloon Decoration',  price: 1499, desc: 'Elegant metallic and chrome balloon setup around the screen arch.',      icon: PartyPopper, imageUrl: IMAGES.addons.balloon },
  { id: 'addons-04', name: 'Cold Smoke Entry Fire shots', price: 499,  desc: 'Stunning cold pyro flash sequences during your entry or cake cutting.',  icon: Flame,       imageUrl: IMAGES.addons.coldSmoke },
];

export default function AddonsPage() {
  const params = useParams();
  const router = useRouter();
  const theaterId = params.id as string;
  const store = useBookingStore() as any;

  const [selectedAddonsIds, setSelectedAddonsIds] = useState<string[]>(store.addonIds || []);
  const isAddonsLoading = false;

  // Frontend-only catalog for now — no backend endpoint exists for add-ons yet.
  const formattedAddons = MOCK_ADDONS_CATALOG.map((addon) => ({
    id: addon.id,
    name: addon.name,
    price: addon.price,
    desc: addon.desc,
    icon: addon.icon,
    imageUrl: addon.imageUrl,
  }));

  const toggleAddon = (id: string) => {
    setSelectedAddonsIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const activeSelectedAddons = formattedAddons.filter((a: any) => selectedAddonsIds.includes(a.id));
  const addonsTotalCost = activeSelectedAddons.reduce((sum: number, item: any) => sum + item.price, 0);

  // Always read from store
  const basePrice       = store.basePrice       || 0;
  const guestSurcharge  = store.guestSurcharge  || 0;
  const decorationPrice = store.decorationPrice || 0;
  const cakePrice       = store.cakePrice       || 0;
  const aggregateRunningTotal = basePrice + guestSurcharge + decorationPrice + cakePrice + addonsTotalCost;

  const handleBack = () => router.push(`/theater/${theaterId}/cakes`);

  const handleContinue = () => {
    store.setAddonItems(activeSelectedAddons.map((a: any) => ({ id: a.id, name: a.name, price: a.price })));
    router.push(`/theater/${theaterId}/food`);
  };

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white pb-12">
      <BookingStepIndicator steps={BOOKING_STEPS} currentStep={5} />

      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
              <Sparkles className="text-[#D4A017]" /> Upgrade Celebration Experience
            </h1>
            <p className="text-[#888] text-sm mt-1">Select optional upgrades. Our team will arrange everything before your arrival.</p>
          </div>

          {isAddonsLoading ? (
            <div className="space-y-3">
              {[1,2,3,4].map(n => <div key={n} className="h-24 bg-[#1A1A1A] rounded-xl animate-pulse border border-white/5" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {formattedAddons.map((addon: any) => {
                const isSelected = selectedAddonsIds.includes(addon.id);
                const IconComponent = addon.icon;
                return (
                  <button key={addon.id} type="button" onClick={() => toggleAddon(addon.id)}
                    className={`p-5 rounded-xl text-left border flex items-center justify-between transition-all duration-200 group ${
                      isSelected
                        ? 'bg-[#D4A017]/5 border-[#D4A017] text-white'
                        : 'bg-[#1A1A1A] border-white/5 text-[#888] hover:text-white hover:border-white/10'
                    }`}>
                    <div className="flex gap-4 items-center">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                        isSelected ? 'bg-[#D4A017] border-[#D4A017] text-black' : 'border-white/20 bg-[#0D0D0D] group-hover:border-white/40'
                      }`}>
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                      {addon.imageUrl ? (
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-[#0D0D0D]">
                          <Image src={addon.imageUrl} alt={addon.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className={`p-2.5 rounded-xl transition-colors shrink-0 ${isSelected ? 'bg-[#D4A017]/20 text-[#D4A017]' : 'bg-[#0D0D0D] text-[#888] group-hover:text-white'}`}>
                          <IconComponent size={20} />
                        </div>
                      )}
                      <div>
                        <h4 className={`text-sm font-bold tracking-wide ${isSelected ? 'text-[#D4A017]' : 'text-white'}`}>{addon.name}</h4>
                        <p className="text-xs text-[#888] mt-0.5 leading-relaxed max-w-md">{addon.desc}</p>
                      </div>
                    </div>
                    <div className="pl-4 text-right min-w-[70px]">
                      <span className="text-sm font-mono font-bold text-white">+₹{addon.price}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Invoice Sidebar */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl border border-white/10 bg-[#1A1A1A] sticky top-6 space-y-6">
            <h3 className="text-lg font-bold tracking-wide border-b border-white/5 pb-3">Reservation Invoice Overview</h3>
            <div className="space-y-3 text-sm">
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
              {cakePrice > 0 && (
                <div className="flex justify-between items-center text-[#888]">
                  <span>Cake:</span>
                  <span className="text-white font-mono">₹{cakePrice}</span>
                </div>
              )}
              {activeSelectedAddons.length > 0 && (
                <div className="space-y-2 border-t border-white/5 pt-3">
                  <span className="text-xs text-[#555] block font-bold uppercase tracking-wider">Add-Ons Selected:</span>
                  {activeSelectedAddons.map((addon: any) => (
                    <div key={addon.id} className="flex justify-between items-center text-xs pl-2 text-[#888]">
                      <span className="truncate max-w-[180px] text-[#bbb]">{addon.name}</span>
                      <span className="font-mono">₹{addon.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-[#0D0D0D] p-4 rounded-xl border border-white/5 flex justify-between items-center">
              <span className="text-xs text-[#888] font-bold uppercase tracking-wider">Running Subtotal:</span>
              <span className="text-xl font-mono font-black text-[#D4A017]">₹{aggregateRunningTotal}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2">
              <button type="button" onClick={handleBack}
                className="px-4 py-4 bg-[#0D0D0D] border border-white/10 hover:bg-white/5 transition-all rounded-2xl text-[#888] hover:text-white flex items-center justify-center">
                <ArrowLeft size={18} />
              </button>
              <button type="button" onClick={handleContinue}
                className="col-span-2 flex items-center justify-center gap-2 px-6 py-4 bg-[#D4A017] text-black font-bold text-sm rounded-2xl hover:bg-[#D4A017]/90 transition-all hover:scale-[1.01]">
                {activeSelectedAddons.length > 0 ? 'Select Catering' : 'Skip to Catering'} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}