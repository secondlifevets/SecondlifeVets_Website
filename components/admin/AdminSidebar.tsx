"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  CalendarDays, 
  Users, 
  Settings, 
  LogOut,
  PawPrint,
  Menu,
  X
} from "lucide-react";
import clsx from "clsx";
import AdminNotificationBell from "@/components/admin/AdminNotificationBell";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Appointments", href: "/admin/appointments", icon: CalendarCheck },
    { name: "Calendar", href: "/admin/calendar", icon: CalendarDays },
    { name: "Clients", href: "/admin/clients", icon: Users },
    { name: "Pets", href: "/admin/pets", icon: PawPrint },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-dark text-white flex items-center justify-between px-4 z-40 border-b border-white/10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 bg-white p-1 rounded-lg">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <span className="font-display font-bold text-lg">Admin Panel</span>
        </div>
        <div className="flex items-center gap-2">
          <AdminNotificationBell />
          <button onClick={() => setIsMobileOpen(true)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Backdrop */}
      <div 
        className={clsx(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Sidebar */}
      <div className={clsx(
        "fixed inset-y-0 left-0 z-50 w-64 bg-dark text-white flex flex-col h-full shrink-0 transition-transform duration-300 lg:relative lg:translate-x-0 shadow-2xl lg:shadow-none",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Mobile close button */}
        <button 
          onClick={() => setIsMobileOpen(false)} 
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white lg:hidden"
        >
          <X size={20} />
        </button>

        <div className="p-6 flex items-center justify-between border-b border-white/10 lg:mt-0 mt-8">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-white p-1 rounded-xl shrink-0">
              <Image src="/logo.png" alt="Vets On Door Logo" fill className="object-contain" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg leading-tight truncate max-w-[120px]">Vets On Door</h2>
              <p className="text-xs text-primary-light font-medium truncate max-w-[120px]">Dr. Muhammad Ahmad</p>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <AdminNotificationBell />
          </div>
        </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                isActive ? "bg-primary text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl transition-all font-medium text-gray-400 hover:bg-white/5 hover:text-emergency"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
      </div>
    </>
  );
}
