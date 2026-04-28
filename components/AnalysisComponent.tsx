"use client";

import React, { useEffect, useState, useMemo } from "react";
import { analysisService } from "@/services/analysisService";
import {
  Activity, ShieldCheck, Search, Droplets, RefreshCw,
  Microscope, LayoutGrid, Clock, Database, AlertTriangle,
  TrendingUp, Leaf, Tractor, HardHat, Scale, 
  ArrowRight, Coins, Calendar, Waves, 
  Thermometer, Wind, CheckCircle, XCircle,
  FileText, TrendingDown, Map as MapIcon, ActivitySquare,
  Home, Smartphone, AlertOctagon, Anchor, Camera, Fish,
  Sprout, Droplet, MapPin, Navigation, Download, Lock
} from 'lucide-react';
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';

export const AnalysisComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("tourist");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isOmniLoading, setIsOmniLoading] = useState(false);
  const [isAuditLoading, setIsAuditLoading] = useState(false);

  const [omniDateRange, setOmniDateRange] = useState({ start: "2026-02-01", end: "2026-04-30" });
  const [auditDateRange, setAuditDateRange] = useState({ start: "2026-02-01", end: "2026-04-30" });

  useEffect(() => {
    setIsMounted(true);
    const checkAuth = () => {
      const user = localStorage.getItem("loginName") || localStorage.getItem("token");
      if (user) setIsAuthenticated(true);
    };
    checkAuth();

    const fetchTelemetry = async () => {
      setIsLoading(true);
      try {
        const results = await Promise.all([
          analysisService.getOmniDashboard(),             
          analysisService.getForensicAttribution(),       
          analysisService.getRemediationProgress(),       
          analysisService.getBloomForecast(),             
          analysisService.getIrrigationSafety(),          
          analysisService.getInfrastructureRisk(),        
          analysisService.getHarvestValue(),              
          analysisService.getComplianceStatus(),          
          (analysisService as any).getMasterAudit(auditDateRange.start, auditDateRange.end), 
          analysisService.getHistoryRange(omniDateRange.start, omniDateRange.end),           
          analysisService.getChatbotSummary(),            
          analysisService.getHistoryRange(auditDateRange.start, auditDateRange.end)          
        ]);
        
        setData({
          omni: results[0], forensic: results[1], progress: results[2],
          bloom: results[3], irrigation: results[4], infra: results[5],
          eco: results[6], compliance: results[7], audit: results[8],
          history: results[9], chatbot: results[10], auditHistory: results[11] 
        });
      } catch (err) {
        console.error("Uplink Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTelemetry();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateOmniGraph = async () => {
    if (!data) return;
    setIsOmniLoading(true);
    try {
      const historyResult = await analysisService.getHistoryRange(omniDateRange.start, omniDateRange.end);
      setData((prev: any) => ({ ...prev, history: historyResult }));
    } catch (err) {
      console.error("Omni Graph Update Error:", err);
    } finally {
      setIsOmniLoading(false);
    }
  };

  const handleUpdateAudit = async () => {
    if (!data) return;
    setIsAuditLoading(true);
    try {
      const [historyResult, auditStatsResult] = await Promise.all([
        analysisService.getHistoryRange(auditDateRange.start, auditDateRange.end),
        (analysisService as any).getMasterAudit(auditDateRange.start, auditDateRange.end)
      ]);
      setData((prev: any) => ({ ...prev, auditHistory: historyResult, audit: auditStatsResult }));
    } catch (err) {
      console.error("Audit Update Error:", err);
    } finally {
      setIsAuditLoading(false);
    }
  };

  const omniChartData = useMemo(() => data?.history?.dataPoints || [], [data]);
  const auditTableData = useMemo(() => data?.auditHistory?.dataPoints || [], [data]);

  const TABS = [
    { id: "overview", label: "Overview", icon: LayoutGrid, isPublic: false },
    { id: "tourist", label: "Visitor Hub", icon: Camera, isPublic: true },
    { id: "resident", label: "Resident Hub", icon: Home, isPublic: false },
    { id: "science", label: "Bio-Profiling", icon: Microscope, isPublic: false },
    { id: "agri", label: "Agri-Safety", icon: Tractor, isPublic: false },
    { id: "audit", label: "Audit Logs", icon: Database, isPublic: false }
  ];

  if (isLoading || !data) return <LoadingState />;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 pb-20">
      <div className="max-w-[1650px] mx-auto p-4 md:p-6 lg:p-10 space-y-6 md:space-y-8">
        
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end border-b-2 border-slate-900 pb-6 md:pb-8 gap-4 md:gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
               <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 uppercase italic">
                Harties <span className="text-emerald-600 font-normal">Command Center</span>
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-3 md:gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <span className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">
                <Clock size={14} className="text-emerald-500" /> {new Date(data.omni?.timestamp).toLocaleString()}
              </span>
              <span className="flex items-center gap-2"><MapIcon size={14} /> Sector Alpha</span>
              {!isAuthenticated && (
                <span className="flex items-center gap-2 text-rose-500 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-md shadow-sm">
                  <Lock size={12} /> Unauthorized Access
                </span>
              )}
            </div>
          </div>

          <nav className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar w-full lg:w-auto snap-x">
            {TABS.map((tab) => {
              const isLocked = !isAuthenticated && !tab.isPublic;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-bold text-[11px] uppercase tracking-wider whitespace-nowrap snap-start ${
                    activeTab === tab.id 
                    ? "bg-slate-900 text-white shadow-lg translate-y-[-2px]" 
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <tab.icon size={14} /> {tab.label}
                  {isLocked && <Lock size={12} className="opacity-50 ml-1" />}
                </button>
              );
            })}
          </nav>
        </header>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 text-white p-4 md:px-8 rounded-2xl md:rounded-[2rem] shadow-xl gap-4 border-b-4 border-emerald-500">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-emerald-400">
            <RefreshCw size={14} className="animate-spin-slow shrink-0" />
            <span className="truncate">Pillar 11 Telemetry Pipeline: Active</span>
          </div>
          <div className="flex items-center gap-3 bg-slate-800 p-2.5 px-4 md:px-6 rounded-xl md:rounded-2xl border border-slate-700 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2">
              <Database size={14} className="text-emerald-400 shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">DB Engine Linked</span>
            </div>
          </div>
        </div>

        <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {activeTab === "tourist" && <TouristModule data={data} />}
          {!isAuthenticated && activeTab !== "tourist" && <LockedState />}
          {isAuthenticated && activeTab === "overview" && <OverviewModule data={data} />}
          {isAuthenticated && activeTab === "resident" && <ResidentModule data={data} />}
          {isAuthenticated && activeTab === "science" && (
            <ForensicsModule 
              data={data} chartData={omniChartData} dateRange={omniDateRange} 
              setDateRange={setOmniDateRange} isMounted={isMounted} 
              isGraphLoading={isOmniLoading} onUpdateGraph={handleUpdateOmniGraph}
            />
          )}
          {isAuthenticated && activeTab === "agri" && <AgriSafetyModule data={data} />}
          {isAuthenticated && activeTab === "audit" && (
            <AuditLogModule 
              data={data} tableData={auditTableData} dateRange={auditDateRange}
              setDateRange={setAuditDateRange} isAuditLoading={isAuditLoading}
              onUpdateAudit={handleUpdateAudit}
            />
          )}
        </main>
      </div>
    </div>
  );
};

// --- SECURITY COMPONENT ---
const LockedState = () => (
  <div className="bg-white border border-slate-200 rounded-[3rem] p-10 md:p-20 shadow-sm flex flex-col items-center justify-center text-center min-h-[500px]">
    <div className="w-24 h-24 bg-rose-50 rounded-3xl flex items-center justify-center mb-8 border border-rose-100">
      <Lock size={40} className="text-rose-500" />
    </div>
    <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter text-slate-900 mb-4">Secure Access Required</h2>
    <p className="text-sm md:text-base text-slate-500 max-w-lg leading-relaxed font-medium mb-10">
      This telemetry module contains sensitive infrastructure, forensic, and audit data restricted to authorized personnel. 
    </p>
    <a href="/login" className="bg-slate-900 text-white font-black uppercase tracking-widest text-xs px-8 py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-xl">
      Login to Dashboard
    </a>
  </div>
);

// --- TOOLTIP ---
const TelemetryTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const pt = payload[0].payload;
    const safeDate = new Date(`${label}T00:00:00`); 
    return (
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 p-4 md:p-5 rounded-2xl shadow-2xl min-w-[180px] md:min-w-[200px]">
        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3 border-b border-slate-700 pb-2">
          {safeDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
        </p>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold"><span className="text-slate-400">Nitrates:</span><span className="text-emerald-400">{pt.nitrates} mg/L</span></div>
          <div className="flex justify-between items-center text-xs font-bold"><span className="text-slate-400">Phosphates:</span><span className="text-blue-400">{pt.phosphates} mg/L</span></div>
          <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-slate-800"><span className="text-slate-500">pH Level:</span><span className="text-amber-400">{pt.ph}</span></div>
          <div className="flex justify-between items-center text-xs font-bold"><span className="text-slate-500">Conductivity:</span><span className="text-rose-400">{pt.ec} µS/cm</span></div>
        </div>
      </div>
    );
  }
  return null;
};

// --- OVERVIEW MODULE ---
const OverviewModule = ({ data }: any) => {
  const wqiScore = Math.round(data.chatbot?.summary?.waterHealthScore || 0);
  const getWqiColor = (score: number) => {
    if (score >= 70) return "#10b981"; 
    if (score >= 40) return "#f59e0b"; 
    return "#f43f5e"; 
  };
  const ringColor = getWqiColor(wqiScore);
  const ringOffset = 440 - (wqiScore / 100) * 440;
  const harvestValue = Number(data.eco?.marketValue?.estimatedHarvestValue || data.eco?.marketValueEstimate || data.eco?.marketValue || data.eco) || 0;

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        <div className="lg:col-span-4 bg-slate-900 border-b-4 border-emerald-500 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl flex flex-col h-full text-white relative overflow-hidden">
          <ActivitySquare className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none" size={240} />
          <h4 className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.3em] mb-6 md:mb-10 flex items-center gap-3">
            <ShieldCheck size={16} /> Ecosystem Health
          </h4>
          <div className="relative h-36 w-36 md:h-48 md:w-48 mx-auto mb-8 md:mb-10 shrink-0">
             <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="70" stroke="#334155" strokeWidth="10" fill="transparent" />
                <circle cx="80" cy="80" r="70" stroke={ringColor} strokeWidth="10" fill="transparent" strokeDasharray={440} strokeDashoffset={ringOffset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl md:text-6xl font-black italic tracking-tighter text-white drop-shadow-md">{wqiScore}</span>
                <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">WQI SCORE</span>
             </div>
          </div>
          <div className="text-center z-10 flex-grow flex flex-col justify-end">
            <p className="text-sm font-bold uppercase tracking-widest text-white">{data.chatbot?.summary?.healthGrade}</p>
            <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest">{data.omni?.scientificIntelligence?.trophicState}</p>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6 md:gap-8 h-full">
          <div className="bg-white border border-slate-200 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-sm flex flex-col h-full justify-center relative overflow-hidden">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-4 flex items-center gap-2">
              <Activity size={16} className="text-emerald-600" /> AI Executive Summary
            </h4>
            <p className="text-2xl md:text-3xl font-black italic tracking-tighter text-slate-900 leading-snug mb-8">
              {data.omni?.residentView?.recommendation || "Conditions are stable. No immediate action required."}
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <Search size={20} className={data.omni?.residentView?.sewageDetection.includes("Active") ? "text-rose-500" : "text-emerald-500"} />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Source: {data.omni?.residentView?.sewageDetection}</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <TrendingDown size={20} className="text-emerald-500" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Pollution Reduced by {data.progress?.pollutionReduction?.percentageReduced || "0"}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-emerald-600 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-between text-white h-full">
          <Coins className="absolute -right-10 -bottom-10 opacity-10 rotate-12 pointer-events-none" size={200} />
          <div className="relative z-10">
            <Leaf size={32} className="mb-8 text-emerald-100" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Harvest Value</p>
            <h4 className="text-5xl font-black italic tracking-tighter shrink-0">
              R{harvestValue > 1000000 ? `${(harvestValue/1000000).toFixed(1)}M` : harvestValue.toLocaleString()}
            </h4>
          </div>
          <div className="relative z-10 mt-8 pt-6 border-t border-emerald-500/50">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-1">Bloom Expansion</p>
            <p className="text-lg font-black italic">{data.omni?.residentView?.hyacinthGrowthForecast}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <ModernStatusCard icon={Waves} title="Swim Safety" value={data.chatbot?.summary?.swimSafetyStatus} unit="" status="Recreation" color={data.chatbot?.summary?.swimSafetyStatus.includes('Safe') ? 'emerald' : 'rose'} />
        <ModernStatusCard icon={Wind} title="Odor Profile" value={data.chatbot?.summary?.odorProfile} unit="" status="Air Quality" color={data.chatbot?.summary?.odorProfile.includes('Neutral') ? 'emerald' : 'amber'} />
        <ModernStatusCard icon={ShieldCheck} title="System Trust" value={data.audit?.databaseHealth?.completenessPercentage || "98.2%"} unit="Verified" status="Pillar 11" color="slate" />
        <ModernStatusCard icon={Database} title="Records Scanned" value={data.audit?.auditMetadata?.totalRecordsAnalyzed?.toLocaleString() || "Syncing"} unit="Rows" status="Data Engine" color="slate" />
      </div>
    </div>
  );
};

