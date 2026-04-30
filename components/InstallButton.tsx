"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Tell TypeScript about our custom global variable
declare global {
  interface Window {
    deferredPwaPrompt?: InstallPromptEvent;
  }
}

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<InstallPromptEvent | null>(null);

  useEffect(() => {
    // 1. Check if the event was already caught by our global script in layout.tsx
    if (typeof window !== 'undefined' && window.deferredPwaPrompt) {
      setDeferredPrompt(window.deferredPwaPrompt);
    }

    // 2. Standard listener just in case it fires later
    const handler = (event: Event) => {
      event.preventDefault();
      const promptEvent = event as InstallPromptEvent;
      setDeferredPrompt(promptEvent);
      window.deferredPwaPrompt = promptEvent; // Keep global object in sync
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    // Check both React state AND the window object directly to be safe
    const promptToUse = deferredPrompt || (typeof window !== 'undefined' ? window.deferredPwaPrompt : null);

    if (!promptToUse) {
      // If we STILL don't have it, give accurate diagnostic feedback
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

      if (isStandalone) {
        alert("Project Green Blanket is already installed and running as a standalone window!");
      } else if (isIOS) {
        alert("On iOS, Apple forces you to tap the 'Share' button at the bottom of Safari and select 'Add to Home Screen'.");
      } else {
        alert("The app is ready! Please click the install icon directly in your browser's address bar at the top of the screen.");
      }
      return;
    }

    try {
      // Trigger the native popup
      await promptToUse.prompt();
      const result = await promptToUse.userChoice;
      
      if (result.outcome === "accepted") {
        console.log("User successfully installed the app");
        // Clear out the prompts so it doesn't trigger again
        setDeferredPrompt(null);
        if (typeof window !== 'undefined') window.deferredPwaPrompt = undefined;
      }
    } catch (err) {
      console.error("Install prompt error:", err);
      alert("Please use the install button located in your browser's address bar.");
    }
  };

  return (
    <button
      onClick={handleInstall}
      className="flex-1 bg-emerald-600 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 group"
      style={{ backgroundImage: "linear-gradient(180deg, #10b981 0%, #059669 100%)" }}
    >
      <Download size={16} className="group-hover:scale-110 transition-transform" />
      Install App
    </button>
  );
}