"use client";

import { useLocalStorage } from "hooks/mainHook";
import type React from "react";
import { createContext, useContext, useEffect } from "react";

type ColorTheme = "green" | "blue" | "orange" | "purple";

interface ThemeContextType {
  theme: ColorTheme;
  setTheme: (theme: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeColors = {
  green: {
    "--background": "120 25% 97%",
    "--foreground": "140 30% 20%",
    "--card": "115 30% 95%",
    "--card-foreground": "140 30% 20%",
    "--popover": "120 25% 97%",
    "--popover-foreground": "140 30% 20%",
    "--primary": "145 55% 42%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "130 40% 65%",
    "--secondary-foreground": "140 30% 20%",
    "--muted": "120 20% 90%",
    "--muted-foreground": "140 20% 35%",
    "--accent": "85 60% 55%",
    "--accent-foreground": "140 30% 20%",
    "--border": "120 20% 88%",
    "--input": "120 20% 88%",
    "--ring": "145 55% 42%",
  },
  blue: {
    "--background": "210 25% 97%",
    "--foreground": "220 30% 20%",
    "--card": "215 30% 95%",
    "--card-foreground": "220 30% 20%",
    "--popover": "210 25% 97%",
    "--popover-foreground": "220 30% 20%",
    "--primary": "215 70% 50%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "210 45% 65%",
    "--secondary-foreground": "220 30% 20%",
    "--muted": "210 20% 90%",
    "--muted-foreground": "220 20% 35%",
    "--accent": "200 70% 55%",
    "--accent-foreground": "220 30% 20%",
    "--border": "210 20% 88%",
    "--input": "210 20% 88%",
    "--ring": "215 70% 50%",
  },
  orange: {
    "--background": "35 25% 97%",
    "--foreground": "25 30% 20%",
    "--card": "30 30% 95%",
    "--card-foreground": "25 30% 20%",
    "--popover": "35 25% 97%",
    "--popover-foreground": "25 30% 20%",
    "--primary": "25 85% 55%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "35 60% 65%",
    "--secondary-foreground": "25 30% 20%",
    "--muted": "35 20% 90%",
    "--muted-foreground": "25 20% 35%",
    "--accent": "45 90% 60%",
    "--accent-foreground": "25 30% 20%",
    "--border": "35 20% 88%",
    "--input": "35 20% 88%",
    "--ring": "25 85% 55%",
  },
  purple: {
    "--background": "270 25% 97%",
    "--foreground": "280 30% 20%",
    "--card": "275 30% 95%",
    "--card-foreground": "280 30% 20%",
    "--popover": "270 25% 97%",
    "--popover-foreground": "280 30% 20%",
    "--primary": "270 70% 55%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "280 45% 65%",
    "--secondary-foreground": "280 30% 20%",
    "--muted": "270 20% 90%",
    "--muted-foreground": "280 20% 35%",
    "--accent": "290 65% 60%",
    "--accent-foreground": "280 30% 20%",
    "--border": "270 20% 88%",
    "--input": "270 20% 88%",
    "--ring": "270 70% 55%",
  },
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useLocalStorage<ColorTheme>("color-theme", "green");

  useEffect(() => {
    const colors = themeColors[theme];
    Object.entries(colors).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme moet gebruikt worden binnen een ThemeProvider");
  }
  return context;
};
