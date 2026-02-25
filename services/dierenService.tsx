import { Dier, GezondheidsStatus, Soort, User } from "@types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const DierenService = {
  getAllDieren: async (): Promise<Dier[]> => {
    try {
      const res = await fetch(apiUrl + "/dieren", {
        method: "GET",
      });
      if (!res.ok) {
        throw new Error(
          `Failed to fetch dieren: ${res.status} ${res.statusText}`
        );
      }
      const data = (await res.json()) as Dier[];
      return data;
    } catch (error) {
      throw error;
    }
  },

  getZonderVerzorger: async (): Promise<Dier[]> => {
    try {
      const res = await fetch(apiUrl + "/dieren/getZonderVerzorger", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(
          `Failed to fetch dieren zonder verzorger: ${res.status} ${res.statusText}`
        );
      }
      const data = (await res.json()) as Dier[];
      return data;
    } catch (error) {
      throw error;
    }
  },

  getMetVerzorger: async (userId: number): Promise<Dier[]> => {
    try {
      const res = await fetch(`${apiUrl}/dieren/getMetVerzorger/${userId}`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(
          `Failed to fetch dieren met verzorger: ${res.status} ${res.statusText}`
        );
      }
      const data = (await res.json()) as Dier[];
      return data;
    } catch (error) {
      throw error;
    }
  },

  toggleFavoriet: async (
    userEmail: string,
    dierNaam: string,
    isFavoriet: boolean
  ): Promise<User> => {
    try {
      const method = isFavoriet ? "DELETE" : "POST";

      const res = await fetch(
        `${apiUrl}/users/favoriet/${encodeURIComponent(
          userEmail
        )}/${encodeURIComponent(dierNaam)}`,
        {
          method,
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error(
          `Failed to toggle favoriet: ${res.status} ${res.statusText}`
        );
      }

      const updatedUser = (await res.json()) as User;

      try {
        if (typeof window !== "undefined" && updatedUser) {
          localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
        }
      } catch (e) {
        console.warn("Could not persist updated user to localStorage", e);
      }

      return updatedUser;
    } catch (error) {
      throw error;
    }
  },

  updateDier: async (
    name: string,
    geboorteDatum: Date,
    dier: any
  ): Promise<Dier> => {
    try {
      const res = await fetch(`${apiUrl}/dieren/${name}/${geboorteDatum}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dier),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(
          `Failed to update dier: ${res.status} ${res.statusText}`
        );
      }

      const updated = (await res.json()) as Dier;
      return updated;
    } catch (error) {
      throw error;
    }
  },

  deleteDier: async (name: string, geboorteDatum: Date): Promise<void> => {
    try {
      const res = await fetch(`${apiUrl}/dieren/${name}/${geboorteDatum}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(
          `Failed to delete dier: ${res.status} ${res.statusText}`
        );
      }

      return;
    } catch (error) {
      throw error;
    }
  },

  createDier: async (
    naam: string,
    geboorteDatum: Date,
    gezondheidsStatus: GezondheidsStatus,
    soort: Soort
  ): Promise<Dier> => {
    try {
      const dierData = {
        naam,
        geboorteDatum,
        gezondheidsStatus,
        soort,
      };

      const res = await fetch(`${apiUrl}/dieren/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dierData),
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`Er ging iets mis: ${res.statusText}`);
      }
      return await res.json();
    } catch (error) {
      console.error("Fout bij aanmaken dier:", error);
      throw error;
    }
  },
};

export default DierenService;
