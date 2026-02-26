"use client";

import { useState } from "react";

export default function Home() {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <>
      <h2>Welkom bij de interactieve knop!</h2>
      <p>Houd de knop ingedrukt om hem rood te maken.</p>

      <button
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        style={{
          backgroundColor: isPressed ? "green" : "blue",
          color: "white",
          padding: "10px 20px",
          fontSize: "16px",
          transition: "background-color 0.1s", // Maakt de overgang soepel
        }}
      >
        {isPressed ? "Ik ben green!" : "Houd mij ingedrukt"}
      </button>
    </>
  );
}
