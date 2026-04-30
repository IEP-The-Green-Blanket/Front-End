import { AlertTriangle, CheckCircle, ShieldAlert, Loader2, Activity, Info } from "lucide-react";

// The 4 distinct levels + an analyzing state
export type DamLevel = "safe" | "moderate" | "poor" | "unsafe" | "analyzing";

// THIS HELPER ENSURES BOTH COMPONENTS ALWAYS AGREE
export function calculateDamLevel(score: number): DamLevel {
  if (score >= 75) return "safe";
  if (score >= 50) return "moderate";
  if (score >= 30) return "poor";
  return "unsafe";
}

interface DamStatusBannerProps {
  level: DamLevel;
  activeMetric?: string;
}

export function DamStatusBanner({ level, activeMetric }: DamStatusBannerProps) {
  const config = {
    analyzing: {
      bg: "bg-slate-900 border-slate-700",
      text: "text-slate-300",
      pulseColor: "bg-slate-500",
      icon: <Loader2 className="animate-spin shrink-0" size={24} />,
      message: "ANALYZING",
    },
    safe: {
      // 75 - 100
      bg: "bg-emerald-500 border-emerald-600 shadow-[0_10px_25px_-5px_rgba(16,185,129,0.4)]",
      text: "text-white",
      pulseColor: "bg-red-500", 
      icon: <CheckCircle className="shrink-0" size={28} />,
      message: "SAFE",
    },
    moderate: {
      // 50 - 74
      bg: "bg-blue-500 border-blue-600 shadow-[0_10px_25px_-5px_rgba(59,130,246,0.4)]",
      text: "text-white",
      pulseColor: "bg-red-500",
      icon: <Info className="shrink-0" size={28} />,
      message: "MODERATE",
    },
    poor: {
      // 30 - 49
      bg: "bg-amber-500 border-amber-600 shadow-[0_10px_25px_-5px_rgba(245,158,11,0.4)]",
      text: "text-slate-900",
      pulseColor: "bg-red-600",
      icon: <AlertTriangle className="shrink-0" size={28} />,
      message: "POOR",
    },
    unsafe: {
      // 0 - 29
      bg: "bg-red-600 border-red-700 shadow-[0_10px_25px_-5px_rgba(220,38,38,0.5)]",
      text: "text-white",
      pulseColor: "bg-white",
      icon: <ShieldAlert className="animate-pulse shrink-0" size={28} />,
      message: "UNSAFE",
    },
  };

  const active = config[level];

  return (
    <div className={`w-full ${active.bg} border-b-2 px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3 z-50 relative transition-all duration-700`}>
      {/* LEFT: Live Pulse */}
      <div className={`flex items-center gap-2 ${level === 'poor' ? 'text-amber-900' : 'text-white'} text-[10px] md:text-xs font-black uppercase tracking-widest w-full md:w-64 justify-center md:justify-start`}>
        <div className="relative flex h-3 w-3">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${active.pulseColor} opacity-75`}></span>
          <span className={`relative inline-flex rounded-full h-3 w-3 ${active.pulseColor}`}></span>
        </div>
        LIVE
      </div>

      {/* CENTER: Massive Simple Text (Max 2 words) */}
      <div className="flex items-center gap-3">
        <div className={`${active.text} drop-shadow-md`}>
          {active.icon}
        </div>
        <span className={`text-2xl md:text-3xl font-black uppercase tracking-[0.2em] text-center ${active.text} drop-shadow-sm`}>
          {active.message}
        </span>
      </div>

      {/* RIGHT: Metric Readout */}
      <div className={`flex items-center gap-2 ${level === 'poor' ? 'text-amber-900' : 'text-white/80'} text-[10px] md:text-xs font-bold uppercase tracking-widest w-full md:w-64 justify-center md:justify-end`}>
        {activeMetric && level !== "analyzing" && (
          <>
            <Activity size={14} />
            <span className="truncate">{activeMetric}</span>
          </>
        )}
      </div>
    </div>
  );
}