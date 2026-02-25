"use client";

import DierenService from "@services/dierenService";
import DierenPanelOverviewTable from "@components/admin/DierenPanelOverviewTable";
import type { Dier, User, GezondheidsStatus, Soort } from "@types";
import { useEffect, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import AddButton from "@components/admin/AddButton";
import { useLocalStorage } from "hooks/mainHook";

const DierenPanel = () => {
  const [dieren, setDieren] = useState<Dier[]>([]);
  const [user] = useLocalStorage<User | null>("loggedInUser", null);
  const [hiddenAnimals, setHiddenAnimals] = useLocalStorage<string[]>(
    "hiddenAnimals",
    []
  );
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const refreshData = useCallback(async () => {
    try {
      const allesDieren = await DierenService.getAllDieren();

      const mappedDieren = allesDieren.map((dier) => ({
        ...dier,
        verborgen: hiddenAnimals.includes(dier.naam),
      }));

      setDieren(mappedDieren);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [hiddenAnimals]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleCreateDier = async (data: {
    name: string;
    geboorteDatum: Date;
    gezondheidsStatus: GezondheidsStatus;
    soort: Soort;
  }) => {
    try {
      await DierenService.createDier(
        data.name,
        data.geboorteDatum,
        data.gezondheidsStatus,
        data.soort
      );
      await refreshData();
    } catch (error) {
      console.error("Fout bij aanmaken:", error);
    }
  };

  const handleToggleVerborgen = async (updatedDier: Dier) => {
    try {
      let newHiddenList;
      if (updatedDier.verborgen) {
        if (!hiddenAnimals.includes(updatedDier.naam)) {
          newHiddenList = [...hiddenAnimals, updatedDier.naam];
        } else {
          newHiddenList = hiddenAnimals;
        }
      } else {
        newHiddenList = hiddenAnimals.filter(
          (naam: string) => naam !== updatedDier.naam
        );
      }

      setHiddenAnimals(newHiddenList);

      setDieren((prevDieren) =>
        prevDieren.map((dier) =>
          dier.naam === updatedDier.naam
            ? { ...dier, verborgen: updatedDier.verborgen }
            : dier
        )
      );
    } catch (error) {
      console.error("Error toggling verborgen:", error);
    }
  };

  const handleUpdateDier = async (updatedDier: Dier) => {
    setLoading(true);
    await refreshData();
  };

  const handleDeleteClick = async (deletedDier: Dier) => {
    setLoading(true);
    await refreshData();
  };

  if (loading && dieren.length === 0) {
    return (
      <main className="min-h-screen max-w-7xl mx-auto px-6 py-12">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Laden...</p>
        </div>
      </main>
    );
  }

  if (!user || user.rol !== "ADMIN") {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="border-2 border-green-700 border-foreground/20 rounded-lg p-8 text-center">
            <h1 className="text-2xl font-semibold text-foreground mb-4">
              Toegang geweigerd
            </h1>
            <p className="text-muted-foreground">
              U moet een admin zijn om deze pagina te bekijken.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              Dieren paneel
            </h1>
            <p className="text-muted-foreground mt-1">
              Beheer hier alle dieren in het systeem.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-medium py-2.5 px-5 rounded-lg shadow-sm transition-all active:scale-95"
          >
            <Plus size={20} />
            Dier Toevoegen
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {dieren.length > 0 ? (
            dieren.map((dier: Dier) => (
              <DierenPanelOverviewTable
                key={dier.naam}
                dier={dier}
                onToggle={handleToggleVerborgen}
                onUpdate={handleUpdateDier}
                onDelete={handleDeleteClick}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-muted-foreground">Geen dieren gevonden.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-blue-600 hover:underline mt-2 font-medium"
              >
                Voeg je eerste dier toe
              </button>
            </div>
          )}
        </div>
      </div>

      <AddButton
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateDier}
      />
    </main>
  );
};

export default DierenPanel;
