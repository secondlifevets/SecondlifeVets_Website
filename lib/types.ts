export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "in-progress"
  | "completed"
  | "cancelled";

export type EmergencyLevel = "none" | "low" | "medium" | "high" | "critical";

export interface Appointment {
  id: string;
  booking_ref: string;
  client_name: string;
  client_phone: string;
  client_whatsapp: string;
  client_email?: string;
  pet_name: string;
  pet_type: string;
  pet_breed?: string;
  pet_age?: string;
  service_type: string;
  preferred_date: string;
  preferred_time: string;
  address: string;
  city: string;
  pin_lat?: number;
  pin_lng?: number;
  status: AppointmentStatus;
  notes?: string;
  emergency_level: EmergencyLevel;
  created_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  icon: string;
  price_range?: string;
  is_emergency?: boolean;
}

export interface TimeSlot {
  id: string;
  date: string;
  time: string;
  is_available: boolean;
  appointment_id?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "vet" | "receptionist";
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  specialization: string;
  bio: string;
  image?: string;
  experience_years: number;
  qualifications: string[];
}

export interface BookingFormData {
  client_name: string;
  client_phone: string;
  client_whatsapp: string;
  client_email?: string;
  pet_name: string;
  pet_type: string;
  pet_breed?: string;
  pet_age?: string;
  service_type: string;
  preferred_date: string;
  preferred_time: string;
  address: string;
  city: string;
  notes?: string;
  emergency_level: EmergencyLevel;
}

export interface DashboardStats {
  total_appointments: number;
  today_appointments: number;
  pending_appointments: number;
  completed_today: number;
  emergency_cases: number;
  total_clients: number;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

// --- Pet Passport Types ---

export interface PetProfile {
  id: string;
  customer_id: string;
  name: string;
  type: string;
  breed?: string;
  date_of_birth?: string;
  avatar_url?: string;
  image_url?: string;
  color?: string;
  gender?: string;
  microchip_no?: string;
  notes?: string;
  created_at: string;
}

export interface VaccinationRecord {
  id: string;
  pet_id: string;
  vaccine_type: "Rabies" | "Other";
  vaccination_date: string;
  valid_until?: string;
  manufacturer_and_name?: string;
  vaccine_name?: string;
  batch_no?: string;
  is_vod_verified?: boolean;
  veterinarian_name?: string;
  created_at: string;
}

export interface DewormingRecord {
  id: string;
  pet_id: string;
  date: string;
  veterinarian_name?: string;
  is_vod_verified?: boolean;
  created_at: string;
}

export interface TickFleaTreatment {
  id: string;
  pet_id: string;
  date: string;
  medicine?: string;
  veterinarian_name?: string;
  is_vod_verified?: boolean;
  created_at: string;
}

export interface HealthCheckup {
  id: string;
  pet_id: string;
  date: string;
  tpr?: string;
  body_weight?: string;
  general_body_condition?: string;
  prescription?: string;
  veterinarian_name?: string;
  is_vod_verified?: boolean;
  created_at: string;
}

export interface SurgeryRecord {
  id: string;
  pet_id: string;
  date: string;
  surgery_details?: string;
  veterinarian_name?: string;
  is_vod_verified?: boolean;
  created_at: string;
}

export interface PetPassportData {
  pet: PetProfile;
  owner: {
    full_name: string;
    email?: string;
    address?: string;
    city?: string;
    phone?: string;
    whatsapp?: string;
    emergency_name?: string;
    emergency_relation?: string;
    emergency_phone?: string;
  };
  vaccinations: VaccinationRecord[];
  deworming_records: DewormingRecord[];
  tick_flea_treatments: TickFleaTreatment[];
  health_checkups: HealthCheckup[];
  surgeries: SurgeryRecord[];
}
