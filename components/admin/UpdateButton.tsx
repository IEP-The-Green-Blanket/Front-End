"use client";

import type { Dier } from "@types";
import { GezondheidsStatus } from "@types";
import type React from "react";
import { useState } from "react";
import DierenService from "@services/dierenService";
import SoortService from "@services/soortService";
import { useAsyncAction, useFetchData } from "hooks/mainHook";

type Props = {
  dier: Dier;
  onUpdate: (updatedDier: Dier) => void;
  onCancel: () => void;
};

export default function UpdateButton({ dier, onUpdate, onCancel }: Props) {
  const [formData, setFormData] = useState({
    naam: dier.naam,
    geboorteDatum: dier.geboorteDatum
      ? new Date(dier.geboorteDatum).toISOString().split("T")[0]
      : "",
    gezondheidsStatus: dier.gezondheidsStatus,
    soort:
      typeof dier.soort === "string"
        ? dier.soort
        : (dier.soort as any)?.naam ?? "",
  });

  const { data: soortenLijst = [] } = useFetchData(async () => {
    return await SoortService.getAllSoorten();
  }, []);

  const {
    execute: handleFormSubmit,
    loading: isLoading,
    error,
  } = useAsyncAction(async () => {
    const updatedDier = await DierenService.updateDier(
      dier.naam,
      dier.geboorteDatum,
      {
        naam: formData.naam,
        geboorteDatum: new Date(formData.geboorteDatum),
        gezondheidsStatus: formData.gezondheidsStatus,
        soort: {
          naam: formData.soort,
        },
      }
    );

    onUpdate(updatedDier);
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleFormSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 bg-card rounded-lg border border-border p-4"
    >
      <h3 className="text-lg font-semibold text-foreground">
        Update {dier.naam}
      </h3>

      {error && (
        <div className="p-2 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-foreground mb-1">
          Naam
        </label>
        <input
          type="text"
          name="naam"
          value={formData.naam}
          onChange={handleChange}
          className="w-full px-2 py-1 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm text-foreground bg-background"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-foreground mb-1">
          Geboortedatum
        </label>
        <input
          type="date"
          name="geboorteDatum"
          value={formData.geboorteDatum}
          onChange={handleChange}
          className="w-full px-2 py-1 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm text-foreground bg-background"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-foreground mb-1">
          Gezondheid
        </label>
        <select
          name="gezondheidsStatus"
          value={formData.gezondheidsStatus}
          onChange={handleChange}
          className="w-full px-2 py-1 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm text-foreground bg-background"
        >
          <option value={GezondheidsStatus.Gezond}>
            {GezondheidsStatus.Gezond}
          </option>
          <option value={GezondheidsStatus.herstellen}>
            {GezondheidsStatus.herstellen}
          </option>
          <option value={GezondheidsStatus.Ziek}>
            {GezondheidsStatus.Ziek}
          </option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-foreground mb-1">
          Soort
        </label>
        <select
          name="soort"
          value={formData.soort}
          onChange={handleChange}
          className="w-full px-2 py-1 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm text-foreground bg-background"
        >
          {(soortenLijst ?? []).map((soort: any) => {
            const displayValue = soort.naam;

            return (
              <option key={displayValue} value={displayValue}>
                {displayValue}
              </option>
            );
          })}
        </select>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-3 py-1 rounded-md border border-border text-foreground hover:bg-secondary transition text-sm"
          disabled={isLoading}
        >
          Annuleer
        </button>
        <button
          type="submit"
          className="flex-1 px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition disabled:opacity-50 text-sm"
          disabled={isLoading}
        >
          {isLoading ? "Opslaan..." : "Opslaan"}
        </button>
      </div>
    </form>
  );
}
