"use client";

import React, { useEffect, useState } from "react";
import { analysisService } from "@/services/analysisService";
import { DataPoint } from "@/types";

const years = [2021, 2022, 2023, 2024, 2025, 2026];

const metricConfig = [
  {
    key: "ph" as const,
    label: "pH",
    description: "Acidity",
    accent: "#0ea5e9",
    gradientFrom: "from-sky-500",
    gradientTo: "to-sky-700",
  },
  {
    key: "nitrates" as const,
    label: "Nitrates",
    description: "Nutrient load",
    accent: "#16a34a",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-emerald-700",
  },
  {
    key: "phosphates" as const,
    label: "Phosphates",
    description: "Algae driver",
    accent: "#14b8a6",
    gradientFrom: "from-teal-500",
    gradientTo: "to-teal-700",
  },
  {
    key: "ec" as const,
    label: "EC",
    description: "Conductivity",
    accent: "#7c3aed",
    gradientFrom: "from-violet-500",
    gradientTo: "to-violet-700",
  },
];

const chartWidth = 640;
const chartHeight = 240;
const chartPadding = { top: 20, right: 24, bottom: 42, left: 44 };
const monthLabels = [
  "Jan",
  "Feb",
  "Mrt",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Okt",
  "Nov",
  "Dec",
];

