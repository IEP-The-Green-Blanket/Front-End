"use client";

import { LoginService } from "@/services/loginService";
import { useRouter } from "next/navigation";
import React from "react";
import { User, Lock, Mail, ArrowRight, RefreshCw } from "lucide-react";

export const RegisterFields: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const username = localStorage.getItem("loginName");
    if (username) {
      setIsLoggedIn(true);
    }
  }, [router]); // ✅ Size is now constant

  const handleRegister = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const email = formData.get("email") as string;

    setLoading(true);
    try {
      const response = await LoginService.registerUser(username, password, email);
      if (response.ok) {
        localStorage.setItem("loginName", username);
        router.push("/");
      } else {
        const errorData = await response.json();
        console.error("Register failed:", response.status, errorData);
      }
    } catch (error) {
      console.error("Register failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-transparent font-sans">
      <div className="w-full max-w-md">
        
        {/* --- Header Area --- */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">
            Green <span className="text-emerald-600 font-normal">Registration</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">
            Green Blanket Signup Portal
          </p>
        </div>

        {/* --- Solid Registration Card --- */}
        <div className="bg-white border border-slate-200 p-8 md:p-12 rounded-[3rem] shadow-2xl relative">
          <form className="space-y-5" onSubmit={handleRegister}>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                Register your name
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input
                  type="text"
                  name="username"
                  placeholder="Bart"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-900 placeholder:text-slate-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="bart@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-900 placeholder:text-slate-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-900 placeholder:text-slate-300"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-xs py-5 rounded-2xl hover:bg-emerald-600 transition-all shadow-xl disabled:opacity-50 active:scale-95 group mt-6"
            >
              {loading ? (
                <RefreshCw className="animate-spin" size={18} />
              ) : (
                <>
                  Confirm
                  <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
              Already have an account?
            </p>
            <a
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 py-3 border-2 border-slate-100 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 hover:border-emerald-100 transition-all"
            >
              Return to Login <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal Helper for the Icon
const UserPlus = ({ size, className }: { size: number, className: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>
  </svg>
);