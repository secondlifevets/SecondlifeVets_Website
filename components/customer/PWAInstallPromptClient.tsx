"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { toast } from "sonner";

export default function PWAInstallPromptClient({ hasPets }: { hasPets: boolean }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Only target regular users (has at least 1 pet)
    if (!hasPets) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Check if user dismissed it recently
      const dismissed = localStorage.getItem("pwaPromptDismissed");
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [hasPets]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      toast.success("Thanks for installing Vets On Door!");
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for a while
    localStorage.setItem("pwaPromptDismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:w-96 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 animate-fade-in-up flex flex-col gap-3">
      <button 
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full p-1"
      >
        <X size={16} />
      </button>
      
      <div className="flex items-center gap-4 pt-2">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
          <Download size={24} className="text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-dark leading-tight">Install Vets On Door App</h3>
          <p className="text-xs text-gray-500 mt-0.5">For faster 1-click bookings</p>
        </div>
      </div>
      
      <button 
        onClick={handleInstallClick}
        className="w-full bg-primary hover:bg-primary-mid text-white text-sm font-bold py-2.5 rounded-xl transition-colors shadow-sm"
      >
        Add to Home Screen
      </button>
    </div>
  );
}
