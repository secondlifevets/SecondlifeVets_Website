"use client";

import React from "react";
import { PetPassportData } from "@/lib/types";

// Constants for exact A4 dimensions in pixels at 96 DPI
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

/** Standard anchor-click download — works on desktop and Android Chrome */
function downloadViaAnchor(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 1500);
}


const VerifiedStamp = ({ id }: { id: string | number }) => (
  <div className="relative w-[60px] h-[60px] rotate-[-12deg] mt-1 shrink-0 opacity-90 mx-auto bg-transparent overflow-visible" style={{ filter: 'drop-shadow(0 0 1px rgba(93, 177, 100, 0.2))' }}>
    <svg viewBox="0 0 100 100" className="w-full h-full text-[#5DB164]">
      <defs>
        <path id={`topArc-${id}`} d="M 15 50 A 35 35 0 0 1 85 50" fill="none" />
        <path id={`bottomArc-${id}`} d="M 6 50 A 44 44 0 0 0 94 50" fill="none" />
        <filter id={`stamp-noise-${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  5 0 0 0 -1" in="noise" result="alphaNoise" />
          <feComposite operator="in" in="SourceGraphic" in2="alphaNoise" />
        </filter>
      </defs>
      <g filter={`url(#stamp-noise-${id})`}>
        <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <text fontSize="9.5" fontWeight="bold" fontFamily="Montserrat, sans-serif" fill="currentColor" letterSpacing="0.5">
          <textPath href={`#topArc-${id}`} startOffset="50%" textAnchor="middle">- VETSONDOOR -</textPath>
        </text>
        <text fontSize="9.5" fontWeight="bold" fontFamily="Montserrat, sans-serif" fill="currentColor" letterSpacing="0.5">
          <textPath href={`#bottomArc-${id}`} startOffset="50%" textAnchor="middle">- VETSONDOOR -</textPath>
        </text>
        <path d="M 19.5 40 A 32 32 0 0 1 80.5 40" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <path d="M 19.5 60 A 32 32 0 0 0 80.5 60" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <text x="50" y="55" fontSize="16" fontWeight="900" fontFamily="Montserrat, sans-serif" fill="currentColor" textAnchor="middle" textLength="76" lengthAdjust="spacingAndGlyphs">VERIFIED</text>
        <g fill="currentColor">
          <text x="36" y="35" fontSize="6" textAnchor="middle">★</text>
          <text x="50" y="33.5" fontSize="7" textAnchor="middle">★</text>
          <text x="64" y="35" fontSize="6" textAnchor="middle">★</text>
        </g>
        <g fill="currentColor">
          <text x="36" y="67" fontSize="6" textAnchor="middle">★</text>
          <text x="50" y="68.5" fontSize="7" textAnchor="middle">★</text>
          <text x="64" y="67" fontSize="6" textAnchor="middle">★</text>
        </g>
      </g>
    </svg>
  </div>
);

export default function DigitalPassport({ data }: { data: PetPassportData }) {
  const { pet, owner, vaccinations, deworming_records, tick_flea_treatments, health_checkups, surgeries } = data;

  const sortedVaccinations = [...(vaccinations || [])].sort(
    (a, b) => new Date(b.vaccination_date).getTime() - new Date(a.vaccination_date).getTime()
  );

  const healthCheckups = (health_checkups || []).map((c) => ({
    date: c.date,
    weight: c.body_weight,
    tpr: c.tpr,
    condition: c.general_body_condition,
    prescription: c.prescription,
    veterinarian: c.veterinarian_name || "—"
  })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const sortedSurgeries = [...(surgeries || [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const chunkArray = <T,>(arr: T[], size: number): T[][] => {
    return arr.length ? Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    ) : [[]];
  };

  const vaxChunks = chunkArray(sortedVaccinations, 7);
  const dewormingChunks = chunkArray(deworming_records || [], 9);
  const healthChunks = chunkArray(healthCheckups, 5);
  const tickChunks = chunkArray(tick_flea_treatments || [], 10);
  const surgeryChunks = chunkArray(sortedSurgeries, 8);

  // Safely get and handle current URL for QR code verification to prevent hydration mismatches
  const [passportUrl, setPassportUrl] = React.useState<string>(
    `https://vetsondoor.com/passport/${pet?.id || ""}`
  );

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setPassportUrl(window.location.href);
    }
  }, [pet?.id]);

  const issueDate = pet?.created_at
    ? new Date(pet.created_at).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  const passportId = pet?.id ? `VOD-${pet.id.substring(0, 8).toUpperCase()}` : "VOD-00000000";

  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      // Wait for React re-render with PDF-optimized layout
      await new Promise(resolve => setTimeout(resolve, 300));

      // Ensure fonts are loaded before capture
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;
      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.default;

      const container = document.getElementById('passport-pdf-content');
      if (!container) return;

      // Find all page divs inside the container
      const pages = container.querySelectorAll<HTMLElement>('.pdf-page');
      if (!pages.length) return;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pdfWidth = 210; // mm
      const pdfHeight = 297; // mm

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];

        // Clone the page to a temporary off-screen container for clean rendering
        const clone = page.cloneNode(true) as HTMLElement;
        clone.style.width = `${A4_WIDTH_PX}px`;
        clone.style.height = `${A4_HEIGHT_PX}px`;
        clone.style.position = 'fixed';
        clone.style.left = '-9999px';
        clone.style.top = '0';
        clone.style.overflow = 'hidden';
        clone.style.background = 'white';
        clone.style.boxShadow = 'none';
        clone.style.border = 'none';
        clone.style.margin = '0';
        clone.style.padding = page.style.padding || '20mm';
        clone.style.boxSizing = 'border-box';

        // Remove any SVG filters that html2canvas can't render (feTurbulence etc.)
        clone.querySelectorAll('filter').forEach(f => {
          const filterId = f.id;
          // Find elements using this filter and remove the filter attribute
          clone.querySelectorAll(`[filter*="${filterId}"]`).forEach(el => {
            el.removeAttribute('filter');
          });
        });
        // Also remove filter from style attributes
        clone.querySelectorAll('[style*="filter"]').forEach(el => {
          (el as HTMLElement).style.filter = 'none';
        });

        document.body.appendChild(clone);

        try {
          const canvas = await html2canvas(clone, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
            width: A4_WIDTH_PX,
            height: A4_HEIGHT_PX,
            windowWidth: A4_WIDTH_PX,
            windowHeight: A4_HEIGHT_PX,
            scrollX: 0,
            scrollY: 0,
            x: 0,
            y: 0,
            backgroundColor: '#ffffff',
          });

          const imgData = canvas.toDataURL('image/jpeg', 0.95);

          if (i > 0) {
            pdf.addPage();
          }

          pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
        } finally {
          document.body.removeChild(clone);
        }
      }

      // Universal cross-platform download
      const pdfBlob = pdf.output('blob');
      const filename = `${pet?.name || 'Pet'}_Passport_${passportId}.pdf`;
      
      // Detect platform
      const ua = navigator.userAgent || '';
      const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
      
      if (isIOS || isSafari) {
        // iOS Safari doesn't support <a download> with blob URLs
        // Use window.open which opens the PDF in a new tab where user can share/save
        const blobUrl = URL.createObjectURL(pdfBlob);
        window.open(blobUrl, '_blank');
        // Revoke after a delay to allow the new tab to load
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      } else if (navigator.share && typeof File !== 'undefined') {
        // Try Web Share API for mobile (Android Chrome, etc.) — allows "Save to Files"
        try {
          const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });
          if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
            await navigator.share({
              files: [pdfFile],
              title: filename,
            });
          } else {
            // Fallback to anchor download
            downloadViaAnchor(pdfBlob, filename);
          }
        } catch (shareError) {
          // User cancelled share or share failed — fallback to anchor
          if ((shareError as Error).name !== 'AbortError') {
            downloadViaAnchor(pdfBlob, filename);
          }
        }
      } else {
        // Desktop browsers — standard anchor download
        downloadViaAnchor(pdfBlob, filename);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-[#F0F4F8] min-h-screen p-4 sm:p-8 print:p-0 print:bg-white flex flex-col font-inter overflow-x-auto w-full">
      {/* Control Bar (Hidden on Print) */}
      <div className="print:hidden w-full max-w-[210mm] mx-auto bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 border border-[#D9E2EC]">
        <div>
          <h2 className="text-xl font-bold font-montserrat text-[#0E4664]">{pet?.name || "Pet"}'s Digital Passport</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Official VetsOnDoor Digital Record</p>
        </div>
        <button 
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className="bg-[#5DB164] hover:bg-[#4d9a53] disabled:opacity-70 text-white font-semibold py-2 px-6 rounded-xl shadow-sm transition-all flex items-center gap-2 font-inter"
        >
          {isGenerating ? (
            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          )}
          {isGenerating ? "Generating..." : "Print / Save PDF"}
        </button>
      </div>

      {/* Pages Container */}
      <div id="passport-pdf-content" className={`passport-pages-container flex flex-col ${isGenerating ? 'w-[794px] mx-auto gap-0 bg-white' : 'w-full gap-8 print:gap-0 print:block'}`}>
        
        {/* PAGE 1: Profile (ID Card Aesthetic) */}
        <Page isGenerating={isGenerating} isFirstPage={true}>
          {/* Hero Header */}
          <div className="bg-[#0E4664] text-white p-4 sm:p-6 rounded-t-2xl flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 relative overflow-hidden shrink-0">
            {/* Watermark overlay */}
            <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
              <img src="/logo.svg" className="w-[150%] h-[150%] object-contain filter invert" alt="watermark" />
            </div>
            
            <div className="flex items-center gap-4 relative z-10">
              <img src="/logo.svg" alt="Vets On Door Logo" className="w-12 h-12 object-contain" />
              <div>
                <h1 className="text-2xl font-bold font-montserrat tracking-tight leading-none lowercase">
                  <span className="text-white">vets</span>
                  <span className="text-[#5DB164]">on</span>
                  <span className="text-white">door</span>
                </h1>
                <p className="text-[10px] font-semibold tracking-wider text-slate-300 font-inter uppercase mt-1">Official Pet Passport</p>
              </div>
            </div>
            <div className="flex flex-col items-center sm:items-end relative z-10">
              <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest font-inter mb-1 text-center sm:text-right">Passport Number</div>
              <div className="flex items-center justify-center sm:justify-end gap-2">
                <span className="font-mono font-bold text-sm text-white bg-[#1A4C67] px-2.5 py-1 rounded border border-[#2E607A]">{passportId}</span>
                <span className="font-bold text-[10px] text-[#5DB164] bg-[#164259] px-2.5 py-1 rounded border border-[#2E607A]">ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Main Card Container */}
          <div className="flex-1 border-x border-b border-[#D9E2EC] rounded-b-2xl bg-white p-4 sm:p-6 flex flex-col relative z-10">
            
            {/* Upper Section: Photo and Basic Info */}
            <div className="flex flex-col sm:flex-row gap-6 items-center text-center sm:text-left">
              {/* Pet Photo */}
              <div className="relative w-32 h-32 border-2 border-[#D9E2EC] rounded-full shadow-sm shrink-0 flex items-center justify-center">
                {pet?.image_url ? (
                  <img src={pet.image_url} alt="Pet Profile" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-1.5 p-3 rounded-full bg-[#FAFBFC]">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span className="text-[9px] font-bold tracking-widest uppercase">NO PHOTO</span>
                  </div>
                )}
              </div>

              {/* Identity Header */}
              <div className="flex-1">
                <span className="text-xs font-semibold text-[#5DB164] uppercase tracking-wider block font-inter mb-0.5">Pet Identity</span>
                <h2 className="text-3xl font-black font-montserrat text-[#0E4664] leading-none mb-1">{pet?.name || "UNNAMED"}</h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1.5">
                  <span className="text-xs font-semibold text-slate-500 bg-[#FAFBFC] border border-[#D9E2EC] px-2 py-0.5 rounded font-inter">
                    {pet?.type || "Unknown Species"}
                  </span>
                  {pet?.microchip_no && (
                    <span className="text-xs font-medium text-slate-500 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-inter">
                      Microchip #{pet.microchip_no}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#D9E2EC] my-5"></div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
              <InfoItem label="Species" value={pet?.type} isEven={true} />
              <InfoItem label="Breed" value={pet?.breed} isEven={true} />
              <InfoItem label="Gender" value={pet?.gender} isEven={false} />
              <InfoItem label="Date of Birth" value={pet?.date_of_birth} isEven={false} />
              <InfoItem label="Coat Color" value={pet?.color} isEven={true} />
              <InfoItem label="Microchip No" value={pet?.microchip_no} isEven={true} />
            </div>

            {/* Owner & Emergency Contact Details */}
            <div className="mt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Registered Owner */}
                <div>
                  <div className="text-[10px] font-bold tracking-wider text-[#0E4664] uppercase mb-2 font-montserrat">Registered Owner</div>
                  <div className="space-y-2 bg-[#FAFBFC] border border-[#D9E2EC] p-3 rounded-xl flex flex-col justify-center">
                    <div className="flex justify-between items-start text-xs gap-3">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block font-inter mt-0.5 shrink-0">Name</span>
                      <span className="font-bold text-[#0E4664] text-right font-inter break-words max-w-[180px] leading-tight">{owner?.full_name || "—"}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block font-inter">Phone</span>
                      <span className="font-bold text-[#0E4664] font-inter">{owner?.phone || "—"}</span>
                    </div>
                    <div className="flex justify-between items-start text-xs gap-3">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block font-inter mt-0.5 shrink-0">Address</span>
                      <span className="font-bold text-[#0E4664] text-right font-inter break-words max-w-[180px] leading-tight">{owner?.address || "—"}</span>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <div className="text-[10px] font-bold tracking-wider text-[#0E4664] uppercase mb-2 font-montserrat">Emergency Contact</div>
                  <div className="space-y-2 bg-[#FAFBFC] border border-[#D9E2EC] p-3 rounded-xl flex flex-col justify-center">
                    <div className="flex justify-between items-start text-xs gap-3">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block font-inter mt-0.5 shrink-0">Name</span>
                      <span className="font-bold text-[#0E4664] text-right font-inter break-words max-w-[180px] leading-tight">{owner?.emergency_name || "—"}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block font-inter">Relation</span>
                      <span className="font-bold text-[#0E4664] font-inter">{owner?.emergency_relation || "—"}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block font-inter">Phone</span>
                      <span className="font-bold text-[#0E4664] font-inter">{owner?.emergency_phone || "—"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Status Summary */}
            <div className="mt-5">
              <div className="text-[10px] font-bold tracking-wider text-[#0E4664] uppercase mb-2 font-montserrat">Official Medical Status</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center justify-between border border-[#D9E2EC] p-2.5 rounded-xl shadow-sm">
                  <span className="text-xs font-medium text-slate-600 font-inter">Vaccinations</span>
                  {vaccinations && vaccinations.length > 0 ? (
                    <span className="text-[10px] font-bold text-[#5DB164] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#5DB164]/30 font-inter">✓ Updated</span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-inter font-inter">No Records</span>
                  )}
                </div>
                <div className="flex items-center justify-between border border-[#D9E2EC] p-2.5 rounded-xl shadow-sm">
                  <span className="text-xs font-medium text-slate-600 font-inter">Deworming</span>
                  {deworming_records && deworming_records.length > 0 ? (
                    <span className="text-[10px] font-bold text-[#5DB164] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#5DB164]/30 font-inter">✓ Current</span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-inter">No Records</span>
                  )}
                </div>
                <div className="flex items-center justify-between border border-[#D9E2EC] p-2.5 rounded-xl shadow-sm">
                  <span className="text-xs font-medium text-slate-600 font-inter">Health Check</span>
                  {health_checkups && health_checkups.length > 0 ? (
                    <span className="text-[10px] font-bold text-[#5DB164] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#5DB164]/30 font-inter">✓ Passed</span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-inter font-inter">No Records</span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Verification Section */}
            <div className="mt-auto pt-5 border-t border-[#D9E2EC] flex flex-col-reverse sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
              <div className="flex-1 flex flex-col items-center sm:items-start">
                <h3 className="text-[10px] font-bold text-[#0E4664] font-montserrat uppercase tracking-wider">DIGITAL RECORD VERIFICATION</h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed font-inter">
                  Scan the QR code to verify this pet's real-time vaccination, deworming, and medical logs on the official registry.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-3 text-[10px] text-slate-400 font-inter text-center sm:text-left">
                  <div>
                    <span className="font-semibold text-slate-500">Issued by: </span> Vets On Door
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">Issue Date: </span> {issueDate}
                  </div>
                </div>
              </div>
              
              {/* QR Code Container */}
              <div className="p-1.5 bg-white rounded-xl border border-[#D9E2EC] shadow-sm flex items-center justify-center shrink-0">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(passportUrl)}`}
                  alt="Verification QR"
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>
          </div>
          
          {/* Security Strip Footer */}
          <div className="mt-4 border-t-2 border-[#0E4664] pt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-inter shrink-0 text-center">
            <span>Vets On Door Registry</span>
            <span className="text-[#5DB164]">Digitally Verified</span>
            <span>www.vetsondoor.com</span>
          </div>
        </Page>


        {/* PAGE 2: Vaccinations */}
        {vaxChunks.map((chunk, index) => (
          <Page key={`vax-${index}`} isGenerating={isGenerating}>
            <Header title="MEDICAL HISTORY" subtitle={`VACCINATION RECORDS ${vaxChunks.length > 1 ? `(Page ${index + 1} of ${vaxChunks.length})` : ''}`} />
            <div className="flex-1 pt-8 w-full max-w-3xl mx-auto">
              <VaxTable data={chunk} />
            </div>
            <Footer />
          </Page>
        ))}

        {/* PAGE 3: Deworming */}
        {dewormingChunks.map((chunk, index) => (
          <Page key={`deworm-${index}`} isGenerating={isGenerating}>
            <Header title="MEDICAL HISTORY" subtitle={`DEWORMING RECORDS ${dewormingChunks.length > 1 ? `(Page ${index + 1} of ${dewormingChunks.length})` : ''}`} />
            <div className="flex-1 pt-8 w-full max-w-3xl mx-auto">
              <DewormingTable data={chunk} />
            </div>
            <Footer />
          </Page>
        ))}

        {/* PAGE 4: General Health */}
        {healthChunks.map((chunk, index) => (
          <Page key={`health-${index}`} isGenerating={isGenerating}>
            <Header title="MEDICAL HISTORY" subtitle={`GENERAL HEALTH CHECKUPS ${healthChunks.length > 1 ? `(Page ${index + 1} of ${healthChunks.length})` : ''}`} />
            <div className="flex-1 pt-8 w-full max-w-3xl mx-auto">
              <GeneralHealthTable data={chunk} />
            </div>
            <Footer />
          </Page>
        ))}

        {/* PAGE 5: Tick & Flea */}
        {tickChunks.map((chunk, index) => (
          <Page key={`tick-${index}`} isGenerating={isGenerating}>
            <Header title="MEDICAL HISTORY" subtitle={`TICK & FLEA TREATMENTS ${tickChunks.length > 1 ? `(Page ${index + 1} of ${tickChunks.length})` : ''}`} />
            <div className="flex-1 pt-8 w-full max-w-3xl mx-auto">
              <TickTable title="Tick & Flea Treatments" data={chunk} />
            </div>
            <Footer />
          </Page>
        ))}

        {/* PAGE 6: Surgeries */}
        {surgeryChunks.map((chunk, index) => (
          <Page key={`surgery-${index}`} isGenerating={isGenerating}>
            <Header title="MEDICAL HISTORY" subtitle={`SURGICAL RECORDS ${surgeryChunks.length > 1 ? `(Page ${index + 1} of ${surgeryChunks.length})` : ''}`} />
            <div className="flex-1 pt-8 w-full max-w-3xl mx-auto">
              <SurgeryTable data={chunk} />
            </div>
            <Footer />
          </Page>
        ))}

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Inter:wght@400;500;600;700&display=swap');
        
        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }
        .font-inter {
          font-family: 'Inter', sans-serif;
        }

        @media print {
          body {
            background-color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
          tr {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .break-inside-avoid {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}} />
    </div>
  );
}

// Sub-components

const Page = ({ children, isGenerating, isFirstPage }: { children: React.ReactNode, isGenerating?: boolean, isFirstPage?: boolean }) => (
  <div className={`${!isFirstPage ? 'page-break' : ''} pdf-page bg-white relative flex flex-col box-border mx-auto
    ${isGenerating ? 'w-[794px] h-[1123px] p-[20mm] border-none shadow-none m-0 overflow-hidden shrink-0' : 'w-full max-w-[794px] min-h-auto sm:min-h-[1123px] p-4 sm:p-8 md:p-[20mm] print:p-[20mm] shadow-[0_0_40px_rgba(0,0,0,0.06)] border border-[#D9E2EC] overflow-hidden sm:overflow-visible'}
  `}>
     {children}
  </div>
);

const Header = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-[#0E4664] pb-4 shrink-0 gap-4 text-center sm:text-left">
    <div>
      <h1 className="text-xl font-bold font-montserrat text-[#0E4664] tracking-tight uppercase leading-none mb-1.5">{title}</h1>
      <p className="text-xs font-semibold tracking-wider text-[#5DB164] font-inter uppercase">{subtitle}</p>
    </div>
    <div className="flex flex-col-reverse sm:flex-row items-center gap-3">
      <div className="text-center sm:text-right">
        <h2 className="font-bold font-montserrat text-lg leading-none tracking-tight mb-1 lowercase">
          <span className="text-[#0E4664]">vets</span>
          <span className="text-[#5DB164]">on</span>
          <span className="text-[#0E4664]">door</span>
        </h2>
        <p className="text-[9px] font-semibold text-[#0E4664] tracking-wide font-inter">Your Mobile Vet Team</p>
      </div>
      <img src="/logo.svg" alt="Vets On Door" className="w-10 h-10 object-contain" />
    </div>
  </div>
);

const Footer = () => (
  <div className="mt-auto shrink-0 pt-4 border-t border-[#D9E2EC] flex flex-col sm:flex-row gap-2 justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest font-inter text-center">
    <span>www.vetsondoor.com</span>
    <span>Official Digital Record</span>
  </div>
);

const ProfileRow = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="flex justify-between items-center py-3.5 border-b border-[#D9E2EC]/40 last:border-b-0">
    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider font-inter">{label}</span>
    <span className="text-sm font-semibold text-[#0E4664] font-inter">{value || "—"}</span>
  </div>
);

const InfoItem = ({ label, value, isEven }: { label: string; value?: string | null; isEven: boolean }) => (
  <div className={`flex justify-between items-center p-3 rounded-lg ${isEven ? 'bg-[#FAFBFC]' : 'bg-white'} border-b border-[#D9E2EC]/30`}>
    <span className="text-xs font-medium text-slate-500 font-inter">{label}</span>
    <span className="text-sm font-semibold text-[#0E4664] font-inter">{value || "—"}</span>
  </div>
);

const VaxTable = ({ title, data }: { title?: string, data: any[] }) => (
  <div className="w-full">
    {title && <h3 className="text-xs font-bold text-[#0E4664] font-montserrat uppercase tracking-wider mb-2.5">{title}</h3>}
    <div className="overflow-x-auto border border-[#D9E2EC] rounded-xl shadow-sm bg-white w-full max-w-full">
      <table className="w-full text-left border-collapse text-xs min-w-[600px]">
        <thead>
          <tr className="bg-[#0E4664] text-white">
            <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[24%]">Vaccination Date</th>
            <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[26%] border-l border-white/10">Vaccination Name</th>
            <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[18%] border-l border-white/10">Vaccination Batch No</th>
            <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[15%] border-l border-white/10">Veterinarian</th>
            <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[15%] text-center border-l border-white/10">Vets On Door Stamp</th>
            <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[14%] text-center border-l border-white/10">Vets On Door Stamp</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((v, i) => (
              <tr key={i} className="border-b border-[#D9E2EC] last:border-0 hover:bg-[#FAFBFC] transition-colors h-16">
                <td className="p-3 font-inter">
                  <div className="text-[9px] font-medium text-slate-400 uppercase tracking-wide">Vaccinated on:</div>
                  <div className="font-semibold text-[#0E4664] mt-0.5">{v.vaccination_date}</div>
                  {v.valid_until && (
                    <>
                      <div className="text-[9px] font-medium text-slate-400 uppercase tracking-wide mt-1.5">until:</div>
                      <div className="font-semibold text-amber-600 mt-0.5">{v.valid_until}</div>
                    </>
                  )}
                </td>
                <td className="p-3 border-l border-[#D9E2EC]/50 font-inter">
                  <div className="font-semibold text-[#0E4664]">{v.vaccine_name || v.manufacturer_and_name || "—"}</div>
                  {v.vaccine_type === "Rabies" && (
                    <span className="text-[8px] font-bold text-red-600 bg-red-50 border border-red-100 rounded px-1.5 py-0.5 uppercase tracking-wide inline-block mt-1 font-montserrat">
                      Rabies
                    </span>
                  )}
                </td>
                <td className="p-3 border-l border-[#D9E2EC]/50 font-inter text-center">
                  {v.batch_no ? (
                    <span className="font-mono font-semibold text-[#0E4664]">{v.batch_no}</span>
                  ) : (
                    <span className="text-slate-300 font-mono tracking-tighter text-[10px] block">........................</span>
                  )}
                </td>
                <td className="p-3 font-semibold text-[#0E4664] border-l border-[#D9E2EC]/50 font-inter">{v.veterinarian_name || "—"}</td>
                <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-middle text-center">
                  <div className="flex flex-col items-center justify-center relative">
                    {v.is_vod_verified && (
                      <VerifiedStamp id={`vax-${i}`} />
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr className="bg-[#FAFBFC]">
              <td colSpan={5} className="p-4 text-center text-xs text-slate-400 font-medium italic">No vaccination records found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const DewormingTable = ({ data }: { data: any[] }) => (
  <div className="w-full">
    <div className="overflow-x-auto border border-[#D9E2EC] rounded-xl shadow-sm bg-white w-full max-w-full">
      <table className="w-full text-left border-collapse text-xs min-w-[600px]">
        <thead>
          <tr className="bg-[#0E4664] text-white">
            <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[35%]">Date</th>
            <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[35%] border-l border-white/10">Dewormer</th>
            <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[20%] border-l border-white/10">Veterinarian</th>
            <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[15%] text-center border-l border-white/10">Vets On Door Stamp</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((record, i) => {
              // Calculate next due date (typically 3 months later)
              let nextDue = "—";
              try {
                const d = new Date(record.date);
                d.setMonth(d.getMonth() + 3);
                nextDue = d.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                });
              } catch (e) {}

              return (
                <tr key={i} className="border-b border-[#D9E2EC] last:border-0 hover:bg-[#FAFBFC] transition-colors h-16">
                  <td className="p-3 font-inter">
                    <div className="text-[9px] font-medium text-slate-400 uppercase tracking-wide">Date Administered:</div>
                    <div className="font-semibold text-[#0E4664] mt-0.5">{record.date}</div>
                    <div className="text-[9px] font-medium text-slate-400 uppercase tracking-wide mt-1.5">Next Due:</div>
                    <div className="font-semibold text-amber-600 mt-0.5">{nextDue}</div>
                  </td>
                  <td className="p-3 font-semibold text-[#0E4664] border-l border-[#D9E2EC]/50 font-inter">
                    {record.medicine || record.dewormer || (
                      <span className="text-slate-300 font-mono tracking-tighter text-[10px] block">........................................</span>
                    )}
                  </td>
                  <td className="p-3 font-semibold text-[#0E4664] border-l border-[#D9E2EC]/50 font-inter">{record.veterinarian_name || "—"}</td>
                  <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-middle text-center">
                    <div className="flex flex-col items-center justify-center relative">
                      {record.is_vod_verified && <VerifiedStamp id={`deworm-${i}`} />}
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr className="bg-[#FAFBFC]">
              <td colSpan={4} className="p-4 text-center text-xs text-slate-400 font-medium italic">No deworming records found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const GeneralHealthTable = ({ data }: { data: any[] }) => (
  <div className="w-full">
    <h3 className="text-xs font-bold text-[#0E4664] font-montserrat uppercase tracking-wider mb-2.5">General Health</h3>
    <div className="overflow-x-auto border border-[#D9E2EC] rounded-xl shadow-sm bg-white w-full max-w-full">
      <table className="w-full text-left border-collapse text-xs min-w-[600px]">
        <thead>
          <tr className="bg-[#0E4664] text-white">
            <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[20%]">Visit Date</th>
            <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[40%] border-l border-white/10">Diagnosis</th>
            <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[22%] border-l border-white/10">Prescription</th>
            <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[18%] border-l border-white/10">Veterinarian</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((record, i) => (
              <tr key={i} className="border-b border-[#D9E2EC] last:border-0 hover:bg-[#FAFBFC] transition-colors h-16">
                <td className="p-3 font-semibold text-[#0E4664] font-inter align-top">{record.date}</td>
                <td className="p-3 text-slate-600 border-l border-[#D9E2EC]/50 font-inter align-top leading-relaxed">
                  <div>
                    <div className="font-bold text-[#0E4664] mb-1">
                      {record.condition && record.condition.includes(" - ") ? record.condition.split(" - ")[0] : "General Health Checkup"}
                    </div>
                    <div className="text-[11px] text-slate-500 space-y-0.5">
                      {record.weight && <div>• Weight: <span className="font-semibold text-slate-700">{record.weight} kg</span></div>}
                      {record.tpr && <div>• TPR: <span className="font-semibold text-slate-700">{record.tpr}</span></div>}
                      {record.condition && <div>• Details: <span className="font-semibold text-slate-700">
                        {record.condition.includes(" - ") ? record.condition.substring(record.condition.indexOf(" - ") + 3) : record.condition}
                      </span></div>}
                    </div>
                  </div>
                </td>
                <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-top">
                  {record.prescription ? (
                    <div className="font-semibold text-[#0E4664] mt-1 text-sm">{record.prescription}</div>
                  ) : (
                    <span className="text-slate-300 font-mono tracking-tighter text-[10px] block mt-1">........................................</span>
                  )}
                </td>
                <td className="p-3 font-semibold text-[#0E4664] border-l border-[#D9E2EC]/50 font-inter align-top">{record.veterinarian || "—"}</td>
                <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-middle text-center">
                  <div className="flex flex-col items-center justify-center relative">
                    {record.is_vod_verified && <VerifiedStamp id={`health-${i}`} />}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr className="bg-[#FAFBFC]">
              <td colSpan={5} className="p-4 text-center text-xs text-slate-400 font-medium italic">No health checkup records found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const SurgeryTable = ({ data }: { data: any[] }) => (
  <div className="w-full">
    <h3 className="text-xs font-bold text-[#0E4664] font-montserrat uppercase tracking-wider mb-2.5">Surgical Records</h3>
    <div className="overflow-x-auto border border-[#D9E2EC] rounded-xl shadow-sm bg-white w-full max-w-full">
      <table className="w-full text-left border-collapse text-xs min-w-[600px]">
        <thead>
          <tr className="bg-[#0E4664] text-white">
            <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[20%]">Surgery Date</th>
            <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[50%] border-l border-white/10">Surgery Details</th>
            <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[20%] border-l border-white/10">Attending Veterinarian</th>
            <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[15%] text-center border-l border-white/10">Vets On Door Stamp</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((record, i) => (
              <tr key={i} className="border-b border-[#D9E2EC] last:border-0 hover:bg-[#FAFBFC] transition-colors h-16">
                <td className="p-3 font-semibold text-[#0E4664] font-inter align-middle">{record.date}</td>
                <td className="p-3 font-semibold text-[#0E4664] border-l border-[#D9E2EC]/50 font-inter align-middle">{record.surgery_details || "Surgery Performed"}</td>
                <td className="p-3 font-semibold text-[#0E4664] border-l border-[#D9E2EC]/50 font-inter align-middle">{record.veterinarian_name || "—"}</td>
                <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-middle text-center">
                  <div className="flex flex-col items-center justify-center relative">
                    {record.is_vod_verified && <VerifiedStamp id={`surgery-${i}`} />}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr className="bg-[#FAFBFC]">
              <td colSpan={4} className="p-4 text-center text-xs text-slate-400 font-medium italic">No surgical records found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const TickTable = ({ title, data }: { title: string, data: any[] }) => (
  <div className="w-full">
    <h3 className="text-xs font-bold text-[#0E4664] font-montserrat uppercase tracking-wider mb-2.5">{title}</h3>
    <div className="overflow-x-auto border border-[#D9E2EC] rounded-xl shadow-sm bg-white w-full max-w-full">
      <table className="w-full text-left border-collapse text-xs min-w-[600px]">
        <thead>
          <tr className="bg-[#0E4664] text-white">
            <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-1/4">Date</th>
            <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-1/2 border-l border-white/10">Medicine Used</th>
            <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[20%] text-center border-l border-white/10">Veterinarian</th>
            <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[15%] text-center border-l border-white/10">Vets On Door Stamp</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((t, i) => (
              <tr key={i} className="border-b border-[#D9E2EC] last:border-0 hover:bg-[#FAFBFC] transition-colors h-12">
                <td className="p-3 font-semibold text-[#0E4664] font-inter">{t.date}</td>
                <td className="p-3 font-medium text-slate-600 border-l border-[#D9E2EC]/50 font-inter">{t.medicine || "—"}</td>
                <td className="p-3 text-center font-semibold text-[#0E4664] border-l border-[#D9E2EC]/50 font-inter">{t.veterinarian_name || "—"}</td>
                <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-middle text-center">
                  <div className="flex flex-col items-center justify-center relative">
                    {t.is_vod_verified && <VerifiedStamp id={`tick-${i}`} />}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr className="bg-[#FAFBFC]">
              <td colSpan={4} className="p-4 text-center text-xs text-slate-400 font-medium italic">No treatment records found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
