"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Search, Filter, AlertTriangle, Eye, MessageCircle, MapPin, X, Map, FileText, CheckCircle, Users, Trash2, Loader2, CalendarX, ChevronDown, ChevronUp, ShieldAlert, Phone
} from "lucide-react";
import WhatsappIcon from "@/components/ui/WhatsappIcon";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Pagination from "@/components/ui/Pagination";
import { toast } from "sonner";
import useSWR from "swr";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import { getPetDetailsAction, markVaccinatedToday } from "./actions";
import { differenceInMonths, differenceInYears, parseISO, format, addDays } from "date-fns";
import PassportCompletionModal from "@/components/admin/PassportCompletionModal";

function getPetAge(dob: string) {
  if (!dob) return "Unknown";
  const birthDate = parseISO(dob);
  const now = new Date();
  const years = differenceInYears(now, birthDate);
  const months = differenceInMonths(now, birthDate) % 12;
  
  if (years > 0) {
    return `${years} Year${years > 1 ? 's' : ''}${months > 0 ? `, ${months} Mo` : ''}`;
  }
  return `${months} Month${months !== 1 ? 's' : ''}`;
}

const fetcher = async ([_key, status, emergency, date, search, page, pageSize, customerId, filterPetId]: any) => {
  const supabase = createClient();
  let query = supabase
    .from('appointments')
    .select('*', { count: 'exact' })
    .order('preferred_date', { ascending: false })
    .order('preferred_time', { ascending: false });

  if (status !== "All") query = query.eq('status', status.toLowerCase().replace(" ", "-"));
  if (emergency) query = query.eq('is_emergency', true);
  if (date) query = query.eq('preferred_date', date);
  if (customerId) query = query.eq('customer_id', customerId);
  if (filterPetId) query = query.eq('pet_id', filterPetId);
  if (search) query = query.or(`client_name.ilike.%${search}%,client_phone.ilike.%${search}%,booking_ref.ilike.%${search}%`);

  const from = page * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;
  if (error) throw error;
  return { data, count };
};

