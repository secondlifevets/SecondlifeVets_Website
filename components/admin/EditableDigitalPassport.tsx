"use client";

import React, { useState } from "react";
import { PetPassportData } from "@/lib/types";
import { savePassportData } from "@/lib/actions/passport-edit";
import { toast } from "sonner";
import { Save, Loader2, ArrowUp, ArrowDown, Trash2, Plus, Calendar } from "lucide-react";

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

export default function EditableDigitalPassport({ initialData, petId }: { initialData: PetPassportData, petId: string }) {
  const [data, setData] = useState<PetPassportData>(initialData);
  const [isSaving, setIsSaving] = useState(false);

  const { pet, owner, vaccinations, deworming_records, tick_flea_treatments, health_checkups, surgeries } = data;

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await savePassportData(petId, data);
      if (res && res.error) {
        toast.error(res.error);
        return;
      }
      toast.success("Passport updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Couldn't save passport.");
    } finally {
      setIsSaving(false);
    }
  };

  const updatePetField = (field: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      pet: { ...prev.pet, [field]: value }
    }));
  };

  const updateTableData = (table: string, index: number, field: string, value: any) => {
    setData((prev: any) => {
      const arr = [...(prev[table] || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [table]: arr };
    });
  };

  const moveRow = (table: string, index: number, direction: 'up' | 'down') => {
    setData((prev: any) => {
      const arr = [...(prev[table] || [])];
      if (direction === 'up' && index > 0) {
        const temp = arr[index - 1];
        arr[index - 1] = arr[index];
        arr[index] = temp;
      } else if (direction === 'down' && index < arr.length - 1) {
        const temp = arr[index + 1];
        arr[index + 1] = arr[index];
        arr[index] = temp;
      }
      return { ...prev, [table]: arr };
    });
  };

  const deleteRow = (table: string, index: number) => {
    setData((prev: any) => {
      const arr = [...(prev[table] || [])];
      arr.splice(index, 1);
      return { ...prev, [table]: arr };
    });
  };

  const addRow = (table: string, emptyRow: any) => {
    setData((prev: any) => {
      const arr = [...(prev[table] || [])];
      arr.unshift(emptyRow); // Add to top
      return { ...prev, [table]: arr };
    });
  };

  const issueDate = pet?.created_at
    ? new Date(pet.created_at).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  const passportId = pet?.id ? `VOD-${pet.id.substring(0, 8).toUpperCase()}` : "VOD-00000000";

  const [isGenerating, setIsGenerating] = useState(false);

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

        // Collect computed styles from original elements BEFORE cloning
        // (getComputedStyle doesn't work on elements not in the DOM)
        const originalInputs = page.querySelectorAll('textarea, input[type="text"], input[type="date"]');
        const inputStyles: Array<{
          fontFamily: string; fontSize: string; fontWeight: string;
          color: string; lineHeight: string; textAlign: string; minHeight: string;
          value: string; type: string;
        }> = [];
        originalInputs.forEach(el => {
          const htmlEl = el as HTMLInputElement | HTMLTextAreaElement;
          const cs = window.getComputedStyle(htmlEl);
          inputStyles.push({
            fontFamily: cs.fontFamily,
            fontSize: cs.fontSize,
            fontWeight: cs.fontWeight,
            color: cs.color,
            lineHeight: cs.lineHeight,
            textAlign: cs.textAlign,
            minHeight: cs.minHeight,
            value: htmlEl.value || '',
            type: htmlEl.type || '',
          });
        });

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

        // Strip interactive/edit-mode elements from the clone
        clone.querySelectorAll('[class*="print:hidden"]').forEach(el => el.remove());
        // Remove action buttons (move up/down/delete)
        clone.querySelectorAll('button').forEach(el => el.remove());
        // Remove checkbox inputs
        clone.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(el => el.remove());

        // Convert textarea/input values to static text spans using pre-collected styles
        const cloneInputs = clone.querySelectorAll('textarea, input[type="text"], input[type="date"]');
        cloneInputs.forEach((el, idx) => {
          const htmlEl = el as HTMLInputElement | HTMLTextAreaElement;
          const styles = inputStyles[idx];
          const span = document.createElement('span');

          if (styles) {
            span.style.fontFamily = styles.fontFamily;
            span.style.fontSize = styles.fontSize;
            span.style.fontWeight = styles.fontWeight;
            span.style.color = styles.color;
            span.style.lineHeight = styles.lineHeight;
            span.style.textAlign = styles.textAlign;
            span.style.minHeight = styles.minHeight;
          } else {
            // Fallback styles if index doesn't match
            span.style.fontFamily = "'Inter', sans-serif";
            span.style.fontSize = '12px';
            span.style.fontWeight = '600';
            span.style.color = '#0E4664';
          }
          span.style.display = 'block';
          span.style.whiteSpace = 'pre-wrap';
          span.style.wordBreak = 'break-word';
          span.style.width = '100%';
          span.style.padding = '0 1px';

          // Format date values for display
          const rawValue = styles?.value || htmlEl.value || '';
          let displayValue = rawValue;
          if ((styles?.type === 'date' || htmlEl.type === 'date') && displayValue) {
            try {
              const d = new Date(displayValue + 'T00:00:00');
              displayValue = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
            } catch { /* keep original */ }
          }
          span.textContent = displayValue || '\u2014';
          htmlEl.parentNode?.replaceChild(span, htmlEl);
        });

        // Remove any SVG filters that html2canvas can't render (feTurbulence etc.)
        clone.querySelectorAll('filter').forEach(f => {
          const filterId = f.id;
          clone.querySelectorAll(`[filter*="${filterId}"]`).forEach(el => {
            el.removeAttribute('filter');
          });
        });
        clone.querySelectorAll('[style*="filter"]').forEach(el => {
          (el as HTMLElement).style.filter = 'none';
        });

        // Remove the calendar icon overlays
        clone.querySelectorAll('.relative.shrink-0.flex.items-center.justify-center.w-4.h-4').forEach(el => el.remove());

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
      const filename = `${pet?.name || 'Pet'}_Editable_Passport_${passportId}.pdf`;
      
      // Detect platform
      const ua = navigator.userAgent || '';
      const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
      
      if (isIOS || isSafari) {
        // iOS Safari doesn't support <a download> with blob URLs
        const blobUrl = URL.createObjectURL(pdfBlob);
        window.open(blobUrl, '_blank');
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      } else if (navigator.share && typeof File !== 'undefined') {
        // Try Web Share API for mobile (Android Chrome, etc.)
        try {
          const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });
          if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
            await navigator.share({
              files: [pdfFile],
              title: filename,
            });
          } else {
            downloadViaAnchor(pdfBlob, filename);
          }
        } catch (shareError) {
          if ((shareError as Error).name !== 'AbortError') {
            downloadViaAnchor(pdfBlob, filename);
          }
        }
      } else {
        downloadViaAnchor(pdfBlob, filename);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-[#F0F4F8] min-h-screen p-4 sm:p-8 print:p-0 print:bg-white flex flex-col font-inter overflow-x-auto w-full relative pb-24">
      {/* Control Bar (Hidden on Print) */}
      <div className="print:hidden w-full max-w-[210mm] mx-auto bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 border border-[#D9E2EC]">
        <div>
          <h2 className="text-xl font-bold font-montserrat text-[#0E4664]">{pet?.name || "Pet"}'s Editable Passport</h2>
          <p className="text-sm text-amber-600 font-bold mt-1">Admin Edit Mode</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-xl shadow-sm transition-all flex items-center gap-2 font-inter disabled:opacity-70"
          >
            {isGenerating ? <Loader2 className="animate-spin w-5 h-5" /> : null}
            {isGenerating ? "Generating..." : "Print / Save PDF"}
          </button>
        </div>
      </div>

      {/* Save FAB */}
      <div className="fixed bottom-8 right-8 z-50 print:hidden">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary hover:bg-primary-mid text-white font-bold py-4 px-8 rounded-full shadow-2xl transition-all flex items-center gap-3 text-lg disabled:opacity-70 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
        >
          {isSaving ? <Loader2 className="animate-spin w-6 h-6" /> : <Save className="w-6 h-6" />}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Pages Container */}
      <div id="passport-pdf-content" className={`passport-pages-container flex flex-col ${isGenerating ? 'gap-0' : 'gap-8 print:gap-0 print:block'}`}>
        
        {/* PAGE 1: Profile */}
        <Page isGenerating={isGenerating} isFirstPage={true}>
          <div className="bg-[#0E4664] text-white p-4 sm:p-6 rounded-t-2xl flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 relative overflow-hidden shrink-0">
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

          <div className="flex-1 border-x border-b border-[#D9E2EC] rounded-b-2xl bg-white p-4 sm:p-6 flex flex-col relative z-10">
            <div className="flex flex-col sm:flex-row gap-6 items-center text-center sm:text-left">
              <div className="relative w-32 h-32 border-2 border-[#D9E2EC] rounded-full shadow-sm shrink-0 flex items-center justify-center">
                {pet?.image_url ? (
                  <img src={pet.image_url} alt="Pet Profile" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-1.5 p-3 rounded-full bg-[#FAFBFC]">
                    <span className="text-[9px] font-bold tracking-widest uppercase">NO PHOTO</span>
                  </div>
                )}
              </div>

              <div className="flex-1 w-full">
                <span className="text-xs font-semibold text-[#5DB164] uppercase tracking-wider block font-inter mb-0.5">Pet Identity</span>
                <InputField 
                  value={pet?.name || ""} 
                  onChange={(v) => updatePetField('name', v)} 
                  className="text-3xl font-black font-montserrat text-[#0E4664] leading-none mb-1 max-w-[300px]" 
                  placeholder="PET NAME" 
                />
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1.5 w-full">
                  <div className="bg-[#FAFBFC] border border-[#D9E2EC] px-2 py-0.5 rounded flex items-center">
                    <InputField 
                      value={pet?.type || ""} 
                      onChange={(v) => updatePetField('type', v)} 
                      className="text-xs font-semibold text-slate-500 font-inter w-32" 
                      placeholder="Species" 
                    />
                  </div>
                  <div className="bg-amber-50 border border-amber-200 px-2 py-0.5 rounded flex items-center">
                    <span className="text-xs font-medium text-slate-500 mr-1">Microchip #</span>
                    <InputField 
                      value={pet?.microchip_no || ""} 
                      onChange={(v) => updatePetField('microchip_no', v)} 
                      className="text-xs font-medium text-slate-500 font-inter w-32" 
                      placeholder="Number" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-[#D9E2EC] my-5"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
              <InfoItem label="Breed" value={pet?.breed || ""} onChange={(v) => updatePetField('breed', v)} isEven={true} />
              <InfoItem label="Gender" value={pet?.gender || ""} onChange={(v) => updatePetField('gender', v)} isEven={false} />
              <InfoItem label="Date of Birth" value={pet?.date_of_birth || ""} onChange={(v) => updatePetField('date_of_birth', v)} isEven={true} isDate={true} />
              <InfoItem label="Coat Color" value={pet?.color || ""} onChange={(v) => updatePetField('color', v)} isEven={false} />
            </div>

            {/* Read-only Owner Info omitted here for brevity, keeping same as DigitalPassport */}
            <div className="mt-5 opacity-70 cursor-not-allowed" title="Owner details are read-only here">
              <div className="text-[10px] font-bold tracking-wider text-[#0E4664] uppercase mb-2 font-montserrat">Registered Owner (Read-Only)</div>
              <div className="space-y-2 bg-[#FAFBFC] border border-[#D9E2EC] p-3 rounded-xl flex flex-col justify-center">
                <div className="flex justify-between items-start text-xs gap-3">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block font-inter mt-0.5 shrink-0">Name</span>
                  <span className="font-bold text-[#0E4664] text-right font-inter break-words max-w-[180px] leading-tight">{owner?.full_name || "—"}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block font-inter">Phone</span>
                  <span className="font-bold text-[#0E4664] font-inter">{owner?.phone || "—"}</span>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-5 border-t border-[#D9E2EC] flex flex-col-reverse sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
              <div className="flex-1 flex flex-col items-center sm:items-start">
                <h3 className="text-[10px] font-bold text-[#0E4664] font-montserrat uppercase tracking-wider">DIGITAL RECORD VERIFICATION</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-3 text-[10px] text-slate-400 font-inter text-center sm:text-left">
                  <div><span className="font-semibold text-slate-500">Issued by: </span> Vets On Door</div>
                  <div><span className="font-semibold text-slate-500">Issue Date: </span> {issueDate}</div>
                </div>
              </div>
            </div>
          </div>
        </Page>

        {/* PAGE 2: Vaccinations */}
        <Page isGenerating={isGenerating}>
          <Header title="MEDICAL HISTORY" subtitle="VACCINATION RECORDS" />
          <div className="flex-1 pt-8 w-full max-w-3xl mx-auto">
            <div className="w-full">
              <div className="flex justify-between items-center mb-2.5">
                <h3 className="text-xs font-bold text-[#0E4664] font-montserrat uppercase tracking-wider">Vaccinations</h3>
                <button onClick={() => addRow('vaccinations', { vaccination_date: new Date().toISOString().split('T')[0], vaccine_name: '', vaccine_type: 'Other', batch_no: '', valid_until: '', veterinarian_name: '', is_vod_verified: true })} className="print:hidden flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-mid bg-primary/10 px-3 py-1 rounded-lg">
                  <Plus size={14} /> Add Row
                </button>
              </div>
              <div className="overflow-x-auto border border-[#D9E2EC] rounded-xl shadow-sm bg-white w-full max-w-full">
                <table className="w-full text-left border-collapse text-xs min-w-[600px]">
                  <thead>
                    <tr className="bg-[#0E4664] text-white">
                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[20%]">Date / Until</th>
                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[22%] border-l border-white/10">Vaccine Name</th>
                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[15%] border-l border-white/10">Batch No</th>
                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[18%] border-l border-white/10">Vet</th>
                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[20%] text-center border-l border-white/10">Verified</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(vaccinations || []).map((v: any, i: number) => (
                      <tr key={i} className="border-b border-[#D9E2EC] last:border-0 hover:bg-[#FAFBFC] transition-colors h-16 group">
                        <td className="p-3 font-inter relative">
                          <DateField value={v.vaccination_date || ""} onChange={(val) => updateTableData('vaccinations', i, 'vaccination_date', val)} placeholder="YYYY-MM-DD" className="font-semibold text-[#0E4664]" />
                          <DateField value={v.valid_until || ""} onChange={(val) => updateTableData('vaccinations', i, 'valid_until', val)} placeholder="Until YYYY-MM-DD" className="font-semibold text-amber-600 mt-1" />
                          <div className="absolute left-2 top-[1px] -translate-y-full opacity-0 group-hover:opacity-100 bg-white shadow-md border border-slate-200 px-1 py-1 rounded-lg z-10 print:hidden transition-opacity duration-200">
                            <ActionButtons onUp={() => moveRow('vaccinations', i, 'up')} onDown={() => moveRow('vaccinations', i, 'down')} onDelete={() => deleteRow('vaccinations', i)} />
                          </div>
                        </td>
                        <td className="p-3 border-l border-[#D9E2EC]/50 font-inter">
                          <InputField value={v.vaccine_name || ""} onChange={(val) => updateTableData('vaccinations', i, 'vaccine_name', val)} placeholder="Vaccine Name" className="font-semibold text-[#0E4664]" />
                          <div className="mt-1 flex items-center gap-2">
                            <label className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1 cursor-pointer">
                              <input type="radio" checked={v.vaccine_type === "Rabies"} onChange={() => updateTableData('vaccinations', i, 'vaccine_type', "Rabies")} className="w-3 h-3 print:hidden" /> Rabies
                            </label>
                            <label className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1 cursor-pointer">
                              <input type="radio" checked={v.vaccine_type !== "Rabies"} onChange={() => updateTableData('vaccinations', i, 'vaccine_type', "Other")} className="w-3 h-3 print:hidden" /> Other
                            </label>
                          </div>
                        </td>
                        <td className="p-3 border-l border-[#D9E2EC]/50 font-inter text-center">
                          <InputField value={v.batch_no || ""} onChange={(val) => updateTableData('vaccinations', i, 'batch_no', val)} placeholder="Batch No" className="font-mono font-semibold text-[#0E4664] text-center" />
                        </td>
                        <td className="p-3 border-l border-[#D9E2EC]/50 font-inter">
                          <InputField value={v.veterinarian_name || ""} onChange={(val) => updateTableData('vaccinations', i, 'veterinarian_name', val)} placeholder="Vet Name" className="font-semibold text-[#0E4664]" />
                        </td>
                        <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-middle text-center relative">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <CheckboxField checked={v.is_vod_verified} onChange={(val) => updateTableData('vaccinations', i, 'is_vod_verified', val)} />
                            {v.is_vod_verified && (
                              <VerifiedStamp id={`vax-${i}`} />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {(!vaccinations || vaccinations.length === 0) && (
                      <tr className="bg-[#FAFBFC]"><td colSpan={6} className="p-4 text-center text-xs text-slate-400 font-medium italic">No vaccination records found. Click "Add Row" to create one.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <Footer />
        </Page>

        {/* PAGE 3: Deworming */}
        <Page isGenerating={isGenerating}>
          <Header title="MEDICAL HISTORY" subtitle="DEWORMING RECORDS" />
          <div className="flex-1 pt-8 w-full max-w-3xl mx-auto">
             <div className="w-full">
              <div className="flex justify-between items-center mb-2.5">
                <h3 className="text-xs font-bold text-[#0E4664] font-montserrat uppercase tracking-wider">Deworming Records</h3>
                <button onClick={() => addRow('deworming_records', { date: new Date().toISOString().split('T')[0], dewormer: '', veterinarian_name: '', is_vod_verified: true })} className="print:hidden flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-mid bg-primary/10 px-3 py-1 rounded-lg">
                  <Plus size={14} /> Add Row
                </button>
              </div>
              <div className="overflow-x-auto border border-[#D9E2EC] rounded-xl shadow-sm bg-white w-full max-w-full">
                <table className="w-full text-left border-collapse text-xs min-w-[600px]">
                  <thead>
                    <tr className="bg-[#0E4664] text-white">
                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[25%]">Date</th>
                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[35%] border-l border-white/10">Dewormer</th>
                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[25%] border-l border-white/10">Veterinarian</th>
                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[15%] text-center border-l border-white/10">Verified</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(deworming_records || []).map((v: any, i: number) => (
                      <tr key={i} className="border-b border-[#D9E2EC] last:border-0 hover:bg-[#FAFBFC] transition-colors h-16 group">
                        <td className="p-3 font-inter align-top relative">
                          <DateField value={v.date || ""} onChange={(val) => updateTableData('deworming_records', i, 'date', val)} placeholder="YYYY-MM-DD" className="font-semibold text-[#0E4664]" />
                          <div className="absolute left-2 top-[1px] -translate-y-full opacity-0 group-hover:opacity-100 bg-white shadow-md border border-slate-200 px-1 py-1 rounded-lg z-10 print:hidden transition-opacity duration-200">
                            <ActionButtons onUp={() => moveRow('deworming_records', i, 'up')} onDown={() => moveRow('deworming_records', i, 'down')} onDelete={() => deleteRow('deworming_records', i)} />
                          </div>
                        </td>
                        <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-top">
                          <TextAreaField value={v.dewormer || ""} onChange={(val) => updateTableData('deworming_records', i, 'dewormer', val)} placeholder="Dewormer Medicine" className="font-semibold text-[#0E4664] leading-tight" />
                        </td>
                        <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-top">
                          <InputField value={v.veterinarian_name || ""} onChange={(val) => updateTableData('deworming_records', i, 'veterinarian_name', val)} placeholder="Vet Name" className="font-semibold text-[#0E4664]" />
                        </td>
                        <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-middle text-center relative">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <CheckboxField checked={v.is_vod_verified} onChange={(val) => updateTableData('deworming_records', i, 'is_vod_verified', val)} />
                            {v.is_vod_verified && <VerifiedStamp id={`deworm-${i}`} />}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {(!deworming_records || deworming_records.length === 0) && (
                      <tr className="bg-[#FAFBFC]"><td colSpan={4} className="p-4 text-center text-xs text-slate-400 font-medium italic">No deworming records found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <Footer />
        </Page>

        {/* PAGE 4: Checkups & Tick/Flea & Surgeries */}
        <Page isGenerating={isGenerating}>
          <Header title="MEDICAL HISTORY" subtitle="GENERAL HEALTH & TREATMENTS" />
          <div className="flex-1 pt-8 w-full max-w-3xl mx-auto space-y-8">
            
            {/* Health Checkups */}
            <div className="w-full">
              <div className="flex justify-between items-center mb-2.5">
                <h3 className="text-xs font-bold text-[#0E4664] font-montserrat uppercase tracking-wider">Health Checkups</h3>
                <button onClick={() => addRow('health_checkups', { date: new Date().toISOString().split('T')[0], body_weight: '', tpr: '', general_body_condition: '', prescription: '', veterinarian_name: '', is_vod_verified: true })} className="print:hidden flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-mid bg-primary/10 px-3 py-1 rounded-lg">
                  <Plus size={14} /> Add Row
                </button>
              </div>
              <div className="overflow-x-auto border border-[#D9E2EC] rounded-xl shadow-sm bg-white w-full max-w-full">
                <table className="w-full text-left border-collapse text-xs min-w-[600px]">
                  <thead>
                    <tr className="bg-[#0E4664] text-white">
                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[20%]">Date</th>
                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[40%] border-l border-white/10">Diagnosis / Findings</th>
                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[20%] border-l border-white/10">Prescription</th>
                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[15%] border-l border-white/10">Vet</th>
                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[15%] text-center border-l border-white/10">Verified</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(health_checkups || []).map((v: any, i: number) => (
                      <tr key={i} className="border-b border-[#D9E2EC] last:border-0 hover:bg-[#FAFBFC] transition-colors h-16 group">
                        <td className="p-3 font-inter align-top relative">
                          <DateField value={v.date || ""} onChange={(val) => updateTableData('health_checkups', i, 'date', val)} placeholder="YYYY-MM-DD" className="font-semibold text-[#0E4664]" />
                          <div className="absolute left-2 top-[1px] -translate-y-full opacity-0 group-hover:opacity-100 bg-white shadow-md border border-slate-200 px-1 py-1 rounded-lg z-10 print:hidden transition-opacity duration-200">
                            <ActionButtons onUp={() => moveRow('health_checkups', i, 'up')} onDown={() => moveRow('health_checkups', i, 'down')} onDelete={() => deleteRow('health_checkups', i)} />
                          </div>
                        </td>
                        <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-top space-y-1">
                           <TextAreaField value={v.general_body_condition || ""} onChange={(val) => updateTableData('health_checkups', i, 'general_body_condition', val)} placeholder="General Body Condition" className="font-bold text-[#0E4664] leading-tight" />
                           <div className="flex gap-2">
                             <span className="text-[11px] text-slate-500 font-medium">Weight:</span>
                             <InputField value={v.body_weight || ""} onChange={(val) => updateTableData('health_checkups', i, 'body_weight', val)} placeholder="kg" className="text-[11px] font-semibold text-slate-700 w-16" />
                             <span className="text-[11px] text-slate-500 font-medium ml-2">TPR:</span>
                             <InputField value={v.tpr || ""} onChange={(val) => updateTableData('health_checkups', i, 'tpr', val)} placeholder="TPR" className="text-[11px] font-semibold text-slate-700 w-20" />
                           </div>
                        </td>
                        <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-top">
                          <TextAreaField 
                            value={v.prescription || ""} 
                            onChange={(val) => updateTableData('health_checkups', i, 'prescription', val)} 
                            placeholder="Prescription..." 
                            className="text-sm font-semibold text-[#0E4664] leading-tight"
                          />
                        </td>
                        <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-top">
                          <InputField value={v.veterinarian_name || ""} onChange={(val) => updateTableData('health_checkups', i, 'veterinarian_name', val)} placeholder="Vet Name" className="font-semibold text-[#0E4664]" />
                        </td>
                        <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-middle text-center relative">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <CheckboxField checked={v.is_vod_verified} onChange={(val) => updateTableData('health_checkups', i, 'is_vod_verified', val)} />
                            {v.is_vod_verified && <VerifiedStamp id={`health-${i}`} />}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {(!health_checkups || health_checkups.length === 0) && (
                      <tr className="bg-[#FAFBFC]"><td colSpan={5} className="p-4 text-center text-xs text-slate-400 font-medium italic">No health records found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tick & Flea */}
            <div className="w-full">
              <div className="flex justify-between items-center mb-2.5">
                <h3 className="text-xs font-bold text-[#0E4664] font-montserrat uppercase tracking-wider">Tick & Flea Treatments</h3>
                <button onClick={() => addRow('tick_flea_treatments', { date: new Date().toISOString().split('T')[0], medicine: '', veterinarian_name: '', is_vod_verified: true })} className="print:hidden flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-mid bg-primary/10 px-3 py-1 rounded-lg">
                  <Plus size={14} /> Add Row
                </button>
              </div>
              <div className="overflow-x-auto border border-[#D9E2EC] rounded-xl shadow-sm bg-white w-full max-w-full">
                <table className="w-full text-left border-collapse text-xs min-w-[600px]">
                  <thead>
                    <tr className="bg-[#0E4664] text-white">
                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[25%]">Date</th>
                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[40%] border-l border-white/10">Medicine Used</th>
                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[20%] border-l border-white/10">Veterinarian</th>
                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[15%] text-center border-l border-white/10">Verified</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(tick_flea_treatments || []).map((v: any, i: number) => (
                      <tr key={i} className="border-b border-[#D9E2EC] last:border-0 hover:bg-[#FAFBFC] transition-colors h-16 group">
                        <td className="p-3 font-inter align-top relative">
                          <DateField value={v.date || ""} onChange={(val) => updateTableData('tick_flea_treatments', i, 'date', val)} placeholder="YYYY-MM-DD" className="font-semibold text-[#0E4664]" />
                          <div className="absolute left-2 top-[1px] -translate-y-full opacity-0 group-hover:opacity-100 bg-white shadow-md border border-slate-200 px-1 py-1 rounded-lg z-10 print:hidden transition-opacity duration-200">
                            <ActionButtons onUp={() => moveRow('tick_flea_treatments', i, 'up')} onDown={() => moveRow('tick_flea_treatments', i, 'down')} onDelete={() => deleteRow('tick_flea_treatments', i)} />
                          </div>
                        </td>
                        <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-top">
                          <TextAreaField value={v.medicine || ""} onChange={(val) => updateTableData('tick_flea_treatments', i, 'medicine', val)} placeholder="Medicine" className="font-semibold text-[#0E4664] leading-tight" />
                        </td>
                        <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-top">
                          <InputField value={v.veterinarian_name || ""} onChange={(val) => updateTableData('tick_flea_treatments', i, 'veterinarian_name', val)} placeholder="Vet Name" className="font-semibold text-[#0E4664]" />
                        </td>
                        <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-middle text-center relative">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <CheckboxField checked={v.is_vod_verified} onChange={(val) => updateTableData('tick_flea_treatments', i, 'is_vod_verified', val)} />
                            {v.is_vod_verified && <VerifiedStamp id={`tick-${i}`} />}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {(!tick_flea_treatments || tick_flea_treatments.length === 0) && (
                      <tr className="bg-[#FAFBFC]"><td colSpan={4} className="p-4 text-center text-xs text-slate-400 font-medium italic">No treatment records found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Surgeries */}
            <div className="w-full">
              <div className="flex justify-between items-center mb-2.5">
                <h3 className="text-xs font-bold text-[#0E4664] font-montserrat uppercase tracking-wider">Surgical Records</h3>
                <button onClick={() => addRow('surgeries', { date: new Date().toISOString().split('T')[0], surgery_details: '', veterinarian_name: '', is_vod_verified: true })} className="print:hidden flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-mid bg-primary/10 px-3 py-1 rounded-lg">
                  <Plus size={14} /> Add Row
                </button>
              </div>
              <div className="overflow-x-auto border border-[#D9E2EC] rounded-xl shadow-sm bg-white w-full max-w-full">
                <table className="w-full text-left border-collapse text-xs min-w-[600px]">
                  <thead>
                    <tr className="bg-[#0E4664] text-white">
                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[25%]">Date</th>
                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[40%] border-l border-white/10">Details</th>
                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[20%] border-l border-white/10">Veterinarian</th>
                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[15%] text-center border-l border-white/10">Verified</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(surgeries || []).map((v: any, i: number) => (
                      <tr key={i} className="border-b border-[#D9E2EC] last:border-0 hover:bg-[#FAFBFC] transition-colors h-16 group">
                        <td className="p-3 font-inter align-top relative">
                          <DateField value={v.date || ""} onChange={(val) => updateTableData('surgeries', i, 'date', val)} placeholder="YYYY-MM-DD" className="font-semibold text-[#0E4664]" />
                          <div className="absolute left-2 top-[1px] -translate-y-full opacity-0 group-hover:opacity-100 bg-white shadow-md border border-slate-200 px-1 py-1 rounded-lg z-10 print:hidden transition-opacity duration-200">
                            <ActionButtons onUp={() => moveRow('surgeries', i, 'up')} onDown={() => moveRow('surgeries', i, 'down')} onDelete={() => deleteRow('surgeries', i)} />
                          </div>
                        </td>
                        <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-top">
                          <TextAreaField value={v.surgery_details || ""} onChange={(val) => updateTableData('surgeries', i, 'surgery_details', val)} placeholder="Surgery details" className="font-semibold text-[#0E4664] leading-tight" />
                        </td>
                        <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-top">
                          <InputField value={v.veterinarian_name || ""} onChange={(val) => updateTableData('surgeries', i, 'veterinarian_name', val)} placeholder="Vet Name" className="font-semibold text-[#0E4664]" />
                        </td>
                        <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-middle text-center relative">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <CheckboxField checked={v.is_vod_verified} onChange={(val) => updateTableData('surgeries', i, 'is_vod_verified', val)} />
                            {v.is_vod_verified && <VerifiedStamp id={`surgery-${i}`} />}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {(!surgeries || surgeries.length === 0) && (
                      <tr className="bg-[#FAFBFC]"><td colSpan={4} className="p-4 text-center text-xs text-slate-400 font-medium italic">No surgical records found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
          <Footer />
        </Page>
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

        .date-no-icon::-webkit-calendar-picker-indicator {
          display: none;
          -webkit-appearance: none;
        }
      `}} />
    </div>
  );
}

// Sub-components
const InputField = ({ value, onChange, placeholder = "", className = "" }: { value: string, onChange: (v: string) => void, placeholder?: string, className?: string }) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={1}
      className={`bg-transparent border border-transparent hover:border-gray-300 focus:border-primary focus:bg-white px-1 -mx-1 rounded outline-none transition-all w-full text-inherit font-inherit print:border-none print:bg-transparent resize-none overflow-hidden block min-h-[24px] ${className}`}
    />
  );
};

const DateField = ({ value, onChange, placeholder = "", className = "" }: { value: string, onChange: (v: string) => void, placeholder?: string, className?: string }) => (
  <div className="flex items-center gap-1.5 w-full">
    <div className="relative shrink-0 flex items-center justify-center w-4 h-4 mt-0.5 print:hidden">
      <Calendar size={14} className="text-[#0E4664] opacity-40 hover:opacity-100 transition-opacity" />
      <input
        type="date"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
    <input
      type="date"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`date-no-icon bg-transparent border border-transparent hover:border-gray-300 focus:border-primary focus:bg-white px-1 -mx-1 rounded outline-none transition-all w-full text-inherit font-inherit print:border-none print:bg-transparent block min-h-[24px] ${className}`}
      style={{ colorScheme: 'light' }}
    />
  </div>
);

const TextAreaField = ({ value, onChange, placeholder = "", className = "" }: { value: string, onChange: (v: string) => void, placeholder?: string, className?: string }) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={1}
      className={`bg-transparent border border-transparent hover:border-gray-300 focus:border-primary focus:bg-white px-1 -mx-1 rounded outline-none transition-all w-full text-inherit font-inherit print:border-none print:bg-transparent resize-none overflow-hidden block min-h-[24px] ${className}`}
    />
  );
};

const CheckboxField = ({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) => (
  <input
    type="checkbox"
    checked={!!checked}
    onChange={(e) => onChange(e.target.checked)}
    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary print:hidden"
  />
);

const Page = ({ children, isGenerating, isFirstPage }: { children: React.ReactNode, isGenerating?: boolean, isFirstPage?: boolean }) => (
  <div className={`${!isFirstPage ? 'page-break' : ''} pdf-page bg-white relative flex flex-col box-border mx-auto
    ${isGenerating ? 'w-[794px] h-[1123px] p-[20mm] border-none shadow-none m-0 overflow-hidden shrink-0' : 'w-full max-w-[210mm] min-h-[297mm] p-4 sm:p-8 md:p-[20mm] print:p-[20mm] print:w-[210mm] print:break-after-page shadow-[0_0_40px_rgba(0,0,0,0.06)] border border-[#D9E2EC] print:shadow-none print:border-none overflow-hidden sm:overflow-visible'}
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

const InfoItem = ({ label, value, onChange, isEven, isDate }: { label: string; value: string; onChange: (v: string) => void; isEven: boolean; isDate?: boolean }) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (textareaRef.current && !isDate) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [value, isDate]);

  return (
    <div className={`flex justify-between items-center p-3 rounded-lg ${isEven ? 'bg-[#FAFBFC]' : 'bg-white'} border-b border-[#D9E2EC]/30`}>
      <span className="text-xs font-medium text-slate-500 font-inter w-1/3">{label}</span>
      <div className="w-2/3 flex justify-end">
        {isDate ? (
          <div className="flex items-center justify-end gap-1.5 w-full">
            <div className="relative shrink-0 flex items-center justify-center w-4 h-4 print:hidden">
              <Calendar size={14} className="text-[#0E4664] opacity-40 hover:opacity-100 transition-opacity" />
              <input
                type="date"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <input
              type="date"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              className="date-no-icon bg-transparent border border-transparent hover:border-gray-300 focus:border-primary focus:bg-white px-2 py-0.5 rounded outline-none transition-all text-sm font-semibold text-[#0E4664] font-inter text-right print:border-none print:bg-transparent block min-h-[24px]"
              style={{ colorScheme: 'light' }}
            />
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={label}
            rows={1}
            className="bg-transparent border border-transparent hover:border-gray-300 focus:border-primary focus:bg-white px-2 py-0.5 rounded outline-none transition-all text-sm font-semibold text-[#0E4664] font-inter text-right w-full print:border-none print:bg-transparent resize-none overflow-hidden block min-h-[24px]"
          />
        )}
      </div>
    </div>
  );
};

const ActionButtons = ({ onUp, onDown, onDelete }: { onUp: () => void, onDown: () => void, onDelete: () => void }) => (
  <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
    <button onClick={onUp} className="p-1 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-colors" title="Move Up"><ArrowUp size={14} /></button>
    <button onClick={onDown} className="p-1 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-colors" title="Move Down"><ArrowDown size={14} /></button>
    <button onClick={onDelete} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title="Delete Row"><Trash2 size={14} /></button>
  </div>
);
