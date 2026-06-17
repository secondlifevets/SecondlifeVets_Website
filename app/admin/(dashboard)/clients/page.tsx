"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Users, Search, ChevronRight, MessageCircle, UsersRound } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import useSWR from "swr";
import Link from "next/link";

const fetcher = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('preferred_date', { ascending: false });
    
  if (error) throw error;
  
  // Group by customer_id if available, fallback to phone
  const clientMap = new Map();
  data.forEach(appt => {
    const groupKey = appt.customer_id || appt.client_phone;
    
    if (!clientMap.has(groupKey)) {
      clientMap.set(groupKey, {
        id: appt.customer_id,
        name: appt.client_name,
        phone: appt.client_phone,
        whatsapp: appt.client_whatsapp,
        email: appt.client_email,
        visits: 0,
        pets: new Set(),
        lastVisit: appt.preferred_date,
        appointments: []
      });
    }
    const client = clientMap.get(groupKey);
    client.visits += 1;
    client.pets.add(`${appt.pet_name} (${appt.pet_type})`);
    if (new Date(appt.preferred_date) > new Date(client.lastVisit)) {
      client.lastVisit = appt.preferred_date;
      client.name = appt.client_name;
      client.phone = appt.client_phone;
      client.whatsapp = appt.client_whatsapp;
      client.email = appt.client_email;
    }
    client.appointments.push(appt);
  });

  return Array.from(clientMap.values()).map((c: any) => ({
    ...c,
    petsList: Array.from(c.pets).join(", ")
  }));
};

export default function ClientsPage() {
  const supabase = createClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);

  const { data: clients = [], isLoading } = useSWR('clients', fetcher, {
    keepPreviousData: true
  });

  // Reset page on search
  useEffect(() => {
    setPage(0);
  }, [search, pageSize]);

  const filteredClients = clients.filter((c: any) => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search)
  );
  
  const totalCount = filteredClients.length;
  const paginatedClients = filteredClients.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-dark mb-1">Clients Database</h1>
          <p className="text-gray-500 font-sans">Manage and view patient history</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or phone..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500">
                <th className="py-4 px-6 font-bold">Client Information</th>
                <th className="py-4 px-6 font-bold">Pets</th>
                <th className="py-4 px-6 font-bold text-center">Total Visits</th>
                <th className="py-4 px-6 font-bold">Last Visit</th>
                <th className="py-4 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 animate-pulse">
                    <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-32 mb-2"></div><div className="h-3 bg-gray-100 rounded w-24"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
                    <td className="py-4 px-6 text-center"><div className="w-8 h-8 rounded-full bg-gray-200 mx-auto"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="py-4 px-6 text-right"><div className="h-8 bg-gray-200 rounded w-20 inline-block"></div></td>
                  </tr>
                ))
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16">
                    <div className="flex flex-col items-center justify-center text-center px-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100 shadow-sm">
                        <UsersRound size={28} className="text-gray-400" />
                      </div>
                      <h3 className="font-display font-bold text-dark text-lg mb-1">No clients found</h3>
                      <p className="text-gray-500 text-sm max-w-sm">There are no clients matching your current search criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedClients.map((client: any, i: number) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <p className="text-sm font-bold text-dark">{client.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{client.phone}</span>
                        <a href={`https://wa.me/${(client.whatsapp || client.phone).replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-[#25D366]/10 text-[#25D366] px-1.5 py-0.5 rounded font-bold flex items-center gap-1 hover:bg-[#25D366]/20">
                          <MessageCircle size={10} /> WA
                        </a>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-700 max-w-[200px] truncate">{client.petsList}</p>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-light text-primary font-bold text-sm">
                        {client.visits}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {client.lastVisit}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link 
                        href={`/admin/appointments?${client.id ? `customer_id=${client.id}` : `search=${encodeURIComponent(client.phone)}`}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-mid bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        History <ChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!isLoading && filteredClients.length > 0 && (
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
