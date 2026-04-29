// @/services/analysisService.ts

const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_URL || "https://localhost:7166";

const fetchJson = async (endpoint: string) => {
  try {
    const cleanUrl = `${baseUrl.replace(/\/$/, "")}/api/Analytics/${endpoint}`;
    
    const res = await fetch(cleanUrl, {
      method: "GET",
      headers: { 
        "Accept": "application/json"
      },
      cache: 'no-store' 
    });

    const contentType = res.headers.get("content-type");

    if (!res.ok || !contentType || !contentType.includes("application/json")) {
      const errorType = res.status === 404 ? "ROUTE_NOT_FOUND" : "SERVER_CRASH";
      console.error(`🚨 ${errorType} [${res.status}] at: ${endpoint}`);
      throw new Error(`API Error: ${errorType} at ${endpoint}`); 
    }

    return await res.json();
  } catch (err) {
    console.error(`📡 CONNECTION_REFUSED: Is the C# backend running on ${baseUrl}?`, err);
    throw err;
  }
};

export const analysisService = {
  getOmniDashboard: () => fetchJson("omni-dashboard"),
  getForensicAttribution: () => fetchJson("forensic-attribution"),
  getRemediationProgress: () => fetchJson("remediation-progress"),
  getBloomForecast: () => fetchJson("bloom-forecast"),
  getIrrigationSafety: () => fetchJson("irrigation-safety"),
  getInfrastructureRisk: () => fetchJson("infrastructure-risk"),
  getHarvestValue: () => fetchJson("nutrient-harvest-value"),
  getComplianceStatus: () => fetchJson("regulatory-compliance"),
  
  getMasterAudit: (start?: string, end?: string) => {
    if (start && end) {
      return fetchJson(`master-audit?start=${start}&end=${end}`);
    }
    return fetchJson("master-audit");
  },

  getChatbotSummary: () => fetchJson("chatbot-summary"),
  getHistoryRange: (start: string, end: string) => fetchJson(`history/range?start=${start}&end=${end}`),
  getCriticalTrends: (start: string, end: string) => fetchJson(`graph-data/critical-trends?start=${start}&end=${end}`),

  // --- NEW COMMUNITY REPORTS ENDPOINT ---
  getReports: async () => {
    try {
      // Uses the same base URL, but targets /api/reports directly
      const rootUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_URL || "https://localhost:7166";
      const cleanUrl = `${rootUrl.replace(/\/$/, "")}/api/reports`;
      
      const res = await fetch(cleanUrl, {
        method: "GET",
        headers: { "Accept": "application/json" },
        cache: 'no-store'
      });

      const contentType = res.headers.get("content-type");
      if (!res.ok || !contentType || !contentType.includes("application/json")) {
        throw new Error(`API Error: Failed to fetch reports [${res.status}]`);
      }
      
      return await res.json();
    } catch (err) {
      console.error(`📡 CONNECTION_REFUSED for Reports API.`, err);
      throw err;
    }
  }
};