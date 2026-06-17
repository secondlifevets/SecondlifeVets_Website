"use client";

import { useState, useEffect } from "react";
import { PawPrint, Search, ChevronRight, FileText } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import Link from "next/link";

export default function PetsClient({ initialPets }: { initialPets: any[] }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);

  // Reset page on search
  useEffect(() => {
    setPage(0);
  }, [search, pageSize]);

  // Handle Search Filtering
  const filteredPets = search.trim() ? initialPets.filter((p: any) => {
    const term = search.toLowerCase();
    
    const petName = (p.name || "").toLowerCase();
    const petId = (p.id || "").toLowerCase();
    const shortPetId = p.id ? p.id.split('-')[0].toLowerCase() : "";
    
    const ownerName = (p.profiles?.full_name || "").toLowerCase();
    const ownerPhone = (p.profiles?.phone || "").toLowerCase();
    const ownerId = (p.profiles?.id || "").toLowerCase();
    const shortOwnerId = p.profiles?.id ? p.profiles.id.split('-')[0].toLowerCase() : "";

    return (
      petName.includes(term) ||
      petId.includes(term) ||
      shortPetId.includes(term) ||
      ownerName.includes(term) ||
      ownerPhone.includes(term) ||
      ownerId.includes(term) ||
      shortOwnerId.includes(term) ||
      term === `vod-${shortPetId}` // Matches "VOD-90AD9239" exactly
    );
  }) : [];
  
  const totalCount = filteredPets.length;
  const paginatedPets = filteredPets.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-dark mb-1">Registered Pets</h1>
          <p className="text-gray-500 font-sans">Manage pet passports and details</p>
        </div>
        
        <div className="relative w-full sm:w-[400px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by Pet ID, Owner ID, name, phone..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500">
                <th className="py-4 px-6 font-bold">Pet Information</th>
                <th className="py-4 px-6 font-bold">Passport Number</th>
                <th className="py-4 px-6 font-bold">Species & Breed</th>
                <th className="py-4 px-6 font-bold">Owner Information</th>
                <th className="py-4 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16">
                    <div className="flex flex-col items-center justify-center text-center px-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100 shadow-sm">
                        <Search size={28} className="text-gray-400" />
                      </div>
                      <h3 className="font-display font-bold text-dark text-lg mb-1">
                        {!search.trim() ? "Search for a Pet" : "No pets found"}
                      </h3>
                      <p className="text-gray-500 text-sm max-w-sm">
                        {!search.trim() 
                          ? "Enter a Pet ID, Owner ID, Name, or Phone Number to view records."
                          : "There are no pets matching your current search criteria."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedPets.map((pet: any, i: number) => {
                  const shortPetId = pet.id ? pet.id.split('-')[0].toUpperCase() : "N/A";
                  const shortOwnerId = pet.profiles?.id ? pet.profiles.id.split('-')[0].toUpperCase() : "N/A";
                  
                  return (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {pet.image_url ? (
                            <img src={pet.image_url} alt={pet.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">🐾</div>
                          )}
                          <div>
                            <p className="text-sm font-bold text-dark">{pet.name}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Registered: {new Date(pet.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-dark bg-gray-100 px-2 py-1 rounded w-fit tracking-wide">
                            VOD-{shortPetId}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm font-bold text-dark capitalize">{pet.type}</p>
                        <p className="text-xs text-gray-500">{pet.breed || "Mixed Breed"}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm font-bold text-dark">{pet.profiles?.full_name || "Unknown Owner"}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{pet.profiles?.phone || "No phone"}</span>
                          <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider" title="Owner ID">
                            ID: {shortOwnerId}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            href={`/admin/passport/${pet.id}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[#0E4664] hover:bg-[#0E4664]/90 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <FileText size={14} /> Passport
                          </Link>
                          <Link 
                            href={`/admin/appointments?pet_id=${pet.id}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-mid bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            History <ChevronRight size={14} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {filteredPets.length > 0 && (
          <Pagination 
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        )}
      </div>
    </div>
  );
}
