"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Cake, ShieldAlert, Clock, X, Loader2 } from "lucide-react";
import Link from "next/link";
import EliteVaccinationModal from "@/components/customer/EliteVaccinationModal";

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

export default function VaccinationAlertsClient({ 
  reminders, 
  profile, 
  email 
}: { 
  reminders: any[];
  profile: any;
  email: string;
}) {
  const router = useRouter();
  
  // Modal State
  const [selectedVaxPet, setSelectedVaxPet] = useState<any>(null);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<{time: string, available: boolean}[]>([]);
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [businessSettings, setBusinessSettings] = useState<any>(null);

  // Fetch settings when modal opens
  const openModal = async (pet: any) => {
    setSelectedVaxPet(pet);
    setDate("");
    setTime("");
    
    if (!businessSettings) {
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
  };

  // Fetch slots when date changes
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
        pet_name: selectedVaxPet.name,
        pet_type: selectedVaxPet.type,
        pet_breed: selectedVaxPet.breed || "",
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
        setSelectedVaxPet(null);
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

  if (!reminders || reminders.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reminders.map((reminder, i) => (
          <div key={i}>
            {reminder.type === 'birthday' ? (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/50 p-4 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-white p-2.5 rounded-xl shadow-sm shrink-0">
                  <Cake size={24} className="text-yellow-600" />
                </div>
                <div>
                  <p className="font-bold text-yellow-800">Birthday Week!</p>
                  <p className="text-xs text-yellow-700">Time to celebrate {reminder.pet.name}!</p>
                </div>
              </div>
            ) : reminder.type === 'vaccine_due' ? (
              <button 
                onClick={() => openModal(reminder.pet)}
                className="w-full text-left bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all group/vax hover:bg-red-100"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2.5 rounded-xl shadow-sm shrink-0">
                    <ShieldAlert size={24} className="text-emergency" />
                  </div>
                  <div>
                    <p className="font-bold text-emergency">{reminder.vaxStatus.label} — {reminder.pet.name}</p>
                    <p className="text-xs text-red-700">{reminder.vaxStatus.sublabel}</p>
                  </div>
                </div>
                <span className="text-emergency font-bold text-xl group-hover/vax:translate-x-1 transition-transform">→</span>
              </button>
            ) : (
              <button 
                onClick={() => openModal(reminder.pet)}
                className="w-full text-left bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all group/vax hover:bg-orange-100"
              >
                <div className="bg-white p-2.5 rounded-xl shadow-sm shrink-0">
                  <Clock size={24} className="text-orange-500" />
                </div>
                <div>
                  <p className="font-bold text-orange-700">{reminder.vaxStatus.label} — {reminder.pet.name}</p>
                  <p className="text-xs text-orange-600">{reminder.vaxStatus.sublabel}</p>
                </div>
                <span className="text-orange-500 font-bold text-xl group-hover/vax:translate-x-1 transition-transform ml-auto">→</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Elite Vaccination Booking Modal */}
      {selectedVaxPet && (
        <EliteVaccinationModal
          pet={selectedVaxPet}
          profile={profile}
          email={email}
          onClose={() => setSelectedVaxPet(null)}
        />
      )}
    </>
  );
}
