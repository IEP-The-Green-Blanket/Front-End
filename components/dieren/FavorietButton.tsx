"use client";

import { Heart } from "lucide-react";
import type { Dier } from "@types";

interface Props {
  dier: Dier;
  isFavoriet: boolean;
  onToggle: (dier: Dier) => void;
}

export default function FavorietButton({ dier, isFavoriet, onToggle }: Props) {
  return (
    <button
      onClick={() => onToggle(dier)}
      className={`absolute top-4 right-4 p-2 rounded-full transition-all ${
        isFavoriet
          ? "bg-green-500 text-white hover:bg-green-600"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      }`}
      title={
        isFavoriet ? "Verwijder uit favorieten" : "Toevoegen aan favorieten"
      }
    >
      <Heart className={`w-5 h-5 ${isFavoriet ? "fill-current" : ""}`} />
    </button>
  );
}
