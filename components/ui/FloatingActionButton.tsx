"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import clsx from "clsx";

export default function FloatingActionButton() {
  const pathname = usePathname();

  // Hide the FAB if we are already on the booking page
  if (pathname === "/dashboard/book") return null;

  return (
    <Link
      href="/dashboard/book"
      className={clsx(
        "fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-50",
        "bg-primary text-white w-14 h-14 rounded-full shadow-card hover:shadow-card-hover",
        "flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group animate-fade-in-up"
      )}
    >
      <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
    </Link>
  );
}
