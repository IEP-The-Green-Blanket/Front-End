"use client";

import { useState } from "react";
import { WeatherTestService } from "@/services/weatherTestService";
import { weather } from "../types";

export default function Home() {
  const [isPressed, setIsPressed] = useState(false);
  const [weatherData, setWeatherData] = useState<weather[]>([]);
  const [loading, setLoading] = useState(false);

  const handleButtonClick = async () => {
    const newState = !isPressed;
    setIsPressed(newState);

    if (newState && weatherData.length === 0) {
      setLoading(true);
      try {
        const data = await WeatherTestService.getWeatherData();
        setWeatherData(data);
      } catch (error) {
        console.error("Oeps:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center px-6 mb-12">
        <h1 className="text-5xl font-bold mb-4">Welkom!</h1>
        <p className="text-xl mb-8 opacity-90">
          This will be The Green Blanket website.
        </p>

        <button
          onClick={handleButtonClick}
          className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
        >
          {loading
            ? "Loading..."
            : isPressed
              ? "Hide Weather"
              : "Show WeatherMessage"}
        </button>
      </div>

      {isPressed && weatherData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full max-w-6xl">
          {weatherData.map((day, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 text-gray-800"
            >
              <p className="font-semibold text-blue-500 uppercase text-xs tracking-widest">
                {new Date(day.date).toLocaleDateString("nl-NL", {
                  weekday: "short",
                  day: "numeric",
                })}
              </p>
              <h2 className="text-4xl font-bold my-2">{day.temperatureC}°C</h2>
              <p className="text-gray-500 italic">"{day.summary}"</p>
              <p className="text-xs text-gray-400 mt-2">{day.temperatureF}°F</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
