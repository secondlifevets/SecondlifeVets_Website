"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import clsx from "clsx";
import { CheckCircle, CalendarX, Plus, AlertCircle } from "lucide-react";
import { DatePicker } from "@/components/ui/DatePicker";
import Link from "next/link";

const SERVICES = [
  "General Checkup", "Vaccination", "Deworming",
  "Surgical Consultation", "Dental Cleaning",
  "Emergency Care", "Pet Nutrition Consultation", "Diagnostic & Lab Tests",
  "Tick & Flea Treatments"
];

import { parseWorkingHours, parseDaysToArray, formatTime } from "@/lib/utils";

const formatPhone = (value: string) => {
  const cleaned = ('' + value).replace(/\D/g, '');
  if (cleaned.length <= 4) return cleaned;
  return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 11)}`;
};

export default function BookClient({ profile, pets, email }: { profile: any, pets: any[], email: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [isEmergency, setIsEmergency] = useState(false);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  
  const [availableSlots, setAvailableSlots] = useState<{time: string, available: boolean}[]>([]);
  const [businessSettings, setBusinessSettings] = useState<any>(null);
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);

  useEffect(() => {
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
    loadSettings();
  }, []);

  useEffect(() => {
    if (!date) return;
    async function fetchBlocks() {
      setIsFetchingSlots(true);
      try {
        const res = await fetch(`/api/slots?date=${date}`);
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
    setTime("");
  }, [date]);

  const handleNext = () => {
    if (step === 1 && !selectedPetId) return toast.error("Please select a pet.");
    if (step === 2 && !selectedService) return toast.error("Please select a service.");
    if (step === 3 && (!date || !time)) return toast.error("Please select date and time.");
    setStep(s => Math.min(s + 1, 4));
  };

  const selectedPet = pets.find(p => p.id === selectedPetId);

  const handleSubmit = async () => {
    if (!selectedPet) return toast.error("Pet selection is missing. Please select a pet.");
    setIsLoading(true);
    try {
      const payload = {
        client_name: profile.full_name,
        client_phone: formatPhone(profile.phone),
        client_whatsapp: profile.whatsapp ? formatPhone(profile.whatsapp) : formatPhone(profile.phone),
        client_email: email,
        pet_name: selectedPet.name,
        pet_type: selectedPet.type,
        pet_breed: selectedPet.breed || "",
        pet_id: selectedPet.id,
        service_type: selectedService,
        is_emergency: isEmergency,
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
        toast.success("Appointment booked successfully!");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(`Couldn't book appointment: ${data.error}`);
        setIsLoading(false);
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again later.");
      setIsLoading(false);
    }
  };

  if (pets.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-gray-100 flex flex-col items-center text-center shadow-sm">
        <div className="w-20 h-20 bg-primary-light/30 rounded-full flex items-center justify-center mb-6">
          <CalendarX size={32} className="text-primary" />
        </div>
        <h3 className="font-display text-xl font-bold text-dark mb-2">You need a pet profile first</h3>
        <p className="text-gray-500 max-w-sm mb-6">Please add at least one pet to your profile before booking an appointment.</p>
        <Link href="/dashboard/pets" className="btn-primary inline-flex items-center gap-2">
          <Plus size={18} /> Add Pet
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100">
      {/* Steps Header */}
      <div className="flex bg-primary-light/30 border-b border-gray-100 overflow-x-auto rounded-t-3xl">
        {[
          { num: 1, title: "Select Pet" },
          { num: 2, title: "Services" },
          { num: 3, title: "Date & Time" },
          { num: 4, title: "Confirm" }
        ].map(s => (
          <div key={s.num} className={clsx(
            "flex-1 py-4 px-4 text-center text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors whitespace-nowrap",
            step === s.num ? "border-primary text-primary bg-white" : step > s.num ? "border-transparent text-primary" : "border-transparent text-gray-500"
          )}>
            <div className={clsx(
              "w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0",
              step >= s.num ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
            )}>
              {step > s.num ? <CheckCircle size={14} /> : s.num}
            </div>
            <span className="hidden sm:inline">{s.title}</span>
          </div>
        ))}
      </div>

      <div className="p-6 md:p-8">
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="font-display text-2xl font-bold text-dark">Who is this appointment for?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {pets.map(pet => (
                <button
                  key={pet.id}
                  onClick={() => setSelectedPetId(pet.id)}
                  className={clsx(
                    "p-5 rounded-2xl border-2 text-left transition-all",
                    selectedPetId === pet.id ? "border-primary bg-primary-light text-primary shadow-sm" : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white"
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">
                      {pet.type === 'Dog' ? '🐶' : pet.type === 'Cat' ? '🐱' : pet.type === 'Bird' ? '🦜' : pet.type === 'Rabbit' ? '🐰' : '🐾'}
                    </span>
                    <div>
                      <h3 className="font-bold text-lg text-dark">{pet.name}</h3>
                      <p className="text-xs font-bold uppercase tracking-wider opacity-70">{pet.type}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="font-display text-2xl font-bold text-dark">What service does {selectedPet?.name} need?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SERVICES.map(service => (
                <button
                  key={service}
                  onClick={() => setSelectedService(service)}
                  className={clsx(
                    "p-4 rounded-2xl border-2 text-left font-bold transition-all",
                    selectedService === service ? "border-primary bg-primary-light text-primary shadow-sm" : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white"
                  )}
                >
                  {service}
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <label className="flex items-center gap-3 cursor-pointer p-4 bg-red-50 rounded-xl border border-red-100 group w-max">
                <input
                  type="checkbox"
                  checked={isEmergency}
                  onChange={e => setIsEmergency(e.target.checked)}
                  className="w-5 h-5 rounded text-emergency focus:ring-emergency"
                />
                <span className="font-bold text-emergency group-hover:underline">This is a medical emergency</span>
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="font-display text-2xl font-bold text-dark">Choose Date & Time</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Select Date</label>
                <DatePicker 
                  value={date} 
                  onChange={setDate} 
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
                  <div className="bg-gray-50 p-6 rounded-2xl text-center border border-gray-100 h-[240px] flex items-center justify-center">
                    <p className="text-gray-500 font-medium">Please select a date first</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="font-display text-2xl font-bold text-dark">Confirm Appointment</h2>
            
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Patient</p>
                  <p className="font-bold text-dark">{selectedPet?.name} ({selectedPet?.type})</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Service</p>
                  <p className="font-bold text-dark">{selectedService}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Date & Time</p>
                  <p className="font-bold text-dark">{date} at {time && formatTime(time)}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Owner Contact</p>
                  <p className="font-bold text-dark">{profile.phone}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-gray-500 mb-1 text-sm">Service Address</p>
                <p className="font-bold text-dark text-sm">{profile.address}, {profile.city}</p>
                <Link href="/dashboard/settings" className="text-primary text-xs font-bold hover:underline mt-1 inline-block">
                  Change Address
                </Link>
              </div>

              {isEmergency && (
                <div className="bg-red-50 p-3 rounded-lg flex items-start gap-2 border border-red-100 mt-4">
                  <AlertCircle className="text-emergency shrink-0 w-4 h-4 mt-0.5" />
                  <p className="text-xs text-emergency font-bold">This is marked as an emergency. Our vet will prioritize this visit.</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)} className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors">
              Back
            </button>
          ) : <div></div>}
          
          {step < 4 ? (
            <button onClick={handleNext} className="bg-primary hover:bg-primary-mid text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-md">
              Continue
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={isLoading} className="bg-primary hover:bg-primary-mid text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-md flex items-center gap-2">
              {isLoading ? "Booking..." : "Confirm & Book"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
