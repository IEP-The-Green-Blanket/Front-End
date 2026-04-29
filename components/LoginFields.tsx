"use client";

import { LoginService } from "@/services/loginService";
import React from "react";
import { useRouter } from "next/navigation";
import { User, Lock, ShieldCheck, LogOut, ArrowRight, RefreshCw } from "lucide-react"; // ✅ Added RefreshCw here

export const LoginFields: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const loginName = localStorage.getItem("loginName");
    if (loginName) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const loginName = formData.get("loginName") as string;
    const password = formData.get("password") as string;

    setLoading(true);
    try {
      const response = await LoginService.loginUser(loginName, password);
      if (response.ok) {
        localStorage.setItem("loginName", loginName);
        await router.push("/");
      } else {
        const errorData = await response.json();
        console.error("Login failed:", response.status, errorData);
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    const loginName = localStorage.getItem("loginName");
    const handleLogout = () => {
      localStorage.removeItem("loginName");
      setIsLoggedIn(false);
      router.push("/");
    };

    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-slate-200 p-10 rounded-[3rem] shadow-2xl text-center relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
            <ShieldCheck size={200} />
          </div>
          
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-100">
            <ShieldCheck size={40} />
          </div>

          <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic mb-2">
            GREEN <span className="text-emerald-600 font-normal">Secure</span>
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">
            Authenticated: <span className="text-slate-900">{loginName}</span>
          </p>

          <button
            onClick={handleLogout}
            className="w-full group flex items-center justify-center gap-3 bg-slate-900 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl hover:bg-rose-600 transition-all shadow-xl active:scale-95"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">
            GREEN <span className="text-emerald-600 font-normal">Login</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">
            Green Bkanket Authentication System
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-8 md:p-12 rounded-[3rem] shadow-2xl relative">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                Login Name
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input
                  type="text"
                  name="loginName"
                  placeholder="Bart"
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
              className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-xs py-5 rounded-2xl hover:bg-emerald-600 transition-all shadow-xl disabled:opacity-50 active:scale-95 group mt-4"
            >
              {loading ? (
                <RefreshCw className="animate-spin" size={18} />
              ) : (
                <>
                  Confirm Credentials
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
              Don't have an account?
            </p>
            <a
              href="/register"
              className="w-full inline-flex items-center justify-center gap-2 py-3 border-2 border-slate-100 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 hover:border-emerald-100 transition-all"
            >
              Sign Up <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};