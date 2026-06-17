"use client";

import { useState, useRef, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfDay, getDay } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  minDate?: string;
  placeholder?: string;
  availableDays?: string[];
}

export function DatePicker({ value, onChange, minDate, placeholder = "Tap to select a date...", availableDays }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value + "T00:00:00") : new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const today = startOfDay(new Date());
  const minDateObj = minDate ? startOfDay(new Date(minDate + "T00:00:00")) : null;

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const startDayOfWeek = getDay(startOfMonth(currentMonth));
  const blanks = Array.from({ length: startDayOfWeek });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const handleDateClick = (date: Date) => {
    if (minDateObj && isBefore(startOfDay(date), startOfDay(minDateObj))) return;
    
    if (availableDays) {
      const dayName = format(date, 'EEEE');
      if (!availableDays.includes(dayName)) {
        // Just return, the button is disabled anyway, but just in case
        return;
      }
    }

    onChange(format(date, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  const selectedDateObj = value ? startOfDay(new Date(value + "T00:00:00")) : null;

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        className={clsx(
          "w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all cursor-pointer flex items-center min-h-[52px] select-none",
          !value ? "text-gray-500" : "text-dark"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <CalendarIcon size={20} className={clsx("transition-transform duration-300", isOpen ? "text-primary" : "text-gray-400 group-hover:text-primary")} />
        </div>
        
        {value ? format(selectedDateObj!, 'EEE, MMM d, yyyy') : placeholder}
      </div>

      {isOpen && (
        <div className="absolute z-50 top-[calc(100%+8px)] left-0 w-full sm:w-[320px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in origin-top">
          <div className="p-4 bg-primary-light/30 border-b border-gray-100 flex items-center justify-between">
            <button type="button" onClick={(e) => { e.stopPropagation(); prevMonth(); }} className="p-2 hover:bg-white rounded-full transition-colors text-dark hover:text-primary shadow-sm border border-transparent hover:border-gray-200">
              <ChevronLeft size={20} />
            </button>
            <h3 className="font-bold text-dark text-lg select-none">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            <button type="button" onClick={(e) => { e.stopPropagation(); nextMonth(); }} className="p-2 hover:bg-white rounded-full transition-colors text-dark hover:text-primary shadow-sm border border-transparent hover:border-gray-200">
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="p-4 bg-white">
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                <div key={d} className="text-xs font-bold text-gray-400 uppercase select-none">{d}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {blanks.map((_, i) => (
                <div key={`blank-${i}`} className="aspect-square" />
              ))}
              
              {daysInMonth.map((date, i) => {
                let isDisabled = minDateObj ? isBefore(startOfDay(date), startOfDay(minDateObj)) : false;
                
                if (availableDays && !isDisabled) {
                  const dayName = format(date, 'EEEE');
                  if (!availableDays.includes(dayName)) {
                    isDisabled = true;
                  }
                }

                const isSelected = selectedDateObj && isSameDay(date, selectedDateObj);
                const isTodayDate = isSameDay(date, today);

                return (
                  <button
                    key={i}
                    type="button"
                    disabled={isDisabled}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDateClick(date);
                    }}
                    className={clsx(
                      "aspect-square w-full rounded-full flex items-center justify-center text-sm sm:text-base transition-all",
                      isDisabled ? "text-gray-300 cursor-not-allowed bg-gray-50/50" : 
                      isSelected ? "bg-primary text-white font-bold shadow-md transform scale-105" :
                      "text-dark hover:bg-primary-light/50 hover:text-primary font-medium",
                      isTodayDate && !isSelected && "ring-2 ring-primary-light"
                    )}
                  >
                    {format(date, 'd')}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 border-t border-gray-200 bg-white flex justify-between items-center shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.05)]">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
                setIsOpen(false);
              }}
              className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-dark hover:bg-gray-200 rounded-lg transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDateClick(new Date());
              }}
              className="px-4 py-2 text-sm font-bold text-primary bg-primary-light hover:bg-primary hover:text-white rounded-lg transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
