import { createAdminClient } from "@/lib/supabase/server";
import { 
  Users, CalendarCheck, Clock, AlertTriangle, 
  MapPin 
} from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import RefreshButton from "@/components/admin/RefreshButton";
import RoutePlannerClient from "@/components/admin/RoutePlannerClient";

// Opt out of static rendering so data is fresh on every request
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function AdminDashboard() {
  const supabase = await createAdminClient();
  const today = new Date();
  
  // Helper to format date as YYYY-MM-DD in local time
  const formatYYYYMMDD = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = formatYYYYMMDD(today);
  const firstDayOfMonth = formatYYYYMMDD(new Date(today.getFullYear(), today.getMonth(), 1));
  
  const monday = new Date(today);
  const day = monday.getDay();
  const diff = monday.getDate() - day + (day === 0 ? -6 : 1);
  monday.setDate(diff);
  const firstDayOfWeek = formatYYYYMMDD(monday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const endDayOfWeek = formatYYYYMMDD(sunday);

  // Fetch all data in parallel on the server
  const [
    { count: todayApptsCount },
    { count: pendingCount },
    { count: thisWeekCount },
    { count: emergencyPendingCount },
    { data: todayAppointments },
    { data: recentBookings }
  ] = await Promise.all([
    supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('preferred_date', todayStr),
    supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('appointments').select('*', { count: 'exact', head: true }).gte('preferred_date', firstDayOfWeek).lte('preferred_date', endDayOfWeek),
    supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('is_emergency', true).eq('status', 'pending'),
    supabase.from('appointments').select('*').eq('preferred_date', todayStr),
    supabase.from('appointments').select('*').order('created_at', { ascending: false }).limit(10)
  ]);

  const stats = {
    today_appointments: todayApptsCount || 0,
    pending_count: pendingCount || 0,
    this_week: thisWeekCount || 0,
    emergency_pending: emergencyPendingCount || 0
  };

  const todayAppts = todayAppointments || [];
  const recentBookingsData = recentBookings || [];

  return (
    <div className="p-4 sm:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-dark">Dashboard Overview</h1>
          <p className="text-gray-500 font-sans">Welcome back, Dr. Ahmad.</p>
        </div>
        <RefreshButton />
      </div>

      {/* Emergency Alert Banner */}
      {stats.emergency_pending > 0 && (
        <div className="bg-emergency/10 border-l-4 border-emergency p-4 rounded-r-xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-emergency font-bold">
            <AlertTriangle size={24} className="shrink-0" />
            ⚠️ {stats.emergency_pending} Emergency appointment(s) awaiting response
          </div>
          <Link href="/admin/appointments?emergency=true" className="bg-emergency text-white px-6 py-2 rounded-lg text-sm font-bold shadow-sm whitespace-nowrap text-center">
            View Now
          </Link>
        </div>
      )}

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-bold text-sm uppercase">Today's Visits</h3>
            <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center">
              <CalendarCheck size={20} className="text-primary" />
            </div>
          </div>
          <p className="text-4xl font-display font-bold text-dark">{stats.today_appointments}</p>
        </div>

        <div className={clsx("p-6 rounded-2xl shadow-sm border flex flex-col", stats.pending_count > 0 ? "bg-amber-50 border-amber-200" : "bg-white border-gray-100")}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={clsx("font-bold text-sm uppercase", stats.pending_count > 0 ? "text-amber-700" : "text-gray-500")}>Pending Conf.</h3>
            <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center", stats.pending_count > 0 ? "bg-amber-100" : "bg-gray-100")}>
              <Clock size={20} className={stats.pending_count > 0 ? "text-amber-600" : "text-gray-500"} />
            </div>
          </div>
          <p className={clsx("text-4xl font-display font-bold", stats.pending_count > 0 ? "text-amber-600" : "text-dark")}>{stats.pending_count}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-bold text-sm uppercase">This Week</h3>
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <Users size={20} className="text-gray-500" />
            </div>
          </div>
          <p className="text-4xl font-display font-bold text-dark">{stats.this_week}</p>
        </div>

        <div className={clsx("p-6 rounded-2xl shadow-sm border flex flex-col", stats.emergency_pending > 0 ? "bg-red-50 border-red-200" : "bg-white border-gray-100")}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={clsx("font-bold text-sm uppercase", stats.emergency_pending > 0 ? "text-emergency" : "text-gray-500")}>Emergencies</h3>
            <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center", stats.emergency_pending > 0 ? "bg-red-100" : "bg-gray-100")}>
              <AlertTriangle size={20} className={stats.emergency_pending > 0 ? "text-emergency" : "text-gray-500"} />
            </div>
          </div>
          <p className={clsx("text-4xl font-display font-bold", stats.emergency_pending > 0 ? "text-emergency" : "text-dark")}>{stats.emergency_pending}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Schedule */}
        <div className="lg:col-span-1 min-w-0">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-dark">Today's Schedule</h2>
              <Link href="/admin/calendar" className="text-primary text-sm font-medium hover:underline">View Calendar</Link>
            </div>
            
            <div className="space-y-4">
              {todayAppts.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No appointments today.</p>
              ) : (
                todayAppts.map((appt: any) => (
                  <div key={appt.id} className="relative flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                      <div className="w-0.5 h-full bg-gray-100 mt-1"></div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex-1 mb-4 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-primary text-sm">{appt.preferred_time?.substring(0, 5) || "N/A"}</span>
                        <span className={clsx(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                          appt.status === 'confirmed' ? "bg-success/10 text-success" : 
                          appt.status === 'pending' ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"
                        )}>
                          {appt.status}
                        </span>
                      </div>
                      <p className="font-bold text-dark text-sm truncate">{appt.client_name}</p>
                      <p className="text-xs text-gray-500 truncate mb-2">{appt.pet_name} ({appt.pet_type}) - {appt.service_type}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mb-3 truncate">
                        <MapPin size={12} /> {appt.address}, {appt.city}
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/admin/appointments?id=${appt.id}`} className="bg-gray-50 hover:bg-gray-100 text-dark px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-gray-200 w-full text-center">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {todayAppts.length > 0 && <RoutePlannerClient appointments={todayAppts} />}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="lg:col-span-2 min-w-0">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 overflow-hidden flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-dark">Recent Bookings</h2>
              <Link href="/admin/appointments" className="text-primary text-sm font-medium hover:underline">View All</Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase text-gray-500">
                    <th className="py-4 px-2 font-bold">Ref</th>
                    <th className="py-4 px-2 font-bold">Client & Pet</th>
                    <th className="py-4 px-2 font-bold">Service</th>
                    <th className="py-4 px-2 font-bold">Date & Time</th>
                    <th className="py-4 px-2 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookingsData.length === 0 ? (
                    <tr><td colSpan={5} className="py-4 text-center text-gray-500">No bookings found.</td></tr>
                  ) : (
                    recentBookingsData.map((booking: any) => (
                      <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-6 px-2 text-sm font-bold text-dark">{booking.booking_ref}</td>
                        <td className="py-6 px-2">
                          <p className="text-sm font-bold text-dark mb-1">{booking.client_name}</p>
                          {booking.client_email && (
                            <p className="text-xs text-gray-500 truncate mb-1" title={booking.client_email}>{booking.client_email}</p>
                          )}
                          <p className="text-xs font-medium text-gray-600 mt-1">{booking.pet_name} <span className="text-gray-400">({booking.pet_type})</span></p>
                        </td>
                        <td className="py-6 px-2">
                          <p className="text-sm font-medium text-gray-800">{booking.service_type}</p>
                          {booking.is_emergency && <span className="inline-block mt-2 px-2 py-0.5 bg-red-50 border border-red-100 text-emergency text-[10px] font-bold rounded-md">EMERGENCY</span>}
                        </td>
                        <td className="py-6 px-2 text-sm text-gray-600">
                          <p className="font-medium text-dark mb-1">{booking.preferred_date}</p>
                          <span className="text-gray-500 text-xs font-medium bg-gray-100 px-2 py-1 rounded-md">{booking.preferred_time?.substring(0, 5) || "N/A"}</span>
                          <div className="mt-2 text-[10px] text-gray-400 font-medium">
                            Booked: {new Date(booking.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="py-6 px-2">
                          <span className={clsx(
                            "px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm",
                            booking.status === 'confirmed' ? "bg-success/10 text-success border border-success/20" : 
                            booking.status === 'pending' ? "bg-amber-100 text-amber-700 border border-amber-200" : 
                            booking.status === 'completed' ? "bg-primary-light text-primary border border-primary/20" : 
                            "bg-gray-100 text-gray-600 border border-gray-200"
                          )}>
                            {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Unknown'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

