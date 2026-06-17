import Link from "next/link";
import { PawPrint, Phone, CalendarHeart } from "lucide-react";
import { BRAND } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | Vets On Door",
  description: "The page you are looking for could not be found.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-24 h-24 bg-primary-light/50 rounded-full flex items-center justify-center mb-8">
        <PawPrint size={48} className="text-primary" />
      </div>
      
      <h1 className="font-display text-5xl md:text-7xl font-bold text-dark mb-4">404</h1>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-dark mb-4">Page Not Found</h2>
      
      <p className="text-gray-500 max-w-md mx-auto mb-10 text-lg">
        Oops! It looks like you've wandered off the trail. The page you are looking for doesn't exist or has been moved.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
        <Link 
          href="/book-vet-appointment-lahore" 
          className="bg-primary hover:bg-primary-mid text-white px-6 py-4 rounded-xl font-bold transition-all shadow-md flex justify-center items-center gap-2 w-full"
        >
          <CalendarHeart size={20} /> Book Appointment
        </Link>
        <Link 
          href="/" 
          className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-dark px-6 py-4 rounded-xl font-bold transition-all flex justify-center items-center gap-2 w-full"
        >
          Return Home
        </Link>
      </div>
      
      <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col items-center">
        <p className="text-gray-500 text-sm mb-3">Need immediate help?</p>
        <a 
          href={BRAND.whatsapp_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#25D366] font-bold flex items-center gap-2 hover:underline"
        >
          <Phone size={16} /> Contact Support
        </a>
      </div>
    </div>
  );
}
