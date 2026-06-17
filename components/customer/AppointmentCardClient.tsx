"use client";

import { useState, useEffect } from "react";
import { Clock, Activity, MapPin, X, Calendar as CalendarIcon } from "lucide-react";
import clsx from "clsx";
import { format, parseISO } from "date-fns";
import { requestAppointmentChange } from "@/app/(customer)/dashboard/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DatePicker } from "@/components/ui/DatePicker";
import { parseWorkingHours, parseDaysToArray } from "@/lib/utils";

function formatTime(time24: string) {
  const [h] = time24.split(":");
  let hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:00 ${ampm}`;
}

export default function AppointmentCardClient({ appt, isPast }: { appt: any, isPast?: boolean }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType] = useState<'cancel' | 'reschedule' | null>(null);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [optimisticAppt, setOptimisticAppt] = useState(appt);

  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  
  const [availableSlots, setAvailableSlots] = useState<{time: string, available: boolean}[]>([]);
  const [businessSettings, setBusinessSettings] = useState<any>(null);
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);

  useEffect(() => {
    if (!isModalOpen || type !== 'reschedule') return;
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const json = await res.json();
          setBusinessSettings(json.data);
        }
      } catch (e) {
        console.error("Failed to fetch settings", e);
      }
    }
    if (!businessSettings) loadSettings();
  }, [isModalOpen, type, businessSettings]);

  useEffect(() => {
    if (!newDate) return;
    async function fetchBlocks() {
      setIsFetchingSlots(true);
      try {
        const res = await fetch(`/api/slots?date=${newDate}`);
        const data = await res.json();
        if (data.slots) {
          setAvailableSlots(data.slots);
        }
      } catch (err) {
        console.error(err);
      }
      setIsFetchingSlots(false);
    }
    fetchBlocks();
    setNewTime("");
  }, [newDate]);

  // Graceful fallback for malformed dates
  let formattedDate = optimisticAppt.preferred_date;
  let formattedTime = optimisticAppt.preferred_time?.substring(0, 5) || "N/A";
  
  try {
    formattedDate = format(parseISO(optimisticAppt.preferred_date), 'MMMM d, yyyy');
    if (optimisticAppt.preferred_time) {
      formattedTime = format(parseISO(`2000-01-01T${optimisticAppt.preferred_time}`), 'h:mm a');
    }
  } catch (e) {}

  const canModify = !isPast && (optimisticAppt.status === 'pending' || optimisticAppt.status === 'confirmed');
  const hasPendingRequest = optimisticAppt.modification_request_status === 'pending';
  const hasDeniedRequest = optimisticAppt.modification_request_status === 'denied';

  const handleSubmit = async () => {
    if (!type || !reason.trim()) {
      toast.error("Please provide a reason or details.");
      return;
    }
    
    if (type === 'reschedule' && (!newDate || !newTime)) {
      toast.error("Please select a new date and time.");
      return;
    }

    setIsSubmitting(true);
    
    // Optimistic UI Update
    setOptimisticAppt({
      ...optimisticAppt,
      modification_request_status: 'pending',
      modification_request_type: type
    });
    
    // Optimistically close modal
    setIsModalOpen(false);

    const res = await requestAppointmentChange(appt.id, type, reason, newDate, newTime);
    setIsSubmitting(false);

    if (res.success) {
      toast.success(type === 'cancel' ? "Cancellation request sent." : "Reschedule request sent.");
      setReason("");
      setNewDate("");
      setNewTime("");
      
      if (res.whatsappUrl) {
        window.open(res.whatsappUrl, "_blank");
      }
      
      router.refresh();
    } else {
      toast.error(res.error || "Couldn't submit request. Please try again.");
      // Revert optimistic update on failure
      setOptimisticAppt(appt);
    }
  };

  return (
    <>
      <div className={clsx(
        "bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all relative group flex flex-col h-full isolate",
        isPast && "opacity-75"
      )}>
        {optimisticAppt.is_emergency && <div className="absolute top-0 left-0 w-1 h-full bg-emergency rounded-l-2xl"></div>}
        <div className="flex justify-between items-start mb-4">
          <span className={clsx(
            "text-[10px] font-bold uppercase px-2 py-1 rounded",
            optimisticAppt.is_emergency ? "bg-red-50 text-emergency border border-red-100" : 
            optimisticAppt.status === 'confirmed' ? "bg-primary-light text-primary border border-primary-light" : 
            "bg-gray-100 text-gray-600 border border-gray-200"
          )}>
            {optimisticAppt.is_emergency ? "EMERGENCY" : optimisticAppt.status}
          </span>
          <span className="font-bold text-dark text-xs flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
            <Clock size={12} className="text-primary" /> 
            {formattedTime}
          </span>
        </div>
        
        {optimisticAppt.booking_ref && (
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Ticket: {optimisticAppt.booking_ref}</p>
        )}
        <p className="font-display font-bold text-dark text-xl mb-1">{formattedDate}</p>
        
        <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-600">
          <Activity size={14} className="text-primary-mid" />
          {optimisticAppt.service_type} for <span className="text-dark">{optimisticAppt.pet_name}</span>
        </div>
        
        <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
          <MapPin size={14} className="shrink-0 mt-0.5 text-gray-400" />
          <span className="line-clamp-2">{optimisticAppt.address}, {optimisticAppt.city}</span>
        </div>

        {hasPendingRequest ? (
          <div className="mt-4 pt-3 border-t border-gray-100 text-xs">
            <p className="font-bold text-orange-500 mb-1 flex items-center gap-1">
              ⏳ {optimisticAppt.modification_request_type === 'cancel' ? 'Cancellation' : 'Reschedule'} Requested
            </p>
            <p className="text-gray-500">Your request has been sent to the admin. You will be notified once it is processed.</p>
          </div>
        ) : hasDeniedRequest ? (
          <div className="mt-4 pt-3 border-t border-gray-100 text-xs">
            <p className="font-bold text-red-500 mb-1 flex items-center gap-1">❌ Request Denied</p>
            <p className="text-gray-500">Your modification request could not be accommodated. Please contact support via WhatsApp for alternatives.</p>
          </div>
        ) : optimisticAppt.admin_notes ? (
          <div className="mt-4 pt-3 border-t border-gray-100 text-xs">
            <p className="font-bold text-gray-500 mb-1 flex items-center gap-1">👨‍⚕️ Vet's Notes</p>
            <p className="text-gray-700 bg-primary-light/25 p-2.5 rounded-lg border border-primary-light/20 italic">
              "{optimisticAppt.admin_notes}"
            </p>
          </div>
        ) : null}

        {canModify && !hasPendingRequest && (
          <div className="mt-auto pt-4 flex gap-2">
            <button 
              onClick={() => { setType('reschedule'); setIsModalOpen(true); }}
              className="flex-1 py-2 text-xs font-bold text-dark border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <CalendarIcon size={14} /> Reschedule
            </button>
            <button 
              onClick={() => { setType('cancel'); setIsModalOpen(true); }}
              className="flex-1 py-2 text-xs font-bold text-emergency border border-red-100 bg-red-50/50 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <X size={14} /> Cancel
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-display font-bold text-xl text-dark">
                {type === 'cancel' ? 'Request Cancellation' : 'Request Reschedule'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-dark transition-colors bg-gray-50 p-2 rounded-full hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <p className="text-sm text-gray-600 mb-4">
                {type === 'cancel' 
                  ? 'Please let us know why you need to cancel this appointment. An admin will review and process your request.' 
                  : 'Please select your preferred new date and time.'}
              </p>
              
              <div className="space-y-4">
                {type === 'reschedule' && (
                  <div className="flex flex-col gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New Date</label>
                      <DatePicker 
                        value={newDate} 
                        onChange={setNewDate} 
                        minDate={new Date().toISOString().split('T')[0]} 
                        availableDays={
                          businessSettings 
                            ? parseDaysToArray(parseWorkingHours(businessSettings.working_hours).days)
                            : undefined
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New Time</label>
                      {newDate ? (
                        <div className="grid grid-cols-3 gap-2">
                          {availableSlots.map(slot => {
                            const isBlocked = !slot.available;
                            return (
                              <button
                                key={slot.time}
                                disabled={isBlocked || isFetchingSlots}
                                onClick={() => setNewTime(slot.time)}
                                className={clsx(
                                  "py-2 rounded-lg text-xs font-bold transition-all border",
                                  isBlocked ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50" :
                                    newTime === slot.time ? "bg-primary border-primary text-white shadow-md scale-105" : "bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
                                )}
                              >
                                {formatTime(slot.time)}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100 h-full min-h-[120px] flex items-center justify-center">
                          <p className="text-gray-500 text-xs font-medium">Please select a date first</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    {type === 'cancel' ? 'Reason for cancellation' : 'Additional details'}
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={type === 'cancel' ? 'e.g., My pet is already feeling better...' : 'e.g., Can we move this to next Tuesday afternoon?'}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-dark text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none h-28"
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
                >
                  Nevermind
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || (type === 'cancel' && !reason.trim()) || (type === 'reschedule' && (!newDate || !newTime || !reason.trim()))}
                  className={clsx(
                    "flex-1 py-3 px-4 font-bold text-white rounded-xl shadow-sm transition-all flex items-center justify-center disabled:opacity-50",
                    type === 'cancel' ? "bg-emergency hover:bg-red-600" : "bg-primary hover:bg-primary-mid"
                  )}
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    "Send Request"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
