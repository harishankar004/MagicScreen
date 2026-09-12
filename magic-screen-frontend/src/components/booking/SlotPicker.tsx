'use client';

import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface SlotAvailabilityResult {
  slot_id: string;
  name: string;
  time_range: string;
  status: 'available' | 'booked' | 'locked';
}

interface Props {
  slots: SlotAvailabilityResult[];
  selectedSlotId: string | null;
  onSlotSelect: (slotId: string) => void;
  isLoading: boolean;
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function SlotPicker({ slots, selectedSlotId, onSlotSelect, isLoading, selectedDate, onDateChange }: Props) {
  return (
    <div className="space-y-5 bg-[#1A1A1A] p-5 sm:p-6 rounded-2xl border border-white/10">

      {/* Date Picker */}
      <div>
        <label className="flex items-center gap-2 text-xs font-bold uppercase text-[#888] tracking-wider mb-2.5">
          <Calendar size={13} className="text-[#D4A017]" /> Select Experience Date
        </label>
        <input
          type="date"
          value={selectedDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => onDateChange(e.target.value)}
          onClick={(e) => {
            try { (e.currentTarget as HTMLInputElement).showPicker(); } catch (_) {}
          }}
          className="w-full rounded-xl border border-white/10 bg-[#0D0D0D] px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A017]/40 focus:border-[#D4A017]/50 transition-all cursor-pointer"
          style={{ colorScheme: 'dark' }}
        />
      </div>

      {/* Slots */}
      <div>
        <label className="flex items-center gap-2 text-xs font-bold uppercase text-[#888] tracking-wider mb-3">
          <Clock size={13} className="text-[#D4A017]" /> Available Timings
        </label>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-20 bg-[#0D0D0D] rounded-xl animate-pulse border border-white/5" />
            ))}
          </div>
        ) : slots.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
            <p className="text-sm text-[#555]">No slots available for this date.</p>
            <p className="text-xs text-[#444] mt-1">Try selecting a different date.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {slots.map((slot) => {
              const isAvailable = slot.status === 'available';
              const isLocked    = slot.status === 'locked';
              const isBooked    = slot.status === 'booked';
              const isSelected  = selectedSlotId === slot.slot_id;

              return (
                <button
                  key={slot.slot_id}
                  type="button"
                  disabled={isBooked || isLocked}
                  onClick={() => onSlotSelect(slot.slot_id)}
                  className={`
                    p-3.5 rounded-xl text-left border flex flex-col gap-2
                    transition-all duration-200 relative overflow-hidden
                    ${isSelected
                      ? 'bg-[#D4A017]/10 border-[#D4A017] shadow-[0_0_15px_rgba(212,160,23,0.15)]'
                      : isAvailable
                      ? 'bg-[#0D0D0D] border-white/10 hover:border-[#D4A017]/40 hover:bg-[#D4A017]/5 cursor-pointer'
                      : isLocked
                      ? 'bg-[#111] border-amber-500/20 opacity-60 cursor-not-allowed'
                      : 'bg-[#0D0D0D]/40 border-white/5 opacity-40 cursor-not-allowed'
                    }
                  `}
                >
                  <div>
                    <h4 className={`text-xs sm:text-sm font-bold tracking-tight leading-tight ${isSelected ? 'text-[#D4A017]' : 'text-white'}`}>
                      {slot.name}
                    </h4>
                    <p className="text-[10px] text-[#666] mt-0.5 font-mono">{slot.time_range}</p>
                  </div>

                  <span className={`
                    text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md w-fit
                    ${isSelected   ? 'bg-[#D4A017] text-black'
                    : isAvailable  ? 'bg-white/5 text-[#888]'
                    : isLocked     ? 'bg-amber-500/10 text-amber-400'
                    :                'text-[#444]'}
                  `}>
                    {isSelected ? '✓ Selected' : isAvailable ? 'Available' : isLocked ? 'Held' : 'Booked'}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}