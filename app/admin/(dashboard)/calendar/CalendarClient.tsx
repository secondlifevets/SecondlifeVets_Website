"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, format, isSameMonth, isSameDay, 
  addMonths, subMonths, isToday
} from "date-fns";
import { 
  ChevronLeft, ChevronRight, Plus, X, Clock, MapPin, Loader2, AlertTriangle, CalendarX
} from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { toast } from "sonner";
import useSWR from "swr";

const fetcher = async ([_key, monthStart, monthEnd]: any) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .gte('preferred_date', monthStart)
    .lte('preferred_date', monthEnd);
    
  if (error) throw error;
  return data || [];
};

export default function CalendarClient({ initialData }: { initialData: any[] }) {
  const supabase = createClient();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  // Block Time Modal
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockTime, setBlockTime] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [blocking, setBlocking] = useState(false);

  const start = startOfWeek(startOfMonth(currentDate));
  const end = endOfWeek(endOfMonth(currentDate));
  
  const { data: appointments = [], isLoading: loading, mutate } = useSWR(
    ['calendar', format(start, 'yyyy-MM-dd'), format(end, 'yyyy-MM-dd')],
    fetcher,
    { keepPreviousData: true, fallbackData: initialData }
  );

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate)),
    end: endOfWeek(endOfMonth(currentDate))
  });

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const selectedAppts = appointments.filter((a: any) => a.preferred_date === selectedDateStr).sort((a: any, b: any) => (a.preferred_time || "").localeCompare(b.preferred_time || ""));

  const handleBlockSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlocking(true);
    const res = await fetch('/api/slots/block', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: selectedDateStr,
        time: blockTime,
        reason: blockReason
      })
    });
    if (res.ok) {
      setIsBlockModalOpen(false);
      setBlockTime("");
      setBlockReason("");
      mutate(); // Revalidate
      toast.success("Time slot blocked successfully.");
    } else {
      try {
        const errData = await res.json();
        toast.error("Couldn't block time slot: " + (errData.details || errData.error || "Unknown error"));
      } catch (e) {
        toast.error("Couldn't block time slot. Please try again.");
      }
    }
    setBlocking(false);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-full">
      {/* Calendar Main */}
      <div className="flex-1 p-4 sm:p-8 bg-background w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-dark">Calendar</h1>
            <p className="text-gray-500 font-sans">Manage your daily schedule</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
            <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <span className="font-bold text-dark min-w-[120px] text-center">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-w-[600px]">
            <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 auto-rows-[minmax(120px,auto)]">
            {days.map((day, i) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const dayAppts = appointments.filter((a: any) => a.preferred_date === dateStr);
              
              return (
                <div 
                  key={day.toString()} 
                  onClick={() => setSelectedDate(day)}
                  className={clsx(
                    "border-b border-r border-gray-100 p-2 cursor-pointer transition-colors relative min-h-[120px]",
                    !isSameMonth(day, currentDate) ? "bg-gray-50/50 text-gray-400" : "bg-white hover:bg-primary-light/10 text-dark",
                    isSameDay(day, selectedDate) && "ring-2 ring-inset ring-primary bg-primary-light/5",
                    i % 7 === 6 && "border-r-0"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={clsx(
                      "w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold",
                      isToday(day) ? "bg-primary text-white" : ""
                    )}>
                      {format(day, 'd')}
                    </span>
                    
                    {dayAppts.length > 0 && (
                      <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {dayAppts.length}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-1 mt-1 overflow-y-auto max-h-[70px] no-scrollbar">
                    {dayAppts.slice(0, 3).map((appt: any) => (
                      <div 
                        key={appt.id} 
                        className={clsx(
                          "text-[10px] truncate px-1.5 py-0.5 rounded font-bold",
                          appt.is_emergency ? "bg-red-50 text-emergency border border-red-100" :
                          appt.status === 'confirmed' ? "bg-primary-light/50 text-primary border border-primary-light" :
                          appt.status === 'pending' ? "bg-amber-50 text-amber-600 border border-amber-100" :
                          "bg-gray-50 text-gray-500 border border-gray-100"
                        )}
                      >
                        {appt.preferred_time?.substring(0, 5) || "N/A"} {appt.client_name}
                      </div>
                    ))}
                    {dayAppts.length > 3 && (
                      <div className="text-[10px] text-gray-400 font-bold px-1">+ {dayAppts.length - 3} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        </div>
      </div>

      {/* Side Panel */}
      <div className="w-full lg:w-80 bg-white border-l border-gray-100 flex flex-col h-auto lg:h-[calc(100vh-80px)] shrink-0 shadow-[-4px_0_24px_-12px_rgba(0,0,0,0.05)]">
        <div className="p-6 border-b border-gray-100 flex flex-col gap-4 bg-gray-50/50">
          <div>
            <h2 className="font-display text-2xl font-bold text-dark">{format(selectedDate, 'EEEE')}</h2>
            <p className="text-sm text-gray-500 font-medium">{format(selectedDate, 'MMMM d, yyyy')}</p>
          </div>
          
          <button 
            onClick={() => setIsBlockModalOpen(true)}
            className="w-full bg-white hover:bg-gray-50 text-dark border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus size={16} /> Block Time Slot
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!appointments.length && loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
                <div className="flex justify-between items-start mb-2">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                <div className="h-3 bg-gray-100 rounded w-40 mb-3"></div>
                <div className="h-3 bg-gray-100 rounded w-24 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            ))
          ) : selectedAppts.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100 shadow-sm">
                <CalendarX size={28} className="text-gray-400" />
              </div>
              <h3 className="font-display font-bold text-dark text-lg mb-1">No appointments</h3>
              <p className="text-gray-500 text-sm">You have a clear schedule for this day.</p>
            </div>
          ) : (
            selectedAppts.map((appt: any) => (
              <div key={appt.id} className="bg-white rounded-xl p-4 border border-gray-100 relative overflow-hidden group hover:border-primary/30 hover:shadow-md transition-all">
                {appt.is_emergency && <div className="absolute top-0 left-0 w-1 h-full bg-emergency"></div>}
                {!appt.is_emergency && appt.status === 'confirmed' && <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>}
                
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-dark text-sm flex items-center gap-1">
                    <Clock size={12} className="text-primary" /> {appt.preferred_time?.substring(0, 5) || "N/A"}
                  </span>
                  <span className={clsx(
                    "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                    appt.is_emergency ? "bg-red-50 text-emergency" : "bg-gray-100 text-gray-600"
                  )}>
                    {appt.is_emergency ? "EMERGENCY" : appt.status}
                  </span>
                </div>
                
                <p className="font-bold text-dark text-sm truncate">{appt.client_name}</p>
                <p className="text-xs text-gray-500 truncate mb-2">{appt.pet_name} • {appt.service_type}</p>
                
                <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-3">
                  <MapPin size={10} /> <span className="truncate">{appt.city}</span>
                </div>
                
                <Link 
                  href={`/admin/appointments?id=${appt.id}`}
                  className="block w-full text-center bg-gray-50 border border-transparent hover:border-primary text-dark hover:text-primary px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:bg-white"
                >
                  View Details
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Block Slot Modal */}
      {isBlockModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleBlockSlot} className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="font-display text-xl font-bold text-dark">Block Time Slot</h2>
              <button type="button" onClick={() => setIsBlockModalOpen(false)} className="text-gray-400 hover:text-dark">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                <input type="text" disabled value={selectedDateStr} className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Time *</label>
                <select required value={blockTime} onChange={e => setBlockTime(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none">
                  <option value="">Select Time</option>
                  {["09:00:00", "10:00:00", "11:00:00", "12:00:00", "13:00:00", "14:00:00", "15:00:00", "16:00:00", "17:00:00", "18:00:00", "19:00:00", "20:00:00"].map(t => (
                    <option key={t} value={t}>{t.substring(0, 5)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Reason (Optional)</label>
                <input type="text" value={blockReason} onChange={e => setBlockReason(e.target.value)} placeholder="e.g. Lunch Break, Holiday" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsBlockModalOpen(false)} className="px-4 py-2 font-bold text-gray-500 hover:text-dark">Cancel</button>
              <button type="submit" disabled={blocking} className="bg-primary hover:bg-primary-mid text-white px-6 py-2 rounded-xl font-bold shadow-sm flex items-center gap-2 disabled:opacity-50">
                {blocking && <Loader2 size={16} className="animate-spin" />} Confirm Block
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