export default function AppointmentsClient({ initialData, initialSearchParams }: { initialData: any, initialSearchParams: any }) {
  const supabase = createClient();
  const router = useRouter();
  const searchParamsHook = useSearchParams();

  // Filters
  const [statusFilter, setStatusFilter] = useState(initialSearchParams.status || "All");
  const [search, setSearch] = useState(initialSearchParams.search || "");
  const [isEmergencyOnly, setIsEmergencyOnly] = useState(initialSearchParams.emergency === 'true');
  const [dateFilter, setDateFilter] = useState(initialSearchParams.date || "");
  const [customerId, setCustomerId] = useState(initialSearchParams.customer_id || null);
  const [filterPetId, setFilterPetId] = useState(initialSearchParams.pet_id || null);

  // Modal
  const lastOpenedId = useRef<string | null>(null);
  const [selectedAppt, setSelectedAppt] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  // Confirm Delete
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [apptToDelete, setApptToDelete] = useState<string | null>(null);

  // Exact Pet Details
  const [exactPetAge, setExactPetAge] = useState<string | null>(null);
  const [petImage, setPetImage] = useState<string | null>(null);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [petId, setPetId] = useState<string | null>(null);
  const [lastVaccinationDate, setLastVaccinationDate] = useState<string | null>(null);

  // Elite Vaccination Flow
  const [isPassportModalOpen, setIsPassportModalOpen] = useState(false);
  const [passportModalServiceOverride, setPassportModalServiceOverride] = useState<string | null>(null);


  // Pull-to-Refresh
  const [isPulling, setIsPulling] = useState(false);
  const touchStartY = useRef(0);
  const touchCurrentY = useRef(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      touchStartY.current = e.touches[0].clientY;
    } else {
      touchStartY.current = 0;
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === 0) return;
    touchCurrentY.current = e.touches[0].clientY;
    const pullDistance = touchCurrentY.current - touchStartY.current;
    if (pullDistance > 50 && pullDistance < 150) {
      setIsPulling(true);
    } else if (pullDistance < 0) {
      setIsPulling(false);
    }
  };
  
  const handleTouchEnd = async () => {
    if (touchStartY.current === 0) return;
    const pullDistance = touchCurrentY.current - touchStartY.current;
    if (pullDistance > 80) {
      setIsPulling(true);
      await mutate();
    }
    setIsPulling(false);
    touchStartY.current = 0;
    touchCurrentY.current = 0;
  };

  // Accordion states
  const [isClientExpanded, setIsClientExpanded] = useState(false);
  const [isPetExpanded, setIsPetExpanded] = useState(false);
  const [isServiceExpanded, setIsServiceExpanded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      setIsClientExpanded(true);
      setIsPetExpanded(true);
      setIsServiceExpanded(true);
    }
  }, []);

  // Pagination state
  const [page, setPage] = useState(initialSearchParams.page ? parseInt(initialSearchParams.page) : 0);
  const [pageSize, setPageSize] = useState(50);

  // SWR Fetching
  const { data, error, isLoading, mutate } = useSWR(
    ['appointments', statusFilter, isEmergencyOnly, dateFilter, search, page, pageSize, customerId, filterPetId],
    fetcher,
    { keepPreviousData: true, fallbackData: initialData }
  );

  const appointments = data?.data || [];
  const totalCount = data?.count || 0;

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [statusFilter, isEmergencyOnly, dateFilter, search, pageSize]);

  useEffect(() => {
    const searchParam = searchParamsHook.get('search');
    if (searchParam) {
      setSearch(searchParam);
    }

    const emergency = searchParamsHook.get('emergency');
    if (emergency === 'true') {
      setIsEmergencyOnly(true);
    }

    const customerIdParam = searchParamsHook.get('customer_id');
    if (customerIdParam) {
      setCustomerId(customerIdParam);
    }
    
    const petIdParam = searchParamsHook.get('pet_id');
    if (petIdParam) {
      setFilterPetId(petIdParam);
    }
  }, [searchParamsHook]);

  useEffect(() => {
    const id = searchParamsHook.get('id');

    if (id && appointments.length > 0) {
      if (lastOpenedId.current !== id) {
        const appt = appointments.find((a: any) => a.id === id);
        if (appt) {
          setSelectedAppt(appt);
          setAdminNotes(appt.admin_notes || "");
          lastOpenedId.current = id;
        }
      }
    } else if (!id) {
      if (lastOpenedId.current !== null) {
        setSelectedAppt(null);
        setAdminNotes("");
        setExactPetAge(null);
        setPetImage(null);
        setPetId(null);
        setLastVaccinationDate(null);
        setIsImageExpanded(false);
        lastOpenedId.current = null;
      }
    }
  }, [appointments, searchParamsHook]);

  // Fetch exact pet details when modal opens
  useEffect(() => {
    async function fetchPetDetails() {
      if (selectedAppt?.pet_id) {
        try {
          const details = await getPetDetailsAction(selectedAppt.pet_id);
          if (details) {
            setPetId(details.pet_id);
            setLastVaccinationDate(details.last_vaccination_date);
            setExactPetAge(details.dob ? getPetAge(details.dob) : null);
            setPetImage(details.image_url);
            return;
          }
        } catch (err) {
          console.error("Failed to fetch pet details:", err);
        }
      }
      setExactPetAge(null);
      setPetImage(null);
      setPetId(null);
      setLastVaccinationDate(null);
    }
    fetchPetDetails();
  }, [selectedAppt]);

  const updateStatus = async (id: string, newStatus: string, overrideNotes?: string) => {
    setUpdating(true);

    const isModalUpdate = selectedAppt && selectedAppt.id === id;
    const notesToUse = overrideNotes !== undefined ? overrideNotes : adminNotes;
    
    const payload: any = { status: newStatus };
    if (isModalUpdate) {
      payload.admin_notes = notesToUse;
    }

    // Optimistic update
    mutate({
      data: appointments.map((a: any) => a.id === id
        ? { ...a, status: newStatus, ...(isModalUpdate ? { admin_notes: notesToUse } : {}) } as any
        : a),
      count: totalCount
    }, false);

    const res = await fetch(`/api/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const responseData = await res.json();
      if (responseData.whatsapp_url) {
        window.open(responseData.whatsapp_url, "_blank");
      }
      mutate(); // Revalidate
      router.refresh(); // Invalidate Next.js router cache
      if (isModalUpdate) {
        setSelectedAppt({ ...selectedAppt, status: newStatus, admin_notes: notesToUse });
        if (overrideNotes !== undefined) {
          setAdminNotes(notesToUse);
        }
      }
      toast.success(`Appointment status updated to ${newStatus}`);
    } else {
      mutate(); // Rollback
      toast.error("Couldn't update status.");
    }
    setUpdating(false);
  };

  const markVaccinated = async () => {
    // Legacy function, replaced by PassportCompletionModal logic
  };

  const updateDateTime = async (id: string, newDate: string, newTime: string) => {
    setUpdating(true);

    const payload = { 
      preferred_date: newDate, 
      preferred_time: newTime,
      is_reschedule: true 
    };

    const res = await fetch(`/api/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const responseData = await res.json();
      if (responseData.whatsapp_url) {
        window.open(responseData.whatsapp_url, "_blank");
      }
      mutate(); // Revalidate
      router.refresh();
      toast.success("Appointment rescheduled and WhatsApp generated");
    } else {
      toast.error("Couldn't reschedule appointment.");
    }
    setUpdating(false);
  };

  const saveNotes = async () => {
    if (!selectedAppt) return;
    setUpdating(true);

    // Optimistic update
    mutate({ data: appointments.map((a: any) => a.id === selectedAppt.id ? { ...a, admin_notes: adminNotes } as any : a), count: totalCount }, false);

    const res = await fetch(`/api/appointments/${selectedAppt.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_notes: adminNotes })
    });
    if (res.ok) {
      mutate(); // Revalidate
      router.refresh(); // Invalidate Next.js router cache
      toast.success("Admin notes saved successfully");
    } else {
      mutate(); // Rollback
      toast.error("Couldn't save notes.");
    }
    setUpdating(false);
  };

  const handleModificationAction = async (id: string, action: 'approve' | 'deny') => {
    setUpdating(true);
    const res = await fetch(`/api/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ modification_action: action })
    });
    
    if (res.ok) {
      const responseData = await res.json();
      if (responseData.whatsapp_url) {
        window.open(responseData.whatsapp_url, "_blank");
      }
      mutate();
      router.refresh();
      toast.success(action === 'approve' ? "Request approved" : "Request denied");
      setSelectedAppt(null);
    } else {
      toast.error("Couldn't process request.");
    }
    setUpdating(false);
  };

  const requestDelete = (id: string) => {
    setApptToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!apptToDelete) return;

    setUpdating(true);
    // Optimistic update
    mutate({ data: appointments.filter((a: any) => a.id !== apptToDelete), count: totalCount - 1 }, false);

    try {
      const res = await fetch(`/api/appointments/${apptToDelete}`, {
        method: "DELETE",
      });

      if (res.ok) {
        mutate(); // Revalidate
        router.refresh(); // Invalidate Next.js router cache
        if (selectedAppt?.id === apptToDelete) {
          setSelectedAppt(null);
        }
        toast.success("Appointment deleted successfully");
      } else {
        mutate(); // Rollback
        toast.error("Couldn't delete appointment. Please try again.");
      }
    } catch (error) {
      mutate(); // Rollback
      toast.error("Something went wrong while deleting the appointment.");
    } finally {
      setUpdating(false);
      setIsConfirmOpen(false);
      setApptToDelete(null);
    }
  };

  const closeModal = () => {
    setSelectedAppt(null);
    setAdminNotes("");
    if (searchParamsHook.has('id')) {
      const newParams = new URLSearchParams(searchParamsHook.toString());
      newParams.delete('id');
      if (customerId) newParams.set("customer_id", customerId);
      if (filterPetId) newParams.set("pet_id", filterPetId);
      const newUrl = newParams.toString() ? `${window.location.pathname}?${newParams.toString()}` : window.location.pathname;
      router.replace(newUrl, { scroll: false });
    }
  };

  return (
    <div 
      className="p-4 sm:p-8"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {isPulling && (
        <div className="flex justify-center items-center py-4 mb-4 transition-all">
          <Loader2 className="animate-spin text-primary w-6 h-6" />
        </div>
      )}
      {/* Header & Filters */}
      <div className="bg-gray-50 -mx-4 px-4 sm:-mx-8 sm:px-8 py-4 sm:py-6 mb-6 border-b border-gray-200/50 shadow-sm transition-all">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
          <h1 className="font-display text-3xl font-bold text-dark mb-0">Appointments</h1>
          
          <div className="relative w-full lg:w-80 shrink-0">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, phone, ref..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm shadow-sm"
            />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
          <div className="flex gap-2 overflow-x-auto w-full no-scrollbar sm:flex-wrap pb-1">
            <button 
              onClick={() => {
                const today = format(new Date(), "yyyy-MM-dd");
                setDateFilter(dateFilter === today ? "" : today);
                setPage(0);
              }}
              className={clsx(
                "px-4 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap shrink-0 snap-start border-2",
                dateFilter === format(new Date(), "yyyy-MM-dd") ? "bg-dark text-white border-dark shadow-sm" : "bg-white text-gray-600 border-gray-100 hover:border-gray-200"
              )}
            >
              Today
            </button>
            <button 
              onClick={() => {
                const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");
                setDateFilter(dateFilter === tomorrow ? "" : tomorrow);
                setPage(0);
              }}
              className={clsx(
                "px-4 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap shrink-0 snap-start border-2",
                dateFilter === format(addDays(new Date(), 1), "yyyy-MM-dd") ? "bg-dark text-white border-dark shadow-sm" : "bg-white text-gray-600 border-gray-100 hover:border-gray-200"
              )}
            >
              Tomorrow
            </button>
            <div className="w-px h-8 bg-gray-200 mx-1 self-center shrink-0"></div>
            {["All", "Pending", "Confirmed", "In Progress", "Completed", "Cancelled"].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={clsx(
                  "px-4 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap shrink-0 snap-start",
                  statusFilter === s ? "bg-primary text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4 w-full border-t border-gray-100 pt-4">
            <label className="flex items-center gap-2 cursor-pointer bg-red-50 px-4 py-2 rounded-xl border border-red-100 text-emergency font-bold text-sm shrink-0">
              <input type="checkbox" checked={isEmergencyOnly} onChange={e => setIsEmergencyOnly(e.target.checked)} className="rounded text-emergency focus:ring-emergency" />
              Emergency Only
            </label>

            <input
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary flex-1 min-w-[140px]"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500">
                <th className="py-4 px-6 font-bold">Booking Ref</th>
                <th className="py-4 px-6 font-bold">Client</th>
                <th className="py-4 px-6 font-bold">Pet</th>
                <th className="py-4 px-6 font-bold">Service</th>
                <th className="py-4 px-6 font-bold">Date & Time</th>
                <th className="py-4 px-6 font-bold">City</th>
                <th className="py-4 px-6 font-bold">Status</th>
                <th className="py-4 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* @ts-ignore */}
              {!data && isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 animate-pulse">
                    <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-32 mb-2"></div><div className="h-3 bg-gray-100 rounded w-24"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-24 mb-2"></div><div className="h-3 bg-gray-100 rounded w-16"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-28"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-24 mb-2"></div><div className="h-3 bg-gray-100 rounded w-12"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="py-4 px-6"><div className="h-6 bg-gray-200 rounded w-24"></div></td>
                    <td className="py-4 px-6 text-right"><div className="h-8 bg-gray-200 rounded w-20 inline-block"></div></td>
                  </tr>
                ))
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16">
                    <div className="flex flex-col items-center justify-center text-center px-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100 shadow-sm">
                        <CalendarX size={28} className="text-gray-400" />
                      </div>
                      <h3 className="font-display font-bold text-dark text-lg mb-1">No appointments found</h3>
                      <p className="text-gray-500 text-sm max-w-sm">Try adjusting your filters or search terms to find what you're looking for.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                appointments.map((appt: any) => (
                  <tr key={appt.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="text-sm font-bold text-dark">{appt.booking_ref}</span>
                      {appt.is_emergency && <span className="ml-2 inline-block px-2 py-0.5 bg-red-50 text-emergency text-[10px] font-bold rounded-full">Emergency</span>}
                      <p className="text-[10px] text-gray-500 mt-1 tracking-wider whitespace-nowrap">
                        Booked: {new Date(appt.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-bold text-dark">{appt.client_name}</p>
                      <a href={`https://wa.me/${(appt.client_whatsapp || appt.client_phone)?.replace(/\D/g, '') || ""}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                        {appt.client_whatsapp || appt.client_phone}
                      </a>
                      {appt.client_email && (
                        <p className="text-xs text-gray-500 mt-0.5 max-w-[150px] truncate" title={appt.client_email}>
                          {appt.client_email}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-dark">{appt.pet_name}</p>
                        {appt.pet_id ? (
                          <span className="bg-primary/10 text-primary text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider" title="Registered Pet (Passport Eligible)">Registered</span>
                        ) : (
                          <span className="bg-gray-100 text-gray-500 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider" title="Guest Pet (No Passport)">Guest</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{appt.pet_type}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-700 truncate max-w-[150px]">{appt.service_type}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-bold text-dark">{appt.preferred_date}</p>
                      <p className="text-xs text-gray-500">{appt.preferred_time?.substring(0, 5) || "N/A"}</p>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{appt.city}</td>
                    <td className="py-4 px-6">
                      <span
                        className={clsx(
                          "px-3 py-1.5 rounded-lg text-xs font-bold capitalize",
                          appt.status === 'confirmed' ? "bg-success/10 text-success" :
                            appt.status === 'pending' ? "bg-amber-100 text-amber-700" :
                              appt.status === 'completed' ? "bg-primary-light text-primary" :
                                appt.status === 'in-progress' ? "bg-blue-100 text-blue-700" :
                                  "bg-gray-100 text-gray-600"
                        )}
                      >
                        {appt.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {appt.modification_request_status === 'pending' && (
                          <span className="flex items-center justify-center bg-orange-100 text-orange-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider animate-pulse mr-2">
                            Action Req
                          </span>
                        )}
                        <button
                          onClick={() => {
                            setSelectedAppt(appt);
                            setAdminNotes(appt.admin_notes || "");
                          }}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                        >
                          <Eye size={14} /> View
                        </button>
                        <button
                          onClick={() => requestDelete(appt.id)}
                          disabled={updating}
                          className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 disabled:opacity-50"
                          title="Delete appointment permanently"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {(!data && isLoading ? false : appointments.length > 0) && (
          <Pagination
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        )}
      </div>

      {/* Modal */}
      {selectedAppt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl relative my-8 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-3xl shrink-0">
              <div>
                <h2 className="font-display text-2xl font-bold text-dark flex items-center gap-3">
                  Appointment Details
                  {selectedAppt.is_emergency && <span className="bg-red-50 text-emergency text-xs px-2 py-1 rounded-lg border border-red-100">EMERGENCY</span>}
                </h2>
                <p className="text-sm text-gray-500 font-mono mt-1">Ref: {selectedAppt.booking_ref}</p>
              </div>
              <button onClick={closeModal} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors border border-gray-200">
                <X size={20} />
              </button>
            </div>

            {/* Action Request Banner */}
            {selectedAppt && selectedAppt.modification_request_status === 'pending' && (
              <div className="px-6 pt-6">
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div>
                      <h3 className="text-orange-800 font-bold text-lg flex items-center gap-2">
                        <AlertTriangle size={20} />
                        {selectedAppt.modification_request_type === 'cancel' ? "Cancellation Request" : "Reschedule Request"}
                      </h3>
                      <p className="text-orange-700 text-sm mt-1">
                        {selectedAppt.modification_request_type === 'cancel' 
                          ? `The customer has requested to cancel this appointment. Reason: ${selectedAppt.modification_reason || 'N/A'}`
                          : `The customer requested to move this to ${selectedAppt.requested_reschedule_date} at ${selectedAppt.requested_reschedule_time}. Reason: ${selectedAppt.modification_reason || 'N/A'}`
                        }
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button 
                        onClick={() => handleModificationAction(selectedAppt.id, 'deny')}
                        disabled={updating}
                        className="px-4 py-2 bg-white text-orange-600 hover:bg-orange-100 border border-orange-200 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
                      >
                        Deny Request
                      </button>
                      <button 
                        onClick={() => handleModificationAction(selectedAppt.id, 'approve')}
                        disabled={updating}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm disabled:opacity-50"
                      >
                        {selectedAppt.modification_request_type === 'cancel' ? "Approve Cancel" : "Approve & Update"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Col */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                    <button 
                      onClick={() => setIsClientExpanded(!isClientExpanded)}
                      className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100/50 transition-colors"
                    >
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <Users size={14} /> Client Information
                      </h3>
                      {isClientExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </button>
                    {isClientExpanded && (
                      <div className="px-5 pb-5 space-y-3 animate-fade-in">
                        <div>
                          <p className="text-xs text-gray-500">Name</p>
                          <p className="font-bold text-dark">{selectedAppt.client_name}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5 flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</p>
                            <p className="font-bold text-dark">{selectedAppt.client_phone}</p>
                          </div>
                          <a href={`https://wa.me/${(selectedAppt.client_whatsapp || selectedAppt.client_phone)?.replace(/\D/g, '') || ""}`} target="_blank" rel="noopener noreferrer" className="bg-[#25D366]/10 text-[#25D366] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-[#25D366]/20 transition-colors">
                            <WhatsappIcon className="w-4 h-4" /> WhatsApp
                          </a>
                        </div>
                        {selectedAppt.client_email && (
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="font-bold text-dark">{selectedAppt.client_email}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                    <button 
                      onClick={() => setIsPetExpanded(!isPetExpanded)}
                      className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {petImage ? (
                          <img 
                            src={petImage} 
                            alt="Pet Avatar" 
                            onClick={(e) => { e.stopPropagation(); setIsImageExpanded(true); }}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer hover:opacity-80 transition-opacity" 
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg shadow-sm border border-primary/20">🐾</div>
                        )}
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pet Details</h3>
                      </div>
                      {isPetExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </button>
                    {isPetExpanded && (
                      <div className="px-5 pb-5 grid grid-cols-2 gap-4 animate-fade-in">
                        <div>
                          <p className="text-xs text-gray-500">Name</p>
                          <p className="font-bold text-dark">{selectedAppt.pet_name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Type</p>
                          <p className="font-bold text-dark">{selectedAppt.pet_type}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Breed</p>
                          <p className="font-bold text-dark">{selectedAppt.pet_breed || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Age</p>
                          <p className="font-bold text-dark">
                            {exactPetAge ? (
                              <span className="flex items-center gap-1.5">
                                {exactPetAge} <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase font-black tracking-wider border border-primary/20">Exact</span>
                              </span>
                            ) : (
                              selectedAppt.pet_age || "—"
                            )}
                          </p>
                        </div>
                        {petId && (
                          <div className="col-span-2 pt-2 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-gray-500">Last Vaccinated</p>
                                <p className="font-bold text-dark">
                                  {lastVaccinationDate ? format(parseISO(lastVaccinationDate), 'MMM d, yyyy') : "Unknown"}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                    <button 
                      onClick={() => setIsServiceExpanded(!isServiceExpanded)}
                      className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100/50 transition-colors"
                    >
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <FileText size={14} /> Service & Notes
                      </h3>
                      {isServiceExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </button>
                    {isServiceExpanded && (
                      <div className="px-5 pb-5 space-y-4 animate-fade-in">
                        <div>
                          <p className="text-xs text-gray-500">Service Required</p>
                          <p className="font-bold text-primary">{selectedAppt.service_type}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Client Notes</p>
                          <p className="text-sm text-dark mt-1 bg-white p-3 rounded-xl border border-gray-100">{selectedAppt.notes || "No notes provided."}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Col */}
                <div className="space-y-6">
                  <div className="bg-primary-light/20 p-5 rounded-2xl border border-primary-light">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2"><MapPin size={14} /> Schedule & Location</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-white p-3 rounded-xl border border-primary-light/50">
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="font-bold text-dark">{selectedAppt.preferred_date}</p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-primary-light/50">
                        <p className="text-xs text-gray-500">Time</p>
                        <p className="font-bold text-dark">{selectedAppt.preferred_time?.substring(0, 5) || "N/A"}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-xs text-gray-500">Address ({selectedAppt.city})</p>
                      <p className="font-bold text-dark text-sm">{selectedAppt.address}</p>
                    </div>

                    {/* Map Section */}
                    <div className="bg-gray-100 rounded-xl h-48 w-full relative overflow-hidden border border-gray-200 flex items-center justify-center">
                      {selectedAppt.pin_lat && selectedAppt.pin_lng ? (
                        <>
                          <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedAppt.pin_lng - 0.005}%2C${selectedAppt.pin_lat - 0.005}%2C${selectedAppt.pin_lng + 0.005}%2C${selectedAppt.pin_lat + 0.005}&layer=mapnik&marker=${selectedAppt.pin_lat}%2C${selectedAppt.pin_lng}`}
                          ></iframe>
                          <div className="absolute bottom-2 right-2 z-10">
                            <a
                              href={`https://maps.google.com/?q=${selectedAppt.pin_lat},${selectedAppt.pin_lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-white/90 backdrop-blur text-primary text-xs font-bold px-3 py-2 rounded-lg shadow-sm border border-gray-200 hover:bg-white transition-colors flex items-center gap-1.5"
                            >
                              <MapPin size={14} />
                              Open in Maps
                            </a>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center text-gray-400 p-4 text-center">
                          <MapPin size={32} className="mb-2" />
                          <p className="text-sm font-medium">No exact pin provided.</p>
                          
                          <div className="flex items-center justify-between w-full mt-4">
                            <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex-1">
                              <MapPin size={14} className="shrink-0 mt-0.5 text-gray-400" />
                              <span className="line-clamp-2">{selectedAppt.address}, {selectedAppt.city}</span>
                            </div>
                            {(selectedAppt.admin_notes?.includes('[CANCEL REQUEST]') || selectedAppt.admin_notes?.includes('[RESCHEDULE REQUEST]')) && (
                              <div className="ml-3 shrink-0 flex items-center justify-center bg-orange-100 text-orange-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider animate-pulse">
                                Action Req
                              </div>
                            )}
                          </div>

                          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedAppt.address + ', ' + selectedAppt.city)}`} target="_blank" rel="noopener noreferrer" className="text-primary text-xs font-bold mt-2 hover:underline">
                            Open in Google Maps
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Admin Controls */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-xs font-bold text-dark uppercase tracking-wider mb-4 flex items-center gap-2">Admin Controls</h3>

                    <div className="mb-4">
                      <label className="block text-xs font-bold text-gray-500 mb-1">Status</label>
                      <select
                        value={selectedAppt.status}
                        onChange={(e) => updateStatus(selectedAppt.id, e.target.value)}
                        disabled={updating}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Reschedule Date</label>
                        <input
                          type="date"
                          value={selectedAppt.preferred_date}
                          onChange={(e) => setSelectedAppt({ ...selectedAppt, preferred_date: e.target.value })}
                          disabled={updating}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Reschedule Time</label>
                        <input
                          type="time"
                          value={selectedAppt.preferred_time}
                          onChange={(e) => setSelectedAppt({ ...selectedAppt, preferred_time: e.target.value })}
                          disabled={updating}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end mb-4 -mt-2">
                      <button 
                        onClick={() => updateDateTime(selectedAppt.id, selectedAppt.preferred_date, selectedAppt.preferred_time)} 
                        disabled={updating} 
                        className="text-xs bg-primary hover:bg-primary-mid text-white px-3 py-1.5 rounded-lg font-bold disabled:opacity-50 transition-colors"
                      >
                        Save & Notify Reschedule
                      </button>
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs font-bold text-gray-500 mb-1">Admin Notes (Private)</label>
                      <textarea
                        rows={3}
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Add internal notes here..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                      <div className="flex justify-end mt-2">
                        <button onClick={saveNotes} disabled={updating || adminNotes === selectedAppt.admin_notes} className="text-xs bg-dark hover:bg-black text-white px-3 py-1.5 rounded-lg font-bold disabled:opacity-50 transition-colors">
                          Save Notes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3 bg-gray-50/50 rounded-b-3xl shrink-0">
              {selectedAppt.status !== 'completed' && (
                <button
                  onClick={() => {
                    if (selectedAppt.pet_id) {
                      setIsPassportModalOpen(true);
                    } else {
                      updateStatus(selectedAppt.id, 'completed');
                    }
                  }}
                  disabled={updating}
                  className="bg-white border-2 border-primary text-primary hover:bg-primary-light px-6 py-2.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} /> Mark Completed
                </button>
              )}
              {selectedAppt.status !== 'confirmed' && selectedAppt.status !== 'completed' && (
                <button
                  onClick={() => updateStatus(selectedAppt.id, 'confirmed')}
                  disabled={updating}
                  className="bg-primary hover:bg-primary-mid text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  Confirm Appointment
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Passport Completion Modal */}
      {isPassportModalOpen && selectedAppt && selectedAppt.pet_id && (
        <PassportCompletionModal
          appointmentId={selectedAppt.id}
          petId={selectedAppt.pet_id}
          defaultServiceType={passportModalServiceOverride || selectedAppt.service_type}
          onClose={() => {
            setIsPassportModalOpen(false);
            setPassportModalServiceOverride(null);
          }}
          onSuccess={() => {
            setIsPassportModalOpen(false);
            setPassportModalServiceOverride(null);
            // Refresh logic handled by mutate() via a re-fetch or optimistically
            mutate();
            router.refresh();
            // Also update local selectedAppt so the UI reflects "completed"
            setSelectedAppt({ ...selectedAppt, status: 'completed' });
          }}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Appointment"
        message="Are you sure you want to permanently delete this appointment? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
        isLoading={updating}
      />

      {/* Expanded Image Modal */}
      {isImageExpanded && petImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setIsImageExpanded(false)}
        >
          <button 
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); setIsImageExpanded(false); }}
          >
            <X size={32} />
          </button>
          <img 
            src={petImage} 
            alt="Expanded Pet Avatar" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
