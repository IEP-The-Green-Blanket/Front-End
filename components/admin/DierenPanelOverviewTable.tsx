"use client";

import type { Dier } from "@types";
import type React from "react";
import { useState } from "react";
import UpdateButton from "./UpdateButton";
import DeleteButton from "./DeleteButton";

type Props = {
  dier: Dier;
  onToggle?: (dier: Dier) => void;
  onUpdate?: (dier: Dier) => void;
  onDelete?: (dier: Dier) => void;
};

const DierenPanelOverviewTable: React.FC<Props> = ({
  dier,
  onUpdate,
  onDelete,
  onToggle,
}) => {
  const [isVerborgen, setIsVerborgen] = useState<boolean>(
    () => !!dier?.verborgen
  );
  const [isEditModeUpdate, setIsEditModeUpdate] = useState(false);
  const [isEditModeDelete, setIsEditModeDelete] = useState(false);

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

  const handleToggle = () => {
    const newVerborgenState = !isVerborgen;
    setIsVerborgen(newVerborgenState);
    onToggle?.({ ...dier, verborgen: newVerborgenState });
    console.log(isVerborgen);
  };

  const handleUpdateSuccess = (updatedDier: Dier) => {
    onUpdate?.(updatedDier);
    setIsEditModeUpdate(false);
  };

  if (isEditModeUpdate) {
    return (
      <UpdateButton
        dier={dier}
        onUpdate={handleUpdateSuccess}
        onCancel={() => setIsEditModeUpdate(false)}
      />
    );
  }

  const handleDeleteSuccess = (deletedDier: Dier) => {
    onDelete?.(deletedDier);
    setIsEditModeDelete(false);
  };

  if (isEditModeDelete) {
    return (
      <DeleteButton
        dier={dier}
        onDeleted={handleDeleteSuccess}
        onCancel={() => setIsEditModeDelete(false)}
      />
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow relative">
      <div className="flex justify-between items-start gap-6">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            {dier?.naam ?? "Onbekend dier"}
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Geboortedatum: </span>
              <span className="font-medium text-foreground">
                {formattedDate}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Soort: </span>
              <span className="font-medium text-foreground">{soort}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Gezondheid: </span>
              <span
                className={`font-medium px-2 py-1 rounded-full text-xs ${healthClasses}`}
              >
                {dier?.gezondheidsStatus ?? "Onbekend"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 min-w-[120px]">
          <button
            type="button"
            onClick={() => setIsEditModeUpdate(true)}
            className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-500 transition"
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => setIsEditModeDelete(true)}
            className="px-3 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-500 transition"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={handleToggle}
            className={`px-3 py-2 rounded-md text-white text-sm transition ${
              isVerborgen
                ? "bg-green-600 hover:bg-green-500"
                : "bg-orange-600 hover:bg-orange-500"
            }`}
          >
            {isVerborgen ? "Laten zien" : "Verbergen"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DierenPanelOverviewTable;
