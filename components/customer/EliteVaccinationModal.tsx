"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X, Loader2 } from "lucide-react";
import { DatePicker } from "@/components/ui/DatePicker";
import clsx from "clsx";
import { parseWorkingHours, parseDaysToArray } from "@/lib/utils";

function formatTime(time24: string) {
  const [h] = time24.split(":");
  let hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:00 ${ampm}`;
}

const formatPhone = (value: string) => {
  const cleaned = ('' + value).replace(/\D/g, '');
  if (cleaned.length <= 4) return cleaned;
  return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 11)}`;
};

export default function EliteVaccinationModal({ 
  pet, 
  profile, 
  email,
  onClose 
}: { 
  pet: any;
  profile: any;
  email: string;
  onClose: () => void;
}) {
  const router = useRouter();
  
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<{time: string, available: boolean}[]>([]);
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [businessSettings, setBusinessSettings] = useState<any>(null);

  useEffect(() => {
    async function fetchSettings() {
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
    fetchSettings();
  }, []);

  const handleDateChange = async (newDate: string) => {
    setDate(newDate);
    setTime("");
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
  };

  const handleRequestVaccination = async () => {
    if (!date || !time) return toast.error("Please select a date and time.");
    setIsLoading(true);

    try {
      const payload = {
        client_name: profile.full_name,
        client_phone: formatPhone(profile.phone),
        client_whatsapp: profile.whatsapp_number ? formatPhone(profile.whatsapp_number) : formatPhone(profile.phone),
        client_email: email,
        pet_name: pet.name,
        pet_type: pet.type,
        pet_breed: pet.breed || "",
        service_type: "Vaccination",
        is_emergency: false,
        preferred_date: date,
        preferred_time: time,
        city: profile.city,
        address: profile.address,
      };

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Vaccination appointment requested!");
        onClose();
        router.refresh();
      } else {
        toast.error(`Couldn't request appointment: ${data.error}`);
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh]">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-primary/5 shrink-0">
          <div>
            <h3 className="font-display font-bold text-xl text-dark">Schedule Vaccination</h3>
            <p className="text-sm text-gray-500">For {pet.name}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-dark shadow-sm border border-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Select Date</label>
            <DatePicker 
              value={date} 
              onChange={handleDateChange} 
              minDate={new Date().toISOString().split('T')[0]} 
              availableDays={
                businessSettings 
                  ? parseDaysToArray(parseWorkingHours(businessSettings.working_hours).days)
                  : undefined
              }
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Select Time</label>
            {date ? (
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map(slot => {
                  const isBlocked = !slot.available;
                  return (
                    <button
                      key={slot.time}
                      disabled={isBlocked || isFetchingSlots}
                      onClick={() => setTime(slot.time)}
                      className={clsx(
                        "py-2.5 rounded-xl text-sm font-bold transition-all border",
                        isBlocked ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50" :
                          time === slot.time ? "bg-primary border-primary text-white shadow-md scale-105" : "bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
                      )}
                    >
                      {formatTime(slot.time)}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-2xl text-center border border-gray-100 flex items-center justify-center">
                <p className="text-gray-500 font-medium text-sm">Please select a date first</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
          <p className="text-xs text-gray-500 font-medium">Service address: <br/><span className="text-dark">{profile?.address}</span></p>
          <button 
            onClick={handleRequestVaccination}
            disabled={isLoading || !date || !time}
            className="bg-primary hover:bg-primary-mid disabled:bg-gray-300 disabled:text-gray-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {isLoading ? "Requesting..." : "Confirm & Book"}
          </button>
        </div>
      </div>
    </div>
  );
}
