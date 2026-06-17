"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Settings as SettingsIcon, Store, Shield, Trash2, CalendarX, Loader2, Save, Edit2, X } from "lucide-react";
import { toast } from "sonner";
import useSWR from "swr";

const fetchBlockedSlots = async () => {
  const res = await fetch('/api/admin/blocked-slots');
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to fetch');
  return json.data || [];
};

const fetchSettings = async () => {
  const res = await fetch('/api/admin/settings');
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to fetch settings');
  return json.data;
};

import { ALL_DAYS, parseWorkingHours, parseDaysToArray, convertTo24h } from "@/lib/utils";

const formatTime12h = (time24: string) => {
  if (!time24) return "";
  const [h, m] = time24.split(":");
  let hours = parseInt(h, 10);
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${m} ${ampm}`;
};

const formatDaysArrayToString = (days: string[]) => {
  if (days.length === 0) return "";
  if (days.length === 7) return "Everyday";
  
  const sorted = [...days].sort((a, b) => ALL_DAYS.indexOf(a) - ALL_DAYS.indexOf(b));
  
  let isContiguous = true;
  for (let i = 0; i < sorted.length - 1; i++) {
    if (ALL_DAYS.indexOf(sorted[i+1]) - ALL_DAYS.indexOf(sorted[i]) !== 1) {
      isContiguous = false;
      break;
    }
  }
  
  if (isContiguous && sorted.length >= 3) {
    return `${sorted[0]} – ${sorted[sorted.length - 1]}`;
  }
  
  return sorted.join(", ");
};

export default function SettingsPage() {
  const { data: blockedSlots = [], isLoading: loading, mutate: mutateBlocked } = useSWR('blocked-slots', fetchBlockedSlots);
  const { data: settings, isLoading: loadingSettings, mutate: mutateSettings } = useSWR('settings', fetchSettings);
  
  const [unblocking, setUnblocking] = useState<string | null>(null);
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isDaysDropdownOpen, setIsDaysDropdownOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    business_name: 'Vets On Door',
    primary_phone: '0307-8517122',
    email: 'contact@vetsondoor.com',
    working_hours: 'Monday – Saturday: 9:00 AM – 8:00 PM'
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        business_name: settings.business_name || 'Vets On Door',
        primary_phone: settings.primary_phone || '0307-8517122',
        email: settings.email || 'contact@vetsondoor.com',
        working_hours: settings.working_hours || 'Monday – Saturday: 9:00 AM – 8:00 PM'
      });
    }
  }, [settings]);

  const updateWorkingHours = (type: 'days' | 'start' | 'end', value: string) => {
    const current = parseWorkingHours(formData.working_hours);
    const updated = { ...current, [type]: value };
    const newString = `${updated.days}: ${formatTime12h(updated.start)} – ${formatTime12h(updated.end)}`;
    setFormData({ ...formData, working_hours: newString });
  };

  const handleUnblock = async (date: string, time: string, id: string) => {
    setUnblocking(id);
    
    // Optimistic update
    mutateBlocked(blockedSlots.filter((s: any) => s.id !== id), false);
    const res = await fetch('/api/slots/block', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, time })
    });
    
    if (res.ok) {
      mutateBlocked(); // Revalidate
      toast.success("Time slot unblocked");
    } else {
      mutateBlocked(); // Rollback
      toast.error("Couldn't unblock slot. Please try again.");
    }
    setUnblocking(null);
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error('Failed to save settings');
      
      await mutateSettings();
      setIsEditingSettings(false);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error("Couldn't save settings. Please try again.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-dark mb-1 flex items-center gap-3">
          <SettingsIcon size={28} className="text-primary" /> Settings
        </h1>
        <p className="text-gray-500 font-sans">Manage your operational preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Business Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-dark flex items-center gap-2">
                <Store size={20} className="text-primary" /> Business Information
              </h2>
              {!isEditingSettings ? (
                <button 
                  onClick={() => setIsEditingSettings(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-primary bg-primary-light/10 hover:bg-primary-light/20 rounded-lg transition-colors"
                >
                  <Edit2 size={16} /> Edit
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setIsEditingSettings(false);
                      // Reset to original data
                      if (settings) {
                        setFormData({
                          business_name: settings.business_name || 'Vets On Door',
                          primary_phone: settings.primary_phone || '0307-8517122',
                          email: settings.email || 'contact@vetsondoor.com',
                          working_hours: settings.working_hours || 'Monday – Saturday: 9:00 AM – 8:00 PM'
                        });
                      }
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    disabled={isSavingSettings}
                  >
                    <X size={16} /> Cancel
                  </button>
                  <button 
                    onClick={handleSaveSettings}
                    disabled={isSavingSettings}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isSavingSettings ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
                    Save
                  </button>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Business Name</label>
                {isEditingSettings ? (
                  <input
                    type="text"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    className="w-full font-bold text-dark bg-white px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                ) : (
                  <p className="font-bold text-dark bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">{formData.business_name}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Primary Phone / WhatsApp</label>
                {isEditingSettings ? (
                  <input
                    type="text"
                    value={formData.primary_phone}
                    onChange={(e) => setFormData({ ...formData, primary_phone: e.target.value })}
                    className="w-full font-bold text-dark bg-white px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                ) : (
                  <p className="font-bold text-dark bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">{formData.primary_phone}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                {isEditingSettings ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full font-bold text-dark bg-white px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                ) : (
                  <p className="font-bold text-dark bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">{formData.email}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Standard Working Hours</label>
                {isEditingSettings ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="relative">
                      <span className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">Days</span>
                      <div 
                        onClick={() => setIsDaysDropdownOpen(!isDaysDropdownOpen)}
                        className="w-full font-bold text-primary bg-white px-3 py-2.5 rounded-xl border border-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer flex justify-between items-center"
                      >
                        <span className="truncate">{parseWorkingHours(formData.working_hours).days || "Select Days"}</span>
                        <svg className={`w-4 h-4 text-primary transition-transform ${isDaysDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>

                      {isDaysDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-0" onClick={() => setIsDaysDropdownOpen(false)}></div>
                          <div className="absolute z-10 top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg py-2">
                            {ALL_DAYS.map(day => {
                              const currentArray = parseDaysToArray(parseWorkingHours(formData.working_hours).days);
                              const isSelected = currentArray.includes(day);
                              
                              return (
                                <label key={day} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={isSelected}
                                    onChange={() => {
                                      const newArray = isSelected 
                                        ? currentArray.filter(d => d !== day)
                                        : [...currentArray, day];
                                      updateWorkingHours('days', formatDaysArrayToString(newArray));
                                    }}
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                  />
                                  <span className="text-sm font-bold text-dark">{day}</span>
                                </label>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">Opening Time</span>
                      <input
                        type="time"
                        value={parseWorkingHours(formData.working_hours).start}
                        onChange={(e) => updateWorkingHours('start', e.target.value)}
                        className="w-full font-bold text-primary bg-white px-3 py-2.5 rounded-xl border border-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">Closing Time</span>
                      <input
                        type="time"
                        value={parseWorkingHours(formData.working_hours).end}
                        onChange={(e) => updateWorkingHours('end', e.target.value)}
                        className="w-full font-bold text-primary bg-white px-3 py-2.5 rounded-xl border border-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="font-bold text-primary bg-primary-light/20 px-4 py-3 rounded-xl border border-primary-light">{formData.working_hours}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-display text-xl font-bold text-dark mb-4 flex items-center gap-2">
              <Shield size={20} className="text-primary" /> Admin Management
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-800 font-medium leading-relaxed">
                <strong className="block mb-1">Need to add another admin?</strong>
                To add admin users, please go directly to your Supabase Dashboard → Authentication → Users. Any authenticated user will have access to this admin panel.
              </p>
            </div>
          </div>
        </div>

        {/* Blocked Time Slots */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col h-full max-h-[800px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-dark flex items-center gap-2">
              <CalendarX size={20} className="text-primary" /> Blocked Time Slots
            </h2>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            These time slots are completely hidden from the public booking calendar.
          </p>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center justify-between animate-pulse">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="flex gap-2 mt-1">
                      <div className="h-5 bg-gray-200 rounded w-16"></div>
                      <div className="h-4 bg-gray-100 rounded w-32 mt-0.5"></div>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                </div>
              ))
            ) : blockedSlots.length === 0 ? (
              <div className="text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300 p-8 flex flex-col items-center">
                <CalendarX size={32} className="text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm font-bold">No time slots are currently blocked.</p>
                <p className="text-xs text-gray-400 mt-1">Block time slots from the Calendar page.</p>
              </div>
            ) : (
              blockedSlots.map((slot: any) => (
                <div key={slot.id} className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center justify-between group hover:border-gray-200 transition-colors">
                  <div>
                    <p className="font-bold text-dark text-sm">{slot.blocked_date}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100 text-primary">
                        {slot.blocked_time?.substring(0, 5) || "N/A"}
                      </span>
                      {slot.reason && <span className="text-xs text-gray-500">• {slot.reason}</span>}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleUnblock(slot.blocked_date, slot.blocked_time, slot.id)}
                    disabled={unblocking === slot.id}
                    className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-emergency hover:bg-red-50 hover:border-red-100 transition-colors disabled:opacity-50"
                    title="Unblock slot"
                  >
                    {unblocking === slot.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
