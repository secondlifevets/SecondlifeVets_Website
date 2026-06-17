"use client";

import Link from "next/link";
import { MessageCircle, ShieldAlert } from "lucide-react";
import WhatsappIcon from "@/components/ui/WhatsappIcon";
import { BRAND } from "@/lib/constants";
import { useEffect, useState } from "react";
import clsx from "clsx";

export default function FloatingActions() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay before showing them to allow initial page load
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={clsx(
        "fixed bottom-24 lg:bottom-6 right-4 lg:right-6 z-50 flex flex-col gap-4 transition-all duration-500 transform",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      )}
    >
      {/* SOS Button */}
      <a
        href={`tel:${BRAND.phone}`}
        className="group relative hidden lg:flex items-center justify-center w-14 h-14 bg-emergency text-white rounded-full shadow-lg shadow-emergency/40 hover:-translate-y-1 transition-all duration-300"
        aria-label="Emergency SOS"
      >
        <div className="absolute inset-0 rounded-full border-2 border-emergency opacity-0 group-hover:animate-ping pointer-events-none"></div>
        <div className="flex flex-col items-center justify-center">
          <ShieldAlert size={20} className="mb-0.5 pointer-events-none" />
          <span className="text-[10px] font-bold leading-none uppercase pointer-events-none">SOS</span>
        </div>
        
        {/* Tooltip */}
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-dark text-white text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Emergency Call
        </div>
      </a>

      {/* WhatsApp Button */}
      <a
        href={BRAND.whatsapp_url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg shadow-[#25D366]/40 hover:-translate-y-1 transition-all duration-300"
        aria-label="WhatsApp Us"
      >
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-40 pointer-events-none"></span>
        <WhatsappIcon className="w-7 h-7 pointer-events-none" />
        
        {/* Tooltip */}
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-dark text-white text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          WhatsApp Us
        </div>
      </a>
    </div>
  );
}
