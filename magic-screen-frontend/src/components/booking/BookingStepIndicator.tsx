'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface Props {
  steps: string[];
  currentStep: number;
}

export default function BookingStepIndicator({ steps, currentStep }: Props) {
  return (
    <div className="booking-step-indicator w-full bg-[#0D0D0D] border-b border-white/8 mb-8">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center justify-between relative w-full">

          {/* Background track */}
          <div className="absolute top-[15px] sm:top-[18px] left-0 right-0 h-[2px] bg-white/8 z-0" />

          {/* Active progress */}
          <div
            className="absolute top-[15px] sm:top-[18px] left-0 h-[2px] bg-gradient-to-r from-[#D4A017] to-[#F5D67B] z-0 transition-all duration-500 ease-in-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = currentStep > stepNumber;
            const isActive    = currentStep === stepNumber;

            return (
              <div key={step} className="flex flex-col items-center relative z-10 flex-1 min-w-0">
                {/* Circle */}
                <div className={`
                  w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-xs
                  transition-all duration-300 shrink-0
                  ${isCompleted
                    ? 'bg-[#D4A017] text-black shadow-[0_0_12px_rgba(212,160,23,0.5)]'
                    : isActive
                    ? 'bg-[#0D0D0D] border-2 border-[#D4A017] text-[#D4A017] shadow-[0_0_12px_rgba(212,160,23,0.2)]'
                    : 'bg-[#111] border border-white/10 text-[#444]'
                  }
                `}>
                  {isCompleted ? <Check size={13} strokeWidth={3} /> : stepNumber}
                </div>

                {/* Label — hidden on xs, visible sm+ */}
                <span className={`
                  hidden sm:block text-[9px] md:text-[10px] font-semibold mt-1.5 tracking-wide text-center leading-tight px-0.5
                  transition-colors duration-300 truncate max-w-[60px] md:max-w-none
                  ${isActive ? 'text-[#D4A017]' : isCompleted ? 'text-[#888]' : 'text-[#444]'}
                `}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}