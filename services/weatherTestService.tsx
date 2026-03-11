import { weather } from "../types";

const apiUrl = process.env.NEXT_PUBLIC_URL;

export const WeatherTestService = {
  async getWeatherData(): Promise<weather[]> {
    const response = await fetch(`${apiUrl}/weatherforecast`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch weather data: ${response.status} ${response.statusText}`,
      );
    }

    const data: weather[] = await response.json();
    return data;
  },
};
