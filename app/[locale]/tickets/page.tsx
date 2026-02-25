"use client";

import CreateTicketForm from "@components/tickets/CreateTicketForm";
import TicketList from "@components/tickets/TicketList";
import React, { useState } from "react";

const TicketPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  return (
    <div className="max-w-6xl mx-auto p-4 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t-2 border-black pt-8">
        <section className="flex flex-col">
          <CreateTicketForm onTicketCreated={handleRefresh} />
        </section>

        <section className="border-2 border-gray-300 bg-white flex flex-col min-h-[600px]">
          <div className="border-b-2 border-gray-300 p-4">
            <h3 className="text-center font-bold uppercase">
              Mijn ActieveTickets
            </h3>
          </div>
          <div className="p-4 flex-grow overflow-y-auto">
            <TicketList key={refreshKey} active={true} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default TicketPage;
