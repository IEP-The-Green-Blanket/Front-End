// Fallback to port 5050 if the env variable isn't loaded correctly
const apiUrl = process.env.NEXT_PUBLIC_URL || "https://localhost:5050";

export const waterQualityService = {
  /**
   * Fetches the master Omni-Dashboard telemetry.
   * Includes an HTML Shield to prevent "Unexpected token <" errors.
   */
  async getCurrentWaterQuality() {
    try {
      const response = await fetch(`${apiUrl}/api/Analytics/omni-dashboard`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        cache: 'no-store' // Prevents browser from caching 404/500 error pages
      });

      const contentType = response.headers.get("content-type");

      // 1. The HTML Shield: If the backend crashes (500) or route isn't found (404), 
      // it returns HTML. We catch that here before .json() is called.
      if (!response.ok || !contentType || !contentType.includes("application/json")) {
        console.error(`🚨 TELEMETRY_FAILURE [${response.status}]: Backend returned HTML/Error instead of JSON.`);
        return this.fakeGetCurrentWaterQuality();
      }

      const data = await response.json();
      
      // Safety check: ensure the nested structure exists
      if (!data.touristView) {
        throw new Error("Mismatched JSON structure received from backend.");
      }

      return data;

    } catch (error) {
      console.error("📡 CONNECTION_REFUSED: C# Backend is unreachable at " + apiUrl, error);
      return this.fakeGetCurrentWaterQuality();
    }
  },

  /**
   * Fallback data used when the Backend or SSH Tunnel is down.
   * Matches the 11-pillar AnalyticsController schema.
   */
  async fakeGetCurrentWaterQuality() {
    return {
      timestamp: new Date().toISOString(),
      touristView: {
        waterHealthScore: 0,
        healthGrade: "OFFLINE",
        swimSafety: "DISCONNECTED",
        skinIrritationRisk: "UNKNOWN",
        odorLevel: "UNKNOWN",
        fishKillLikelihood: "UNKNOWN"
      },
      residentView: {
        hyacinthGrowthForecast: "0% expansion/day",
        sewageDetection: "SENSOR_OFFLINE",
        stabilityStatus: "UNSTABLE",
        recommendation: "Check SSH Tunnel (Port 54320) and Backend (Port 5050)."
      },
      scientificIntelligence: {
        trophicState: "UNKNOWN",
        toxicAmmoniaMgL: 0,
        redfieldRatio: 0,
        soilSalinityRisk: "UNKNOWN"
      },
      graphingData: []
    };
  },
};