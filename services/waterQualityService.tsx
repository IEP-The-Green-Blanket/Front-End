const apiUrl = process.env.NEXT_PUBLIC_URL;

export const waterQualityService = {
  async getCurrentWaterQuality() {
    try {
      const response = await fetch(`${apiUrl}/api/Analytics/water-quality`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Water quality fetch error:", error);
      throw error;
    }
  },

  async fakeGetCurrentWaterQuality() {
    return {
      waterQualityScore: 70,
    };
  },
};
