"use client";

import { Download } from "lucide-react";
import Link from "next/link";

export default function MedicalCertificateClient({ pet }: { pet: any }) {
  return (
    <>
      <Link 
        href={`/passport/${pet.id}`}
        className="mt-2 w-full bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 p-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-sm group"
      >
        <Download size={16} className="text-primary group-hover:-translate-y-0.5 transition-transform" />
        Download Digital Passport
      </Link>
    </>
  );
}
