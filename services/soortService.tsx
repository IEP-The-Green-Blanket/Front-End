import { Soort } from "@types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const SoortService = {
  getAllSoorten: async (): Promise<Soort[]> => {
    try {
      const res = await fetch(apiUrl + "/soort", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(
          `Failed to fetch soorten: ${res.status} ${res.statusText}`
        );
      }
      const data = (await res.json()) as Soort[];
      return data;
    } catch (error) {
      throw error;
    }
  },
};

export default SoortService;
