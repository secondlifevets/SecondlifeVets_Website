import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AppointmentStatus, EmergencyLevel } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateBookingRef(): string {
  const prefix = "VOD";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-PK", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

export function formatPhoneNumber(phone: string): string {
  // Format Pakistani phone numbers
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("92")) {
    const local = cleaned.substring(2);
    return `+92 ${local.substring(0, 3)} ${local.substring(3, 7)} ${local.substring(7)}`;
  }
  return phone;
}

export function getStatusBadgeClass(status: AppointmentStatus): string {
  const classes: Record<AppointmentStatus, string> = {
    pending: "bg-warning/10 text-warning border-warning/30",
    confirmed: "bg-primary-light text-primary border-primary/30",
    "in-progress": "bg-blue-50 text-blue-600 border-blue-200",
    completed: "bg-success/10 text-success border-success/30",
    cancelled: "bg-red-50 text-red-600 border-red-200",
  };
  return classes[status];
}

export function getEmergencyBadgeClass(level: EmergencyLevel): string {
  const classes: Record<EmergencyLevel, string> = {
    none: "hidden",
    low: "bg-yellow-50 text-yellow-600 border-yellow-200",
    medium: "bg-orange-50 text-orange-600 border-orange-200",
    high: "bg-emergency/10 text-emergency border-emergency/30",
    critical: "bg-emergency text-white border-emergency animate-pulse",
  };
  return classes[level];
}

export function getWhatsAppUrl(phone: string, message?: string): string {
  const encoded = message ? encodeURIComponent(message) : "";
  return `https://wa.me/${phone}${encoded ? `?text=${encoded}` : ""}`;
}

export function getBookingWhatsAppMessage(petName: string, service: string): string {
  return `Hi! I'd like to book a *${service}* for my pet *${petName}* through Vets On Door. Please confirm availability.`;
}

export function isToday(dateStr: string): boolean {
  const today = new Date();
  const date = new Date(dateStr);
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function isTomorrow(dateStr: string): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const date = new Date(dateStr);
  return (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  );
}

export function getMinBookingDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const offset = tomorrow.getTimezoneOffset() * 60000;
  return new Date(tomorrow.getTime() - offset).toISOString().split("T")[0];
}

export function getMaxBookingDate(): string {
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const offset = maxDate.getTimezoneOffset() * 60000;
  return new Date(maxDate.getTime() - offset).toISOString().split("T")[0];
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "…";
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const convertTo24h = (time12: string) => {
  const match = time12.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return "09:00";
  let [_, h, m, ampm] = match;
  let hours = parseInt(h, 10);
  if (ampm.toUpperCase() === "PM" && hours < 12) hours += 12;
  if (ampm.toUpperCase() === "AM" && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, '0')}:${m}`;
};

export const parseWorkingHours = (str: string) => {
  try {
    const parts = str.split(': ');
    if (parts.length >= 2) {
      const days = parts[0];
      const timesStr = parts.slice(1).join(': ');
      const times = timesStr.split(/\s*[-–]\s*/);
      if (times.length === 2) {
        return { days, start: convertTo24h(times[0].trim()), end: convertTo24h(times[1].trim()) };
      }
    }
  } catch(e) {}
  return { days: "Monday – Saturday", start: "09:00", end: "20:00" };
};

export const parseDaysToArray = (daysStr: string) => {
  if (!daysStr) return [];
  if (daysStr === "Everyday") return [...ALL_DAYS];
  if (daysStr === "Weekdays") return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  if (daysStr === "Weekends") return ["Saturday", "Sunday"];
  
  if (daysStr.includes('–') || daysStr.includes('-')) {
    const parts = daysStr.split(/[-–]/).map(s => s.trim());
    if (parts.length === 2) {
      const startIndex = ALL_DAYS.indexOf(parts[0]);
      const endIndex = ALL_DAYS.indexOf(parts[1]);
      if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
        return ALL_DAYS.slice(startIndex, endIndex + 1);
      }
    }
  }
  
  const selected = ALL_DAYS.filter(d => daysStr.includes(d));
  return selected.length > 0 ? selected : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
};
