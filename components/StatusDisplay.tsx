"use client";

import React, { useEffect, useState } from "react";
import { analysisService } from "@/services/analysisService";
import { 
  Waves, 
  ShieldCheck, 
  Wind, 
  ArrowRight,
  RefreshCw,
  Droplets,
  Sparkles,
  Wifi,
  WifiOff,
  CheckCircle2,
  Heart
} from "lucide-react";
import Link from "next/link";

const damGradeExplanations: Record<string, string> = {
  "1: Hazardous": "Toxic or completely choked by weeds. Unsafe for humans, animals, and boats.",
  "2: Critical": "Severe pollution and thick green coverage. Bad smells and highly unsafe for recreation.",
  "3: Very Poor": "Mostly covered in a thick green blanket. Very unhealthy for fish and aquatic life.",
  "4: Poor": "Heavy algae or weed growth. Boating is difficult and the water looks very murky.",
  "5: Fair": "Usable, but you will see noticeable patches of green surface weeds or debris.",
  "6: Average": "Standard condition. Some minor green patches, but mostly clear and functioning.",
  "7: Good": "Looking healthy. Mostly clear water, great for everyday recreation and boating.",
  "8: Very Good": "Great water quality. Clear, healthy ecosystem and almost completely weed-free.",
  "9: Excellent": "Sparkling and thriving. Fantastic, clean conditions for wildlife and visitors.",
  "10: Pristine": "Crystal clear and perfectly balanced. As healthy and beautiful as nature gets."
};

