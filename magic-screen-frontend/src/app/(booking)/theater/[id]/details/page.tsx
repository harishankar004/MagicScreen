'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBookingStore } from '@/hooks/useBooking';
import BookingStepIndicator from '@/components/booking/BookingStepIndicator';
import { User, Phone, Mail, MessageSquare, ArrowRight, ArrowLeft } from 'lucide-react';

// Use this same array in ALL booking step pages
const BOOKING_STEPS = ['Decoration', 'Date & Slot', 'Occasion', 'Cake', 'Add-Ons', 'Food', 'Details', 'Summary'];

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const theaterId = params.id as string;
  const store = useBookingStore() as any;

  // Initialize form state from Zustand store if they exist
  const [formData, setFormData] = useState({
    name: store.customerName || '',
    phone: store.customerPhone || '',
    email: store.customerEmail || '',
    specialRequest: store.specialRequest || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBack = () => {
    router.push(`/theater/${theaterId}/food`);
  };

  // Inside your handleContinue function:
const handleContinue = () => {
  if (!formData.name || !formData.phone || !formData.email) {
    alert('Please fill in all mandatory contact fields.');
    return;
  }

  // Pass the data exactly as the store expects
  store.setCustomerDetails({
    customerName: formData.name,
    customerPhone: formData.phone,
    customerEmail: formData.email
  });

  router.push(`/theater/${theaterId}/summary`);
};

  return (
    <main className="booking-page min-h-screen bg-[#0D0D0D] text-white pb-12">
      <BookingStepIndicator steps={BOOKING_STEPS} currentStep={7} />

      <div className="max-w-2xl mx-auto px-4 mt-8">
        <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-8 space-y-6">
          <div className="border-b border-white/5 pb-6">
            <h1 className="text-2xl font-bold text-white">Guest Information</h1>
            <p className="text-sm text-[#888] mt-1">Please provide the contact details for your booking coordination.</p>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#555] uppercase">Full Name</label>
              <div className="flex items-center bg-[#0D0D0D] border border-white/10 rounded-xl px-4 py-3 focus-within:border-[#D4A017] transition-colors">
                <User size={18} className="text-[#555] mr-3" />
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="bg-transparent border-none outline-none w-full text-sm"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#555] uppercase">Mobile Number</label>
              <div className="flex items-center bg-[#0D0D0D] border border-white/10 rounded-xl px-4 py-3 focus-within:border-[#D4A017] transition-colors">
                <Phone size={18} className="text-[#555] mr-3" />
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  className="bg-transparent border-none outline-none w-full text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#555] uppercase">Email Address</label>
              <div className="flex items-center bg-[#0D0D0D] border border-white/10 rounded-xl px-4 py-3 focus-within:border-[#D4A017] transition-colors">
                <Mail size={18} className="text-[#555] mr-3" />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="bg-transparent border-none outline-none w-full text-sm"
                />
              </div>
            </div>

            {/* Special Request */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#555] uppercase">Special Requests / Notes</label>
              <div className="flex items-start bg-[#0D0D0D] border border-white/10 rounded-xl px-4 py-3 focus-within:border-[#D4A017] transition-colors">
                <MessageSquare size={18} className="text-[#555] mr-3 mt-1" />
                <textarea
                  name="specialRequest"
                  value={formData.specialRequest}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Any specific preferences or requirements for your booking?"
                  className="bg-transparent border-none outline-none w-full text-sm resize-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <button
              onClick={handleBack}
              className="px-6 py-4 bg-[#0D0D0D] border border-white/10 rounded-2xl text-[#888] hover:text-white flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} /> Back
            </button>
            <button
              onClick={handleContinue}
              className="px-6 py-4 bg-[#D4A017] text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-[#D4A017]/90 transition-all"
            >
              Review Booking <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}