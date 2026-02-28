"use client";

import { useState } from "react";

export default function Home() {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center px-6">
        <h1 className="text-5xl font-bold mb-4">Welkom!</h1>
        <p className="text-xl mb-8 opacity-90">
          This will be The Green Blanket website.
        </p>
        <button
          onClick={() => {
            const newState = !isPressed;
            setIsPressed(newState);
            console.log("isPressed:", newState);
          }}
          className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
        >
          {isPressed
            ? "What does this button do?"
            : "We dont know but maby later somthing cool :)"}
        </button>
      </div>
    </div>
  );
}
