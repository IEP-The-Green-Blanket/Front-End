"use client";

import type { Dier } from "@types";
import type React from "react";

type Props = {
  dier: Dier;
  onDragStart?: () => void;
  onDragEnd?: () => void;
};

const DierenZonderVerantwoordelijkeOvervieuwTable: React.FC<Props> = ({
  dier,
  onDragStart,
  onDragEnd,
}) => {
  const healthClasses =
    dier?.gezondheidsStatus === "GEZOND"
      ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-600"
      : dier?.gezondheidsStatus === "HERSTEL"
      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-600"
      : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className="border-2 border-foreground/20 rounded-md p-6 flex items-center justify-between gap-4 hover:border-foreground/40 transition-colors cursor-move active:opacity-50"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground mb-1">Naam</p>
        <p className="text-lg font-semibold text-foreground truncate">
          {dier?.naam ?? "Onbekend"}
        </p>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground mb-1">Soort</p>
        <p className="text-lg font-medium text-foreground truncate">
          {(dier as any)?.soort?.naam ?? "Onbekend"}
        </p>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground mb-1">Gezondheidstatus</p>
        <span
          className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium ${healthClasses}`}
        >
          {dier?.gezondheidsStatus ?? "Onbekend"}
        </span>
      </div>
    </div>
  );
};

export default DierenZonderVerantwoordelijkeOvervieuwTable;
