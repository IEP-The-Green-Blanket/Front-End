import { CreateTicket, Ticket } from "@types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const TicketService = {
  createTicket: async (ticketData: CreateTicket): Promise<Ticket> => {
    try {
      const res = await fetch(`${apiUrl}/tickets/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketData),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData?.message || `Fout bij het aanmaken van het ticket: ${res.statusText}`
        );
      }

      const data = await res.json();
      const result = data.object ? data.object : data;
      return result;
    } catch (error) {
      console.error("TicketService Error:", error);
      throw error;
    }
  },

  getMyTickets: async (isActive: boolean = true): Promise<any[]> => {
    const res = await fetch(`${apiUrl}/tickets/me?isActive=${isActive}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Kon tickets niet ophalen");
    }
    return res.json();
  },

    getAllMyTickets: async (): Promise<any[]> => {
    const res = await fetch(`${apiUrl}/tickets/me`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Kon tickets niet ophalen");
    }
    return res.json();
  },

  
};