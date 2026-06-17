"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { updateProfile } from "./actions";
import { toast } from "sonner";

const formatPhone = (value: string) => {
  const cleaned = ('' + value).replace(/\D/g, '');
  if (cleaned.length <= 4) return cleaned;
  return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 11)}`;
};

export default function SettingsClient({ profile, email }: { profile: any, email: string }) {
  const [isPending, setIsPending] = useState(false);
  const [phone, setPhone] = useState(profile?.phone ? formatPhone(profile.phone) : "");
  const [whatsapp, setWhatsapp] = useState(profile?.whatsapp ? formatPhone(profile.whatsapp) : "");
  const [emergencyPhone, setEmergencyPhone] = useState(profile?.emergency_phone ? formatPhone(profile.emergency_phone) : "");
  const [lat, setLat] = useState<number | null>(profile?.pin_lat || null);
  const [lng, setLng] = useState<number | null>(profile?.pin_lng || null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "granted" | "denied">("idle");

  const getLocation = () => {
    setLocationStatus("loading");
    if (!navigator.geolocation) {
      setLocationStatus("denied");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        setLocationStatus("granted");
        toast.success("Location coordinates captured!");
      },
      () => {
        setLocationStatus("denied");
        toast.error("Couldn't access your location. Please check your browser permissions.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const removeLocation = () => {
    setLat(null);
    setLng(null);
    setLocationStatus("idle");
    toast.success("Location pin removed. Remember to save changes.");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);
    
    setIsPending(false);
    
    if (result.error) {
      toast.error(result.error || "Couldn't update profile. Please try again.");
    } else {
      toast.success("Profile updated successfully!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-card">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
          <input 
            type="email" 
            disabled 
            value={email} 
            className="w-full bg-gray-100 border border-transparent rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed" 
          />
          <p className="text-xs text-gray-400 mt-1.5 ml-1">Your email is used for login and cannot be changed here.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
            <input 
              required 
              name="full_name" 
              type="text" 
              defaultValue={profile?.full_name || ""}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-dark" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
            <input 
              required 
              name="phone" 
              type="tel" 
              value={phone}
              onChange={e => setPhone(formatPhone(e.target.value))}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-dark" 
              placeholder="03XX-XXXXXXX"
              maxLength={12}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp Number</label>
          <input 
            required 
            name="whatsapp" 
            type="tel" 
            value={whatsapp}
            onChange={e => setWhatsapp(formatPhone(e.target.value))}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-dark" 
            placeholder="03XX-XXXXXXX"
            maxLength={12}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Home Address</label>
          <input 
            name="address" 
            type="text" 
            defaultValue={profile?.address || ""}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-dark" 
            placeholder="e.g. House 123, Street 4"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">City</label>
          <select 
            name="city" 
            defaultValue={profile?.city || "Lahore"}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-dark appearance-none" 
          >
            <option value="Lahore">Lahore</option>
          </select>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <h3 className="font-bold text-dark text-lg mb-1">Emergency Contact for passport</h3>
          <p className="text-xs text-gray-500 mb-4">Optional. This contact will be added to your pet's digital passport for emergencies.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
              <input 
                name="emergency_name" 
                type="text" 
                defaultValue={profile?.emergency_name || ""}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-dark" 
                placeholder="e.g. Ali Raza"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Relation</label>
              <input 
                name="emergency_relation" 
                type="text" 
                defaultValue={profile?.emergency_relation || ""}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-dark" 
                placeholder="e.g. Sister, Friend"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Phone</label>
            <input 
              name="emergency_phone" 
              type="tel" 
              value={emergencyPhone}
              onChange={e => setEmergencyPhone(formatPhone(e.target.value))}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-dark" 
              placeholder="03XX-XXXXXXX"
              maxLength={12}
            />
          </div>
        </div>

        <div className="bg-primary-light/20 border border-primary-light/40 p-5 rounded-2xl">
          <label className="flex items-center gap-2 text-sm font-bold text-dark mb-1">
            📍 Saved Location (Optional)
          </label>
          <p className="text-xs text-gray-500 mb-4">Save your exact coordinates to auto-fill when booking</p>

          <input type="hidden" name="pin_lat" value={lat ?? ""} />
          <input type="hidden" name="pin_lng" value={lng ?? ""} />

          {locationStatus !== "granted" && !lat ? (
            <>
              <button
                type="button"
                onClick={getLocation}
                disabled={locationStatus === "loading"}
                className="bg-white border border-primary text-primary px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {locationStatus === "loading" && <Loader2 className="animate-spin" size={14} />}
                Pin My Current Location
              </button>
              {locationStatus === "denied" && (
                <p className="text-xs text-emergency mt-2">Location access denied by browser.</p>
              )}
            </>
          ) : (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs bg-success/10 text-success font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  ✓ Location captured
                </span>
                <button 
                  type="button" 
                  onClick={removeLocation} 
                  className="text-xs text-emergency font-bold hover:underline"
                >
                  Remove Pin
                </button>
              </div>
              <div className="h-48 w-full rounded-xl overflow-hidden border border-gray-200 relative bg-gray-100">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${(lng || 0) - 0.005}%2C${(lat || 0) - 0.005}%2C${(lng || 0) + 0.005}%2C${(lat || 0) + 0.005}&layer=mapnik&marker=${lat}%2C${lng}`}
                ></iframe>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button 
            type="submit" 
            disabled={isPending} 
            className="bg-primary hover:bg-primary-mid text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            {isPending ? <Loader2 size={20} className="animate-spin" /> : <><Save size={20} /> Save Changes</>}
          </button>
        </div>
      </div>
    </form>
  );
}
