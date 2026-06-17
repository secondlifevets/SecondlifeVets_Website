"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MapPin, Phone, Loader2, PartyPopper, User } from "lucide-react";
import WhatsappIcon from "@/components/ui/WhatsappIcon";
import { updateProfile } from "@/app/(customer)/dashboard/actions";

export default function ProfileOnboardingClient({ profile }: { profile: any }) {
  const router = useRouter();
  
  const needsOnboarding = !profile.full_name || !profile.phone || !profile.address || !profile.whatsapp_number;
  const [isOpen, setIsOpen] = useState(needsOnboarding);
  
  const [fullName, setFullName] = useState(profile.full_name || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp_number || "");
  const [address, setAddress] = useState(profile.address || "");
  const [city, setCity] = useState(profile.city || "Lahore");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !whatsapp || !address || !city) {
      return toast.error("Please fill in all fields.");
    }
    
    setIsLoading(true);
    const res = await updateProfile(address, city, phone, whatsapp, fullName);
    if (res.success) {
      toast.success("Profile completed!");
      setIsOpen(false);
      router.refresh();
    } else {
      toast.error(res.error || "Couldn't update profile. Please try again.");
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up max-h-[90vh] flex flex-col relative">
        
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="text-center mb-2">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <PartyPopper size={24} className="text-primary" />
            </div>
            <h2 className="font-display font-bold text-2xl text-dark mb-1">Welcome!</h2>
            <p className="text-sm text-gray-500">
              Please provide your service location for home visits.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Ali Khan"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={16} className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  placeholder="0300 1234567"
                  value={phone}
                  onChange={e => {
                    setPhone(e.target.value);
                    if (!whatsapp && e.target.value) {
                      setWhatsapp(e.target.value);
                    }
                  }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">WhatsApp Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <WhatsappIcon size={16} className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  placeholder="0300 1234567"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">City</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin size={16} className="text-gray-400" />
                </div>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all appearance-none font-medium text-dark"
                >
                  <option value="Lahore">Lahore</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Home Address</label>
              <textarea
                rows={3}
                placeholder="House 123, Street 4, F-8/3..."
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all resize-none font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !fullName || !phone || !whatsapp || !address || !city}
            className="w-full bg-primary hover:bg-primary-mid disabled:bg-gray-300 disabled:text-gray-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 size={18} className="animate-spin" />}
            {isLoading ? "Saving..." : "Complete Profile & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
