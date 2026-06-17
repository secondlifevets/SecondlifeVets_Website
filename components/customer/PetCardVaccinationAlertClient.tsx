"use client";

import { useState } from "react";
import { ShieldAlert, Clock } from "lucide-react";
import EliteVaccinationModal from "@/components/customer/EliteVaccinationModal";

export default function PetCardVaccinationAlertClient({
  pet,
  vaxStatus,
  profile,
  email
}: {
  pet: any;
  vaxStatus: any;
  profile: any;
  email: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isDue = vaxStatus.state === "due";
  const isUpcoming = vaxStatus.state === "upcoming";

  return (
    <>
      {isDue ? (
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="w-full text-left bg-red-50 border border-red-100 p-3 rounded-xl flex items-center justify-between shadow-sm hover:shadow-md transition-all group/vax hover:bg-red-100 mt-2"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-lg shadow-sm shrink-0">
              <ShieldAlert size={16} className="text-emergency" />
            </div>
            <div>
              <p className="text-xs font-bold text-emergency uppercase tracking-wide">{vaxStatus.label}</p>
              <p className="text-[10px] text-red-700">{vaxStatus.sublabel}</p>
            </div>
          </div>
          <span className="text-emergency font-bold text-lg group-hover/vax:translate-x-1 transition-transform">→</span>
        </button>
      ) : isUpcoming ? (
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="w-full text-left bg-orange-50 border border-orange-100 p-3 rounded-xl flex items-center justify-between shadow-sm hover:shadow-md transition-all group/vax hover:bg-orange-100 mt-2"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-lg shadow-sm shrink-0">
              <Clock size={16} className="text-orange-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-orange-700 uppercase tracking-wide">{vaxStatus.label}</p>
              <p className="text-[10px] text-orange-600">{vaxStatus.sublabel}</p>
            </div>
          </div>
          <span className="text-orange-500 font-bold text-lg group-hover/vax:translate-x-1 transition-transform">→</span>
        </button>
      ) : null}

      {isModalOpen && (
        <EliteVaccinationModal
          pet={pet}
          profile={profile}
          email={email}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
