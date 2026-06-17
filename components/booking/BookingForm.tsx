"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  SERVICES,
  PET_TYPES,
  PAKISTANI_CITIES,
  TIME_SLOTS,
  BRAND,
} from "@/lib/constants";
import { getMinBookingDate, getMaxBookingDate } from "@/lib/utils";
import Input, { Select, Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type Step = 1 | 2 | 3;

interface FormData {
  // Step 1 — Pet Info
  pet_name: string;
  pet_type: string;
  pet_breed: string;
  pet_age: string;
  service_type: string;
  emergency_level: string;
  // Step 2 — Owner & Location
  client_name: string;
  client_phone: string;
  client_email: string;
  address: string;
  city: string;
  // Step 3 — Date & Time
  preferred_date: string;
  preferred_time: string;
  notes: string;
}

const initialForm: FormData = {
  pet_name: "",
  pet_type: "",
  pet_breed: "",
  pet_age: "",
  service_type: "",
  emergency_level: "none",
  client_name: "",
  client_phone: "",
  client_email: "",
  address: "",
  city: "",
  preferred_date: "",
  preferred_time: "",
  notes: "",
};

export default function BookingForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitError, setSubmitError] = useState("");

  const set = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (step === 1) {
      if (!form.pet_type) newErrors.pet_type = "Please select pet type";
      if (!form.service_type) newErrors.service_type = "Please select a service";
    }
    if (step === 2) {
      if (!form.client_name) newErrors.client_name = "Your name is required";
      if (!form.client_phone) newErrors.client_phone = "Phone number is required";
      if (!form.address) newErrors.address = "Address is required";
      if (!form.city) newErrors.city = "City is required";
    }
    if (step === 3) {
      if (!form.preferred_date) newErrors.preferred_date = "Please select a date";
      if (!form.preferred_time) newErrors.preferred_time = "Please select a time slot";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = () => {
    if (validateStep()) setStep((s) => (s < 3 ? ((s + 1) as Step) : s));
  };

  const back = () => setStep((s) => (s > 1 ? ((s - 1) as Step) : s));

  const submit = async () => {
    if (!validateStep()) return;
    setIsLoading(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: form.client_name,
          client_phone: form.client_phone,
          client_whatsapp: form.client_phone,
          client_email: form.client_email || null,
          pet_name: form.pet_name,
          pet_type: form.pet_type,
          pet_breed: form.pet_breed || null,
          pet_age: form.pet_age || null,
          service_type: SERVICES.find((s) => s.id === form.service_type)?.name ?? form.service_type,
          preferred_date: form.preferred_date,
          preferred_time: form.preferred_time,
          address: form.address,
          city: form.city,
          notes: form.notes || null,
          is_emergency: form.emergency_level === "high" || form.emergency_level === "critical",
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setSubmitError(json.error ?? "Something went wrong. Please try again.");
        setIsLoading(false);
        return;
      }

      const { booking_ref } = json.appointment;
      router.push(
        `/book-vet-appointment-lahore/success?ref=${booking_ref}&name=${encodeURIComponent(form.client_name)}&pet=${encodeURIComponent(form.pet_name)}`
      );
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
      setIsLoading(false);
    }
  };

  const steps = [
    { num: 1, label: "Pet Info" },
    { num: 2, label: "Your Details" },
    { num: 3, label: "Schedule" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-0 mb-10">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step >= s.num
                    ? "bg-hero-gradient text-white shadow-glow"
                    : "bg-gray-100 text-gray-400"
                  }`}
              >
                {step > s.num ? "✓" : s.num}
              </div>
              <span
                className={`text-xs mt-1 font-medium ${step >= s.num ? "text-primary" : "text-gray-400"
                  }`}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-16 sm:w-24 h-0.5 mx-2 mb-4 transition-all duration-300 ${step > s.num ? "bg-primary-mid" : "bg-gray-200"
                  }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="card p-8">
        {/* Step 1 — Pet Info */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="font-display font-bold text-dark text-2xl mb-1">About Your Pet</h2>
              <p className="text-dark/60 text-sm">Tell us about your furry friend</p>
            </div>

            <Input
              id="pet_name"
              label="Pet's Name (Optional)"
              placeholder="e.g., Sheru"
              value={form.pet_name}
              onChange={(e) => set("pet_name", e.target.value)}
              error={errors.pet_name}
              leftIcon={<span className="text-sm">🐾</span>}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                id="pet_type"
                label="Pet Type"
                required
                placeholder="Select pet type"
                options={PET_TYPES}
                value={form.pet_type}
                onChange={(e) => set("pet_type", e.target.value)}
                error={errors.pet_type}
              />
              <Input
                id="pet_breed"
                label="Breed (Optional)"
                placeholder="e.g., Golden Retriever"
                value={form.pet_breed}
                onChange={(e) => set("pet_breed", e.target.value)}
              />
            </div>

            <Input
              id="pet_age"
              label="Age (Optional)"
              placeholder="e.g., 2 years, 6 months"
              value={form.pet_age}
              onChange={(e) => set("pet_age", e.target.value)}
            />

            <Select
              id="service_type"
              label="Service Required"
              required
              placeholder="Select a service"
              options={SERVICES.map((s) => ({ value: s.id, label: `${s.icon} ${s.name}` }))}
              value={form.service_type}
              onChange={(e) => set("service_type", e.target.value)}
              error={errors.service_type}
            />

            <Select
              id="emergency_level"
              label="Is This an Emergency?"
              options={[
                { value: "none", label: "No — Routine Visit" },
                { value: "low", label: "Low — Mild Concern" },
                { value: "medium", label: "Medium — Moderate Concern" },
                { value: "high", label: "High — Urgent Care Needed" },
                { value: "critical", label: "🚨 Critical — Call Immediately" },
              ]}
              value={form.emergency_level}
              onChange={(e) => set("emergency_level", e.target.value)}
            />

            {(form.emergency_level === "high" || form.emergency_level === "critical") && (
              <div className="rounded-xl bg-emergency/5 border border-emergency/20 p-4 flex items-start gap-3 animate-fade-in">
                <span className="text-lg">🚨</span>
                <div>
                  <p className="text-emergency font-semibold text-sm">For emergencies, please call directly!</p>
                  <a href={`tel:${BRAND.emergency_line}`} className="text-emergency text-sm underline font-bold">
                    {BRAND.emergency_line}
                  </a>
                  <span className="text-dark/50 text-xs ml-1">or WhatsApp for fastest response</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2 — Owner & Location */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="font-display font-bold text-dark text-2xl mb-1">Your Details</h2>
              <p className="text-dark/60 text-sm">We'll use this to confirm your booking</p>
            </div>

            <Input
              id="client_name"
              label="Your Full Name"
              required
              placeholder="Ahmed Ali"
              value={form.client_name}
              onChange={(e) => set("client_name", e.target.value)}
              error={errors.client_name}
              leftIcon={<span className="text-sm">👤</span>}
            />

            <Input
              id="client_phone"
              label="WhatsApp / Phone Number"
              required
              type="tel"
              placeholder="03XX XXXXXXX"
              value={form.client_phone}
              onChange={(e) => set("client_phone", e.target.value)}
              error={errors.client_phone}
              leftIcon={<span className="text-sm">📱</span>}
              hint="We'll send your booking confirmation here"
            />

            <Input
              id="client_email"
              label="Email Address (Optional)"
              type="email"
              placeholder="ahmed@example.com"
              value={form.client_email}
              onChange={(e) => set("client_email", e.target.value)}
              leftIcon={<span className="text-sm">📧</span>}
            />

            <Select
              id="city"
              label="City"
              required
              placeholder="Select your city"
              options={PAKISTANI_CITIES.map((c) => ({ value: c, label: c }))}
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              error={errors.city}
            />

            <Textarea
              id="address"
              label="Full Home Address"
              required
              rows={3}
              placeholder="House #, Street, Area, Landmark..."
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              error={errors.address}
              hint="Please include a nearby landmark for easier navigation"
            />
          </div>
        )}

        {/* Step 3 — Schedule */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="font-display font-bold text-dark text-2xl mb-1">Choose Your Slot</h2>
              <p className="text-dark/60 text-sm">Select your preferred date and time</p>
            </div>

            <Input
              id="preferred_date"
              label="Preferred Date"
              required
              type="date"
              min={getMinBookingDate()}
              max={getMaxBookingDate()}
              value={form.preferred_date}
              onChange={(e) => set("preferred_date", e.target.value)}
              error={errors.preferred_date}
              hint="Bookings available from tomorrow up to 30 days ahead"
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-dark/80">
                Preferred Time <span className="text-emergency">*</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot.value}
                    type="button"
                    onClick={() => set("preferred_time", slot.value)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all duration-150 ${form.preferred_time === slot.value
                        ? "bg-hero-gradient text-white border-primary shadow-glow"
                        : "bg-white text-dark/70 border-gray-200 hover:border-primary hover:text-primary"
                      }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
              {errors.preferred_time && (
                <p className="text-xs text-emergency flex items-center gap-1">
                  <span>⚠</span> {errors.preferred_time}
                </p>
              )}
            </div>

            <Textarea
              id="notes"
              label="Additional Notes (Optional)"
              rows={3}
              placeholder="Any specific concerns, symptoms, or instructions for the vet..."
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />

            {/* Summary */}
            <div className="rounded-xl bg-primary-light p-5 space-y-2">
              <p className="font-semibold text-dark text-sm mb-3">📋 Booking Summary</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-dark/70">
                <span>Pet:</span> <span className="font-medium text-dark">{form.pet_name || 'Not provided'} ({form.pet_type})</span>
                <span>Service:</span> <span className="font-medium text-dark">{SERVICES.find(s => s.id === form.service_type)?.name || form.service_type}</span>
                <span>Name:</span> <span className="font-medium text-dark">{form.client_name}</span>
                <span>City:</span> <span className="font-medium text-dark">{form.city}</span>
              </div>
            </div>
          </div>
        )}

        {/* Submit error */}
        {submitError && (
          <div className="mt-5 rounded-xl bg-emergency/10 border border-emergency/20 p-4 flex items-start gap-3 animate-fade-in">
            <span className="text-lg flex-shrink-0">⚠️</span>
            <p className="text-emergency text-sm">{submitError}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
          {step > 1 ? (
            <Button variant="outline" onClick={back} id="booking-back-btn">
              ← Back
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button onClick={next} id={`booking-next-step-${step}`}>
              Continue →
            </Button>
          ) : (
            <Button
              onClick={submit}
              isLoading={isLoading}
              id="booking-submit-btn"
              className="px-8"
            >
              Confirm Booking ✓
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
