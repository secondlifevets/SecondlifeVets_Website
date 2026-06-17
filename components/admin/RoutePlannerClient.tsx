"use client";

import { Map } from "lucide-react";

export default function RoutePlannerClient({ appointments }: { appointments: any[] }) {
  if (!appointments || appointments.length === 0) return null;

  const handleOpenRoute = () => {
    const origin = "Lahore, Pakistan"; // Default base
    const waypoints = appointments.map(a => encodeURIComponent(`${a.address}, ${a.city}`)).join("|");
    
    // Construct Google Maps Directions URL
    // Format: https://www.google.com/maps/dir/?api=1&origin=...&destination=...&waypoints=...
    const dest = encodeURIComponent(`${appointments[appointments.length - 1].address}, ${appointments[appointments.length - 1].city}`);
    const wp = waypoints ? `&waypoints=${waypoints}` : "";
    
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${dest}${wp}`;
    window.open(url, '_blank');
  };

  return (
    <button 
      onClick={handleOpenRoute}
      className="mt-4 w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 p-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-sm"
    >
      <Map size={18} />
      Open Today's Route Map
    </button>
  );
}
