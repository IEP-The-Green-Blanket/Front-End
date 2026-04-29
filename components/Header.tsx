"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, AlertTriangle, LayoutDashboard, MessageSquare, LogIn, LogOut } from "lucide-react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem("loginName");
    setIsLoggedIn(Boolean(storedUser));
  }, [pathname]);

  if (pathname === "/offline") {
    return null;
  }

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Analytics", path: "/analysis", icon: LayoutDashboard },
    { name: "Report Hazard", path: "/reporting", icon: AlertTriangle },
    { name: "AI Assistant", path: "/chatbot", icon: MessageSquare },
  ];

  return (
    <>
      {/* --- DESKTOP HEADER --- */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 hidden md:block">
        <div className="max-w-[1650px] mx-auto bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg rounded-[2.5rem] px-8 py-3 flex items-center justify-between transition-all">
          
          {/* OG Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/images/green_wrt.png" className="h-5 object-contain opacity-90" alt="Green" />
            <img 
              src="/images/Green_Blanket.png" 
              className="h-12 object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm" 
              alt="Green Blanket Logo" 
            />
            <img src="/images/blanket_wrt.png" className="h-5 object-contain opacity-90" alt="Blanket" />
          </Link>

          {/* Center Navigation (Lucide Icons) */}
          <nav className="flex items-center gap-2 lg:gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link 
                  key={link.name} 
                  href={link.path}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    isActive 
                    ? "bg-slate-900 text-white shadow-md" 
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <link.icon size={16} className={isActive ? "text-emerald-400" : "text-slate-400"} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Auth Button */}
          <Link href="/login">
            <button className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 ${
              isLoggedIn 
              ? "border-rose-100 text-rose-600 bg-rose-50 hover:bg-rose-100" 
              : "border-slate-200 text-slate-900 bg-white hover:border-emerald-500 hover:text-emerald-600"
            }`}>
              {isLoggedIn ? <LogOut size={16} /> : <LogIn size={16} />}
              <span className="hidden xl:inline">{isLoggedIn ? "Logout" : "Operator Login"}</span>
            </button>
          </Link>

        </div>
      </header>

      {/* --- MOBILE TOP BAR (Logos Only) --- */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-sm flex justify-center items-center">
        <Link href="/" className="flex items-center gap-2">
          <img src="/images/green_wrt.png" className="h-3.5 object-contain" alt="Green" />
          <img src="/images/Green_Blanket.png" className="h-8 object-contain drop-shadow-sm" alt="Logo" />
          <img src="/images/blanket_wrt.png" className="h-3.5 object-contain" alt="Blanket" />
        </Link>
      </header>

      {/* --- MOBILE NAVIGATION (Bottom Bar with Lucide Icons) --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-slate-200 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <nav className="flex justify-around items-center px-2 py-3">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link 
                key={link.name} 
                href={link.path}
                className="flex flex-col items-center gap-1.5 p-2 w-16"
              >
                <div className={`p-2 rounded-xl transition-all ${
                  isActive ? "bg-emerald-100 text-emerald-600 scale-110" : "text-slate-400"
                }`}>
                  <link.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[9px] font-black uppercase tracking-wider text-center ${
                  isActive ? "text-emerald-700" : "text-slate-400"
                }`}>
                  {link.name.split(' ')[0]} {/* Keep text short for mobile */}
                </span>
              </Link>
            );
          })}
          
          {/* Mobile Auth Button */}
          <Link href="/login" className="flex flex-col items-center gap-1.5 p-2 w-16">
            <div className={`p-2 rounded-xl transition-all ${
              pathname === "/login" ? "bg-slate-900 text-emerald-400 scale-110" : "text-slate-400"
            }`}>
              {isLoggedIn ? <LogOut size={20} /> : <LogIn size={20} />}
            </div>
            <span className={`text-[9px] font-black uppercase tracking-wider text-center ${
              pathname === "/login" ? "text-slate-900" : "text-slate-400"
            }`}>
              {isLoggedIn ? "Logout" : "Login"}
            </span>
          </Link>
        </nav>
      </div>
    </>
  );
}