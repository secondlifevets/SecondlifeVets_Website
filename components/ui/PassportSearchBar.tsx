"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Search, Loader2, QrCode, X } from "lucide-react";
import { findPetIdByShortCode } from "@/lib/actions/passport";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function PassportSearchBar() {
  const [shortCode, setShortCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (shortCode.length !== 8) {
      setError("Please enter an 8-character ID");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fullId = await findPetIdByShortCode(shortCode.toLowerCase());
      if (fullId) {
        router.push(`/passport/${fullId}`);
      } else {
        setError("No passport found with this ID");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-fA-F0-9]/g, '').slice(0, 8).toUpperCase();
    setShortCode(value);
    if (error) setError(null);
  };

  const handleScan = (detectedCodes: any[]) => {
    if (detectedCodes && detectedCodes.length > 0) {
      const rawValue = detectedCodes[0].rawValue || detectedCodes[0].text || (typeof detectedCodes[0] === 'string' ? detectedCodes[0] : "");
      if (rawValue) {
        setIsScanning(false);
        try {
          if (rawValue.includes("/passport/")) {
            const url = new URL(rawValue);
            router.push(url.pathname);
          } else {
            setShortCode(rawValue.replace(/[^a-fA-F0-9]/g, '').slice(0, 8).toUpperCase());
          }
        } catch (e) {
          setShortCode(rawValue.replace(/[^a-fA-F0-9]/g, '').slice(0, 8).toUpperCase());
        }
      }
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col">
      <div className="w-full relative group">
        <form 
          onSubmit={handleSearch} 
          className="flex items-center bg-white/10 backdrop-blur-md border border-white/30 rounded-full p-1.5 shadow-lg overflow-hidden focus-within:ring-2 focus-within:ring-white/50 focus-within:border-white/50 transition-all duration-300 relative z-10"
        >
          <button
            type="button"
            onClick={() => setIsScanning(true)}
            className="bg-white/20 hover:bg-white/30 text-white w-10 h-10 ml-1 rounded-full flex items-center justify-center transition-all shadow-sm shrink-0 focus:outline-none border border-white/10"
            aria-label="Scan QR Code"
            title="Scan Passport QR"
          >
            <QrCode size={18} />
          </button>
          <div className="pl-2 pr-1 text-white/70">
            <Search size={16} className="opacity-50" />
          </div>
          <input
            type="text"
            placeholder="8-Digit Pet ID..."
            value={shortCode}
            onChange={handleChange}
            className="w-full bg-transparent border-none outline-none text-white placeholder-white/60 font-mono tracking-wider text-base sm:text-lg px-1 min-w-0"
            maxLength={8}
            spellCheck={false}
            autoComplete="off"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={shortCode.length !== 8 || isLoading}
            className="bg-white text-primary px-6 py-2.5 rounded-full font-bold text-sm hover:bg-primary-light transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[100px]"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Access"}
          </button>
        </form>
        
        {/* Glowing background effect */}
        <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 pointer-events-none"></div>
      </div>
      
      {/* Error Message with smooth reveal */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${error ? 'max-h-12 mt-2 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-red-300 text-sm font-medium bg-red-900/30 px-4 py-1.5 rounded-full backdrop-blur-sm border border-red-500/30 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
          {error}
        </p>
      </div>

      {isScanning && typeof window !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[9999] bg-dark/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative flex flex-col items-center p-6">
            <button
              type="button"
              onClick={() => setIsScanning(false)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-dark p-2 rounded-full transition-colors z-10"
            >
              <X size={20} />
            </button>
            <h3 className="font-display font-bold text-xl text-dark mb-2 mt-4 text-center">Scan Pet Passport</h3>
            <p className="text-gray-500 text-sm text-center mb-6">Point your camera at the QR code on the pet's digital passport.</p>
            
            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-black/5 relative border-2 border-primary/20">
              <Scanner 
                onScan={handleScan}
                onError={(err) => console.log(err)}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

