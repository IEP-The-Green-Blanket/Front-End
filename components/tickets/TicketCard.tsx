import React from 'react';
import { TicketType } from '@types';

const TicketCard = ({ ticket }: { ticket: any }) => {
  const formattedDate = new Date(ticket.datum).toLocaleDateString('nl-BE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h5 className="text-lg font-bold mt-2 text-[hsl(var(--foreground))] uppercase">
            {ticket.ticketType}
          </h5>
        </div>
      </div>
      
      <div className="text-sm text-[hsl(var(--muted-foreground))]">
        <p>Ticket type: <strong>{ticket.isVIP ? 'VIP' : 'Standaard'}</strong></p>
        <p>Datum: <strong>{formattedDate}</strong></p>
        <p>Eigenaar: <strong>{ticket.ticketOwner}</strong></p>
        <p>Prijs : <strong>€{ticket.price}</strong></p>
      </div>
    </div>
  );
};

export default TicketCard;