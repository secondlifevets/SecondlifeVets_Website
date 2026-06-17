"use client";

import Link from "next/link";
import { Appointment } from "@/lib/types";
import { getStatusBadgeClass, formatDate, formatTime } from "@/lib/utils";
import { STATUS_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface AppointmentTableProps {
  appointments: Appointment[];
  onStatusChange?: (id: string, status: Appointment["status"]) => void;
}

export default function AppointmentTable({
  appointments,
  onStatusChange,
}: AppointmentTableProps) {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-16 text-dark/40">
        <div className="text-5xl mb-4">📭</div>
        <p className="font-semibold text-dark/60">No appointments found</p>
        <p className="text-sm mt-1">Appointments will appear here when booked</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {["Ref #", "Client", "Pet", "Service", "Date & Time", "City", "Status", "Actions"].map(
              (col) => (
                <th
                  key={col}
                  className="text-left py-3 px-4 text-xs font-semibold text-dark/50 uppercase tracking-wider"
                >
                  {col}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {appointments.map((appt) => {
            const statusStyle = STATUS_COLORS[appt.status];
            return (
              <tr
                key={appt.id}
                className="hover:bg-primary-light/30 transition-colors group"
              >
                <td className="py-3 px-4">
                  <span className="font-mono text-xs font-bold text-primary">
                    {appt.booking_ref}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <p className="font-semibold text-dark">{appt.client_name}</p>
                    <p className="text-dark/50 text-xs">{appt.client_phone}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-dark">{appt.pet_name}</p>
                    <p className="text-dark/50 text-xs capitalize">
                      {appt.pet_type}
                      {appt.pet_breed && ` · ${appt.pet_breed}`}
                    </p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-dark/70">{appt.service_type}</span>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <p className="text-dark font-medium">{formatDate(appt.preferred_date).split(",").slice(0, 2).join(",")}</p>
                    <p className="text-dark/50 text-xs">{formatTime(appt.preferred_time)}</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-dark/60">{appt.city}</td>
                <td className="py-3 px-4">
                  <span
                    className={cn(
                      "badge",
                      statusStyle.bg,
                      statusStyle.text,
                      statusStyle.border
                    )}
                  >
                    {statusStyle.label}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/admin/appointments/${appt.id}`}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      View
                    </Link>
                    {onStatusChange && appt.status === "pending" && (
                      <button
                        onClick={() => onStatusChange(appt.id, "confirmed")}
                        className="text-xs text-success hover:underline font-medium"
                      >
                        Confirm
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
