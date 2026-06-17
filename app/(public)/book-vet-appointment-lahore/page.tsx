"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { BRAND } from "@/lib/constants";
import {
  Dog, Cat, Bird, Rabbit, FileQuestion,
  MapPin, Clock, Calendar as CalendarIcon,
  AlertCircle, CheckCircle, ChevronRight, Loader2, MessageCircle
} from "lucide-react";
import clsx from "clsx";
import { differenceInYears, parseISO } from "date-fns";
import { parseWorkingHours, parseDaysToArray } from "@/lib/utils";

// Constants
const SERVICES = [
  "General Checkup", "Vaccination", "Deworming",
  "Surgical Consultation", "Dental Cleaning",
  "Emergency Care", "Pet Nutrition Consultation", "Diagnostic & Lab Tests",
  "Tick & Flea Treatments"
];



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

import { DatePicker } from "@/components/ui/DatePicker";

export default function BookingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    client_name: "",
    client_phone: "",
    client_whatsapp: "",
    client_email: "",
    pet_name: "",
    pet_type: "",
    other_pet_type: "",
    pet_breed: "",
    pet_age: "",
    service_type: "",
    is_emergency: false,
    notes: "",
    preferred_date: "",
    preferred_time: "",
    city: "",
    address: "",
    pin_lat: null as number | null,
    pin_lng: null as number | null,
    pet_id: null as string | null,
    confirmed: false
  });

  const [savedPets, setSavedPets] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<{time: string, available: boolean}[]>([]);
  const [businessSettings, setBusinessSettings] = useState<any>(null);
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "granted" | "denied">("idle");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState({
    name: false,
    phone: false,
    email: false,
    address: false,
    city: false,
    location: false
  });
  const [selectedSavedPetId, setSelectedSavedPetId] = useState<string | null>(null);

  useEffect(() => {
    // Read service parameter from URL directly to avoid Next.js Suspense boundary requirements for useSearchParams in client components
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const serviceParam = params.get("service");
      if (serviceParam && SERVICES.includes(serviceParam)) {
        setFormData(prev => ({ ...prev, service_type: serviceParam }));
      }
    }
  }, []);

  useEffect(() => {
    async function loadUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setIsLoggedIn(true);

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      const { data: pets } = await supabase.from("pets").select("*").eq("customer_id", user.id);

      if (profile) {
        setProfileLoaded({
          name: !!profile.full_name,
          phone: !!profile.phone,
          email: !!user.email,
          address: !!profile.address,
          city: !!profile.city,
          location: !!profile.pin_lat && !!profile.pin_lng
        });
      }

      setFormData(prev => ({
        ...prev,
        client_name: profile?.full_name || prev.client_name,
        client_phone: profile?.phone ? formatPhone(profile.phone) : prev.client_phone,
        client_whatsapp: profile?.whatsapp ? formatPhone(profile.whatsapp) : prev.client_whatsapp,
        client_email: user.email || prev.client_email,
        address: profile?.address || prev.address,
        city: profile?.city || prev.city,
        pin_lat: profile?.pin_lat || prev.pin_lat,
        pin_lng: profile?.pin_lng || prev.pin_lng,
      }));

      if (pets && pets.length > 0) {
        setSavedPets(pets);
      }
    }
    
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

    loadUserData();
    loadSettings();
  }, [supabase]);

  const handleNext = () => {
    if (step === 1 && !isStep1Valid) {
      if (formData.client_name.length < 2) toast.error("Please enter a valid owner name.");
      else if (formData.client_phone.length !== 12) toast.error("Please enter a valid 11-digit phone number.");
      else if (formData.client_whatsapp.length !== 12) toast.error("Please enter a valid 11-digit WhatsApp number.");
      else if (!formData.pet_type) toast.error("Please select a pet type.");
      else if (formData.pet_type === "Other" && !formData.other_pet_type.trim()) toast.error("Please specify the other pet type.");
      else if (!formData.service_type) toast.error("Please select a service type.");
      return;
    }
    if (step === 2 && !isStep2Valid) {
      if (!formData.preferred_date) toast.error("Please select a preferred date.");
      else if (!formData.preferred_time) toast.error("Please select a preferred time.");
      else if (!formData.city) toast.error("Please enter your city.");
      else if (!formData.address) toast.error("Please enter your full address.");
      return;
    }
    setStep(s => Math.min(s + 1, 3));
  };
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  useEffect(() => {
    if (!formData.preferred_date) return;

    async function fetchBlocks() {
      setIsFetchingSlots(true);

      try {
        const res = await fetch(`/api/slots?date=${formData.preferred_date}`);
        const data = await res.json();

        if (data.slots) {
          setAvailableSlots(data.slots);
        }
      } catch (err) {
        console.error("Failed to fetch blocked slots:", err);
      }

      setIsFetchingSlots(false);
    }
    fetchBlocks();
    setFormData(prev => ({ ...prev, preferred_time: "" }));
  }, [formData.preferred_date, supabase]);

  const getLocation = () => {
    setLocationStatus("loading");
    if (!navigator.geolocation) {
      setLocationStatus("denied");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          pin_lat: position.coords.latitude,
          pin_lng: position.coords.longitude
        }));
        setLocationStatus("granted");
      },
      () => {
        setLocationStatus("denied");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.confirmed) return;
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        pet_type: formData.pet_type === "Other" ? formData.other_pet_type : formData.pet_type
      };
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem("bookingData", JSON.stringify(formData));
        router.push(`/book-vet-appointment-lahore/success?ref=${data.booking_ref}&phone=${formData.client_phone}&date=${formData.preferred_date}&time=${formData.preferred_time}`);
      } else {
        console.error("Booking error details:", data);
        toast.error(`Couldn't book appointment: ${data.error}${data.details ? `\nDetails: ${data.details}` : ''}`);
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again later.");
      setIsLoading(false);
    }
  };

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const currentHour = now.getHours();

  const isStep1Valid = formData.client_name.length >= 2 && formData.client_phone.length === 12 && formData.client_whatsapp.length === 12 && formData.pet_type && (formData.pet_type !== "Other" || formData.other_pet_type.trim() !== "") && formData.service_type;
  const isStep2Valid = formData.preferred_date && formData.preferred_time && formData.address && formData.city;
  const isStep3Valid = formData.confirmed;

  return (
    <div className="min-h-screen bg-background pt-8 pb-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">

        <div className="mb-8 text-center md:text-left">
          <h1 className="font-display text-4xl font-bold text-dark mb-2">Book a Home Visit</h1>
          <p className="text-gray-600 font-sans">Professional veterinary care in the comfort of your home.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Left Column - Form */}
          <div className="w-full lg:w-[60%] bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="flex bg-primary-light/30 border-b border-gray-100 rounded-t-3xl">
              {[
                { num: 1, title: "Details" },
                { num: 2, title: "Time & Location" },
                { num: 3, title: "Confirm" }
              ].map(s => (
                <div
                  key={s.num}
                  className={clsx(
                    "flex-1 py-4 px-2 text-center text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-2 border-b-2 transition-colors",
                    step === s.num ? "border-primary text-primary bg-white" : step > s.num ? "border-transparent text-primary" : "border-transparent text-gray-500"
                  )}
                >
                  <div className={clsx(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                    step >= s.num ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                  )}>
                    {step > s.num ? <CheckCircle size={14} /> : s.num}
                  </div>
                  <span className="hidden sm:inline">{s.title}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8">

              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="font-display text-2xl font-bold text-dark mb-4">Pet & Service Details</h2>

                  {isLoggedIn && (!profileLoaded.name || !profileLoaded.phone || !profileLoaded.address || !profileLoaded.city) && (
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl text-amber-800 text-sm animate-fade-in">
                      <p className="font-semibold mb-1">Profile incomplete</p>
                      <p className="mb-2">Please complete your contact number and home address details in your Settings to enable faster booking.</p>
                      <a href="/dashboard/settings" className="font-bold underline text-amber-900 hover:text-amber-950">
                        Go to Settings Tab
                      </a>
                    </div>
                  )}

                  {savedPets.length > 0 && (
                    <div className="mb-6 bg-primary-light/20 border border-primary-light p-4 rounded-2xl animate-fade-in">
                      <label className="block text-sm font-bold text-dark mb-3">Select a Saved Pet (Optional)</label>
                      <div className="flex flex-wrap gap-3">
                        {savedPets.map(pet => (
                          <button
                            key={pet.id}
                            type="button"
                            onClick={() => {
                              let ageRange = "";
                              if (pet.date_of_birth) {
                                try {
                                  const years = differenceInYears(new Date(), parseISO(pet.date_of_birth));
                                  if (years < 1) ageRange = "0-1yr";
                                  else if (years < 3) ageRange = "1-3yr";
                                  else if (years < 7) ageRange = "3-7yr";
                                  else ageRange = "7yr+";
                                } catch (e) {}
                              }
                              setSelectedSavedPetId(pet.id);
                              setFormData(prev => ({
                                ...prev,
                                pet_name: pet.name,
                                pet_type: pet.type,
                                other_pet_type: "",
                                pet_breed: pet.breed || "",
                                pet_age: ageRange,
                                pet_id: pet.id
                              }));
                            }}
                            className={clsx(
                              "bg-white border hover:border-primary px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2",
                              formData.pet_name === pet.name ? "border-primary ring-2 ring-primary/20 bg-primary-light/30" : "border-gray-200 text-dark"
                            )}
                          >
                            <span className="text-lg">
                              {pet.type === 'Dog' ? '🐶' : pet.type === 'Cat' ? '🐱' : pet.type === 'Bird' ? '🦜' : pet.type === 'Rabbit' ? '🐰' : '🐾'}
                            </span>
                            {pet.name}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-3">Or enter new pet details below.</p>
                    </div>
                  )}

                  {profileLoaded.name && profileLoaded.phone ? (
                    <div className="bg-primary-light/10 border border-primary-light/40 p-4 rounded-xl flex justify-between items-center text-sm">
                      <div>
                        <p className="font-bold text-dark">{formData.client_name}</p>
                        <p className="text-xs text-gray-500">{formData.client_phone} {formData.client_email ? `• ${formData.client_email}` : ''}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-success/10 text-success font-bold px-2.5 py-1 rounded-full">
                          <CheckCircle size={14} className="inline mr-1" /> Saved Profile
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setProfileLoaded(prev => ({ ...prev, name: false, phone: false }));
                          }}
                          className="text-xs text-primary font-bold hover:underline"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Owner Name *</label>
                          <input
                            type="text"
                            required
                            value={formData.client_name}
                            onChange={e => setFormData({ ...formData, client_name: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            placeholder="Ali Khan"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number *</label>
                          <input
                            type="tel"
                            required
                            value={formData.client_phone}
                            onChange={e => setFormData({ ...formData, client_phone: formatPhone(e.target.value) })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            placeholder="03XX-XXXXXXX"
                            maxLength={12}
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp Number *</label>
                        <input
                          type="tel"
                          required
                          value={formData.client_whatsapp}
                          onChange={e => setFormData({ ...formData, client_whatsapp: formatPhone(e.target.value) })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="03XX-XXXXXXX"
                          maxLength={12}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Email (Optional)</label>
                        <input
                          type="email"
                          value={formData.client_email}
                          onChange={e => setFormData({ ...formData, client_email: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="ali@example.com"
                        />
                      </div>
                    </>
                  )}

                  <hr className="border-gray-100 my-4" />

                  {selectedSavedPetId ? (
                    <div className="bg-primary-light/10 border border-primary-light/40 p-4 rounded-xl flex justify-between items-center text-sm animate-fade-in">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">
                          {formData.pet_type === 'Dog' ? '🐶' : formData.pet_type === 'Cat' ? '🐱' : formData.pet_type === 'Bird' ? '🦜' : formData.pet_type === 'Rabbit' ? '🐰' : '🐾'}
                        </span>
                        <div>
                          <p className="font-bold text-dark">{formData.pet_name}</p>
                          <p className="text-xs text-gray-500">
                            {formData.pet_type} {formData.pet_breed ? `• ${formData.pet_breed}` : ''} {formData.pet_age ? `• ${formData.pet_age}` : ''}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSavedPetId(null);
                          setFormData(prev => ({
                            ...prev,
                            pet_name: "",
                            pet_type: "",
                            other_pet_type: "",
                            pet_breed: "",
                            pet_age: "",
                            pet_id: null
                          }));
                        }}
                        className="text-xs text-emergency font-bold hover:underline"
                      >
                        Use Different Pet
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Pet Name (Optional)</label>
                          <input
                            type="text"
                            value={formData.pet_name}
                            onChange={e => setFormData({ ...formData, pet_name: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            placeholder="Sheru"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Pet Age (Optional)</label>
                          <select
                            value={formData.pet_age}
                            onChange={e => setFormData({ ...formData, pet_age: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                          >
                            <option value="">Select Age</option>
                            <option value="0-1yr">0 - 1 year</option>
                            <option value="1-3yr">1 - 3 years</option>
                            <option value="3-7yr">3 - 7 years</option>
                            <option value="7yr+">7+ years</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Pet Type *</label>
                        <div className="flex flex-wrap gap-3">
                          {[
                            { type: "Dog", icon: Dog },
                            { type: "Cat", icon: Cat },
                            { type: "Bird", icon: Bird },
                            { type: "Rabbit", icon: Rabbit },
                            { type: "Other", icon: FileQuestion }
                          ].map(p => (
                            <button
                              key={p.type}
                              type="button"
                              onClick={() => setFormData({ ...formData, pet_type: p.type })}
                              className={clsx(
                                "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all w-24 gap-2",
                                formData.pet_type === p.type ? "border-primary bg-primary-light text-primary shadow-sm" : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
                              )}
                            >
                              <p.icon size={24} />
                              <span className="text-xs font-bold">{p.type}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {formData.pet_type === "Other" && (
                        <div className="animate-fade-in mt-4">
                          <label className="block text-sm font-bold text-gray-700 mb-1">Please specify *</label>
                          <input
                            type="text"
                            required
                            value={formData.other_pet_type}
                            onChange={e => setFormData({ ...formData, other_pet_type: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            placeholder="e.g. Guinea Pig"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Pet Breed (Optional)</label>
                        <input
                          type="text"
                          value={formData.pet_breed}
                          onChange={e => setFormData({ ...formData, pet_breed: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="e.g. Golden Retriever"
                        />
                      </div>
                    </>
                  )}

                  <hr className="border-gray-100 my-4" />

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Service Needed *</label>
                    <select
                      required
                      value={formData.service_type}
                      onChange={e => setFormData({ ...formData, service_type: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                    >
                      <option value="">Select a service</option>
                      {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <input
                      type="checkbox"
                      id="emergency"
                      checked={formData.is_emergency}
                      onChange={e => setFormData({ ...formData, is_emergency: e.target.checked })}
                      className="w-5 h-5 rounded text-emergency focus:ring-emergency"
                    />
                    <label htmlFor="emergency" className="font-bold text-dark cursor-pointer">Is this an emergency?</label>
                  </div>

                  {formData.is_emergency && (
                    <div className="bg-emergency/10 border-l-4 border-emergency p-4 rounded-r-xl flex flex-col gap-3 animate-fade-in">
                      <div className="flex gap-3">
                        <AlertCircle className="text-emergency shrink-0" />
                        <p className="text-sm text-dark font-medium leading-relaxed">
                          For life-threatening emergencies please Call immediately: <strong className="text-emergency font-bold">0307-8517122</strong>
                        </p>
                      </div>
                      <a
                        href={`tel:${BRAND.phone}`}
                        className="bg-emergency hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold w-fit text-sm flex items-center gap-2 shadow-sm transition-colors"
                      >
                        Call Now
                      </a>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Brief description of issue (Optional)</label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                      placeholder="Any specific symptoms or concerns?"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="font-display text-2xl font-bold text-dark mb-4">Date, Time & Location</h2>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Date *</label>
                    <DatePicker
                      value={formData.preferred_date}
                      minDate={today}
                      onChange={(date) => {
                        setFormData({ ...formData, preferred_date: date });
                      }}
                      availableDays={
                        businessSettings 
                          ? parseDaysToArray(parseWorkingHours(businessSettings.working_hours).days)
                          : undefined
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Time *</label>
                    {isFetchingSlots ? (
                      <div className="flex items-center gap-2 text-gray-500 p-4">
                        <Loader2 className="animate-spin" size={16} /> Fetching availability...
                      </div>
                    ) : !formData.preferred_date ? (
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500">
                        Please select a date first
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {availableSlots.map(slot => {
                          const slotHour = parseInt(slot.time.split(':')[0], 10);
                          const isToday = formData.preferred_date === today;
                          const isPassed = isToday && slotHour <= currentHour;

                          const isBlocked = !slot.available || isPassed;
                          const isSelected = formData.preferred_time === slot.time;
                          return (
                            <button
                              key={slot.time}
                              type="button"
                              disabled={isBlocked}
                              onClick={() => setFormData({ ...formData, preferred_time: slot.time })}
                              className={clsx(
                                "py-2 px-1 text-sm font-bold rounded-lg border transition-all text-center",
                                isBlocked ? "bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed opacity-60"
                                  : isSelected ? "bg-primary text-white border-primary shadow-sm"
                                    : "bg-white text-dark border-gray-200 hover:border-primary"
                              )}
                            >
                              {formatTime(slot.time)}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  <hr className="border-gray-100 my-4" />

                  {profileLoaded.address && profileLoaded.city ? (
                    <div className="bg-primary-light/10 border border-primary-light/40 p-4 rounded-xl flex justify-between items-center text-sm">
                      <div>
                        <p className="font-bold text-dark">{formData.address}</p>
                        <p className="text-xs text-gray-500">{formData.city}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-success/10 text-success font-bold px-2.5 py-1 rounded-full">
                          <CheckCircle size={14} className="inline mr-1" /> Saved Address
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setProfileLoaded(prev => ({ ...prev, address: false, city: false }));
                          }}
                          className="text-xs text-primary font-bold hover:underline"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1">City *</label>
                        <select
                          required
                          value={formData.city}
                          onChange={e => setFormData({ ...formData, city: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                        >
                          <option value="" disabled>Select your city</option>
                          <option value="Lahore">Lahore</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Full Address *</label>
                        <textarea
                          required
                          rows={2}
                          value={formData.address}
                          onChange={e => setFormData({ ...formData, address: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                          placeholder="House / Street / Area"
                        />
                      </div>
                    </div>
                  )}

                  {profileLoaded.location && formData.pin_lat && formData.pin_lng ? (
                    <div className="bg-primary-light/10 border border-primary-light/40 p-4 rounded-xl text-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs bg-success/10 text-success font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle size={14} className="inline mr-1" /> Saved Exact Location
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setProfileLoaded(prev => ({ ...prev, location: false }));
                            setFormData(prev => ({ ...prev, pin_lat: null, pin_lng: null }));
                          }}
                          className="text-xs text-emergency font-bold hover:underline"
                        >
                          Use Different Location
                        </button>
                      </div>
                      <div className="h-48 w-full rounded-xl overflow-hidden border border-gray-200 relative bg-gray-100">
                        <iframe
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${(formData.pin_lng || 0) - 0.005}%2C${(formData.pin_lat || 0) - 0.005}%2C${(formData.pin_lng || 0) + 0.005}%2C${(formData.pin_lat || 0) + 0.005}&layer=mapnik&marker=${formData.pin_lat}%2C${formData.pin_lng}`}
                        ></iframe>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-primary-light/20 border border-primary-light p-5 rounded-xl">
                      <label className="flex items-center gap-2 text-sm font-bold text-dark mb-1">
                        📍 Share Your Exact Location (Optional)
                      </label>
                      <p className="text-xs text-gray-500 mb-4">
                        Helps our vet find you faster.
                        <span className="text-primary font-semibold block mt-1">
                          📌 Pinning your location is highly recommended so our vet can navigate directly to your door without any delay!
                        </span>
                      </p>

                      {locationStatus !== "granted" ? (
                        <>
                          <button
                            type="button"
                            onClick={getLocation}
                            disabled={locationStatus === "loading"}
                            className="bg-white border border-primary text-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary hover:text-white transition-colors flex items-center gap-2 disabled:opacity-50"
                          >
                            {locationStatus === "loading" && <Loader2 className="animate-spin" size={14} />}
                            Use My Current Location
                          </button>
                          {locationStatus === "denied" && (
                            <p className="text-xs text-emergency mt-2">Location not shared — address will be used for navigation.</p>
                          )}
                        </>
                      ) : (
                        <div className="animate-fade-in">
                          <div className="flex items-center gap-2 text-success text-sm font-bold mb-3">
                            <CheckCircle size={16} /> Location captured successfully
                          </div>
                          <div className="h-48 w-full rounded-xl overflow-hidden border border-gray-200 relative bg-gray-100">
                            <iframe
                              width="100%"
                              height="100%"
                              frameBorder="0"
                              src={`https://www.openstreetmap.org/export/embed.html?bbox=${(formData.pin_lng || 0) - 0.005}%2C${(formData.pin_lat || 0) - 0.005}%2C${(formData.pin_lng || 0) + 0.005}%2C${(formData.pin_lat || 0) + 0.005}&layer=mapnik&marker=${formData.pin_lat}%2C${formData.pin_lng}`}
                            ></iframe>
                          </div>
                          <button type="button" onClick={() => setLocationStatus("idle")} className="text-xs text-primary underline mt-2 hover:text-primary-mid">Remove location</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="font-display text-2xl font-bold text-dark mb-4">Review & Confirm</h2>

                  <div className="bg-primary-light/20 p-5 rounded-2xl border border-primary-light mb-6 space-y-4">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">Payment Note</p>
                      <p className="text-sm text-dark font-medium">Payment is collected by the vet at your doorstep. No online payment required.</p>
                    </div>
                    <hr className="border-primary-light" />
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">Confirmation</p>
                      <p className="text-sm text-dark font-medium">You will receive a confirmation WhatsApp message within 30 minutes of booking.</p>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-primary transition-colors">
                    <input
                      type="checkbox"
                      required
                      checked={formData.confirmed}
                      onChange={e => setFormData({ ...formData, confirmed: e.target.checked })}
                      className="w-5 h-5 rounded text-primary focus:ring-primary mt-0.5"
                    />
                    <span className="text-sm text-dark font-bold">I confirm the above details are correct and I agree to the <a href="/terms" target="_blank" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" target="_blank" className="text-primary hover:underline">Privacy Policy</a>.</span>
                  </label>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                {step > 1 ? (
                  <button type="button" onClick={handlePrev} className="text-gray-500 hover:text-primary font-medium px-4 py-2 transition-colors">
                    Back
                  </button>
                ) : <div></div>}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-primary hover:bg-primary-mid text-white px-8 py-3 rounded-full font-bold transition-all shadow-sm flex items-center gap-2"
                  >
                    Continue <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!isStep3Valid || isLoading}
                    className="bg-primary hover:bg-primary-mid disabled:opacity-50 disabled:cursor-not-allowed text-white px-10 py-3.5 rounded-full font-bold transition-all shadow-md flex items-center gap-2"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Confirm Appointment"}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right Column - Summary */}
          <div className="w-full lg:w-[40%] lg:sticky lg:top-24">
            <div className="bg-dark rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-5 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
                <Dog size={250} />
              </div>

              <h3 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
                Booking Summary
              </h3>

              <div className="space-y-5 relative z-10 font-sans">
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Pet & Owner</p>
                  <p className="font-bold text-lg">
                    {formData.pet_type
                      ? `${formData.pet_type === "Other" ? formData.other_pet_type || "Other" : formData.pet_type}${formData.pet_name ? ` (${formData.pet_name})` : ""}`
                      : "—"}
                  </p>
                  <p className="text-sm text-gray-300">
                    {formData.client_name ? `${formData.client_name} • ${formData.client_phone}` : "—"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Service</p>
                  <p className="font-bold text-primary-light">
                    {formData.service_type || "—"}
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><CalendarIcon size={12} /> Date</p>
                    <p className="font-bold text-sm">
                      {formData.preferred_date ? new Date(formData.preferred_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : "—"}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Clock size={12} /> Time</p>
                    <p className="font-bold text-sm">
                      {formData.preferred_time ? formatTime(formData.preferred_time) : "—"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><MapPin size={12} /> Location</p>
                  <p className="font-bold text-sm text-gray-200 line-clamp-2">
                    {formData.address ? `${formData.address}, ${formData.city}` : "—"}
                  </p>
                </div>

                {formData.is_emergency && (
                  <div className="bg-emergency/20 border border-emergency/50 p-3 rounded-xl mt-4 flex items-center gap-2">
                    <AlertCircle size={16} className="text-emergency shrink-0" />
                    <p className="text-xs font-bold text-emergency">Emergency Case</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
              <CheckCircle size={14} className="text-success" /> Fully encrypted & secure booking
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
