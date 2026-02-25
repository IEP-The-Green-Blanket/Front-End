"use client";

import dierenService from "@services/dierenService";

interface Props {
  dier: Dier;
  onDeleted?: (dier: Dier) => void;
  onCancel?: () => void;
}

import type { Dier } from "@types";

export default function DeleteButton({ dier, onDeleted, onCancel }: Props) {
  const handleDelete = async () => {
    await dierenService.deleteDier(dier.naam, dier.geboorteDatum);

    if (onDeleted) {
      onDeleted(dier);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-red-600 mb-4">
        {dier?.naam} verwijderen?
      </h3>
      <p className="text-muted-foreground mb-6">
        Weet je zeker dat je dit dier wilt verwijderen? Deze actie kan niet
        ongedaan gemaakt worden.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleDelete}
          className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-500 transition font-medium"
        >
          Ja, verwijderen
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md bg-muted text-foreground hover:bg-muted/80 transition font-medium"
        >
          Annuleren
        </button>
      </div>
    </div>
  );
}
