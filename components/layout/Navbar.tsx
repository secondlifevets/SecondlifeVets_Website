"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { PawPrint, Menu, X, PhoneCall, Home, Stethoscope, Users, Info, Mail, ChevronRight, LogIn, LayoutDashboard } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const dismissed = localStorage.getItem('announcement_dismissed');
    if (dismissed !== 'true') {
      setIsAnnouncementVisible(true);
    }

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (event === 'SIGNED_IN') {
        const currentPath = window.location.pathname;
        if (currentPath === '/' || currentPath === '/login') {
          router.push('/dashboard');
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const dismissAnnouncement = () => {
    setIsAnnouncementVisible(false);
    localStorage.setItem('announcement_dismissed', 'true');
  };

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Services", href: "/services", icon: Stethoscope },
    { name: "Our Team", href: "/veterinarian-lahore", icon: Users },
    { name: "About Us", href: "/about", icon: Info },
    { name: "Contact", href: "/contact-vet-lahore", icon: PhoneCall },
  ];

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Announcement Bar */}
      {isAnnouncementVisible && (
        <div className="bg-primary text-white text-sm font-medium py-2 px-4 flex justify-center items-center relative z-50">
          <p className="text-center text-xs sm:text-sm">
            🐾 Pakistan's First Mobile Vet Service | Available 24/7 | WhatsApp:{" "}
            <a href={`tel:${BRAND.phone}`} className="font-bold underline hover:text-primary-light transition-colors">0307-8517122</a>
          </p>
          <button 
            onClick={dismissAnnouncement}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-primary-mid rounded-full transition-colors"
            aria-label="Dismiss announcement"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-primary-light/50 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo area */}
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group shrink-0 min-w-0">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
                <Image src="/logo.png" alt="Vets On Door Logo" fill className="object-contain" priority />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-display font-bold text-lg sm:text-2xl text-primary leading-tight truncate">
                  Vets On Door
                </span>
                <span className="hidden sm:block font-sans text-[10px] uppercase tracking-widest text-primary-mid font-semibold">
                  Your Mobile Vet Team
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={clsx(
                    "font-sans text-sm font-medium transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full",
                    pathname === link.href ? "text-primary after:w-full" : "text-dark/80"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-1.5 bg-primary-light/50 hover:bg-primary-light text-primary px-5 py-2 rounded-full font-bold transition-all duration-300 text-sm border border-primary-light/50 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
              ) : (
                <Link 
                  href="/login" 
                  className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-dark px-5 py-2 rounded-full font-bold transition-all duration-300 text-sm border border-gray-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <LogIn size={16} />
                  Log In
                </Link>
              )}
              <a
                href={`tel:${BRAND.phone}`}
                className="flex items-center gap-2 bg-emergency/10 hover:bg-emergency/20 text-emergency px-4 py-2.5 rounded-full font-semibold transition-all duration-300 border border-emergency/20 shadow-sm hover:shadow-md group"
              >
                <div className="relative flex h-3 w-3 pointer-events-none">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emergency opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emergency"></span>
                </div>
                <span>Emergency</span>
              </a>
              <Link
                href="/book-vet-appointment-lahore"
                className="bg-primary hover:bg-primary-mid text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
              >
                Book Appointment
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center gap-2">
              {user ? (
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-1 bg-primary-light/60 hover:bg-primary-light text-primary px-3 py-1.5 rounded-full font-bold transition-all text-xs border border-primary-light/40"
                >
                  <LayoutDashboard size={14} />
                  Dashboard
                </Link>
              ) : (
                <Link 
                  href="/login" 
                  className="flex items-center gap-1 bg-gray-50 hover:bg-gray-100 text-dark px-3 py-1.5 rounded-full font-bold transition-all text-xs border border-gray-200"
                >
                  <LogIn size={14} />
                  Log In
                </Link>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-primary hover:bg-primary-light rounded-lg transition-colors"
                aria-label="Open menu"
              >
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>

      </header>

      {/* Mobile Navigation Drawer */}
      <div 
        className={clsx(
          "fixed inset-0 bg-dark/40 backdrop-blur-sm z-[100] transition-opacity duration-300 lg:hidden",
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div 
          className={clsx(
            "fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col h-full z-[101]",
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-primary-light bg-white shrink-0">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <Image src="/logo.png" alt="Vets On Door Logo" fill className="object-contain" />
              </div>
              <span className="font-display font-bold text-xl text-primary">Menu</span>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-dark/50 hover:text-primary hover:bg-primary-light rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-4 bg-white w-full">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1">Navigation</div>
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={clsx(
                      "flex items-center justify-between py-4 px-5 rounded-2xl transition-all duration-200 group w-full active:scale-[0.98]",
                      isActive 
                        ? "bg-primary text-white shadow-lg shadow-primary/30 border border-primary-mid" 
                        : "bg-white text-dark border border-gray-100 shadow-sm hover:border-primary/30 hover:shadow-md hover:bg-primary-light/10"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={clsx(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                        isActive 
                          ? "bg-white/20 text-white" 
                          : "bg-gray-50 text-gray-500 group-hover:bg-primary-light group-hover:text-primary"
                      )}>
                        <Icon size={22} strokeWidth={2.5} />
                      </div>
                      <span className="text-lg font-bold tracking-tight">{link.name}</span>
                    </div>
                    <ChevronRight size={20} className={clsx("transition-transform duration-300", isActive ? "text-white/70" : "text-gray-300 group-hover:text-primary group-hover:translate-x-1")} />
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
              {user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-primary-light/50 text-primary py-3.5 rounded-2xl font-bold transition-colors border border-primary-light hover:bg-primary-light"
                >
                  <LayoutDashboard size={20} />
                  My Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-gray-50 text-dark py-3.5 rounded-2xl font-bold transition-colors border border-gray-200 hover:bg-gray-100"
                >
                  <LogIn size={20} />
                  Log In / Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
