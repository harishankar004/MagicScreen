'use client';
import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useBookingStore } from '@/store/bookingStore';
import { CheckCircle } from 'lucide-react';

function SuccessContent() {
  const params = useSearchParams();
  const router = useRouter();
  const store = useBookingStore();
  const trackingCode = params.get('code');

  const handleDone = () => {
    store.resetBooking();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center p-6">
      <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-10 max-w-md w-full text-center space-y-6">
        <CheckCircle size={64} className="text-green-400 mx-auto" />
        <h1 className="text-3xl font-extrabold">Booking Confirmed!</h1>
        <p className="text-[#888]">Your private theater experience is locked in. See you there!</p>
        <div className="bg-[#0D0D0D] border border-[#D4A017]/30 rounded-xl p-4">
          <p className="text-xs text-[#888] mb-1">Your Tracking Code</p>
          <p className="text-2xl font-mono font-bold text-[#D4A017] tracking-widest">{trackingCode}</p>
        </div>
        <p className="text-xs text-[#555]">
          A confirmation email has been sent to your inbox. Show your tracking code at the counter on arrival.
        </p>
        <button
          onClick={handleDone}
          className="w-full py-3 bg-[#D4A017] text-black font-bold rounded-xl"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center text-white">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}