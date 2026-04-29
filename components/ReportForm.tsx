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
  Camera,
  FileText,
  ArrowRight,
  AlertOctagon
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
        },
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
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-100">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* --- HEADER --- */}
        <header className="flex justify-between items-center border-b-2 border-slate-900 pb-8">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 uppercase italic">
              Field <span className="text-emerald-600 font-normal">Intelligence</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Green Blanket Reporting System</p>
          </div>
          <div className="p-3 bg-slate-900/90 backdrop-blur-md text-white rounded-2xl shadow-xl hidden sm:block">
            <Camera size={24} />
          </div>
        </header>

        {/* --- MAIN CARD (GLASS) --- */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden transition-all duration-500">
          
          {/* Status Message Strip */}
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
                        <User size={12} className="text-emerald-500" /> Reporter
                      </label>
                      <SmartField id="nameInput" label="Name" value={name} onChange={setName} placeholder_text="Enter name..." error={nameError === "*" ? null : nameError} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                        <Mail size={12} className="text-emerald-500" /> Endpoint
                      </label>
                      <SmartField id="mailInput" label="Email" type="email" value={email} onChange={setEmail} placeholder_text="Enter email..." error={mailError === "*" ? null : mailError} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                        <MapPin size={12} className="text-emerald-500" /> Observation Node
                      </label>
                      <SmartField id="locationInput" label="Location" category="select" value={location} onChange={setLocation} error={locationError === "*" ? null : locationError} options={
                        <>
                          <option value="">-- Select location --</option>
                          {Object.values(ReportLocations).map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                        </>
                      } />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                        <AlertCircle size={12} className="text-emerald-500" /> Hazard Class
                      </label>
                      <SmartField id="reportingCategory" label="Category" category="select" value={reportType} onChange={setReportType} error={reportTypeError === "*" ? null : reportTypeError} options={
                        <>
                          <option value="">-- Select violation --</option>
                          {Object.values(ReportSubject).map((subj) => <option key={subj} value={subj}>{subj}</option>)}
                        </>
                      } />
                    </div>
                  </div>

                  {reportType === ReportSubject.other && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Specify Details</label>
                      <SmartField id="extraInfo" label="Other" value={otherCategory} onChange={setOtherCategory} placeholder_text="Identify report subject..." error={null} />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                      <FileText size={12} className="text-emerald-500" /> Observation Intel
                    </label>
                    <textarea 
                      value={message} 
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-slate-50/50 backdrop-blur-sm border border-slate-200 rounded-2xl p-5 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all min-h-[140px] font-medium"
                      placeholder="Provide additional context or sensory details (optional)..."
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button type="submit" className="w-full bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-xs py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-xl hover:translate-y-[-2px] group">
                    Validate Report Details <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            ) : (
              /* --- REVIEW STATE (GLASS) --- */
              <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center space-y-2">
                  <div className="w-20 h-20 bg-emerald-50/80 backdrop-blur-md text-emerald-600 rounded-3xl flex items-center justify-center mx-auto border border-emerald-100 mb-4">
                    <ClipboardCheck size={36} />
                  </div>
                  <h2 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900">Report Review</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting final confirmation</p>
                </div>

                <div className="bg-slate-50/50 backdrop-blur-md rounded-[2.5rem] border border-slate-200 p-10 space-y-5">
                  <ReviewRow label="Operator" value={name} />
                  <ReviewRow label="Contact" value={email} />
                  <ReviewRow label="Coordinates" value={location} />
                  <ReviewRow label="Detection" value={reportType === ReportSubject.other ? otherCategory : reportType} />
                  
                  <div className="pt-6 mt-2 border-t border-slate-200">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-3 tracking-[0.2em]">Contextual Notes</p>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-slate-100 italic">
                      "{message || "No contextual data provided."}"
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-5">
                  <button 
                    type="button" 
                    onClick={() => setIsReviewing(false)}
                    className="flex-1 border-2 border-slate-200 text-slate-400 font-black uppercase text-xs tracking-widest py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50/50 hover:text-slate-600 transition-all"
                  >
                    <ArrowLeft size={16} /> Re-Edit Intel
                  </button>
                  <button 
                    type="button"
                    onClick={handleReportSubmit}
                    disabled={isSubmitting}
                    className="flex-2 bg-emerald-600 text-white font-black uppercase text-xs tracking-widest py-5 px-10 rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  >
                    {isSubmitting ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
                    Execute Uplink
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
    </div>
  );
};

const ReviewRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center py-2.5 border-b border-slate-200/60 last:border-0">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{label}</span>
    <span className="text-sm font-black text-slate-900 italic tracking-tight uppercase">{value}</span>
  </div>
);

const LoadingState = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-transparent text-emerald-600">
    <RefreshCw className="animate-spin text-emerald-500 mb-8 w-[60px] h-[60px]" strokeWidth={2} />
    <p className="text-[11px] font-black uppercase tracking-[1em] animate-pulse text-slate-400">Initializing Green Blanket Interface</p>
  </div>
);

export default ReportForm;