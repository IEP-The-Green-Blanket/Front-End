// @/services/analysisService.ts

// 1. Fallback Logic: Uses the exact HTTPS port (7166) from your C# launchSettings.json
// Standardized to NEXT_PUBLIC_API_URL for Next.js conventions
const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_URL || "https://localhost:7166";

const fetchJson = async (endpoint: string) => {
  try {
    // Ensure we don't have double slashes if baseUrl ends with /
    const cleanUrl = `${baseUrl.replace(/\/$/, "")}/api/Analytics/${endpoint}`;
    
    const res = await fetch(cleanUrl, {
      method: "GET",
      headers: { 
        "Accept": "application/json"
        // Note: Removed "Content-Type" as GET requests do not have a body
      },
      // Important: prevent browser from caching "stale" HTML error pages
      cache: 'no-store' 
    });

    const contentType = res.headers.get("content-type");

    // 2. The HTML Shield: Catch 404s and 500s before they hit .json()
    if (!res.ok || !contentType || !contentType.includes("application/json")) {
      const errorType = res.status === 404 ? "ROUTE_NOT_FOUND" : "SERVER_CRASH";
      console.error(`🚨 ${errorType} [${res.status}] at: ${endpoint}`);
      
      // CRITICAL FIX: Must THROW here, not return null
      throw new Error(`API Error: ${errorType} at ${endpoint}`); 
    }

    return await res.json();
  } catch (err) {
    // 3. Network Shield: C# Server is likely not running or port is blocked
    console.error(`📡 CONNECTION_REFUSED: Is the C# backend running on ${baseUrl}?`, err);
    
    // CRITICAL FIX: Must THROW here so Promise.all fails safely
    throw err;
  }
};

// 4. API Registry (Names mapped exactly to what AnalysisComponent.tsx expects)
export const analysisService = {
  getOmniDashboard: () => fetchJson("omni-dashboard"),
  getForensicAttribution: () => fetchJson("forensic-attribution"),
  getRemediationProgress: () => fetchJson("remediation-progress"),
  getBloomForecast: () => fetchJson("bloom-forecast"),
  getIrrigationSafety: () => fetchJson("irrigation-safety"),
  getInfrastructureRisk: () => fetchJson("infrastructure-risk"),
  getHarvestValue: () => fetchJson("nutrient-harvest-value"),
  getComplianceStatus: () => fetchJson("regulatory-compliance"),
  
  // ✅ FIXED: Now accepts optional date parameters for the independent Audit Tab
  getMasterAudit: (start?: string, end?: string) => {
    if (start && end) {
      return fetchJson(`master-audit?start=${start}&end=${end}`);
    }
    return fetchJson("master-audit");
  },

  // Extra helper endpoints built into your C# Backend just in case you need them later
  getChatbotSummary: () => fetchJson("chatbot-summary"),
  getHistoryRange: (start: string, end: string) => fetchJson(`history/range?start=${start}&end=${end}`),
  getCriticalTrends: (start: string, end: string) => fetchJson(`graph-data/critical-trends?start=${start}&end=${end}`)
};