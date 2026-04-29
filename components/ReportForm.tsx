"use client";

import React, { useState } from "react";
import { ReportLocations, ReportSubject, StatusMessage } from "@/types";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SmartField from "./SmartField";
import { 
  ClipboardCheck, 
  MapPin, 
  User, 
  Mail, 
  AlertCircle, 
  Send, 
  ArrowLeft, 
  CheckCircle2, 
  RefreshCw,
  FileText,
  ArrowRight,
  AlertOctagon,
  Map as MapIcon,
  X
} from 'lucide-react';

const ReportForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reportType, setReportType] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const routing = useRouter();

  const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
  const [nameError, setNameError] = useState<string | null>("*");
  const [mailError, setMailError] = useState<string | null>("*");
  const [locationError, setLocationError] = useState<string | null>("*");
  const [reportTypeError, setReportTypeError] = useState<string | null>("*");
  
  const requireMsg: string = " is required";

  const formValidator = (): boolean => {
    setNameError("*");
    setLocationError("*");
    setMailError("*");
    setReportTypeError("*");
    setStatusMessages([]);

    let isValid = true;
    if (!name || name.trim() === "") { setNameError(requireMsg); isValid = false; }
    const hasValidSymbols: boolean = email.includes("@") && email.includes(".");
    if (!hasValidSymbols && email.trim() !== "") { setMailError("Invalid email format"); isValid = false; }
    if (!email || email.trim() === "") { setMailError(requireMsg); isValid = false; }
    if (!location || location.trim() === "") { setLocationError(requireMsg); isValid = false; }
    if (reportType.trim() === "" && otherCategory.trim() === "") { setReportTypeError(requireMsg); isValid = false; }
    return isValid;
  };

  const reportOptionsIdMap: Record<string, number> = {
    [ReportSubject.pollution]: 1,
    [ReportSubject.quality]: 2,
    [ReportSubject.bloom]: 3,
    [ReportSubject.other]: 4,
  };

  const buildMessage = (): string => {
    if (reportType === ReportSubject.other) {
      const parts = [];
      if (otherCategory.trim()) parts.push(`Category: ${otherCategory}`);
      if (message.trim()) parts.push(`Info: ${message}`);
      return parts.join(" | ") || "No details provided.";
    }
    return message.trim() || "No additional information was provided.";
  };

  const handleReportSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!formValidator()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await fetch(
        "https://greenblanket.crabdance.com/n8n/webhook/90764466-79fd-474b-8c5c-1a3dbca8a1df",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: reportType,
            name: name,
            email: email,
            location: location,
            message: buildMessage(),
            timestamp: new Date().toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" }),
          }),
        }
      );

      await fetch("https://greenbed.crabdance.com/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportOptionsId: reportOptionsIdMap[reportType] ?? 4,
          name: name,
          email: email,
          message: buildMessage(),
          location: location,
        }),
      });

      setStatusMessages([{ message: "Report successfully filed. Redirecting...", type: "success" }]);
      setTimeout(() => routing.push("/"), 3000);
    } catch (error) {
      setIsSubmitting(false);
      setStatusMessages([{ message: (error as Error).message, type: "error" }]);
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-100 relative">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <header className="flex justify-between items-center border-b-2 border-slate-900 pb-8 gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 uppercase italic">
              Green <span className="text-emerald-600 font-normal">Reporting</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Community Dam Watch</p>
          </div>
        </header>

        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden transition-all duration-500">
          
          {statusMessages.length > 0 && (
            <div className={`p-6 flex items-center gap-4 border-b ${statusMessages[0].type === 'success' ? 'bg-emerald-50/80 text-emerald-800' : 'bg-rose-50/80 text-rose-800'}`}>
              {statusMessages[0].type === 'success' ? <CheckCircle2 size={24} /> : <AlertOctagon size={24} />}
              <p className="text-sm font-black uppercase tracking-tight">{statusMessages[0].message}</p>
            </div>
          )}

          <div className="p-8 md:p-12">
            {!isReviewing ? (
              <form onSubmit={(e) => { e.preventDefault(); if(formValidator()) setIsReviewing(true); }} className="space-y-8">
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                        <User size={12} className="text-emerald-500" /> Who is reporting?
                      </label>
                      <SmartField id="nameInput" label="Full Name" value={name} onChange={setName} placeholder_text="e.g. Jane Doe" error={nameError === "*" ? null : nameError} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                        <Mail size={12} className="text-emerald-500" /> Where can we reach you?
                      </label>
                      <SmartField id="mailInput" label="Email Address" type="email" value={email} onChange={setEmail} placeholder_text="e.g. jane@example.com" error={mailError === "*" ? null : mailError} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-between px-1">
                        <span className="flex items-center gap-2">
                          <MapPin size={12} className="text-emerald-500" /> Where did you see this?
                        </span>
                        <button 
                          type="button" 
                          onClick={() => setShowMapModal(true)}
                          className="flex items-center gap-1 text-emerald-600 hover:text-emerald-500 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-md transition-colors shadow-sm border border-emerald-100"
                        >
                          <MapIcon size={10} /> <span className="tracking-widest">Open Map</span>
                        </button>
                      </label>

                      <SmartField id="locationInput" label="Location" category="select" value={location} onChange={setLocation} error={locationError === "*" ? null : locationError} options={
                        <>
                          <option value="">-- Choose a location --</option>
                          {Object.values(ReportLocations).map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                        </>
                      } />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                        <AlertCircle size={12} className="text-emerald-500" /> What is the issue?
                      </label>
                      <SmartField id="reportingCategory" label="Issue Type" category="select" value={reportType} onChange={setReportType} error={reportTypeError === "*" ? null : reportTypeError} options={
                        <>
                          <option value="">-- Select an issue --</option>
                          {Object.values(ReportSubject).map((subj) => <option key={subj} value={subj}>{subj}</option>)}
                        </>
                      } />
                    </div>
                  </div>

                  {reportType === ReportSubject.other && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">What kind of issue?</label>
                      <SmartField id="extraInfo" label="Other Category" value={otherCategory} onChange={setOtherCategory} placeholder_text="Briefly name the issue..." error={null} />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                      <FileText size={12} className="text-emerald-500" /> Extra Details
                    </label>
                    <textarea 
                      value={message} 
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-slate-50/50 backdrop-blur-sm border border-slate-200 rounded-2xl p-5 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all min-h-[140px] font-medium"
                      placeholder="Tell us a little more about what you saw (optional)..."
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button type="submit" className="w-full bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-xs py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-xl hover:translate-y-[-2px] group">
                    Review Your Report <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center space-y-2">
                  <div className="w-20 h-20 bg-emerald-50/80 backdrop-blur-md text-emerald-600 rounded-3xl flex items-center justify-center mx-auto border border-emerald-100 mb-4">
                    <ClipboardCheck size={36} />
                  </div>
                  <h2 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900">Review Your Report</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Just make sure everything looks correct</p>
                </div>

                <div className="bg-slate-50/50 backdrop-blur-md rounded-[2.5rem] border border-slate-200 p-10 space-y-5">
                  <ReviewRow label="Name" value={name} />
                  <ReviewRow label="Email" value={email} />
                  <ReviewRow label="Location" value={location.split(': ')[1] || location} />
                  <ReviewRow label="Issue Type" value={reportType === ReportSubject.other ? otherCategory : reportType} />
                  
                  <div className="pt-6 mt-2 border-t border-slate-200">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-3 tracking-[0.2em]">Your Message</p>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-slate-100 italic">
                      "{message || "No additional details provided."}"
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-5">
                  <button 
                    type="button" 
                    onClick={() => setIsReviewing(false)}
                    className="flex-1 border-2 border-slate-200 text-slate-400 font-black uppercase text-xs tracking-widest py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50/50 hover:text-slate-600 transition-all"
                  >
                    <ArrowLeft size={16} /> Go Back & Edit
                  </button>
                  <button 
                    type="button"
                    onClick={handleReportSubmit}
                    disabled={isSubmitting}
                    className="flex-2 bg-emerald-600 text-white font-black uppercase text-xs tracking-widest py-5 px-10 rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  >
                    {isSubmitting ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
                    Submit Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="text-center">
          <Link href="/" className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-emerald-600 transition-colors">
            &larr; Return to Home
          </Link>
        </footer>
      </div>

      {showMapModal && (
        <InteractiveMapModal 
          onClose={() => setShowMapModal(false)} 
          onSelectLocation={(selectedLoc: string) => {
            setLocation(selectedLoc);
            setShowMapModal(false);
          }} 
        />
      )}
    </div>
  );
};

const ReviewRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center py-2.5 border-b border-slate-200/60 last:border-0">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{label}</span>
    <span className="text-sm font-black text-slate-900 italic tracking-tight uppercase">{value}</span>
  </div>
);

// --- REBUILT HIGH-FIDELITY POLYGON MAP MODAL ---
const InteractiveMapModal = ({ onClose, onSelectLocation }: { onClose: () => void, onSelectLocation: (loc: string) => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="text-lg font-black uppercase italic tracking-tight text-slate-900">Select Dam Zone</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Tap a section on the map to auto-fill your report</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white rounded-full hover:bg-slate-200 transition-colors border border-slate-200 shadow-sm">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="p-6 bg-slate-100 relative overflow-x-auto custom-scrollbar flex justify-center items-center">
          
          <svg viewBox="0 0 1000 600" className="w-full min-w-[700px] h-auto drop-shadow-xl rounded-2xl bg-white border border-slate-200 p-4">
            {/* These 10 polygons fit together perfectly with no gaps.
              The stroke defines crisp, clean borders.
              The colors shift through slightly different hues of teals, blues, and emeralds.
            */}

            {/* Zone 1: Far West Inlet */}
            <g className="cursor-pointer group" onClick={() => onSelectLocation(Object.values(ReportLocations)[0] || "Zone 1: Far West")}>
              <polygon points="80,340 150,310 230,320 230,370 150,380" 
                       className="fill-[#0d9488] stroke-white stroke-[3px] stroke-linejoin-round group-hover:fill-[#14b8a6] transition-colors" />
              <text x="160" y="350" className="text-[12px] font-black uppercase fill-white pointer-events-none drop-shadow-md" textAnchor="middle">Zone 1</text>
            </g>

            {/* Zone 2: West Lake / Heron Cove */}
            <g className="cursor-pointer group" onClick={() => onSelectLocation(Object.values(ReportLocations)[1] || "Zone 2: West Lake")}>
              <polygon points="230,320 320,320 340,380 360,400 230,370" 
                       className="fill-[#14b8a6] stroke-white stroke-[3px] stroke-linejoin-round group-hover:fill-[#2dd4bf] transition-colors" />
              <text x="290" y="365" className="text-[12px] font-black uppercase fill-white pointer-events-none drop-shadow-md" textAnchor="middle">Zone 2</text>
            </g>

            {/* Zone 3: Kosmos / North West */}
            <g className="cursor-pointer group" onClick={() => onSelectLocation(Object.values(ReportLocations)[2] || "Zone 3: Kosmos")}>
              <polygon points="320,320 390,260 460,270 420,340 340,380" 
                       className="fill-[#2dd4bf] stroke-white stroke-[3px] stroke-linejoin-round group-hover:fill-[#5eead4] transition-colors" />
              <text x="390" y="315" className="text-[12px] font-black uppercase fill-white pointer-events-none drop-shadow-md" textAnchor="middle">Zone 3</text>
            </g>

            {/* Zone 4: Dam Wall (North Tip) */}
            <g className="cursor-pointer group" onClick={() => onSelectLocation(Object.values(ReportLocations)[3] || "Zone 4: Dam Wall")}>
              <polygon points="390,260 480,140 530,160 500,240 460,270" 
                       className="fill-[#0f766e] stroke-white stroke-[3px] stroke-linejoin-round group-hover:fill-[#115e59] transition-colors" />
              <text x="480" y="215" className="text-[12px] font-black uppercase fill-white pointer-events-none drop-shadow-md" textAnchor="middle">Zone 4</text>
            </g>

            {/* Zone 5: Schoemansville */}
            <g className="cursor-pointer group" onClick={() => onSelectLocation(Object.values(ReportLocations)[4] || "Zone 5: Schoemansville")}>
              <polygon points="500,240 530,160 660,180 720,240 640,290 560,270" 
                       className="fill-[#0e7490] stroke-white stroke-[3px] stroke-linejoin-round group-hover:fill-[#0891b2] transition-colors" />
              <text x="600" y="235" className="text-[12px] font-black uppercase fill-white pointer-events-none drop-shadow-md" textAnchor="middle">Zone 5</text>
            </g>

            {/* Zone 6: Main Basin */}
            <g className="cursor-pointer group" onClick={() => onSelectLocation(Object.values(ReportLocations)[5] || "Zone 6: Main Basin")}>
              <polygon points="460,270 500,240 560,270 640,290 680,360 580,400 480,410 420,340" 
                       className="fill-[#0891b2] stroke-white stroke-[3px] stroke-linejoin-round group-hover:fill-[#06b6d4] transition-colors" />
              <text x="540" y="325" className="text-[12px] font-black uppercase fill-white pointer-events-none drop-shadow-md" textAnchor="middle">Zone 6</text>
            </g>

            {/* Zone 7: Pecanwood */}
            <g className="cursor-pointer group" onClick={() => onSelectLocation(Object.values(ReportLocations)[6] || "Zone 7: Pecanwood")}>
              <polygon points="420,340 480,410 460,490 380,460 360,400 340,380" 
                       className="fill-[#06b6d4] stroke-white stroke-[3px] stroke-linejoin-round group-hover:fill-[#22d3ee] transition-colors" />
              <text x="420" y="425" className="text-[12px] font-black uppercase fill-white pointer-events-none drop-shadow-md" textAnchor="middle">Zone 7</text>
            </g>

            {/* Zone 8: Eagles Landing */}
            <g className="cursor-pointer group" onClick={() => onSelectLocation(Object.values(ReportLocations)[7] || "Zone 8: Eagles Landing")}>
              <polygon points="480,410 580,400 740,420 660,460 460,490" 
                       className="fill-[#22d3ee] stroke-white stroke-[3px] stroke-linejoin-round group-hover:fill-[#67e8f9] transition-colors" />
              <text x="580" y="450" className="text-[12px] font-black uppercase fill-white pointer-events-none drop-shadow-md" textAnchor="middle">Zone 8</text>
            </g>

            {/* Zone 9: Ifafi */}
            <g className="cursor-pointer group" onClick={() => onSelectLocation(Object.values(ReportLocations)[8] || "Zone 9: Ifafi")}>
              <polygon points="640,290 720,240 840,280 880,340 800,390 680,360" 
                       className="fill-[#059669] stroke-white stroke-[3px] stroke-linejoin-round group-hover:fill-[#10b981] transition-colors" />
              <text x="760" y="320" className="text-[12px] font-black uppercase fill-white pointer-events-none drop-shadow-md" textAnchor="middle">Zone 9</text>
            </g>

            {/* Zone 10: Crocodile River Inlet */}
            <g className="cursor-pointer group" onClick={() => onSelectLocation(Object.values(ReportLocations)[9] || "Zone 10: Crocodile River")}>
              <polygon points="680,360 800,390 880,340 920,480 960,540 880,560 820,480 740,420 580,400" 
                       className="fill-[#10b981] stroke-white stroke-[3px] stroke-linejoin-round group-hover:fill-[#34d399] transition-colors" />
              <text x="830" y="465" className="text-[12px] font-black uppercase fill-white pointer-events-none drop-shadow-md" textAnchor="middle">Zone 10</text>
            </g>

          </svg>

          <div className="absolute bottom-10 left-10 pointer-events-none opacity-50">
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">Cartographic Overlay System</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;