"use client";

import React from "react";

export const AnalysisComponent: React.FC = () => {
  // make dict chartDate
  const chartData = {
    1: { title: "very low Analysis", value: 45 },
    2: { title: "low Analysis", value: 62 },
    3: { title: "mid Analysis", value: 78 },
    4: { title: "high Analysis", value: 85 },
    5: { title: "very high Analysis", value: 92 },
  } as const;

  // set witch analyse will be showed in the "cube" (default is 1)
  type Level = keyof typeof chartData;
  const [selectedLevel, setSelectedLevel] = React.useState<Level>(1);
  // data = what is in the {} of chartData example: if level = 1, than data = {title: "Level 1 Analysis", value: 45}
  const data = chartData[selectedLevel];
  console.log(data);

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* the "cube" is build here where we can see the analysis */}
      <div className="w-full">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4">{data.title}</h2>
          <div className="w-full h-40 bg-linear-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
            <p className="text-white text-2xl font-bold">{data.value}%</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {/* loop over all the keys of chartData as lvl */}
        {Object.keys(chartData).map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(Number(lvl) as Level)}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
              selectedLevel === Number(lvl)
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>
    </div>
  );
};
