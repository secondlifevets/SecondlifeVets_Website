import { Service, NavItem } from "./types";

export const BRAND = {
  name: "Vets On Door",
  tagline: "Premium Home Vet Care, Delivered",
  description:
    "Pakistan's leading mobile veterinary service. Expert vets at your doorstep — caring for your beloved pets with compassion and cutting-edge medical expertise.",
  email: "contact@vetsondoor.com",
  phone: "+923078517122",
  whatsapp: "923078517122",
  whatsapp_url: "https://wa.me/923078517122",
  instagram: "https://www.instagram.com/vetsondoor",
  tiktok: "https://www.tiktok.com/@vetsondoor",
  linkedin: "https://www.linkedin.com/company/vetsondoors/",
  emergency_line: "+923078517122",
  founded_year: 2023,
  city: "Pakistan",
};

export const SERVICES: Service[] = [
  {
    id: "general-checkup",
    name: "General Checkup",
    description:
      "Comprehensive health assessment for your pet including physical examination, vitals check, and health advice from our expert vets.",
    duration_minutes: 45,
    icon: "🩺",
    price_range: "PKR 1,500 – 2,500",
  },
  {
    id: "vaccination",
    name: "Vaccination",
    description:
      "Core and non-core vaccines administered safely at home. We maintain proper cold-chain protocols for all vaccines.",
    duration_minutes: 30,
    icon: "💉",
    price_range: "PKR 2,000 – 5,000",
  },
  {
    id: "deworming",
    name: "Deworming",
    description:
      "Complete internal and external parasite treatment. Keeps your pet healthy and your family safe.",
    duration_minutes: 20,
    icon: "🐛",
    price_range: "PKR 600 – 1,200",
  },
  {
    id: "surgical-consultation",
    name: "Surgical Consultation",
    description:
      "Pre-operative assessments, post-surgical wound care, and follow-up consultations by qualified veterinary surgeons.",
    duration_minutes: 60,
    icon: "🔬",
    price_range: "PKR 2,000 – 5,000",
  },
  {
    id: "dental-cleaning",
    name: "Dental Cleaning",
    description:
      "Professional dental scaling and polishing to prevent periodontal disease and maintain your pet's oral hygiene.",
    duration_minutes: 60,
    icon: "🦷",
    price_range: "PKR 3,000 – 6,000",
  },
  {
    id: "emergency-care",
    name: "Emergency Care",
    description:
      "24/7 emergency home visits for critical cases. Our rapid response team reaches you within the shortest time possible.",
    duration_minutes: 90,
    icon: "🚨",
    price_range: "PKR 3,500 – 8,000",
    is_emergency: true,
  },
  {
    id: "pet-nutrition",
    name: "Pet Nutrition Consultation",
    description:
      "Personalized dietary plans and nutritional counseling to optimize your pet's health at every life stage.",
    duration_minutes: 40,
    icon: "🥗",
    price_range: "PKR 1,200 – 2,000",
  },
  {
    id: "diagnostic-lab",
    name: "Diagnostic & Lab Tests",
    description:
      "On-site blood panels, urinalysis, and sample collection with fast lab turnaround for accurate diagnosis.",
    duration_minutes: 50,
    icon: "🧪",
    price_range: "PKR 2,500 – 8,000",
  },
  {
    id: "tick-flea-treatments",
    name: "Tick & Flea Treatments",
    description:
      "Complete eradication and prevention of external parasites. Safe, fast-acting, and long-lasting protection.",
    duration_minutes: 30,
    icon: "🛡️",
    price_range: "PKR 1,000 – 2,500",
  },
];

export const PET_TYPES = [
  { value: "cat", label: "Cat 🐱" },
  { value: "dog", label: "Dog 🐶" },
  { value: "bird", label: "Bird 🦜" },
  { value: "rabbit", label: "Rabbit 🐰" },
  { value: "hamster", label: "Hamster 🐹" },
  { value: "fish", label: "Fish 🐠" },
  { value: "turtle", label: "Turtle 🐢" },
  { value: "other", label: "Other" },
];

export const PAKISTANI_CITIES = [
  "Lahore",
];

export const TIME_SLOTS = [
  { value: "09:00", label: "9:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "16:00", label: "4:00 PM" },
  { value: "17:00", label: "5:00 PM" },
  { value: "18:00", label: "6:00 PM" },
  { value: "19:00", label: "7:00 PM" },
  { value: "20:00", label: "8:00 PM" },
];

export const EMERGENCY_LINE = "+923078517122";
export const WHATSAPP_NUMBER = "923078517122";

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Our Team", href: "/veterinarian-lahore" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact-vet-lahore" },
];

export const STATUS_COLORS = {
  pending: {
    bg: "bg-warning/10",
    text: "text-warning",
    border: "border-warning/30",
    label: "Pending",
  },
  confirmed: {
    bg: "bg-primary-light",
    text: "text-primary",
    border: "border-primary/30",
    label: "Confirmed",
  },
  "in-progress": {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
    label: "In Progress",
  },
  completed: {
    bg: "bg-success/10",
    text: "text-success",
    border: "border-success/30",
    label: "Completed",
  },
  cancelled: {
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200",
    label: "Cancelled",
  },
};

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Ayesha Malik",
    city: "Lahore",
    pet: "Golden Retriever, Max",
    text: "Absolutely incredible service! The vet arrived on time, was so gentle with Max, and the whole experience was stress-free. No more traumatic car rides to the clinic!",
    rating: 5,
    avatar: "AM",
  },
  {
    id: 2,
    name: "Hassan Ahmed",
    city: "Lahore",
    pet: "Persian Cat, Luna",
    text: "Luna is extremely anxious at clinics. Vets On Door changed everything. The vet was calm, professional, and knew exactly how to handle her. Highly recommended!",
    rating: 5,
    avatar: "HA",
  },
  {
    id: 3,
    name: "Fatima Zahra",
    city: "Lahore",
    pet: "Rabbit, Biscuit",
    text: "Finding a good rabbit vet in Pakistan was a nightmare until I found Vets On Door. They actually know exotic pets! Biscuit's health has improved tremendously.",
    rating: 5,
    avatar: "FZ",
  },
  {
    id: 4,
    name: "Omar Farooq",
    city: "Lahore",
    pet: "Labrador, Bruno",
    text: "Used the emergency service at midnight — the vet was at our door in 45 minutes. Bruno is alive because of their rapid response. Forever grateful.",
    rating: 5,
    avatar: "OF",
  },
];

export const STATS = [
  { value: "2,500+", label: "Happy Pets Treated" },
  { value: "All over", label: "Lahore City Covered" },
  { value: "50+", label: "Expert Vets" },
  { value: "24/7", label: "Emergency Support" },
];