// --- VISITOR HUB ---
const TouristModule = ({ data }: any) => {
  const wqiScore = Math.round(data.chatbot?.summary?.waterHealthScore || 0);
  const swimSafety = data.chatbot?.summary?.swimSafetyStatus || "Unknown";
  const odor = data.chatbot?.summary?.odorProfile || "Neutral";
  const isSafe = wqiScore > 65;

  return (
    <div className="space-y-6 md:space-y-8">
      <SectionHeader title="Visitor & Recreation Hub" icon={MapPin} />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <ModernStatusCard icon={Waves} title="Swim Safety" value={swimSafety} unit="" status="Water Contact" color={swimSafety.includes('Safe') || swimSafety.includes('Ideal') ? 'emerald' : 'rose'} />
        <ModernStatusCard icon={Wind} title="Odor Profile" value={odor} unit="" status="Air Quality" color={odor.includes('Neutral') || odor.includes('Fresh') ? 'emerald' : 'amber'} />
        <ModernStatusCard icon={Activity} title="Skin Irritation" value={data.chatbot?.summary?.skinIrritationRisk} unit="" status="Exposure Risk" color={data.chatbot?.summary?.skinIrritationRisk.includes('None') ? 'emerald' : 'amber'} />
        <ModernStatusCard icon={Fish} title="Fish Kill Risk" value={data.omni?.touristView?.fishKillLikelihood} unit="" status="Ecological Alert" color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-sm flex flex-col justify-center">
          <h3 className="text-[10px] md:text-xs font-black uppercase text-slate-800 tracking-widest mb-6 border-b border-slate-100 pb-4">Activity Advisory</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-2xl ${isSafe ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}><Waves size={24} /></div>
              <div><h4 className="text-sm font-black uppercase text-slate-900 tracking-wider mb-1">Swimming & Water Sports</h4><p className="text-sm text-slate-500 font-medium">{data.chatbot?.aiGuidelines?.canISwim}</p></div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-blue-100 text-blue-600"><Navigation size={24} /></div>
              <div><h4 className="text-sm font-black uppercase text-slate-900 tracking-wider mb-1">Boating & Cruises</h4><p className="text-sm text-slate-500 font-medium">Navigable channels are mostly clear. Monitor wind drift reports to avoid sudden hyacinth blockages near the marina.</p></div>
            </div>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-2xl ${data.chatbot?.summary?.skinIrritationRisk.includes('None') ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}><Activity size={24} /></div>
              <div><h4 className="text-sm font-black uppercase text-slate-900 tracking-wider mb-1">Health Warning</h4><p className="text-sm text-slate-500 font-medium">{data.chatbot?.aiGuidelines?.healthWarning}</p></div>
            </div>
          </div>
        </div>

        <div className={`lg:col-span-1 p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl text-white flex flex-col items-center justify-center text-center ${isSafe ? 'bg-emerald-600' : 'bg-amber-600'}`}>
          <Droplet size={48} className="opacity-80 mb-6" />
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-4">Current Water Grade</h4>
          <h3 className="text-7xl md:text-8xl font-black italic tracking-tighter">{wqiScore}</h3>
          <p className="text-sm font-bold uppercase tracking-widest mt-4 opacity-90">{data.chatbot?.summary?.healthGrade}</p>
        </div>
      </div>
    </div>
  );
};

