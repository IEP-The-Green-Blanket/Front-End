// @/services/analysisService.ts

const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_URL || "https://localhost:7166";

const fetchJson = async (endpoint: string, isRootApi: boolean = false) => {
  try {
    // 1. Clean the Base URL and build the target path
    // If isRootApi is true, it hits /api/endpoint, otherwise /api/analytics/endpoint
    const controllerPath = isRootApi ? "api" : "api/analytics";
    const cleanBase = baseUrl.replace(/\/$/, "");
    const cleanUrl = `${cleanBase}/${controllerPath}/${endpoint.replace(/^\//, "")}`;
    
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
      console.error(`🚨 ${errorType} [${res.status}] at: ${cleanUrl}`);
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
  getChatbotSummary: () => fetchJson("chatbot-summary"),

  /**
   * Fetches paginated audit logs filtered by date range.
   */
  getMasterAudit: async (start?: string, end?: string, pageNumber: number = 1, pageSize: number = 25) => {
    const queryParams = new URLSearchParams();
    if (start) queryParams.append('start', start);
    if (end) queryParams.append('end', end);
    queryParams.append('pageNumber', pageNumber.toString());
    queryParams.append('pageSize', pageSize.toString());

    return fetchJson(`master-audit?${queryParams.toString()}`);
  },

  /**
   * Fetches raw historical data for charts.
   */
  getHistoryRange: (start: string, end: string) => 
    fetchJson(`history/range?start=${start}&end=${end}`),

  /**
   * Fetches daily-aggregated trends for composed charts.
   */
  getCriticalTrends: (start: string, end: string) => 
    fetchJson(`graph-data/critical-trends?start=${start}&end=${end}`),

  /**
   * Fetches community reports (Targets /api/reports directly).
   */
  getReports: () => fetchJson("reports", true)
};