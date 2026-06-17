import { Appointment } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import { STATUS_COLORS } from "@/lib/constants";
import { formatDate, formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface AppointmentModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (id: string, status: Appointment["status"]) => void;
}

export default function AppointmentModal({
  appointment,
  isOpen,
  onClose,
  onStatusChange,
}: AppointmentModalProps) {
  if (!appointment) return null;

  const statusStyle = STATUS_COLORS[appointment.status];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Appointment — ${appointment.booking_ref}`}
      size="lg"
    >
      <div className="p-6 space-y-6">
        {/* Status */}
        <div className="flex items-center gap-3">
          <span className={cn("badge", statusStyle.bg, statusStyle.text, statusStyle.border)}>
            {statusStyle.label}
          </span>
          {(appointment.emergency_level === "high" || appointment.emergency_level === "critical") && (
            <span className="badge bg-emergency/10 text-emergency border-emergency/30 animate-pulse">
              🚨 Emergency
            </span>
          )}
        </div>

        {/* Pet & Client */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary-light rounded-xl p-4">
            <p className="text-xs text-dark/50 uppercase tracking-wider mb-2">Pet</p>
            <p className="font-bold text-dark text-lg">{appointment.pet_name}</p>
            <p className="text-dark/60 text-sm capitalize">{appointment.pet_type}</p>
            {appointment.pet_breed && <p className="text-dark/50 text-xs">{appointment.pet_breed}</p>}
          </div>
          <div className="bg-primary-light rounded-xl p-4">
            <p className="text-xs text-dark/50 uppercase tracking-wider mb-2">Client</p>
            <p className="font-bold text-dark text-lg">{appointment.client_name}</p>
            <p className="text-dark/60 text-sm">{appointment.client_phone}</p>
          </div>
        </div>

        {/* Schedule */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-dark/40 uppercase tracking-wider mb-1">Date</p>
            <p className="font-semibold text-dark">{formatDate(appointment.preferred_date)}</p>
          </div>
          <div>
            <p className="text-xs text-dark/40 uppercase tracking-wider mb-1">Time</p>
            <p className="font-semibold text-dark">{formatTime(appointment.preferred_time)}</p>
          </div>
        </div>

        {/* Address */}
        <div>
          <p className="text-xs text-dark/40 uppercase tracking-wider mb-1">Address</p>
          <p className="text-dark">{appointment.address}, {appointment.city}</p>
        </div>

        {/* Service */}
        <div>
          <p className="text-xs text-dark/40 uppercase tracking-wider mb-1">Service</p>
          <p className="font-semibold text-dark">{appointment.service_type}</p>
        </div>

        {/* Notes */}
        {appointment.notes && (
          <div>
            <p className="text-xs text-dark/40 uppercase tracking-wider mb-1">Notes</p>
            <p className="text-dark/70 text-sm bg-gray-50 rounded-xl p-3">{appointment.notes}</p>
          </div>
        )}

        {/* Actions */}
        {onStatusChange && (
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            {appointment.status === "pending" && (
              <button
                onClick={() => onStatusChange(appointment.id, "confirmed")}
                id="appointment-modal-confirm"
                className="btn-primary text-sm flex-1"
              >
                ✓ Confirm
              </button>
            )}
            {appointment.status === "confirmed" && (
              <button
                onClick={() => onStatusChange(appointment.id, "in-progress")}
                id="appointment-modal-start"
                className="btn-primary text-sm flex-1"
              >
                ▶ Start Visit
              </button>
            )}
            {appointment.status === "in-progress" && (
              <button
                onClick={() => onStatusChange(appointment.id, "completed")}
                id="appointment-modal-complete"
                className="btn-primary text-sm flex-1"
              >
                ✅ Mark Complete
              </button>
            )}
            <button
              onClick={() => onStatusChange(appointment.id, "cancelled")}
              id="appointment-modal-cancel"
              className="text-sm text-emergency border border-emergency/30 px-4 rounded-xl hover:bg-emergency/5 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