// --- RESIDENT HUB ---
const ResidentModule = ({ data }: any) => {
  const odor = data.chatbot?.summary?.odorProfile || "Neutral";
  const petSafety = data.chatbot?.scientificContext?.livestockSafety?.includes("Safe") ? "Safe for Pets" : "Toxic to Pets";
  const isHighRisk = data.chatbot?.summary?.waterHealthScore < 40;

  return (
    <div className="space-y-6 md:space-y-8">
      <SectionHeader title="Community & Resident Hub" icon={Home} />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <ModernStatusCard icon={Wind} title="Neighborhood Odor" value={odor} unit="" status="Wind Drift Focus" color={odor.includes("Strong") || odor.includes("Noticeable") ? "amber" : "emerald"} />
        <ModernStatusCard icon={Anchor} title="Marina Access" value={data.omni?.residentView?.hyacinthGrowthForecast.split(' ')[0]} unit="Growth" status="Navigation Risk" color="amber" />
        <ModernStatusCard icon={Droplets} title="Pet Safety" value={petSafety} unit="" status="Shoreline Danger" color={petSafety.includes("Toxic") ? "rose" : "emerald"} />
        <ModernStatusCard icon={AlertOctagon} title="Sewage Alert" value={data.omni?.residentView?.sewageDetection} unit="" status="Current Inflow" color={data.omni?.residentView?.sewageDetection.includes("Active") ? "rose" : "emerald"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-slate-200 shadow-sm flex flex-col justify-center">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Daily Resident Advisory</h3>
          <p className="text-2xl md:text-3xl font-black italic tracking-tighter text-slate-900 leading-snug mb-6">{data.omni?.residentView?.recommendation || "Conditions are currently stable. No immediate action required for shoreline properties."}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className={`p-4 rounded-xl border ${isHighRisk ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Property Action</p>
              <p className="text-sm font-bold text-slate-800">{isHighRisk ? "Keep pets indoors and avoid drawing borehole water." : "Safe for normal outdoor activities near the dam."}</p>
            </div>
            <div className="p-4 rounded-xl border bg-slate-50 border-slate-200">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Community Notice</p>
              <p className="text-sm font-bold text-slate-800">Mechanical harvesters operating in Sector Alpha today.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 bg-slate-900 text-white p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col">
          <Smartphone className="absolute -right-4 -bottom-4 opacity-10 rotate-12" size={180} />
          <h4 className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.2em] mb-4 flex items-center gap-2 relative z-10"><Camera size={14} /> Community Action</h4>
          <h3 className="text-2xl font-black italic tracking-tighter mb-4 relative z-10">See an algae bloom or raw sewage leak?</h3>
          <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8 relative z-10">Your field reports feed directly into our analytical engine. Snap a photo and alert the response team immediately.</p>
          <button className="mt-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-xs tracking-widest py-4 px-6 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 relative z-10 flex items-center justify-between group">
            File Field Report <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- BIOCHEMICAL PROFILING ---
const ForensicsModule = ({ data, chartData, dateRange, setDateRange, isMounted, isGraphLoading, onUpdateGraph }: any) => {
  const rawFertilizer = Number(data.forensic?.attributionSummary?.fertilizerLoadIndex) || 45;
  const rawSewage = Number(data.forensic?.attributionSummary?.sewageLoadIndex) || 55;
  const totalLoad = rawFertilizer + rawSewage;
  const fertilizerPercentage = totalLoad > 0 ? Math.round((rawFertilizer / totalLoad) * 100) : 45;
  const sewagePercentage = totalLoad > 0 ? Math.round((rawSewage / totalLoad) * 100) : 55;

  return (
    <div className="space-y-6 md:space-y-8">
      <SectionHeader title="Biochemical Profiling" icon={Microscope} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <DetailCard title="Trophic State" value={data.forensic?.forensicMetrics?.trophicStatus || data.omni?.scientificIntelligence?.trophicState} desc="Bio-classification based on nutrient density." />
        <DetailCard title="Redfield Ratio" value={data.forensic?.forensicMetrics?.avgRedfieldRatio} desc="Stochastic N:P balance determining dominance." />
        <DetailCard title="pH Variance" value={data.audit?.ecosystemVariance?.phVarianceIndex} desc="Standard deviation representing distress shifts." />
        <DetailCard title="Remediation" value={`${data.progress?.vitalityImprovement?.percentageGain || 4.2}%`} desc="Efficiency of active nanobubble systems." />
      </div>

      <div className="bg-white border border-slate-200 p-5 md:p-8 lg:p-10 rounded-[2rem] md:rounded-[3rem] shadow-sm flex flex-col">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 md:mb-10 gap-4 md:gap-6">
          <div>
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2 mb-1">
              <TrendingUp size={16} className="text-emerald-600 shrink-0" /> Full Spectrum Telemetry
            </h3>
            <p className="text-slate-900 font-black italic uppercase tracking-tight text-lg md:text-xl">Ecosystem Variance Analysis</p>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-slate-100 p-2 md:pl-4 rounded-xl border border-slate-200 shadow-inner w-full lg:w-auto">
            <Calendar size={14} className="text-emerald-600 hidden sm:block shrink-0" />
            <input type="date" value={dateRange.start} onChange={(e)=>setDateRange({...dateRange, start: e.target.value})} className="bg-transparent text-slate-700 text-[10px] md:text-[11px] font-black uppercase outline-none cursor-pointer flex-grow min-w-[100px]" style={{ colorScheme: 'light' }} />
            <ArrowRight size={10} className="text-slate-400 shrink-0" />
            <input type="date" value={dateRange.end} onChange={(e)=>setDateRange({...dateRange, end: e.target.value})} className="bg-transparent text-slate-700 text-[10px] md:text-[11px] font-black uppercase outline-none cursor-pointer flex-grow min-w-[100px]" style={{ colorScheme: 'light' }} />
            <button onClick={onUpdateGraph} disabled={isGraphLoading} className="w-full sm:w-auto bg-slate-900 text-white hover:bg-emerald-600 transition-colors px-4 py-2 rounded-lg text-[10px] font-black tracking-widest uppercase flex items-center justify-center gap-2 disabled:opacity-50">
              {isGraphLoading ? <RefreshCw size={12} className="animate-spin" /> : "Sync"}
            </button>
          </div>
        </div>

        <div className="w-full relative h-[300px] md:h-[400px]">
          {isGraphLoading && (
            <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-2xl">
              <RefreshCw size={40} className="animate-spin text-emerald-500" />
            </div>
          )}
          {isMounted && (
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <ComposedChart data={chartData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNit" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                  <linearGradient id="colorPho" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="x" fontSize={9} tickFormatter={(str) => {
                    const parts = str.split('-');
                    if(parts.length === 3) return new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2])).toLocaleDateString(undefined, { month: 'short', day: 'numeric'});
                    return str;
                  }} minTickGap={30} stroke="#94a3b8" />
                <YAxis yAxisId="left" fontSize={9} stroke="#94a3b8" axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" fontSize={9} stroke="#f59e0b" axisLine={false} tickLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                <YAxis yAxisId="ec" orientation="right" hide={true} domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip content={<TelemetryTooltip />} cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '5 5' }} />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '10px', fontSize: '9px', fontWeight: '800' }} />
                <Area yAxisId="left" name="Nitrates" type="monotone" dataKey="nitrates" stroke="#10b981" strokeWidth={3} fill="url(#colorNit)" activeDot={{ r: 6, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }} />
                <Area yAxisId="left" name="Phosphates" type="monotone" dataKey="phosphates" stroke="#3b82f6" strokeWidth={3} fillOpacity="url(#colorPho)" activeDot={{ r: 6, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }} />
                <Line yAxisId="right" name="pH Level" type="monotone" dataKey="ph" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 5, fill: "#f59e0b", stroke: "#fff", strokeWidth: 2 }} />
                <Line yAxisId="ec" name="Conductivity" type="monotone" dataKey="ec" stroke="#ef4444" strokeWidth={2} strokeDasharray="3 3" dot={false} activeDot={{ r: 5, fill: "#ef4444", stroke: "#fff", strokeWidth: 2 }} />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <SectionBox icon={Activity} title="Live Scientific Context">
            <div className="flex flex-col w-full space-y-1">
              <TelemetryRow label="pH Level" value={data.chatbot?.scientificContext?.phValue?.toFixed(4)} />
              <TelemetryRow label="Nitrates" value={`${data.chatbot?.scientificContext?.nitrateLevel?.toFixed(4)} mg/L`} />
              <TelemetryRow label="Phosphates" value={`${data.chatbot?.scientificContext?.phosphateLevel?.toFixed(4)} mg/L`} />
              <TelemetryRow label="Toxic Ammonia" value={`${data.chatbot?.scientificContext?.ammoniaToxicityMgL?.toFixed(5)} mg/L`} highlight color="rose" />
            </div>
          </SectionBox>
        </div>

        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-sm flex flex-col md:flex-row items-center gap-8 md:gap-10">
          <div className="w-full md:w-1/2">
            <h3 className="text-[11px] md:text-[12px] font-black uppercase text-slate-800 tracking-widest mb-3">Forensic Attribution Model</h3>
            <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed max-w-md">
              Based on the observed Redfield Ratio and historical Electrical Conductivity spikes, our analytical engine divides the nutrient load into municipal sewage faults versus agricultural fertilizer runoff.
            </p>
            <div className="mt-6 md:mt-8 space-y-3 md:space-y-4 w-full max-w-sm">
               <div className="flex justify-between items-center text-[10px] md:text-xs font-black tracking-widest px-4 py-3 md:py-4 bg-emerald-50 rounded-xl md:rounded-2xl text-emerald-700 uppercase border border-emerald-100">
                 <span>Fertilizer Load</span><span>{fertilizerPercentage}%</span>
               </div>
               <div className="flex justify-between items-center text-[10px] md:text-xs font-black tracking-widest px-4 py-3 md:py-4 bg-rose-50 rounded-xl md:rounded-2xl text-rose-700 uppercase border border-rose-100">
                 <span>Sewage Load</span><span>{sewagePercentage}%</span>
               </div>
            </div>
          </div>
          <div className="h-[250px] md:h-72 w-full md:w-1/2 shrink-0">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                  <Pie data={[{ name: 'Agriculture', value: fertilizerPercentage }, { name: 'Sewage', value: sewagePercentage }]} innerRadius="60%" outerRadius="80%" paddingAngle={8} dataKey="value">
                    <Cell fill="#10b981" /><Cell fill="#f43f5e" />
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- AGRI-SAFETY ---
const AgriSafetyModule = ({ data }: any) => {
  const harvestValue = Number(data.eco?.marketValue?.estimatedHarvestValue || data.eco?.marketValueEstimate || data.eco?.marketValue || data.eco) || 0;
  const rawFertilizer = Number(data.forensic?.attributionSummary?.fertilizerLoadIndex) || 45;
  const rawSewage = Number(data.forensic?.attributionSummary?.sewageLoadIndex) || 55;
  const fertilizerPercentage = Math.round((rawFertilizer / (rawFertilizer + rawSewage)) * 100);

  return (
    <div className="space-y-6 md:space-y-8">
      <SectionHeader title="Industry Impact & Agri-Safety" icon={Tractor} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-4 text-slate-900">
           <AgriMetric icon={CheckCircle} label="Livestock Safety" value={data.omni?.scientificIntelligence?.livestockDrinkingSafety || "Marginal"} status="Biological Assessment" />
           <AgriMetric icon={Waves} label="Soil Salinity" value={data.omni?.scientificIntelligence?.soilSalinityRisk || "Stable"} status="Irrigation Health" />
           <AgriMetric icon={Thermometer} label="SAR Rating" value={data.irrigation?.soilHealthMetrics?.sodiumAdsorptionRatio || "1.2"} status="Soil Absorption" />
           <AgriMetric icon={Wind} label="Bloom Probability" value={data.bloom?.riskMetrics?.bloomProbability || "75%"} status="Expansion Forecast" />
        </div>
        <div className="bg-emerald-600 p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[250px] md:min-h-[300px] text-white">
           <Coins className="absolute -right-6 -bottom-6 md:-right-10 md:-bottom-10 opacity-10 rotate-12" size={250} />
           <div className="relative z-10">
             <Leaf size={32} className="mb-6 md:mb-10 text-emerald-100" />
             <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2 md:mb-4">Pillar 8: Harvest Value</p>
             <h4 className="text-5xl md:text-7xl font-black italic tracking-tighter shrink-0">R{harvestValue > 1000000 ? `${(harvestValue/1000000).toFixed(1)}M` : harvestValue.toLocaleString()}</h4>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mt-8">
        <div className="bg-white border border-slate-200 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-sm flex flex-col">
          <h3 className="text-[10px] md:text-xs font-black uppercase text-slate-800 tracking-widest mb-6 border-b border-slate-100 pb-4 flex items-center gap-2">
            <Sprout size={16} className="text-emerald-600" /> Irrigation Suitability Matrix
          </h3>
          <div className="space-y-1">
            <TelemetryRow label="Electrical Conductivity (EC)" value={`${data.omni?.scientificIntelligence?.rawMetrics?.ec?.toFixed(2)} µS/cm`} color={data.omni?.scientificIntelligence?.rawMetrics?.ec > 75 ? "rose" : "emerald"} highlight />
            <p className="text-xs text-slate-500 italic px-1 pb-3">High EC limits water uptake by roots, reducing crop yield.</p>
            <TelemetryRow label="pH Level" value={data.chatbot?.scientificContext?.phValue?.toFixed(2)} color={data.chatbot?.scientificContext?.phValue > 8.5 ? "amber" : "emerald"} highlight />
            <p className="text-xs text-slate-500 italic px-1 pb-3">pH above 8.5 decreases micronutrient availability in soil.</p>
            <TelemetryRow label="Nitrate Concentration" value={`${data.chatbot?.scientificContext?.nitrateLevel?.toFixed(2)} mg/L`} color="blue" highlight />
            <p className="text-xs text-slate-500 italic px-1 pb-1">Acts as free fertilizer; adjust commercial applications accordingly.</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl flex flex-col text-white relative overflow-hidden">
          <Droplet className="absolute -right-10 -bottom-10 opacity-5 rotate-12" size={250} />
          <h3 className="text-[10px] md:text-xs font-black uppercase text-emerald-400 tracking-widest mb-6 border-b border-slate-700 pb-4 relative z-10 flex items-center gap-2">
            <RefreshCw size={16} /> Runoff Feedback Loop
          </h3>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <p className="text-sm font-medium text-slate-300 leading-relaxed mb-6">Agricultural runoff from upstream farms contributes significantly to the nutrient load fueling the hyacinth crisis.</p>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 mb-6">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Estimated Agricultural Contribution</p>
              <h4 className="text-5xl font-black italic tracking-tighter text-emerald-400">{fertilizerPercentage}%</h4>
              <p className="text-xs text-slate-400 mt-2 font-bold">Of total dissolved nutrient load in Sector Alpha.</p>
            </div>
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-xs font-black italic uppercase text-emerald-300 leading-relaxed">Advisory: Optimize fertilizer application timing to avoid heavy rain forecasts, reducing washout into the Hartbeespoort catchment.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- AUDIT LOGS ---
const AuditLogModule = ({ data, tableData, dateRange, setDateRange, isAuditLoading, onUpdateAudit }: any) => {
  const handleDownloadCSV = () => {
    if (!tableData || tableData.length === 0) return;
    const headers = ["Timestamp", "Nitrates (mg/L)", "Phosphates (mg/L)", "Status"];
    const rows = tableData.map((row: any) => {
      const safeDate = new Date(`${row.x}T00:00:00`).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      const isAnomaly = row.nitrates >= 2.4 || row.phosphates >= 0.15;
      const status = isAnomaly ? "ANOMALY" : "VERIFIED";
      return `"${safeDate}",${row.nitrates.toFixed(2)},${row.phosphates.toFixed(2)},${status}`;
    });
    
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Harties_Audit_Log_${dateRange.start}_to_${dateRange.end}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <AuditStat label="Peak Sewage Spike" value={data.audit?.historicalExtremes?.peakSewageInflowMgL?.toFixed(2)} unit="mg/L" />
        <AuditStat label="Max Fertilizer Runoff" value={data.audit?.historicalExtremes?.peakFertilizerInflowMgL?.toFixed(2)} unit="mg/L" />
        <AuditStat label="System Integrity" value={data.audit?.databaseHealth?.completenessPercentage || "98.2%"} unit="DATA TRUST" />
        <AuditStat label="Sensor Array Node" value="99.8%" unit="HARDWARE UPTIME" />
      </div>
      
      <div className="bg-white border border-slate-200 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-sm">
        <div className="p-5 md:p-8 border-b border-slate-100 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-slate-50/50">
          <div>
            <h3 className="text-[10px] md:text-xs font-black uppercase text-slate-800 tracking-widest italic">Historical Audit Logs</h3>
            <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 block">
              Records: {data.audit?.auditMetadata?.totalRecordsAnalyzed?.toLocaleString() || "Syncing"} | Official Data Export Hub
            </span>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-white p-2 md:pl-4 rounded-xl border border-slate-200 shadow-sm w-full lg:w-auto">
            <Calendar size={14} className="text-emerald-600 hidden sm:block shrink-0" />
            <input type="date" value={dateRange.start} onChange={(e)=>setDateRange({...dateRange, start: e.target.value})} className="bg-transparent text-slate-700 text-[10px] md:text-[11px] font-black uppercase outline-none cursor-pointer flex-grow min-w-[100px]" style={{ colorScheme: 'light' }} />
            <ArrowRight size={10} className="text-slate-400 shrink-0" />
            <input type="date" value={dateRange.end} onChange={(e)=>setDateRange({...dateRange, end: e.target.value})} className="bg-transparent text-slate-700 text-[10px] md:text-[11px] font-black uppercase outline-none cursor-pointer flex-grow min-w-[100px]" style={{ colorScheme: 'light' }} />
            <button onClick={onUpdateAudit} disabled={isAuditLoading} className="w-full sm:w-auto bg-slate-900 text-white hover:bg-slate-700 transition-colors px-4 py-2 rounded-lg text-[10px] font-black tracking-widest uppercase flex items-center justify-center gap-2 disabled:opacity-50">
              {isAuditLoading ? <RefreshCw size={12} className="animate-spin" /> : "Sync Logs"}
            </button>
            <button onClick={handleDownloadCSV} className="w-full sm:w-auto bg-emerald-600 text-white hover:bg-emerald-500 transition-colors px-4 py-2 rounded-lg text-[10px] font-black tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[400px] md:max-h-[500px]">
          <table className="w-full text-left min-w-[500px]">
            <thead className="bg-slate-50 border-b border-slate-100 text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest sticky top-0 z-10 shadow-sm">
              <tr><th className="px-6 md:px-10 py-4 md:py-6">Timestamp</th><th className="px-6 md:px-10 py-4 md:py-6 text-slate-900">Nitrates</th><th className="px-6 md:px-10 py-4 md:py-6 text-emerald-600">Phosphates</th><th className="px-6 md:px-10 py-4 md:py-6">Status</th></tr>
            </thead>
            <tbody className="text-sm font-medium text-slate-600">
              {tableData.map((row: any, i: number) => {
                const safeDate = new Date(`${row.x}T00:00:00`);
                const isAnomaly = row.nitrates >= 2.4 || row.phosphates >= 0.15;

                return (
                  <tr key={i} className={`border-b transition-all text-[10px] md:text-[11px] whitespace-nowrap ${isAnomaly ? 'bg-rose-50/80 border-rose-200 hover:bg-rose-100/80' : 'border-slate-50 hover:bg-slate-50/80'}`}>
                    <td className={`px-6 md:px-10 py-4 md:py-5 font-mono ${isAnomaly ? 'text-rose-900' : 'text-slate-400'}`}>{safeDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td className={`px-6 md:px-10 py-4 md:py-5 font-black ${isAnomaly ? 'text-rose-700' : 'text-slate-900'}`}>{row.nitrates.toFixed(2)}</td>
                    <td className={`px-6 md:px-10 py-4 md:py-5 font-black ${isAnomaly ? 'text-rose-700' : 'text-emerald-600'}`}>{row.phosphates.toFixed(2)}</td>
                    <td className="px-6 md:px-10 py-4 md:py-5">
                      <span className={`px-2 md:px-3 py-1 border rounded-full shadow-sm italic uppercase font-black text-[8px] md:text-[9px] ${isAnomaly ? 'bg-rose-500 text-white border-rose-600 shadow-rose-500/30 animate-pulse' : 'bg-white border-slate-200 text-slate-500'}`}>
                        {isAnomaly ? 'Anomaly' : 'Verified'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- SHARED UI ---

const ModernStatusCard = ({ title, value, unit, status, color, icon: Icon }: any) => {
  const styles: any = { emerald: "text-emerald-600 border-emerald-200 bg-emerald-50", blue: "text-blue-600 border-blue-200 bg-blue-50", amber: "text-amber-600 border-amber-200 bg-amber-50", rose: "text-rose-600 border-rose-200 bg-rose-50", slate: "text-slate-600 border-slate-200 bg-slate-50" };
  return (
    <div className="bg-white border border-slate-200 p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between">
       <div className="flex justify-between items-start mb-4">
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-[1rem] flex items-center justify-center border ${styles[color]} group-hover:scale-105 transition-transform shrink-0`}><Icon size={20} className="md:w-6 md:h-6" /></div>
          <p className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2 py-1 md:px-3 md:py-1.5 rounded-full border shadow-sm ${styles[color]} text-right leading-tight max-w-[60%]`}>{status}</p>
       </div>
       <div>
          <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5 md:mb-1">{title}</p>
          <div className="flex items-baseline gap-1 md:gap-1.5">
             <h3 className="text-3xl md:text-4xl font-black text-slate-900 italic tracking-tighter">{value || "---"}</h3>
             <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase">{unit}</span>
          </div>
       </div>
    </div>
  );
};

const SafetyRow = ({ label, value, color }: any) => {
  const valLower = String(value).toLowerCase();
  let pillColor = "text-slate-300 bg-slate-800 border-slate-700";
  if (color) { pillColor = `text-[${color}] bg-slate-800 border-slate-700`; } 
  else if (valLower.includes('safe') || valLower.includes('none') || valLower.includes('fresh') || valLower.includes('ideal')) { pillColor = "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"; } 
  else if (valLower.includes('caution') || valLower.includes('mild') || valLower.includes('noticeable')) { pillColor = "text-amber-400 bg-amber-400/10 border-amber-400/20"; } 
  else if (valLower.includes('danger') || valLower.includes('risk') || valLower.includes('high') || valLower.includes('toxic')) { pillColor = "text-rose-400 bg-rose-400/10 border-rose-400/20"; }

  return (
    <div className="flex justify-between items-center p-3 md:p-4 bg-slate-800/40 rounded-xl md:rounded-2xl border border-slate-700/50 backdrop-blur-sm">
      <span className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-[0.1em] flex items-center gap-1.5 md:gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0" /> <span className="truncate">{label}</span>
      </span>
      <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest px-2 py-1 md:px-3 md:py-1 rounded-md md:rounded-lg border whitespace-nowrap ${pillColor}`}>
        {value ?? "---"}
      </span>
    </div>
  );
};

