"use client";

import { useEffect, useState } from "react";

// looks at the input of the user and returns accepted or dismissed
interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<InstallPromptEvent | null>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // checks one time of the first load of the page if the user can install the app, if so, it shows the button
    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as InstallPromptEvent);
      setShowButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // installs the app when the user clicks on the button, and then hides the button again
  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;

    if (result.outcome === "accepted") {
      console.log("User installed the app");
    }

    setDeferredPrompt(null);
    setShowButton(false);
  };

  if (!showButton) return null;

  // makes the style of the button and when user clicks on it, it fires the prompt to install the app
  return (
    <section
      aria-label="Install the app"
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        margin: "0.25rem auto 0.75rem",
      }}
    >
      <button
        onClick={handleInstall}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "auto",
          padding: "0.7rem 1rem",
          backgroundColor: "#2e7d32",
          backgroundImage: "linear-gradient(180deg, #418f46 0%, #2e7d32 100%)",
          color: "white",
          border: "1px solid rgba(46, 125, 50, 0.35)",
          borderRadius: "999px",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: "0.92rem",
          boxShadow: "0 4px 10px rgba(46, 125, 50, 0.14)",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.transform = "translateY(-1px)";
          event.currentTarget.style.boxShadow =
            "0 6px 14px rgba(46, 125, 50, 0.2)";
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.transform = "translateY(0)";
          event.currentTarget.style.boxShadow =
            "0 4px 10px rgba(46, 125, 50, 0.14)";
        }}
      >
        Install the app
      </button>
    </section>
  );
}
