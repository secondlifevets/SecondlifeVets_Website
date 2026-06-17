"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { STATUS_COLORS } from "@/lib/constants";
import { formatDate, formatTime } from "@/lib/utils";
import { AppointmentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import WhatsappIcon from "@/components/ui/WhatsappIcon";
import { MapPin } from "lucide-react";
import PassportCompletionModal from "@/components/admin/PassportCompletionModal";

interface DbAppointment {
  id: string;
  booking_ref: string;
  client_name: string;
  client_phone: string;
  client_whatsapp: string | null;
  client_email: string | null;
  pet_name: string;
  pet_type: string;
  pet_breed: string | null;
  pet_age: string | null;
  pet_id: string | null;
  service_type: string;
  preferred_date: string;
  preferred_time: string;
  address: string;
  city: string;
  pin_lat?: number | null;
  pin_lng?: number | null;
  status: string;
  notes: string | null;
  is_emergency: boolean;
  admin_notes: string | null;
  customer_id: string | null;
  created_at: string;
}

export default function AppointmentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [appt, setAppt] = useState<DbAppointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<AppointmentStatus>("pending");
  const [adminNotes, setAdminNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isPassportModalOpen, setIsPassportModalOpen] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const fetchAppt = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("appointments")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) {
          console.error("Error fetching appointment:", error);
        } else if (data) {
          setAppt(data);
          setStatus(data.status as AppointmentStatus);
          setAdminNotes(data.admin_notes || "");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppt();
  }, [params.id]);

  const handleSave = async () => {
    if (!appt) return;

    if (status === 'completed' && appt.status !== 'completed' && appt.pet_id) {
      setIsPassportModalOpen(true);
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const { error } = await supabase
        .from("appointments")
        .update({
          status,
          admin_notes: adminNotes.trim() || null,
        })
        .eq("id", appt.id);

      if (error) {
        console.error("Error updating appointment:", error);
      } else {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        // Refresh local state values
        setAppt((prev) =>
          prev ? { ...prev, status, admin_notes: adminNotes.trim() || null } : null
        );
      }
    } catch (err) {
      console.error("Unexpected error during save:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!appt || !confirm("Are you sure you want to cancel this appointment?")) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", appt.id);

      if (error) {
        console.error("Error cancelling appointment:", error);
      } else {
        setStatus("cancelled");
        setAppt((prev) => (prev ? { ...prev, status: "cancelled" } : null));
      }
    } catch (err) {
      console.error("Unexpected error during cancel:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-primary-mid border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!appt) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="text-5xl">⚠️</div>
        <h1 className="font-display font-bold text-dark text-2xl">Appointment Not Found</h1>
        <p className="text-dark/60 text-sm">The appointment you are looking for does not exist or has been deleted.</p>
        <Link href="/admin/appointments" className="btn-primary inline-block">
          Back to Appointments
        </Link>
      </div>
    );
  }

  const statusStyle = STATUS_COLORS[status];

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/appointments"
            className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-dark/60 hover:bg-primary-light hover:text-primary transition-colors text-sm"
          >
            ←
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display font-bold text-dark text-2xl">Appointment Details</h1>
              <span className={cn("badge", statusStyle.bg, statusStyle.text, statusStyle.border)}>
                {statusStyle.label}
              </span>
            </div>
            <p className="font-mono text-primary font-bold text-sm mt-1">{appt.booking_ref}</p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          {saveSuccess && (
            <span className="text-success text-xs font-semibold animate-fade-in">
              Saved successfully! ✓
            </span>
          )}
          <select
            className="input-field text-xs py-2 w-auto"
            id="appointment-status-change"
            value={status}
            onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
          >
            {Object.entries(STATUS_COLORS).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>
          <button
            id="appointment-save-status"
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary text-xs px-4 py-2 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Info */}
          <div className="card p-6">
            <h2 className="font-display font-bold text-dark text-lg mb-5 flex items-center gap-2">
              👤 Client Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: "Full Name", value: appt.client_name },
                {
                  label: "Phone",
                  value: appt.client_phone,
                },
                {
                  label: "WhatsApp",
                  value: appt.client_whatsapp || appt.client_phone,
                  link: `https://wa.me/92${(appt.client_whatsapp || appt.client_phone).replace(/^0+/, "")}`,
                },
                { label: "Email", value: appt.client_email || "—" },
                { label: "City", value: appt.city },
              ].map((field) => (
                <div key={field.label}>
                  <p className="text-xs text-dark/40 uppercase tracking-wider mb-1">
                    {field.label}
                  </p>
                  {field.link ? (
                    <a
                      href={field.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary hover:underline"
                    >
                      {field.value}
                    </a>
                  ) : (
                    <p className="font-semibold text-dark">{field.value}</p>
                  )}
                </div>
              ))}
              <div className="sm:col-span-2">
                <p className="text-xs text-dark/40 uppercase tracking-wider mb-1">Address</p>
                <div className="flex flex-col gap-2 mt-1">
                  <p className="font-semibold text-dark leading-snug">{appt.address}</p>
                  {appt.pin_lat && appt.pin_lng ? (
                    <a 
                      href={`https://maps.google.com/?q=${appt.pin_lat},${appt.pin_lng}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors px-3 py-1.5 rounded-lg text-sm font-bold w-fit mt-1 border border-primary/20 shadow-sm"
                    >
                      <MapPin size={16} />
                      Open Pin in Maps
                    </a>
                  ) : (
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(appt.address + ', ' + appt.city)}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors px-3 py-1.5 rounded-lg text-sm font-bold w-fit mt-1 border border-gray-200 shadow-sm"
                    >
                      <MapPin size={16} />
                      Search Address in Maps
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Pet Info */}
          <div className="card p-6">
            <h2 className="font-display font-bold text-dark text-lg mb-5 flex items-center gap-2 justify-between">
              <span className="flex items-center gap-2">🐾 Pet Information</span>
              {appt.pet_id ? (
                <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider" title="Registered Pet (Passport Eligible)">Registered</span>
              ) : (
                <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider" title="Guest Pet (No Passport)">Guest</span>
              )}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { label: "Name", value: appt.pet_name },
                { label: "Type", value: appt.pet_type },
                { label: "Breed", value: appt.pet_breed || "—" },
                { label: "Age", value: appt.pet_age || "—" },
                { label: "Service", value: appt.service_type },
              ].map((field) => (
                <div key={field.label}>
                  <p className="text-xs text-dark/40 uppercase tracking-wider mb-1">
                    {field.label}
                  </p>
                  <p className="font-semibold text-dark capitalize">{field.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {appt.notes && (
            <div className="card p-6">
              <h2 className="font-display font-bold text-dark text-lg mb-4 flex items-center gap-2">
                📋 Client Notes
              </h2>
              <p className="text-dark/70 text-sm leading-relaxed bg-primary-light rounded-xl p-4">
                {appt.notes}
              </p>
            </div>
          )}

          {/* Internal Admin & Vet Treatment Notes */}
          <div className="card p-6">
            <h2 className="font-display font-bold text-dark text-lg mb-4 flex items-center gap-2">
              🩺 Treatment & Admin Notes
            </h2>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Log diagnosis, administered medications, follow-up recommendations, or private internal notes here..."
              rows={6}
              className="w-full input-field resize-none text-sm p-4"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary text-xs px-6 py-2 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Notes"}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Schedule */}
          <div className="card p-6">
            <h2 className="font-semibold text-dark mb-4">📅 Schedule</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-dark/40 text-xs uppercase tracking-wider mb-1">Date</p>
                <p className="font-semibold text-dark">{formatDate(appt.preferred_date)}</p>
              </div>
              <div>
                <p className="text-dark/40 text-xs uppercase tracking-wider mb-1">Time</p>
                <p className="font-semibold text-dark">{formatTime(appt.preferred_time)}</p>
              </div>
              <div>
                <p className="text-dark/40 text-xs uppercase tracking-wider mb-1">Emergency Visit</p>
                <p className="font-semibold text-dark capitalize">
                  {appt.is_emergency ? "🚨 Yes" : "No"}
                </p>
              </div>
              <div>
                <p className="text-dark/40 text-xs uppercase tracking-wider mb-1">Booked On</p>
                <p className="font-semibold text-dark">
                  {new Date(appt.created_at).toLocaleDateString("en-PK", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h2 className="font-semibold text-dark mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <a
                href={`https://wa.me/92${(appt.client_whatsapp || appt.client_phone).replace(/^0+/, "")}?text=${encodeURIComponent(
                  `Hi ${appt.client_name}! This is Vets On Door. Your appointment for ${appt.pet_name} is confirmed for ${formatDate(appt.preferred_date)} at ${formatTime(appt.preferred_time)}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                id="appointment-whatsapp-client"
                className="btn-ghost text-[#25D366] text-xs w-full border border-[#25D366]/20 bg-[#25D366]/5 hover:bg-[#25D366]/10 text-center block flex items-center justify-center gap-1.5"
              >
                <WhatsappIcon className="w-4 h-4" /> WhatsApp Client
              </a>
              <a
                href={`tel:${appt.client_phone}`}
                id="appointment-call-client"
                className="btn-ghost text-xs w-full border border-gray-200 text-center block"
              >
                📞 Call Client
              </a>
              {status !== "cancelled" && (
                <button
                  id="appointment-cancel"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="w-full text-xs text-emergency font-medium py-2 px-4 rounded-xl hover:bg-emergency/5 transition-colors border border-emergency/20"
                >
                  ✕ Cancel Appointment
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {isPassportModalOpen && appt && appt.pet_id && (
        <PassportCompletionModal
          appointmentId={appt.id}
          petId={appt.pet_id}
          defaultServiceType={appt.service_type}
          onClose={() => setIsPassportModalOpen(false)}
          onSuccess={() => {
            setIsPassportModalOpen(false);
            setSaveSuccess(true);
            setStatus("completed");
            setAppt({ ...appt, status: "completed" });
            setTimeout(() => setSaveSuccess(false), 3000);
          }}
        />
      )}
    </div>
  );
}