export const StatusDisplay: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [aiMessage, setAiMessage] = useState<string>("Hi! I'm just checking the sensors for you...");
  const [isSystemOnline, setIsSystemOnline] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSystemData = async () => {
      try {
        const telemetry = await analysisService.getOmniDashboard();
        const score = telemetry?.touristView?.waterHealthScore;
        
        if (typeof score !== "number") throw new Error("Offline");
        
        setData(telemetry);
        setIsSystemOnline(true);

        try {
          const aiResponse = await fetch("https://greenblanket.crabdance.com/api/Chatbot/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: `The water quality score is ${Math.round(score)} out of 100, which is ${telemetry.touristView.healthGrade}. 
                        Systems are running perfectly. Can you explain this to a visitor in a very friendly, 
                        easy-to-understand way? Please mention that our systems are currently online and 
                        keeping a close eye on everything.`
            })
          });
          
          const aiData = await aiResponse.json();
          setAiMessage(aiData.message || aiData.reply || "The water is looking good and our systems are fully online!");
        } catch (aiErr) {
          setAiMessage(`Hi! The water is scoring a ${Math.round(score)} today. Everything is working correctly, and we're keeping a close watch to keep you safe!`);
        }

      } catch (err) {
        console.error("Connection Error:", err);
        setIsSystemOnline(false);
        setError("Systems Offline");
        setAiMessage("Oh no! It looks like my connection to the dam is currently down. My systems are offline for a moment, but we're working hard to get the satellite link back up for you!");
      } finally {
        setIsLoading(false);
      }
    };

    loadSystemData();
  }, []);

  if (isLoading) return <LoadingHUD />;

  const view = data?.touristView;
  const score = data ? Math.round(view.waterHealthScore) : 0;
  const isSafe = score >= 70;
  const isDangerous = score < 40;
  const statusColor = isSafe ? "emerald" : isDangerous ? "rose" : "amber";

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 bg-transparent font-sans">
      
      {/* Background Glow */}
      {isSystemOnline && (
        <div className={`absolute inset-0 blur-[100px] opacity-10 rounded-full transition-colors duration-1000 ${
          isSafe ? 'bg-emerald-500' : isDangerous ? 'bg-rose-500' : 'bg-amber-500'
        }`} />
      )}

      <div className="relative bg-white border border-slate-200 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl overflow-hidden transition-all duration-700">
        <div className="flex flex-col lg:flex-row">
          
          {/* Gauge Panel */}
          <div className={`w-full lg:w-1/3 p-8 md:p-12 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-100 ${
            !isSystemOnline ? 'bg-slate-50' : isSafe ? 'bg-emerald-50/50' : isDangerous ? 'bg-rose-50/50' : 'bg-amber-50/50'
          }`}>
            <div className="relative">
              <div className={`w-44 h-44 md:w-56 md:h-56 rounded-full border-[12px] bg-white flex items-center justify-center shadow-inner ${!isSystemOnline ? 'border-slate-200 opacity-50' : ''}`}>
                <div className="text-center">
                  <span className="block text-6xl md:text-7xl font-black italic tracking-tighter text-slate-900 leading-none">
                    {isSystemOnline ? score : "--"}
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 block">Dam Health</span>
                </div>
              </div>
              
              <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full border shadow-lg flex items-center gap-2 font-black text-[9px] uppercase tracking-widest whitespace-nowrap ${
                isSystemOnline ? 'bg-white border-emerald-100 text-emerald-600' : 'bg-white border-rose-100 text-rose-600'
              }`}>
                {isSystemOnline ? <Wifi size={12} className="animate-pulse" /> : <WifiOff size={12} />}
                {isSystemOnline ? "Systems Online" : "Systems Offline"}
              </div>
            </div>
            
            {isSystemOnline && (
              <div className="mt-10 flex flex-col items-center text-center">
                <p className={`text-sm font-black uppercase italic tracking-widest text-${statusColor}-600`}>
                  {view.healthGrade}
                </p>
                {view.healthGrade && damGradeExplanations[view.healthGrade] && (
                  <p className="mt-3 text-xs text-slate-500 font-medium max-w-[220px] leading-relaxed">
                    {damGradeExplanations[view.healthGrade]}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Information Panel */}
          <div className="w-full lg:w-2/3 p-8 md:p-12 space-y-8 bg-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">
                  Harties <span className="text-emerald-600 font-normal underline decoration-slate-100 underline-offset-8">Guide</span>
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Live Assistant Dashboard</p>
              </div>
            </div>

            {/* AI Assistant Chatbox */}
            <div className="relative group">
              <div className={`absolute -top-3 -left-2 p-2 rounded-lg shadow-lg z-10 text-white ${isSystemOnline ? 'bg-emerald-600' : 'bg-slate-500'}`}>
                <Sparkles size={16} />
              </div>
              <div className="bg-slate-900 text-white p-6 md:p-10 rounded-[2rem] shadow-xl relative overflow-hidden">
                <p className="text-sm md:text-lg font-medium leading-relaxed italic opacity-95 relative z-10">
                  "{aiMessage}"
                </p>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <Heart size={12} className="text-rose-400 fill-rose-400" />
                     <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400">Green Blanket Chatbot</span>
                  </div>
                  {isSystemOnline && <CheckCircle2 size={14} className="text-emerald-500" />}
                </div>
              </div>
            </div>

            {/* Telemetry Statistics */}
            {isSystemOnline && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <StatusBadge icon={ShieldCheck} label="Swimming" status={view.swimSafety} color={isSafe ? 'emerald' : 'rose'} />
                <StatusBadge icon={Wind} label="Odor Level" status={view.odorLevel} color="slate" />
                <StatusBadge icon={Droplets} label="Health Risk" status={view.skinIrritationRisk} color="slate" />
              </div>
            )}

            {/* Navigation Controls */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link href="/analytics" className="flex-1 bg-slate-900 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl hover:bg-emerald-600 transition-all shadow-xl flex items-center justify-center gap-3 group">
                Enter Analytics Center
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              {!isSystemOnline && (
                 <button onClick={() => window.location.reload()} className="px-10 py-5 border-2 border-slate-200 text-slate-400 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-slate-50 transition-colors">
                   Try Reconnecting
                 </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

{/* Sub-Components */}

const StatusBadge = ({ icon: Icon, label, status, color }: any) => (
  <div className="flex items-center gap-3 md:gap-4 bg-slate-50 px-5 py-4 rounded-2xl border border-slate-100 shadow-sm">
    <Icon size={20} className="text-slate-400 shrink-0" />
    <div className="min-w-0">
      <p className="text-[9px] font-black uppercase text-slate-400 leading-none mb-1.5">{label}</p>
      <p className={`text-[11px] md:text-xs font-black uppercase tracking-tight truncate ${color === 'emerald' ? 'text-emerald-600' : color === 'rose' ? 'text-rose-600' : 'text-slate-900'}`}>{status}</p>
    </div>
  </div>
);

const LoadingHUD = () => (
  <div className="w-full h-80 flex flex-col items-center justify-center bg-white/50 backdrop-blur-md rounded-[3rem] border border-slate-200 shadow-inner">
    <RefreshCw className="animate-spin text-emerald-500 mb-4" size={40} />
    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 animate-pulse text-center px-6">Initializing Intelligence Link...</p>
  </div>
);

const ErrorHUD = ({ message }: { message: string }) => (
  <div className="w-full p-8 md:p-12 bg-white border border-rose-100 rounded-[3rem] text-center space-y-6 shadow-2xl">
    <WifiOff size={48} className="text-rose-500 mx-auto" />
    <p className="text-sm md:text-lg font-medium text-slate-600 italic leading-relaxed max-w-md mx-auto">"{message}"</p>
    <button onClick={() => window.location.reload()} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-rose-600 transition-colors shadow-xl">
      Manual Override Link
    </button>
  </div>
);