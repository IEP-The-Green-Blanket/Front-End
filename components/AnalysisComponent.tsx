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
  Sprout, Droplet, MapPin, Navigation, Download, Lock, Users
} from 'lucide-react';
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import Link from "next/link";

export const AnalysisComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("tourist");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState<any>({
    omni: null, chatbot: null, history: null, bloom: null,
    forensic: null, progress: null, irrigation: null, 
    infra: null, eco: null, compliance: null, audit: null, auditHistory: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const [communityReports, setCommunityReports] = useState<any[]>([]);
  const [omniDateRange, setOmniDateRange] = useState({ start: "2026-02-01", end: "2026-04-30" });
  const [auditDateRange, setAuditDateRange] = useState({ start: "2026-02-01", end: "2026-04-30" });

  // 1. Initial Load: Fetch only the "Core" data (Performance Guard)
  useEffect(() => {
    setIsMounted(true);
    const user = localStorage.getItem("loginName") || localStorage.getItem("token");
    if (user) setIsAuthenticated(true);

    const loadCoreData = async () => {
      setIsLoading(true);
      try {
        const [omni, chatbot, bloom, history] = await Promise.all([
          analysisService.getOmniDashboard(),
          analysisService.getChatbotSummary(),
          analysisService.getBloomForecast(),
          analysisService.getHistoryRange(omniDateRange.start, omniDateRange.end)
        ]);
        
        setData((prev: any) => ({ ...prev, omni, chatbot, bloom, history }));
      } catch (err) {
        console.error("Core Uplink Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadCoreData();
  }, []);

  // 2. Lazy Loading: Fetch tab-specific data only when active
  useEffect(() => {
    if (!isMounted || isLoading) return;

    const loadTabData = async () => {
      try {
        if (activeTab === "science" && !data.forensic) {
          setIsTabLoading(true);
          const [forensic, progress] = await Promise.all([
            analysisService.getForensicAttribution(),
            analysisService.getRemediationProgress()
          ]);
          setData((prev: any) => ({ ...prev, forensic, progress }));
        }
        
        if (activeTab === "agri" && !data.irrigation) {
          setIsTabLoading(true);
          const [irrigation, infra, eco, compliance] = await Promise.all([
            analysisService.getIrrigationSafety(),
            analysisService.getInfrastructureRisk(),
            analysisService.getHarvestValue(),
            analysisService.getComplianceStatus()
          ]);
          setData((prev: any) => ({ ...prev, irrigation, infra, eco, compliance }));
        }

        if (activeTab === "audit" && !data.audit) {
          setIsTabLoading(true);
          const [audit, auditHistory, reports] = await Promise.all([
            (analysisService as any).getMasterAudit(auditDateRange.start, auditDateRange.end),
            analysisService.getHistoryRange(auditDateRange.start, auditDateRange.end),
            analysisService.getReports()
          ]);
          setData((prev: any) => ({ ...prev, audit, auditHistory }));
          setCommunityReports(reports);
        }
      } catch (err) {
        console.error(`Lazy Load Error (${activeTab}):`, err);
      } finally {
        setIsTabLoading(false);
      }
    };

    loadTabData();
  }, [activeTab, isMounted, isLoading]);

  const handleUpdateOmniGraph = async () => {
    setIsTabLoading(true);
    try {
      const historyResult = await analysisService.getHistoryRange(omniDateRange.start, omniDateRange.end);
      setData((prev: any) => ({ ...prev, history: historyResult }));
    } catch (err) {
      console.error("Graph Update Error:", err);
    } finally {
      setIsTabLoading(false);
    }
  };

  const handleUpdateAudit = async () => {
    setIsTabLoading(true);
    try {
      const [history, audit] = await Promise.all([
        analysisService.getHistoryRange(auditDateRange.start, auditDateRange.end),
        (analysisService as any).getMasterAudit(auditDateRange.start, auditDateRange.end)
      ]);
      setData((prev: any) => ({ ...prev, auditHistory: history, audit }));
    } catch (err) {
      console.error("Audit Update Error:", err);
    } finally {
      setIsTabLoading(false);
    }
  };

  const omniChartData = useMemo(() => data.history?.dataPoints || [], [data.history]);
  const auditTableData = useMemo(() => data.auditHistory?.dataPoints || [], [data.auditHistory]);

  const TABS = [
    { id: "overview", label: "Overview", icon: LayoutGrid, isPublic: false },
    { id: "tourist", label: "Visitor Hub", icon: Camera, isPublic: true },
    { id: "resident", label: "Resident Hub", icon: Home, isPublic: false },
    { id: "science", label: "Water Science", icon: Microscope, isPublic: false },
    { id: "agri", label: "Farm & Crops", icon: Tractor, isPublic: false },
    { id: "audit", label: "Data Records", icon: Database, isPublic: false }
  ];

  if (isLoading || !data.omni) return <LoadingState />;

  return (
    <div className="min-h-screen bg-transparent text-slate-900 font-sans selection:bg-emerald-100 pb-20">
      <div className="max-w-[1650px] mx-auto p-4 md:p-6 lg:p-10 space-y-6 md:space-y-8">
        
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end pb-6 md:pb-8 gap-4 md:gap-6 border-b-2 border-slate-900/10">
          <div className="space-y-2 bg-white/80 p-6 rounded-3xl shadow-sm border border-slate-100 backdrop-blur-sm w-full lg:w-auto">
            <div className="flex items-center gap-3">
               <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
               <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 uppercase italic">
                Green <span className="text-emerald-600 font-normal">Analytics Engine</span>
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-3 md:gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">
                <Clock size={14} className="text-emerald-500" /> {new Date(data.omni?.timestamp).toLocaleString()}
              </span>
              <span className="flex items-center gap-2"><MapIcon size={14} /> Main Dam Area</span>
              {!isAuthenticated && (
                <span className="flex items-center gap-2 text-rose-500 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-md shadow-sm">
                  <Lock size={12} /> Unauthorized Access
                </span>
              )}
            </div>
          </div>

          <nav className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xl overflow-x-auto no-scrollbar w-full lg:w-auto snap-x shrink-0">
            {TABS.map((tab) => {
              const isLocked = !isAuthenticated && !tab.isPublic;
              return (
                <button
                  key={tab.id}
                  onClick={() => !isLocked && setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-bold text-[11px] uppercase tracking-wider whitespace-nowrap snap-start ${
                    activeTab === tab.id 
                    ? "bg-slate-900 text-white shadow-lg translate-y-[-2px]" 
                    : isLocked ? "text-slate-300 cursor-not-allowed" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <tab.icon size={14} /> {tab.label}
                  {isLocked && <Lock size={12} className="opacity-50 ml-1" />}
                </button>
              );
            })}
          </nav>
        </header>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 text-white p-4 md:px-8 rounded-2xl md:rounded-[2rem] shadow-2xl gap-4 border-b-4 border-emerald-500">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-emerald-400">
            {isTabLoading ? <RefreshCw size={14} className="animate-spin shrink-0" /> : <ShieldCheck size={14} className="shrink-0" />}
            <span className="truncate">{isTabLoading ? "Syncing Environmental Data..." : "Main Database Connection: Active"}</span>
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
          {isAuthenticated && activeTab === "science" && data.forensic && (
            <ForensicsModule 
              data={data} chartData={omniChartData} dateRange={omniDateRange} 
              setDateRange={setOmniDateRange} isMounted={isMounted} 
              isGraphLoading={isTabLoading} onUpdateGraph={handleUpdateOmniGraph}
            />
          )}
          {isAuthenticated && activeTab === "agri" && data.irrigation && <AgriSafetyModule data={data} />}
          {isAuthenticated && activeTab === "audit" && data.audit && (
            <AuditLogModule 
              data={data} 
              tableData={auditTableData} 
              dateRange={auditDateRange}
              setDateRange={setAuditDateRange} 
              isAuditLoading={isTabLoading}
              onUpdateAudit={handleUpdateAudit}
              communityReports={communityReports}
            />
          )}
        </main>
      </div>
    </div>
  );
};

// --- SECURITY COMPONENT ---
const LockedState = () => (
  <div className="bg-white border border-slate-200 rounded-[3rem] p-10 md:p-20 shadow-2xl flex flex-col items-center justify-center text-center min-h-[500px]">
    <div className="w-24 h-24 bg-rose-50 rounded-3xl flex items-center justify-center mb-8 border border-rose-100">
      <Lock size={40} className="text-rose-500" />
    </div>
    <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter text-slate-900 mb-4">Secure Access Required</h2>
    <p className="text-sm md:text-base text-slate-500 max-w-lg leading-relaxed font-medium mb-10">
      This area contains sensitive technical data and detailed records that are for authorized team members only. 
    </p>
    <Link href="/login" className="bg-slate-900 text-white font-black uppercase tracking-widest text-xs px-8 py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-xl">
      Login to Dashboard
    </Link>
  </div>
);

// --- TOOLTIP ---
const TelemetryTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const pt = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 p-4 md:p-5 rounded-2xl shadow-2xl min-w-[180px] md:min-w-[200px]">
        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3 border-b border-slate-700 pb-2">
          {label}
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
  const harvestValue = Number(data.eco?.marketValue?.estimatedHarvestValue || 0);

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        <div className="lg:col-span-4 bg-slate-900 border-b-4 border-emerald-500 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl flex flex-col h-full text-white relative overflow-hidden">
          <ActivitySquare className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none" size={240} />
          <h4 className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.3em] mb-6 md:mb-10 flex items-center gap-3">
            <ShieldCheck size={16} /> Overall Dam Health
          </h4>
          <div className="relative h-36 w-36 md:h-48 md:w-48 mx-auto mb-8 md:mb-10 shrink-0">
             <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="70" stroke="#334155" strokeWidth="10" fill="transparent" />
                <circle cx="80" cy="80" r="70" stroke={ringColor} strokeWidth="10" fill="transparent" strokeDasharray={440} strokeDashoffset={ringOffset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl md:text-6xl font-black italic tracking-tighter text-white drop-shadow-md">{wqiScore}</span>
                <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">WATER SCORE</span>
             </div>
          </div>
          <div className="text-center z-10 flex-grow flex flex-col justify-end">
            <p className="text-sm font-bold uppercase tracking-widest text-white">{data.chatbot?.summary?.healthGrade}</p>
            <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest">{data.omni?.scientificIntelligence?.trophicState}</p>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6 md:gap-8 h-full">
          <div className="bg-white border border-slate-200 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl flex flex-col h-full justify-center relative overflow-hidden">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-4 flex items-center gap-2">
              <Activity size={16} className="text-emerald-600" /> Live System Summary
            </h4>
            <p className="text-2xl md:text-3xl font-black italic tracking-tighter text-slate-900 leading-snug mb-8">
              {data.omni?.residentView?.recommendation || "Conditions are stable. No immediate action required."}
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <Search size={20} className={data.omni?.residentView?.sewageDetection?.includes("Active") ? "text-rose-500" : "text-emerald-500"} />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Source: {data.omni?.residentView?.sewageDetection}</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <TrendingDown size={20} className="text-emerald-500" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Pollution Reduced by {data.progress?.vitalityImprovement?.percentageGain || "0"}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-emerald-600 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-between text-white h-full">
          <Coins className="absolute -right-10 -bottom-10 opacity-10 rotate-12 pointer-events-none" size={200} />
          <div className="relative z-10">
            <Leaf size={32} className="mb-8 text-emerald-100" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Weed Harvest Value</p>
            <h4 className="text-5xl font-black italic tracking-tighter shrink-0">
              R{harvestValue > 1000000 ? `${(harvestValue/1000000).toFixed(1)}M` : harvestValue.toLocaleString()}
            </h4>
          </div>
          <div className="relative z-10 mt-8 pt-6 border-t border-emerald-500/50">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-1">Weed Growth Forecast</p>
            <p className="text-lg font-black italic">{data.omni?.residentView?.hyacinthGrowthForecast}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <ModernStatusCard icon={Waves} title="Swim Safety" value={data.chatbot?.summary?.swimSafetyStatus} unit="" status="Recreation" color={data.chatbot?.summary?.swimSafetyStatus?.includes('Safe') ? 'emerald' : 'rose'} />
        <ModernStatusCard icon={Wind} title="Odor Profile" value={data.chatbot?.summary?.odorProfile} unit="" status="Air Quality" color={data.chatbot?.summary?.odorProfile?.includes('Neutral') ? 'emerald' : 'amber'} />
        <ModernStatusCard icon={ShieldCheck} title="Data Accuracy" value={data.audit?.databaseHealth?.completenessPercentage || "98.2%"} unit="Verified" status="Data Engine" color="slate" />
        <ModernStatusCard icon={Database} title="Sensor Readings" value={data.audit?.auditMetadata?.totalRecordsAnalyzed?.toLocaleString() || "Syncing"} unit="Rows" status="System Activity" color="slate" />
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
        <ModernStatusCard icon={Waves} title="Swim Safety" value={swimSafety} unit="" status="Water Contact" color={swimSafety?.includes('Safe') || swimSafety?.includes('Ideal') ? 'emerald' : 'rose'} />
        <ModernStatusCard icon={Wind} title="Odor Profile" value={odor} unit="" status="Air Quality" color={odor?.includes('Neutral') || odor?.includes('Fresh') ? 'emerald' : 'amber'} />
        <ModernStatusCard icon={Activity} title="Skin Irritation" value={data.chatbot?.summary?.skinIrritationRisk} unit="" status="Exposure Risk" color={data.chatbot?.summary?.skinIrritationRisk?.includes('None') ? 'emerald' : 'amber'} />
        <ModernStatusCard icon={Fish} title="Risk to Fish" value={data.omni?.touristView?.fishKillLikelihood} unit="" status="Ecological Alert" color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl flex flex-col justify-center">
          <h3 className="text-[10px] md:text-xs font-black uppercase text-slate-800 tracking-widest mb-6 border-b border-slate-100 pb-4">What Can You Do Today?</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-2xl ${isSafe ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}><Waves size={24} /></div>
              <div><h4 className="text-sm font-black uppercase text-slate-900 tracking-wider mb-1">Swimming & Water Sports</h4><p className="text-sm text-slate-500 font-medium">{data.chatbot?.aiGuidelines?.canISwim}</p></div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-blue-100 text-blue-600"><Navigation size={24} /></div>
              <div><h4 className="text-sm font-black uppercase text-slate-900 tracking-wider mb-1">Boating & Cruises</h4><p className="text-sm text-slate-500 font-medium">Boat channels are mostly clear. Keep an eye on the wind, as it can push water weeds into the marina suddenly.</p></div>
            </div>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-2xl ${data.chatbot?.summary?.skinIrritationRisk?.includes('None') ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}><Activity size={24} /></div>
              <div><h4 className="text-sm font-black uppercase text-slate-900 tracking-wider mb-1">Health Advisory</h4><p className="text-sm text-slate-500 font-medium">{data.chatbot?.aiGuidelines?.healthWarning}</p></div>
            </div>
          </div>
        </div>

        <div className={`lg:col-span-1 p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl text-white flex flex-col items-center justify-center text-center ${isSafe ? 'bg-emerald-600' : 'bg-amber-600'}`}>
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
        <ModernStatusCard icon={Wind} title="Neighborhood Odor" value={odor} unit="" status="Wind Drift Focus" color={odor?.includes("Strong") || odor?.includes("Noticeable") ? "amber" : "emerald"} />
        <ModernStatusCard icon={Anchor} title="Marina Weed Blockage" value={data.omni?.residentView?.hyacinthGrowthForecast?.split(' ')[0]} unit="Growth" status="Navigation Risk" color="amber" />
        <ModernStatusCard icon={Droplets} title="Pet Safety" value={petSafety} unit="" status="Shoreline Danger" color={petSafety?.includes("Toxic") ? "rose" : "emerald"} />
        <ModernStatusCard icon={AlertOctagon} title="Sewage Detection" value={data.omni?.residentView?.sewageDetection} unit="" status="Current Inflow" color={data.omni?.residentView?.sewageDetection?.includes("Active") ? "rose" : "emerald"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-slate-200 shadow-2xl flex flex-col justify-center">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Daily Neighborhood Update</h3>
          <p className="text-2xl md:text-3xl font-black italic tracking-tighter text-slate-900 leading-snug mb-6">{data.omni?.residentView?.recommendation || "Things are looking good. You don't need to take any special precautions for your shoreline property today."}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className={`p-4 rounded-xl border ${isHighRisk ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Property Action</p>
              <p className="text-sm font-bold text-slate-800">{isHighRisk ? "Please keep your pets away from the water and avoid using borehole water for now." : "It's safe for normal outdoor activities near the water."}</p>
            </div>
            <div className="p-4 rounded-xl border bg-slate-50 border-slate-200">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Community Notice</p>
              <p className="text-sm font-bold text-slate-800">Weed harvesting boats are operating in the main dam area today.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 bg-slate-900 text-white p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col">
          <Smartphone className="absolute -right-4 -bottom-4 opacity-10 rotate-12" size={180} />
          <h4 className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.2em] mb-4 flex items-center gap-2 relative z-10"><Camera size={14} /> Help Us Monitor</h4>
          <h3 className="text-2xl font-black italic tracking-tighter mb-4 relative z-10">See an algae bloom or raw sewage leak?</h3>
          <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8 relative z-10">Your reports go straight to our system. Snap a photo to let the team know right away.</p>
          <Link href="/reporting" className="mt-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-xs tracking-widest py-4 px-6 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 relative z-10 flex items-center justify-between group">
            Report an Issue <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
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
      <SectionHeader title="Water Science & Pollution Tracking" icon={Microscope} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <DetailCard title="Nutrient Levels" value={data.forensic?.forensicMetrics?.trophicStatus || data.omni?.scientificIntelligence?.trophicState} desc="Measures how much algae and plant food is in the water." />
        <DetailCard title="Chemical Balance" value={data.forensic?.forensicMetrics?.avgRedfieldRatio} desc="The mix of nitrogen and phosphorus that causes weeds to grow rapidly." />
        <DetailCard title="pH Fluctuations" value={data.audit?.ecosystemVariance?.phVarianceIndex} desc="How much the water's acidity is jumping up and down." />
        <DetailCard title="Cleanup Progress" value={`${data.progress?.vitalityImprovement?.percentageGain || 4.2}%`} desc="How well the water treatment systems are working." />
      </div>

      <div className="bg-white border border-slate-200 p-5 md:p-8 lg:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl flex flex-col">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 md:mb-10 gap-4 md:gap-6">
          <div>
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2 mb-1">
              <TrendingUp size={16} className="text-emerald-600 shrink-0" /> Historical Sensor Data
            </h3>
            <p className="text-slate-900 font-black italic uppercase tracking-tight text-lg md:text-xl">How The Water Has Changed Over Time</p>
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
                <XAxis dataKey="x" fontSize={9} minTickGap={30} stroke="#94a3b8" />
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
          <SectionBox icon={Activity} title="Live Sensor Readings">
            <div className="flex flex-col w-full space-y-1">
              <TelemetryRow label="pH Level" value={data.chatbot?.scientificContext?.phValue?.toFixed(4)} />
              <TelemetryRow label="Nitrates" value={`${data.chatbot?.scientificContext?.nitrateLevel?.toFixed(4)} mg/L`} />
              <TelemetryRow label="Phosphates" value={`${data.chatbot?.scientificContext?.phosphateLevel?.toFixed(4)} mg/L`} />
              <TelemetryRow label="Toxic Ammonia" value={`${data.chatbot?.scientificContext?.ammoniaToxicityMgL?.toFixed(5)} mg/L`} highlight color="rose" />
            </div>
          </SectionBox>
        </div>

        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center gap-8 md:gap-10">
          <div className="w-full md:w-1/2">
            <h3 className="text-[11px] md:text-[12px] font-black uppercase text-slate-800 tracking-widest mb-3">Where Is The Pollution Coming From?</h3>
            <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed max-w-md">
              By looking at the chemical balance and salt levels in the water, our system can figure out how much pollution is coming from city sewage leaks versus farm fertilizer washing into the dam.
            </p>
            <div className="mt-6 md:mt-8 space-y-3 md:space-y-4 w-full max-w-sm">
               <div className="flex justify-between items-center text-[10px] md:text-xs font-black tracking-widest px-4 py-3 md:py-4 bg-emerald-50 rounded-xl md:rounded-2xl text-emerald-700 uppercase border border-emerald-100">
                 <span>Farm Fertilizer</span><span>{fertilizerPercentage}%</span>
               </div>
               <div className="flex justify-between items-center text-[10px] md:text-xs font-black tracking-widest px-4 py-3 md:py-4 bg-rose-50 rounded-xl md:rounded-2xl text-rose-700 uppercase border border-rose-100">
                 <span>City Sewage</span><span>{sewagePercentage}%</span>
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
  const harvestValue = Number(data.eco?.marketValue?.estimatedHarvestValue || 0);
  const rawFertilizer = Number(data.forensic?.attributionSummary?.fertilizerLoadIndex) || 45;
  const rawSewage = Number(data.forensic?.attributionSummary?.sewageLoadIndex) || 55;
  const fertilizerPercentage = Math.round((rawFertilizer / (rawFertilizer + rawSewage)) * 100);

  return (
    <div className="space-y-6 md:space-y-8">
      <SectionHeader title="Farm & Crop Safety" icon={Tractor} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-4 text-slate-900">
           <AgriMetric icon={CheckCircle} label="Livestock Drinking Water" value={data.omni?.scientificIntelligence?.livestockDrinkingSafety || "Marginal"} status="Safety Check" />
           <AgriMetric icon={Waves} label="Soil Salt Levels" value={data.omni?.scientificIntelligence?.soilSalinityRisk || "Stable"} status="Irrigation Check" />
           <AgriMetric icon={Thermometer} label="Soil Water Absorption" value={data.irrigation?.soilHealthMetrics?.sodiumAdsorptionRatio || "1.2"} status="Soil Health" />
           <AgriMetric icon={Wind} label="Weed Growth Chance" value={data.bloom?.riskMetrics?.bloomProbability || "75%"} status="Forecast" />
        </div>
        <div className="bg-emerald-600 p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[250px] md:min-h-[300px] text-white">
           <Coins className="absolute -right-6 -bottom-6 md:-right-10 md:-bottom-10 opacity-10 rotate-12" size={250} />
           <div className="relative z-10">
             <Leaf size={32} className="mb-6 md:mb-10 text-emerald-100" />
             <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2 md:mb-4">Value of Harvested Weeds</p>
             <h4 className="text-5xl md:text-7xl font-black italic tracking-tighter shrink-0">R{harvestValue > 1000000 ? `${(harvestValue/1000000).toFixed(1)}M` : harvestValue.toLocaleString()}</h4>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mt-8">
        <div className="bg-white border border-slate-200 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-sm flex flex-col">
          <h3 className="text-[10px] md:text-xs font-black uppercase text-slate-800 tracking-widest mb-6 border-b border-slate-100 pb-4 flex items-center gap-2">
            <Sprout size={16} className="text-emerald-600" /> Is the Water Safe for Crops?
          </h3>
          <div className="space-y-1">
            <TelemetryRow label="Salt Content (Conductivity)" value={`${data.omni?.scientificIntelligence?.rawMetrics?.ec?.toFixed(2)} µS/cm`} color={data.omni?.scientificIntelligence?.rawMetrics?.ec > 75 ? "rose" : "emerald"} highlight />
            <p className="text-xs text-slate-500 italic px-1 pb-3">High salt levels make it hard for plant roots to drink water, which hurts crop growth.</p>
            <TelemetryRow label="pH Level" value={data.chatbot?.scientificContext?.phValue?.toFixed(2)} color={data.chatbot?.scientificContext?.phValue > 8.5 ? "amber" : "emerald"} highlight />
            <p className="text-xs text-slate-500 italic px-1 pb-3">If the water is too alkaline (high pH), the soil loses important nutrients.</p>
            <TelemetryRow label="Nitrate Levels" value={`${data.chatbot?.scientificContext?.nitrateLevel?.toFixed(2)} mg/L`} color="blue" highlight />
            <p className="text-xs text-slate-500 italic px-1 pb-1">These nitrates act like free fertilizer in the water. You may want to use less commercial fertilizer.</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl flex flex-col text-white relative overflow-hidden">
          <Droplet className="absolute -right-10 -bottom-10 opacity-5 rotate-12" size={250} />
          <h3 className="text-[10px] md:text-xs font-black uppercase text-emerald-400 tracking-widest mb-6 border-b border-slate-700 pb-4 relative z-10 flex items-center gap-2">
            <RefreshCw size={16} /> Farm Runoff Warning
          </h3>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <p className="text-sm font-medium text-slate-300 leading-relaxed mb-6">Rain washes fertilizer from nearby farms into the dam, which feeds the invasive water hyacinth.</p>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 mb-6">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Estimated Farm Runoff in Dam</p>
              <h4 className="text-5xl font-black italic tracking-tighter text-emerald-400">{fertilizerPercentage}%</h4>
              <p className="text-xs text-slate-400 mt-2 font-bold">Of the total pollution feeding weeds in the main dam.</p>
            </div>
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-xs font-black italic uppercase text-emerald-300 leading-relaxed">Advice: Try not to apply fertilizer right before heavy rain. This helps stop it from washing into the dam.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

//Audit Log & System History
const AuditLogModule = ({ data, tableData, dateRange, setDateRange, isAuditLoading, onUpdateAudit, communityReports }: any) => {
  
  const handleDownloadCSV = () => {
    if (!tableData || tableData.length === 0) return;
    const headers = ["Timestamp", "Nitrates (mg/L)", "Phosphates (mg/L)", "pH Level", "Conductivity (µS/cm)", "Status"];
    const rows = tableData.map((row: any) => {
      const isAnomaly = row.nitrates >= 2.4 || row.phosphates >= 0.15 || row.ph > 9.0 || row.ph < 6.5;
      return `"${row.x}",${row.nitrates.toFixed(2)},${row.phosphates.toFixed(2)},${row.ph.toFixed(2)},${row.ec.toFixed(2)},${isAnomaly ? "ANOMALY" : "VERIFIED"}`;
    });
    
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Harties_Scientific_Audit.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getIssueColor = (subject: string) => {
    const s = subject?.toLowerCase() || "";
    // POLLUTION (Rose Red)
    if (s.includes("pollution") || s.includes("sewage") || s.includes("leak") || s.includes("spill")) 
        return "bg-rose-500 text-white border-rose-600 shadow-sm shadow-rose-200";
    // ALGAE BLOOM (Cyan Blue)
    if (s.includes("algae") || s.includes("bloom") || s.includes("green") || s.includes("hyacinth")) 
        return "bg-cyan-500 text-white border-cyan-600 shadow-sm shadow-cyan-200";
    // POOR WATER QUALITY (Amber Orange)
    if (s.includes("quality") || s.includes("poor") || s.includes("dirty") || s.includes("muddy") || s.includes("odor")) 
        return "bg-amber-500 text-white border-amber-600 shadow-sm shadow-amber-200";
    // OTHER (Slate Grey)
    return "bg-slate-400 text-white border-slate-500 shadow-sm";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Level Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AuditStat label="Highest Sewage Spike" value={data.audit?.historicalExtremes?.peakSewageInflowMgL?.toFixed(2)} unit="mg/L" />
        <AuditStat label="Highest Fertilizer Spike" value={data.audit?.historicalExtremes?.peakFertilizerInflowMgL?.toFixed(2)} unit="mg/L" />
        <AuditStat label="Data Accuracy" value={data.audit?.databaseHealth?.completenessPercentage || "98.2%"} unit="DATA TRUST" />
        <AuditStat label="Hardware Status" value="99.8%" unit="SENSOR UPTIME" />
      </div>
      
      {/* --- SYSTEM HISTORY TABLE --- */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-xl">
        <div className="p-8 border-b border-slate-100 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-slate-50/30">
          <div>
            <h3 className="text-xs font-black uppercase text-slate-800 tracking-[0.2em] italic flex items-center gap-2">
              <Database size={16} className="text-emerald-500" /> Full System History
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Cross-Metric Sensor Audit Log • Multi-Color Telemetry Analysis
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-inner w-full lg:w-auto">
            <Calendar size={14} className="text-emerald-500 ml-2" />
            <input type="date" value={dateRange.start} onChange={(e)=>setDateRange({...dateRange, start: e.target.value})} className="bg-transparent text-slate-700 text-[11px] font-black uppercase outline-none" style={{ colorScheme: 'light' }} />
            <div className="h-4 w-px bg-slate-200 mx-1" />
            <input type="date" value={dateRange.end} onChange={(e)=>setDateRange({...dateRange, end: e.target.value})} className="bg-transparent text-slate-700 text-[11px] font-black uppercase outline-none" style={{ colorScheme: 'light' }} />
            <button onClick={onUpdateAudit} disabled={isAuditLoading} className="bg-slate-900 text-white hover:bg-emerald-600 transition-all px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase flex items-center gap-2 disabled:opacity-50">
              {isAuditLoading ? <RefreshCw size={12} className="animate-spin" /> : "Sync Sensors"}
            </button>
            <button onClick={handleDownloadCSV} className="bg-emerald-600 text-white hover:bg-emerald-500 transition-all px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase flex items-center gap-2 shadow-lg shadow-emerald-500/20">
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[550px] custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 text-[10px] font-black uppercase text-slate-400 tracking-widest sticky top-0 z-20">
              <tr>
                <th className="px-10 py-5">Timestamp</th>
                <th className="px-6 py-5 text-center text-emerald-400">Nitrates</th>
                <th className="px-6 py-5 text-center text-blue-400">Phosphates</th>
                <th className="px-6 py-5 text-center text-amber-400">pH Level</th>
                <th className="px-6 py-5 text-center text-cyan-400">Salt (EC)</th>
                <th className="px-12 py-5 text-center text-white">Verification</th>
              </tr>
            </thead>
            <tbody className="text-[11px] font-bold">
              {tableData.map((row: any, i: number) => {
                const isAnomaly = row.nitrates >= 2.4 || row.phosphates >= 0.15 || row.ph > 9.0 || row.ph < 6.5;
                return (
                  <tr key={i} className={`border-b transition-colors ${isAnomaly ? 'bg-rose-50/50 hover:bg-rose-100/50 border-rose-100' : 'border-slate-50 hover:bg-slate-50/50'}`}>
                    <td className="px-10 py-4 font-mono text-slate-400">{row.x}</td>
                    <td className={`px-6 py-4 text-center ${isAnomaly && row.nitrates > 2 ? 'text-rose-700 font-black' : 'text-emerald-600 font-black'}`}>
                        {row.nitrates.toFixed(3)}
                    </td>
                    <td className={`px-6 py-4 text-center ${isAnomaly && row.phosphates > 0.1 ? 'text-rose-700 font-black' : 'text-blue-600 font-black'}`}>
                        {row.phosphates.toFixed(3)}
                    </td>
                    <td className={`px-6 py-4 text-center ${isAnomaly && (row.ph > 9 || row.ph < 6.5) ? 'text-rose-700 font-black' : 'text-amber-600 font-black'}`}>
                        {row.ph.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 text-center ${isAnomaly && row.ec > 80 ? 'text-rose-700 font-black' : 'text-cyan-600 font-black'}`}>
                        {row.ec.toFixed(1)}
                    </td>
                    <td className="px-12 py-4 text-center">
                      <span className={`px-4 py-1 border rounded-full uppercase font-black text-[9px] inline-block ${isAnomaly ? 'bg-rose-500 text-white border-rose-600 animate-pulse' : 'bg-white border-slate-200 text-slate-500'}`}>
                        {isAnomaly ? 'Anomaly' : 'Safe'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- COMMUNITY SIGHTINGS LOG --- */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-xl">
        <div className="p-8 border-b border-slate-100 bg-slate-50/30">
            <h3 className="text-xs font-black uppercase text-slate-800 tracking-[0.2em] italic flex items-center gap-2">
              <Users size={16} className="text-cyan-500" /> Community Sightings Log
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Crowdsourced incident data categorized by severity
            </p>
        </div>

        <div className="overflow-x-auto max-h-[450px] custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 text-[10px] font-black uppercase text-slate-400 tracking-widest sticky top-0 z-20">
              <tr>
                <th className="px-10 py-5">Date Submitted</th>
                <th className="px-10 py-5">Reporter</th>
                <th className="px-10 py-5 text-center">Category</th>
                <th className="px-10 py-5">Details</th>
              </tr>
            </thead>
            <tbody className="text-[11px] font-bold text-slate-600">
              {communityReports.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-10 py-16 text-center text-slate-300 text-xs uppercase tracking-[0.3em] font-black">
                    No field reports on record
                  </td>
                </tr>
              ) : (
                communityReports.map((report: any) => (
                    <tr key={report.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                      <td className="px-10 py-5 font-mono text-slate-400">{new Date(report.dateSubmitted).toLocaleDateString()}</td>
                      <td className="px-10 py-5 font-black text-slate-900 uppercase tracking-tight">{report.name}</td>
                      <td className="px-10 py-5 text-center">
                        <span className={`px-4 py-1.5 border rounded-lg uppercase font-black text-[9px] tracking-wider inline-block ${getIssueColor(report.subject)}`}>
                          {report.subject}
                        </span>
                      </td>
                      <td className="px-10 py-5 text-slate-500 italic max-w-md truncate">"{report.message}"</td>
                    </tr>
                  )
                )
              )}
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
  <div className="h-screen flex flex-col items-center justify-center bg-transparent text-emerald-600">
    <RefreshCw className="animate-spin text-emerald-500 mb-6 md:mb-8 w-[50px] h-[50px] md:w-[60px] md:h-[60px]" strokeWidth={2} />
    <p className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.5em] md:tracking-[1em] animate-pulse text-slate-400 text-center px-4">Connecting to the Dam's Sensors...</p>
  </div>
);