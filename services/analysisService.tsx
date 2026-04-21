import { AnalyticsHistoryResponse } from "@/types";

const apiUrl = process.env.NEXT_PUBLIC_URL;

export const analysisService = {
  async getHistoryByYear(year: number) {
    const start = `01-01-${year}`;
    const end = `12-31-${year}`;

    try {
      const response = await fetch(
        `${apiUrl}/api/Analytics/history/range?start=${start}&end=${end}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 404) {
        return { count: 0, dataPoints: [] } as AnalyticsHistoryResponse;
      }

      const data: AnalyticsHistoryResponse = await response.json();
      return data;
    } catch (error) {
      console.error(`Analysis fetch error of year ${year}:`, error);
      throw error;
    }
  },
};
