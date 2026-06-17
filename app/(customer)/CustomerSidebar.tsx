"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, PawPrint, Settings, LogOut, Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import clsx from "clsx";
import Image from "next/image";
import CustomerNotificationBell from "@/components/customer/CustomerNotificationBell";

export default function CustomerSidebar({ user, profile }: { user: any, profile: any }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const navLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Pets", href: "/dashboard/pets", icon: PawPrint },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-white border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <span className="font-display font-bold text-primary">My Portal</span>
        </div>
        <div className="flex items-center gap-2">
          <CustomerNotificationBell />
          <button onClick={() => setIsOpen(true)} className="p-2 text-dark">
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Sidebar Drawer / Desktop Sidebar */}
      <aside className={clsx(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:w-72",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-10 h-10">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <span className="font-display font-bold text-xl text-primary leading-tight">Vets On Door</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="hidden lg:block">
              <CustomerNotificationBell />
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-gray-500">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-primary-light/30 rounded-2xl p-4 border border-primary-light flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shadow-glow">
              {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-dark text-sm truncate">{profile?.full_name || "Welcome"}</span>
              <span className="text-xs text-gray-500 truncate">{user?.email}</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all",
                  isActive 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-dark"
                )}
              >
                <Icon size={20} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-emergency hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-dark/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
