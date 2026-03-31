"use client";

import React from "react";

interface AnalysisChartProps {
  level: 1 | 2 | 3 | 4 | 5;
}

export const AnalysisChart: React.FC<AnalysisChartProps> = ({ level }) => {
  const chartData = {
    1: { text: "Very Low", color: "bg-red-500", percentage: "20%" },
    2: { text: "Low", color: "bg-orange-500", percentage: "40%" },
    3: { text: "Medium", color: "bg-yellow-500", percentage: "60%" },
    4: { text: "High", color: "bg-lime-500", percentage: "80%" },
    5: { text: "Very High", color: "bg-green-500", percentage: "100%" },
  };

  const current = chartData[level];

  return (
    <div className="w-full p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Analysis Level</h2>
        <p className="text-sm text-gray-600">{current.text}</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full ${current.color} transition-all duration-300`}
          style={{ width: current.percentage }}
        />
      </div>
      <div className="mt-2 text-xs text-gray-500">Level {level} of 5</div>
    </div>
  );
};