const TelemetryRow = ({ label, value, highlight = false, color = "emerald" }: any) => {
  const colorMap: any = { emerald: "text-emerald-700 bg-emerald-50 border-emerald-200", blue: "text-blue-700 bg-blue-50 border-blue-200", amber: "text-amber-700 bg-amber-50 border-amber-200", rose: "text-rose-700 bg-rose-50 border-rose-200", slate: "text-slate-700 bg-slate-100 border-slate-200", blueHigh: "text-blue-500 bg-blue-500/10 border-blue-500/20" };
  return (
    <div className="flex justify-between items-center py-3 md:py-3.5 border-b border-slate-100 last:border-0">
      <span className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{label}</span>
      <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest px-2.5 py-1 md:px-3 md:py-1.5 rounded-md md:rounded-lg border shadow-sm ${highlight ? colorMap[color] : 'text-slate-700 border-slate-200 bg-white'}`}>
        {value ?? "---"}
      </span>
    </div>
  );
};

const AgriMetric = ({ icon: Icon, label, value, status }: any) => (
  <div className="flex items-center gap-4 md:gap-6 bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 shadow-sm">
    <div className="p-3 md:p-4 bg-slate-50 text-emerald-600 rounded-xl md:rounded-2xl border border-slate-100 shrink-0"><Icon size={20} className="md:w-6 md:h-6" /></div>
    <div className="min-w-0">
      <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 truncate">{label}</p>
      <p className="text-xl md:text-2xl font-black italic leading-none truncate">{value}</p>
      <p className="text-[8px] md:text-[9px] font-black text-emerald-600 uppercase mt-1 md:mt-2 tracking-widest truncate">{status}</p>
    </div>
  </div>
);

const DetailCard = ({ title, value, desc }: any) => (
  <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-slate-200 shadow-sm group hover:border-emerald-200 transition-colors h-full flex flex-col justify-center">
    <h4 className="text-[10px] md:text-[11px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-1.5 md:mb-2">{title}</h4>
    <p className="text-3xl md:text-4xl font-black text-slate-900 mb-2 md:mb-4 italic tracking-tighter">{value ?? "---"}</p>
    <p className="text-[11px] md:text-xs text-slate-400 leading-relaxed font-medium">{desc}</p>
  </div>
);

const AuditStat = ({ label, value, unit }: any) => (
  <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-slate-200 shadow-sm text-center group transition-all duration-500">
    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-4xl md:text-5xl font-black italic tracking-tighter text-slate-900 leading-none mb-1 md:mb-2">{value ?? "---"}</p>
    <p className="text-[9px] md:text-[10px] font-black text-emerald-600 uppercase tracking-widest">{unit}</p>
  </div>
);

const SectionBox = ({ title, icon: Icon, children }: any) => (
  <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-sm h-full flex flex-col">
    <h4 className="text-[10px] md:text-[11px] font-black uppercase text-slate-400 tracking-[0.4em] mb-5 md:mb-8 flex items-center gap-2 md:gap-3">
      <div className="p-1.5 md:p-2 bg-slate-50 rounded-lg md:rounded-xl border border-slate-100 shrink-0"><Icon size={14} className="text-emerald-600" /></div> <span className="truncate">{title}</span>
    </h4>
    {children}
  </div>
);

const SectionHeader = ({ title, icon: Icon }: any) => (
  <div className="flex items-center gap-3 md:gap-5 mb-4 md:mb-8">
    <div className="p-2.5 md:p-3.5 bg-slate-900 text-white rounded-xl md:rounded-2xl shadow-xl shrink-0"><Icon size={20} className="md:w-6 md:h-6" /></div>
    <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">{title}</h3>
  </div>
);

const LoadingState = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-white text-emerald-600">
    <RefreshCw className="animate-spin text-emerald-500 mb-6 md:mb-8 w-[50px] h-[50px] md:w-[60px] md:h-[60px]" strokeWidth={2} />
    <p className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.5em] md:tracking-[1em] animate-pulse text-slate-400 text-center px-4">Establishing Command Center Uplink</p>
  </div>
);