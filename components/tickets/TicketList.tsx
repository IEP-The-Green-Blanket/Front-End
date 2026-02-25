"use client";
import { TicketService } from "@services/ticketService";
import TicketCard from "./TicketCard";
import { useFetchData } from "hooks/mainHook";

interface Props {
  active?: boolean | undefined;
}

const TicketList = ({ active = true }: Props) => {
  const {
    data: tickets,
    loading,
    error,
  } = useFetchData(async () => {
    if (typeof active === "boolean") {
      return await TicketService.getMyTickets(active);
    } else {
      return await TicketService.getAllMyTickets();
    }
  }, [active]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="font-bold uppercase animate-pulse">Tickets laden...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 border-2 border-dashed border-red-200">
        <p className="text-red-500">
          Error: {typeof error === "string" ? error : error}
        </p>
      </div>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed border-gray-200">
        <p className="text-gray-500 italic">
          Geen{" "}
          {active === true ? "actieve" : active === false ? "verlopen" : ""}{" "}
          tickets gevonden.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
};

export default TicketList;
