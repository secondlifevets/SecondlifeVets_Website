"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { CalendarCheck, X, Clock, Loader2, ShieldCheck } from "lucide-react";
import { getVaccinationHistory } from "./actions";

export default function VaccinationHistoryButton({ petId, petName, lastDate, sublabel }: { petId: string, petName: string, lastDate: string | null, sublabel?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const handleOpen = async () => {
    setIsOpen(true);
    setIsLoading(true);
    const data = await getVaccinationHistory(petId);
    setHistory(data || []);
    setIsLoading(false);
  };

  const formattedDate = lastDate ? format(parseISO(lastDate), "MMM d, yyyy") : "Unknown";

  return (
    <>
      <button 
        onClick={handleOpen}
        className="w-full bg-green-50 border border-green-100 p-3 rounded-xl flex items-center hover:bg-green-100 transition-colors group/vax"
      >
        <div className="flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-lg shadow-sm">
            <ShieldCheck size={16} className="text-success" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-success uppercase tracking-wide">Vaccination Up to Date</p>
            <p className="text-[10px] text-green-700">{sublabel || (lastDate ? `Last: ${formattedDate}` : "View history")}</p>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden flex flex-col max-h-[80vh] animate-slide-up">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-success" size={20} />
                <h2 className="font-display text-lg font-bold text-dark">{petName}'s Vaccinations</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-dark transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto flex-1 bg-gray-50/30">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-3">
                  <Loader2 className="animate-spin" size={24} />
                  <p className="text-sm">Loading history...</p>
                </div>
              ) : history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <Clock className="text-gray-400" size={24} />
                  </div>
                  <h3 className="font-bold text-dark mb-1">No History Found</h3>
                  <p className="text-sm text-gray-500">We don't have past vaccination records for {petName} in our new system.</p>
                </div>
              ) : (
                <div className="space-y-3 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                  {history.map((record, index) => (
                    <div key={record.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-green-100 text-success shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <ShieldCheck size={16} />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-dark text-sm">
                            {record.shot_type ? record.shot_type.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Vaccinated'}
                          </h4>
                          <span className="text-xs font-medium text-gray-500">{format(parseISO(record.vaccination_date), "MMM d, yyyy")}</span>
                        </div>
                        {record.notes && (
                          <p className="text-xs text-gray-600 mt-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                            {record.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-white">
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-dark font-bold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
