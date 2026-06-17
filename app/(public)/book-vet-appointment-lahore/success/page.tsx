"use client";

import Link from "next/link";
import { CheckCircle2, ArrowLeft, Download, MapPin, Clock, Calendar as CalendarIcon, AlertCircle, Dog } from "lucide-react";
import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import html2canvas from "html2canvas";
import { BRAND } from "@/lib/constants";
import WhatsappIcon from "@/components/ui/WhatsappIcon";

function SuccessContent() {
  const searchParams = useSearchParams();
  const bookingRef = searchParams.get("ref") || "VOD-XXXX-XXXX";
  const phone = searchParams.get("phone") || "";
  const date = searchParams.get("date") || "";
  const time = searchParams.get("time") || "";

  const [bookingData, setBookingData] = useState<any>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem("bookingData");
    if (data) {
      try {
        setBookingData(JSON.parse(data));
      } catch (e) {}
    }
  }, []);



  function formatTime(time24: string) {
    const [h] = time24.split(":");
    let hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:00 ${ampm}`;
  }

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const element = cardRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        backgroundColor: "transparent", // Use wrapper's background
        logging: false,
        useCORS: true,
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `VetsOnDoor-Ticket-${bookingRef}.png`;
      link.click();
    } catch (err) {
      console.error("Failed to download image", err);
      alert("Failed to download the booking summary.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center relative overflow-hidden">
        {/* Success Animation Container */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center relative">
            <div className="absolute inset-0 border-4 border-success rounded-full animate-ping opacity-20"></div>
            <CheckCircle2 size={48} className="text-success" />
          </div>
        </div>

        <h2 className="font-display text-3xl font-bold text-dark mb-2">Appointment Booked!</h2>
        <p className="text-gray-500 mb-6 font-sans">Thank you for choosing Vets On Door.</p>

        {/* The Downloadable Card */}
        {/* Wrap in a padded div for a cleaner screenshot that doesn't clip boundaries */}
        <div ref={cardRef} className="bg-white p-2 mb-4 rounded-3xl">
          <div className="bg-dark rounded-3xl p-6 text-white shadow-xl relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 opacity-5 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
                <Dog size={250} />
              </div>
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <h3 className="font-display text-2xl font-bold">Booking Summary</h3>
          </div>

          <div className="bg-primary-light/10 border border-primary-light/20 rounded-xl p-3 mb-5 relative z-10 flex flex-col items-center justify-center">
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Ticket ID</p>
            <p className="font-mono text-xl font-bold text-primary-light tracking-widest">{bookingRef}</p>
          </div>

          <div className="space-y-4 relative z-10 font-sans">
            <div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Pet & Owner</p>
              <p className="font-bold text-base">
                {bookingData?.pet_name ? `${bookingData.pet_name} (${bookingData.pet_type})` : "—"}
              </p>
              <p className="text-xs text-gray-300 mt-0.5">
                {bookingData?.client_name ? `${bookingData.client_name} · ${phone}` : phone}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Service</p>
              <p className="font-bold text-primary-light text-sm">
                {bookingData?.service_type || "—"}
              </p>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><CalendarIcon size={12} /> Date</p>
                <p className="font-bold text-sm">
                  {date ? new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : "—"}
                </p>
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Clock size={12} /> Time</p>
                <p className="font-bold text-sm">
                  {time ? formatTime(time) : "—"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><MapPin size={12} /> Location</p>
              <p className="font-bold text-sm text-gray-200 break-words">
                {bookingData?.address ? `${bookingData.address}, ${bookingData.city}` : "—"}
              </p>
            </div>
            
            {bookingData?.is_emergency && (
              <div className="bg-emergency/20 border border-emergency/50 p-2 rounded-lg mt-3 flex items-center justify-center gap-2">
                <AlertCircle size={14} className="text-emergency shrink-0" />
                <p className="text-[10px] font-bold text-emergency uppercase tracking-wider">Emergency Case</p>
              </div>
            )}
          </div>
        </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full bg-dark hover:bg-gray-800 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 mb-6 disabled:opacity-50"
        >
          {isDownloading ? <span className="animate-pulse">Generating...</span> : <><Download size={20} /> Download Ticket</>}
        </button>

        <p className="text-gray-600 mb-6 font-sans bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm">
          You'll receive a WhatsApp confirmation at <strong className="text-dark">{phone}</strong> shortly.
        </p>

        <div className="flex flex-col gap-3">
          <a
            href={BRAND.whatsapp_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <WhatsappIcon className="w-5 h-5" />
            <span>WhatsApp Us</span>
          </a>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <Link 
            href="/"
            className="text-primary hover:text-primary-mid font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