export const AnalysisComponent: React.FC = () => {
  const [selectedMetric, setSelectedMetric] =
    useState<(typeof metricConfig)[number]["key"]>("ph");

  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // checks if the user is loged in or not
  useEffect(() => {
    const loginName = localStorage.getItem("loginName");
    if (loginName) {
      setIsLoggedIn(true);
    }
    // [] makes it that it only runs once when the user visits.
  }, []);

  // fetches data from analysisService
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await analysisService.getHistoryByYear(selectedYear);
        setDataPoints(result.dataPoints || []);
      } catch (error) {
        console.error("Fout bij ophalen van data in component:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedYear, isLoggedIn]);

  // help fucntion to calculate the average
  const getAverage = (key: keyof Omit<DataPoint, "x">) => {
    if (dataPoints.length === 0) return "0.00";
    const sum = dataPoints.reduce((acc, curr) => acc + (curr[key] || 0), 0);
    return (sum / dataPoints.length).toFixed(2);
  };

  const formatAxisLabel = (value: number) => value.toFixed(1);

  const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value));

  const getMonthPosition = (dateText: string) => {
    const directDate = new Date(dateText);
    if (!Number.isNaN(directDate.getTime())) {
      const month = directDate.getMonth();
      const day = directDate.getDate();
      return clamp(month + (day - 1) / 31, 0, 11.99);
    }

    const dayFirst = dateText.match(
      /^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{2,4})$/,
    );
    if (dayFirst) {
      const day = Number(dayFirst[1]);
      const month = Number(dayFirst[2]) - 1;
      if (month >= 0 && month <= 11) {
        return clamp(month + (day - 1) / 31, 0, 11.99);
      }
    }

    const yearFirst = dateText.match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})$/);
    if (yearFirst) {
      const month = Number(yearFirst[2]) - 1;
      const day = Number(yearFirst[3]);
      if (month >= 0 && month <= 11) {
        return clamp(month + (day - 1) / 31, 0, 11.99);
      }
    }

    return null;
  };

  const buildChartPoints = (key: keyof Omit<DataPoint, "x">) => {
    if (dataPoints.length === 0) {
      return {
        points: [],
        linePath: "",
        areaPath: "",
        minValue: 0,
        maxValue: 1,
        monthTicks: [] as { x: number; label: string }[],
      };
    }

    const values = dataPoints.map((point) => point[key]);
    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);
    const padding = (rawMax - rawMin || Math.max(Math.abs(rawMax), 1)) * 0.15;
    const minValue = rawMin - padding;
    const maxValue = rawMax + padding;
    const usableWidth = chartWidth - chartPadding.left - chartPadding.right;
    const usableHeight = chartHeight - chartPadding.top - chartPadding.bottom;
    const range = maxValue - minValue || 1;

    const monthPositions = dataPoints.map((point, index) => {
      const fallback =
        dataPoints.length === 1 ? 5.5 : (index / (dataPoints.length - 1)) * 11;
      return getMonthPosition(point.x) ?? fallback;
    });

    const minMonthRaw = Math.min(...monthPositions);
    const maxMonthRaw = Math.max(...monthPositions);
    const domainStart = minMonthRaw;
    const domainEnd = maxMonthRaw;
    const monthRange = Math.max(domainEnd - domainStart, 0.25);

    const toX = (monthPos: number) =>
      chartPadding.left + ((monthPos - domainStart) / monthRange) * usableWidth;

    const points = dataPoints
      .map((point, index) => {
        const x = toX(monthPositions[index]);
        const y =
          chartHeight -
          chartPadding.bottom -
          ((point[key] - minValue) / range) * usableHeight;

        return {
          x,
          y,
          value: point[key],
          monthPosition: monthPositions[index],
        };
      })
      .sort((a, b) => a.monthPosition - b.monthPosition);

    const monthTickStart = Math.max(0, Math.floor(domainStart));
    const monthTickEnd = Math.min(11, Math.ceil(domainEnd));
    const monthTicks = Array.from(
      { length: monthTickEnd - monthTickStart + 1 },
      (_, offset) => {
        const monthIndex = monthTickStart + offset;
        return {
          x: toX(monthIndex),
          label: monthLabels[monthIndex],
        };
      },
    );

    const linePath = points
      .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
      .join(" ");

    const areaPath =
      points.length > 0
        ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - chartPadding.bottom} L ${points[0].x} ${chartHeight - chartPadding.bottom} Z`
        : "";

    return {
      points,
      linePath,
      areaPath,
      minValue,
      maxValue,
      monthTicks,
    };
  };

  const renderMetricChart = (metric: (typeof metricConfig)[number]) => {
    const chart = buildChartPoints(metric.key);

    return (
      <article
        key={metric.key}
        className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              {metric.description}
            </p>
            <h3 className="text-xl font-bold text-gray-900">{metric.label}</h3>
          </div>
          <div
            className={`rounded-full bg-linear-to-r ${metric.gradientFrom} ${metric.gradientTo} px-3 py-1 text-xs font-semibold text-white`}
          >
            Avg. {getAverage(metric.key)}
          </div>
        </div>

        {chart.points.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                role="img"
                aria-label={`${metric.label} trend for ${selectedYear}`}
                className="min-w-65 w-full h-44 sm:h-56"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id={`fill-${metric.key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={metric.accent}
                      stopOpacity="0.35"
                    />
                    <stop
                      offset="100%"
                      stopColor={metric.accent}
                      stopOpacity="0.03"
                    />
                  </linearGradient>
                </defs>

                {[0, 1, 2, 3].map((gridLine) => {
                  const y =
                    chartPadding.top +
                    ((chartHeight - chartPadding.top - chartPadding.bottom) /
                      3) *
                      gridLine;
                  const value =
                    chart.maxValue -
                    ((chart.maxValue - chart.minValue) / 3) * gridLine;

                  return (
                    <g key={gridLine}>
                      <line
                        x1={chartPadding.left}
                        x2={chartWidth - chartPadding.right}
                        y1={y}
                        y2={y}
                        stroke="#e5e7eb"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={chartPadding.left - 8}
                        y={y + 4}
                        textAnchor="end"
                        className="fill-gray-500 text-[10px]"
                      >
                        {formatAxisLabel(value)}
                      </text>
                    </g>
                  );
                })}

                {chart.monthTicks.map((tick, index) => (
                  <g key={`${metric.key}-month-${index}`}>
                    <line
                      x1={tick.x}
                      x2={tick.x}
                      y1={chartPadding.top}
                      y2={chartHeight - chartPadding.bottom}
                      stroke="#e5e7eb"
                    />
                    <text
                      x={tick.x}
                      y={chartHeight - 16}
                      textAnchor="middle"
                      className="fill-gray-600 text-[10px]"
                    >
                      {tick.label}
                    </text>
                  </g>
                ))}

                <path d={chart.areaPath} fill={`url(#fill-${metric.key})`} />
                <path
                  d={chart.linePath}
                  fill="none"
                  stroke={metric.accent}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {chart.points.map((point, index) => (
                  <g key={`${metric.key}-point-${index}`}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="5"
                      fill="white"
                      stroke={metric.accent}
                      strokeWidth="3"
                    />
                  </g>
                ))}
              </svg>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3 sm:gap-3">
              <div className="rounded-xl bg-gray-50 p-2.5 sm:p-3">
                <p className="text-gray-500">Low</p>
                <p className="text-base font-semibold text-gray-900">
                  {chart.minValue.toFixed(2)}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-2.5 sm:p-3">
                <p className="text-gray-500">High</p>
                <p className="text-base font-semibold text-gray-900">
                  {chart.maxValue.toFixed(2)}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-44 items-center justify-center rounded-2xl bg-gray-50 text-gray-500 sm:h-56">
            No data for this metric.
          </div>
        )}
      </article>
    );
  };

  const activeMetric =
    metricConfig.find((metric) => metric.key === selectedMetric) ??
    metricConfig[0];

  if (!isLoggedIn) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-3 py-4 sm:gap-6 sm:px-6 sm:py-6 lg:px-8">
        <section className="rounded-3xl border border-gray-200 bg-white/95 p-4 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
            Analysis dashboard
          </p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            Sign in to view the water quality graphs
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-700 sm:text-base">
            The charts show yearly trends for pH, nitrates, phosphates, and EC.
            Log in first to see the full history.
          </p>
          <a
            href="/login"
            className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 sm:w-auto"
          >
            Login here
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-3 py-4 sm:gap-6 sm:px-6 sm:py-6 lg:px-8">
      <section className="rounded-3xl border border-gray-200 bg-white/95 p-4 shadow-sm sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
          Year
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`rounded-2xl px-3 py-2 text-xs font-semibold transition sm:px-4 sm:py-3 sm:text-sm ${
                selectedYear === year
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </section>
      <section className="rounded-3xl border border-gray-200 bg-white/95 p-4 shadow-sm sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
              Analysis {selectedYear}
            </p>
          </div>
          <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-900">
            <p className="font-semibold">Data points</p>
            <p>{dataPoints.length} measurements</p>
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-gray-200 bg-gray-50 p-3 sm:mt-6 sm:p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
            Select graph
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {metricConfig.map((metric) => (
              <button
                key={metric.key}
                type="button"
                onClick={() => setSelectedMetric(metric.key)}
                className={`rounded-2xl px-3 py-2 text-xs font-semibold transition sm:px-4 sm:py-3 sm:text-sm ${
                  selectedMetric === metric.key
                    ? `bg-linear-to-r ${metric.gradientFrom} ${metric.gradientTo} text-white shadow-md`
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {metric.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="mt-5 flex h-44 items-center justify-center rounded-3xl bg-gray-50 text-gray-500 animate-pulse sm:mt-6 sm:h-56">
            Data loading...
          </div>
        ) : dataPoints.length > 0 ? (
          <div className="mt-5 sm:mt-6">{renderMetricChart(activeMetric)}</div>
        ) : (
          <div className="mt-5 flex h-44 items-center justify-center rounded-3xl bg-gray-50 text-gray-500 sm:mt-6 sm:h-56">
            No data available for {selectedYear}.
          </div>
        )}
      </section>
    </main>
  );
};
