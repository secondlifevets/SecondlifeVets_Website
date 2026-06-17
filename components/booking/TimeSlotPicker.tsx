"use client";

import { TIME_SLOTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface TimeSlotPickerProps {
  selectedTime: string;
  onSelect: (time: string) => void;
  unavailableTimes?: string[];
}

export default function TimeSlotPicker({
  selectedTime,
  onSelect,
  unavailableTimes = [],
}: TimeSlotPickerProps) {
  return (
    <div>
      <p className="text-sm font-medium text-dark/80 mb-3">
        Select Time <span className="text-emergency">*</span>
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {TIME_SLOTS.map((slot) => {
          const isUnavailable = unavailableTimes.includes(slot.value);
          const isSelected = selectedTime === slot.value;

          return (
            <button
              key={slot.value}
              type="button"
              disabled={isUnavailable}
              onClick={() => !isUnavailable && onSelect(slot.value)}
              className={cn(
                "py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all duration-150",
                isSelected && "bg-hero-gradient text-white border-primary shadow-glow",
                !isSelected && !isUnavailable && "bg-white text-dark/70 border-gray-200 hover:border-primary hover:text-primary",
                isUnavailable && "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through"
              )}
            >
              {slot.label}
              {isUnavailable && <span className="block text-[9px] text-gray-300">Booked</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
