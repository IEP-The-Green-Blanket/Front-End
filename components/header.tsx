"use client";

import Link from "next/link";
import type React from "react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@context/AuthContext";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Language from "./language";
import ThemeSwitcher from "./theme-switcher";

const Header: React.FC = () => {
  const [isThereMedewerker, setIsThereMedewerker] = useState(false);
  const router = useRouter();
  const [isThereAdmin, setIsThereAdmin] = useState(false);
  const context = useContext(AuthContext);

  const user = context?.user;
  const logout = context?.logout;

  const trans = useTranslations("header");

  const handleLogout = async () => {
    if (logout) {
      await logout();
      router.push("/login");
      router.refresh();
    }
  };

  useEffect(() => {
    //console.log("Ingelogde user:", user); // trouble shoot
    if (user && user.rol) {
      //console.log("Rol van user:", user.rol); // trouble shoot
      const rol = user.rol.toString().toUpperCase();
      setIsThereMedewerker(rol === "WERKNEMER" || rol === "ADMIN");
      setIsThereAdmin(rol === "ADMIN");
    } else {
      setIsThereMedewerker(false);
      setIsThereAdmin(false);
    }
  }, [user]);

  return (
    <header className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity"
          >
            {trans("homepage")}
          </Link>
          <div className="h-6 w-px bg-slate-300" />
          <Language />
          <div className="h-6 w-px bg-slate-300" />
          <ThemeSwitcher />
        </div>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="px-4 py-2 text-foreground hover:text-primary hover:bg-secondary rounded-lg transition-colors"
          >
            {trans("nav.home")}
          </Link>
          <Link
            href="/tickets"
            className="px-4 py-2 text-foreground hover:text-primary hover:bg-secondary rounded-lg transition-colors"
          >
            {trans("nav.tickets")}
          </Link>
          <Link
            href="/dieren"
            className="px-4 py-2 text-foreground hover:text-primary hover:bg-secondary rounded-lg transition-colors"
          >
            {trans("nav.onzeDieren")}
          </Link>

          {isThereMedewerker && (
            <Link
              href="/toewijzing"
              className="px-4 py-2 text-foreground hover:text-primary hover:bg-secondary rounded-lg transition-colors"
            >
              {trans("nav.toewijzing")}
            </Link>
          )}

          {isThereAdmin && (
            <Link
              href="/dierenPanel"
              className="px-4 py-2 text-foreground hover:text-primary hover:bg-secondary rounded-lg transition-colors"
            >
              {trans("nav.dierenPanel")}
            </Link>
          )}

          {!user && (
            <Link
              href="/login"
              className="px-4 py-2 text-foreground hover:text-primary hover:bg-secondary rounded-lg transition-colors"
            >
              {trans("nav.login")}
            </Link>
          )}
          {user && (
            <Link
              href="/account"
              className="px-4 py-2 text-foreground hover:text-primary hover:bg-secondary rounded-lg transition-colors"
            >
              {trans("nav.account")}
            </Link>
          )}
          {user && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-foreground hover:text-primary hover:bg-secondary rounded-lg transition-colors"
            >
              {trans("nav.logout")}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
