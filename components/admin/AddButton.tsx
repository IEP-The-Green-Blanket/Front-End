"use client";

import type React from "react";

import { useEffect, useState } from "react";
import type { GezondheidsStatus, Soort } from "@types";
import SoortService from "@services/soortService";
import { useAsyncAction, useFetchData } from "hooks/mainHook";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    geboorteDatum: Date;
    gezondheidsStatus: GezondheidsStatus;
    soort: Soort;
  }) => Promise<void>;
}

const AddButton = ({ isOpen, onClose, onSubmit }: Props) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<GezondheidsStatus>(
    "GEZOND" as GezondheidsStatus
  );
  const [selectedSoort, setSelectedSoort] = useState<Soort | null>(null);

  const { data: soortenLijst = [], loading: loadingSoorten } =
    useFetchData(async () => {
      if (!isOpen) return [];
      return await SoortService.getAllSoorten();
    }, [isOpen]);

  useEffect(() => {
    const firstSoort = soortenLijst?.[0];

    if (firstSoort && !selectedSoort) {
      setSelectedSoort(firstSoort);
    }
  }, [soortenLijst, selectedSoort]);

  const { execute: handleFormSubmit, loading } = useAsyncAction(async () => {
    if (!selectedSoort) {
      alert("Selecteer een soort.");
      return;
    }

    await onSubmit({
      name,
      geboorteDatum: new Date(date),
      gezondheidsStatus: status,
      soort: selectedSoort,
    });

    setName("");
    setDate("");
    onClose();
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleFormSubmit();
  };

  const getSoortNaam = (s: any) => {
    if (typeof s === "string") return s;
    return s.naam || s.name || JSON.stringify(s);
  };

  const handleSoortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    const found = (soortenLijst ?? []).find(
      (s) => getSoortNaam(s) === selectedValue
    );
    if (found) setSelectedSoort(found);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background border border-gray-200 p-6 rounded-xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
        <h2 className="text-2xl font-bold mb-4">Nieuw Dier Toevoegen</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Naam</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300 bg-background text-foreground focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Bv. Bello"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Geboortedatum
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300 bg-background text-foreground focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Soort</label>
            {loadingSoorten ? (
              <p className="text-sm text-gray-500">Soorten laden...</p>
            ) : (
              <select
                required
                value={selectedSoort ? getSoortNaam(selectedSoort) : ""}
                onChange={handleSoortChange}
                className="w-full p-2 rounded-md border border-gray-300 bg-background text-foreground focus:ring-2 focus:ring-green-500 outline-none"
              >
                {(soortenLijst ?? []).map((s, index) => {
                  const naam = getSoortNaam(s);
                  return (
                    <option key={index} value={naam}>
                      {naam.charAt(0).toUpperCase() +
                        naam.slice(1).toLowerCase()}
                    </option>
                  );
                })}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Gezondheid</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as GezondheidsStatus)}
              className="w-full p-2 rounded-md border border-gray-300 bg-background text-foreground focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="GEZOND">Gezond</option>
              <option value="ZIEK">Ziek</option>
              <option value="GEWONDE">Gewond</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={loading || loadingSoorten}
              className="px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50"
            >
              {loading ? "Opslaan..." : "Toevoegen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddButton;
