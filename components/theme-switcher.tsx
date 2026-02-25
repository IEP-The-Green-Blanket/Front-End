"use client";

import { useTheme } from "@context/ThemeContext";
import { Palette } from "lucide-react";
import { useState } from "react";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    {
      id: "green" as const,
      label: "Groen",
      color: "bg-green-600",
      hoverColor: "hover:bg-green-700",
    },
    {
      id: "blue" as const,
      label: "Blauw",
      color: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
    },
    {
      id: "orange" as const,
      label: "Oranje",
      color: "bg-orange-600",
      hoverColor: "hover:bg-orange-700",
    },
    {
      id: "purple" as const,
      label: "Paars",
      color: "bg-purple-600",
      hoverColor: "hover:bg-purple-700",
    },
  ];

  const currentTheme = themes.find((t) => t.id === theme) || themes[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
        aria-label="Selecteer kleurthema"
      >
        <Palette className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">
          {currentTheme.label}
        </span>
        <svg
          className={`w-4 h-4 text-muted-foreground transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white border border-border rounded-lg shadow-lg z-20 overflow-hidden">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors ${
                  theme === t.id ? "bg-secondary" : ""
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full ${t.color} ${t.hoverColor} shadow-sm`}
                />
                <span className="text-sm font-medium text-foreground">
                  {t.label}
                </span>
                {theme === t.id && (
                  <svg
                    className="w-4 h-4 ml-auto text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
