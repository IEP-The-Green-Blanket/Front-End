import { StatusDisplay } from "@/components/StatusDisplay";
import { ArrowRight, Microscope, Tractor, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent font-sans selection:bg-emerald-100">
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-40 px-4 overflow-hidden">
        
        {/* Cinematic Watermark (Mobile Hidden) */}
        <div className="absolute top-10 left-10 opacity-[0.1] pointer-events-none select-none hidden lg:block">
          <h1 className="text-[18rem] font-black italic tracking-tighter leading-none uppercase">Pillar 11</h1>
        </div>

        <div className="max-w-7xl mx-auto space-y-16 md:space-y-24 relative z-10">
          
          {/* HERO TYPOGRAPHY */}
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full mb-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">Project Green Blanket: Online</span>
            </div>
            <h2 className="text-4xl md:text-8xl font-black tracking-tighter text-slate-900 uppercase italic leading-[0.9]">
              Reclaiming <span className="text-emerald-600 font-normal">the Water.</span><br />
              Intelligence <span className="text-slate-400 font-thin italic">First.</span>
            </h2>
            <p className="text-base md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed px-4">
              A smart environmental system powered by live sensors and in depth analysis to track down pollution and restore Hartbeespoort.
            </p>
          </div>

          {/* THE LIVE PULSE HUD */}
          <StatusDisplay />

          {/* FEATURES GRID (Mobile Stacks Automatically) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4">
            <FeatureCard 
              icon={Microscope}
              title="Forensic Profiling" 
              desc="Deep analysis of Redfield Ratios to distinguish sewage from agricultural load."
            />
            <FeatureCard 
              icon={Tractor}
              title="Agri-Suitability" 
              desc="Real-time irrigation safety scores and root-zone salinity assessments for local farmers."
            />
            <FeatureCard 
              icon={ShieldCheck}
              title="Public Verification" 
              desc="Crowd-sourced field reports validating sensor veracity across all dam sectors."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

const FeatureCard = ({ icon: Icon, title, desc }: any) => (
  <div className="bg-white border border-slate-200 p-8 md:p-10 rounded-[2.5rem] hover:shadow-2xl transition-all hover:translate-y-[-5px] group">
    <div className="p-3 bg-slate-50 rounded-2xl w-fit mb-6 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 mb-4">{title}</h3>
    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">{desc}</p>
    <Link href="/analysis" className="text-[10px] font-black uppercase tracking-widest text-emerald-600 group-hover:text-emerald-500 flex items-center gap-2">
      View Module <ArrowRight size={14} />
    </Link>
  </div>
);