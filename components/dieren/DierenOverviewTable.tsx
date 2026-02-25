"use client";

import type { Dier } from "@types";
import type React from "react";
import FavorietButton from "./FavorietButton";

type Props = {
  dier: Dier;
  showFavorite?: boolean;
  isFavoriet?: boolean;
  onToggle?: (dier: Dier) => void;
};

const DierenOverviewTable: React.FC<Props> = ({
  dier,
  showFavorite = false,
  isFavoriet = false,
  onToggle,
}) => {
  const raw = (dier as any)?.geboorteDatum;
  const date = raw ? new Date(raw) : null;
  const formattedDate =
    date && !isNaN(date.getTime())
      ? new Intl.DateTimeFormat("nl-NL", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(date)
      : "Onbekend";

  const healthClasses =
    dier?.gezondheidsStatus === "GEZOND"
      ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-600"
      : dier?.gezondheidsStatus === "HERSTEL"
      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-600"
      : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";

  const soort =
    typeof dier.soort === "string"
      ? dier.soort
      : (dier.soort as any)?.naam ?? "Onbekend";

  return (
    <div className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow relative">
      {showFavorite && onToggle && (
        <FavorietButton
          dier={dier}
          isFavoriet={isFavoriet}
          onToggle={onToggle}
        />
      )}

      <h3 className="text-xl font-semibold text-foreground mb-4 pr-12">
        {dier?.naam ?? "Onbekend dier"}
      </h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Geboortedatum:</span>
          <span className="font-medium text-foreground">{formattedDate}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Soort:</span>
          <span className="font-medium text-foreground">{soort}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Gezondheid:</span>
          <span
            className={`font-medium px-2 py-1 rounded-full text-xs ${healthClasses}`}
          >
            {dier?.gezondheidsStatus ?? "Onbekend"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DierenOverviewTable;
