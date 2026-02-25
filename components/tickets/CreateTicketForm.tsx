"use client";

import InputField from "@components/ui/InputField";
import { TicketService } from "@services/ticketService";
import { TicketType } from "@types";
import React, { useState, useEffect } from 'react';

const CreateTicketForm = ({ onTicketCreated }: { onTicketCreated: () => void }) => {
  const [datum, setDatum] = useState("");
  const [isVIP, setIsVIP] = useState(false);
  const [ticketType, setTicketType] = useState<TicketType>(TicketType.VOLWASSEN);
  const [displayPrice, setDisplayPrice] = useState(25);

  useEffect(() => {
    let price = ticketType === TicketType.VOLWASSEN ? 25 : 12;
    if (isVIP) price += 15;
    setDisplayPrice(price);
  }, [ticketType, isVIP]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!datum) return alert("Selecteer een datum");

    try {
      await TicketService.createTicket({
        datum: `${datum}T00:00:00`,
        isVIP,
        ticketType
      });
      onTicketCreated();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-2 border-gray-300 p-6 flex flex-col gap-4 bg-white min-h-[500px]">
      <div className="border-b-2 border-gray-300 pb-2 mb-4">
        <h3 className="text-center font-bold uppercase">Tickets kopen</h3>
      </div>

      <InputField
        title="Datum"
        type="date"
        value={datum}
        onChange={(e) => setDatum(e.target.value)}
      />

      <div className="flex flex-col gap-2 border p-3">
        <label className="text-sm font-bold">Vip Ticket?</label>
        <div className="flex items-center gap-2">
            <input type="checkbox" checked={isVIP} onChange={(e) => setIsVIP(e.target.checked)} />
            <span>Jazeker</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 border p-3">
        <label className="text-sm font-bold">Type Ticket</label>
        <select 
          className="p-2 border"
          value={ticketType} 
          onChange={(e) => setTicketType(e.target.value as TicketType)}
        >
          <option value={TicketType.VOLWASSEN}>Volwassen</option>
          <option value={TicketType.KIND}>Kind</option>
          <option value={TicketType.SENIOOR}>Senior</option>
        </select>
      </div>

      <div className="mt-auto border-2 border-gray-300 p-4 text-center bg-gray-50">
        <span className="font-bold">Prijs: €{displayPrice}</span>
      </div>

      <button type="submit" className="w-full border-2 border-black py-3 font-bold uppercase hover:bg-gray-80">
        Ticket Aankopen
      </button>
    </form>
  );
};

export default CreateTicketForm;