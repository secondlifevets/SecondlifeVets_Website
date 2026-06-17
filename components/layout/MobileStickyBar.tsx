"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone, CalendarHeart } from "lucide-react";
import { BRAND } from "@/lib/constants";
import clsx from "clsx";
import { usePathname } from "next/navigation";

export default function MobileStickyBar() {
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Hide when hero CTA is visible (if we have an element with id 'hero-cta')
    const heroCta = document.getElementById("hero-cta");
    if (!heroCta) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // If hero CTA is visible, hide the sticky bar
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(heroCta);

    return () => observer.disconnect();
  }, [pathname]);

  // Hide on admin routes
  if (pathname?.startsWith('/admin')) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-40 lg:hidden pointer-events-none">
      <div 
        className={clsx(
          "w-full bg-white border-t border-gray-200 shadow-[0_-8px_30px_rgba(0,0,0,0.05)] p-3 flex gap-3 transition-transform duration-300 pointer-events-auto",
          isVisible ? "translate-y-0" : "translate-y-full"
        )}
      >
        <a 
          href={`tel:${BRAND.phone}`} 
          aria-label="Emergency contact"
          className="flex-1 bg-emergency text-white flex flex-col items-center justify-center py-2.5 rounded-xl font-bold text-xs relative overflow-hidden"
        >
          <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full animate-ping opacity-75"></div>
          <Phone size={18} className="mb-0.5" />
          Emergency
        </a>
        <Link 
          href="/book-vet-appointment-lahore" 
          className="flex-[2] bg-primary text-white flex flex-col items-center justify-center py-2.5 rounded-xl font-bold text-sm shadow-md"
        >
          <span className="flex items-center gap-1.5">
            <CalendarHeart size={18} /> Book Visit
          </span>
        </Link>
      </div>
    </div>
  );
}
