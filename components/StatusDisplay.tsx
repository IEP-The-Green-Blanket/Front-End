"use client";

import React, { useEffect, useState } from "react";
import style from "@/style/home.module.css";
import { waterQualityService } from "@/services/waterQualityService";
import { Status } from "@/types";

// gets a score and returns a status based on the score thresholds
const getStatusFromScore = (score: number): Status => {
  if (score >= 70) return "safe";
  if (score >= 30) return "unsafe";
  return "dangerous";
};

const StatusDisplay: React.FC = () => {
  const [score, setScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fetches the water quality score from the API and updates the state accordingly
  useEffect(() => {
    const loadWaterQuality = async () => {
      try {
        const data: { waterQualityScore?: number } =
          await waterQualityService.getCurrentWaterQuality(); // getCurrentWaterQuality(); or fakeGetCurrentWaterQuality(); for testing

        if (typeof data.waterQualityScore !== "number") {
          throw new Error("Water quality did not return a valid score.");
        }

        setScore(data.waterQualityScore);
      } catch (fetchError) {
        console.error("Error with fetching watter quality:", fetchError);
        setError(
          "Unable to load water quality score. Sorry for the inconvenience. Please try again later.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadWaterQuality();
  });

  if (isLoading) {
    return (
      <div className={style.statusWindow}>
        <p>Getting the water quality score...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${style.statusWindow} ${style.statDangerous}`}>
        <p>{error}</p>
      </div>
    );
  }

  if (score === null) {
    return null;
  }

  // gives the score value to the getStatusFromScore function to determine the status
  const status = getStatusFromScore(score);
  const statusClass = {
    safe: style.statSafe,
    unsafe: style.statUnsafe,
    dangerous: style.statDangerous,
  }[status];

  // loads in the appropriate icon and message based on the status of the water quality score
  return (
    <>
      <img
        className={style.alertIcon}
        src={
          status === "safe"
            ? "/images/success-green-check-mark-icon.svg"
            : status === "dangerous"
              ? "/images/red-x-line-icon.svg"
              : "/images/caution-icon.svg"
        }
      />
      <div className={`${style.statusWindow} ${statusClass}`}>
        <p>
          Hartbeespoortdam water quality score is {score}, so the water is{" "}
          considered {status}.{" "}
        </p>
        <div className={style.message}>
          {status === "safe" ? (
            <p>Please enjoy your swim!</p>
          ) : status === "dangerous" ? (
            <p>Entering the water is prohibited!</p>
          ) : (
            <p>Entering the water is discouraged.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default StatusDisplay;
