"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem("loginName");
    setIsLoggedIn(Boolean(storedUser));
  }, []);

  if (pathname === "/offline") {
    return null;
  }

  return (
    <header className="site-header">
      {/* 'Mobile' layout */}
      <div className="headerGrid">
        <img src="/images/green_wrt.png" className="max-w-21" alt="" />
        <Link href="/" className="logo-link">
          <img
            src="/images/Green_Blanket.png"
            alt="..."
            className="logo fuseColTwo"
          />
        </Link>
        <img src="/images/blanket_wrt.png" className="max-w-25" alt="" />
        <Link href="/">
          <img
            src="/images/btn_home.png"
            alt="oval-shaped button reading 'home' with a green frame and a house in the upper right corner."
            className="transition-transform duration-15 active:scale-90"
          />
        </Link>
        <Link href="/login">
          <img
            src={
              isLoggedIn ? "/images/btn_logout.png" : "/images/btn_login.png"
            }
            alt={
              isLoggedIn
                ? "oval-shaped button reading 'logout' with a green frame and a logout icon in the upper right corner."
                : "oval-shaped button reading 'login' with a greem frame and a person icon in the upper right corner."
            }
            className="transition-transform duration-15 active:scale-90"
          />
        </Link>
        <Link href="/reporting">
          <img
            src="/images/btn_alert_us.png"
            alt="oval-shaped button reading 'alert us' with a green frame and a megaphone in the upper right corner."
            className="transition-transform duration-15 active:scale-90"
          />
        </Link>
        <Link href="/analysis">
          <img
            src="/images/btn_analysis.png"
            alt="oval-shaped button reading 'analysis' with a green frame and a chart in the upper right corner."
            className="transition-transform duration-15 active:scale-90"
          />
        </Link>
        <Link href="/chatbot">
          <img
            src="/images/btn_contact.png"
            alt="oval-shaped button reading 'chatbot' with a green frame and a information icon in the upper right corner."
            className="ransition-transform duration-15 active:scale-90"
          />
        </Link>
      </div>
    </header>
  );
}
