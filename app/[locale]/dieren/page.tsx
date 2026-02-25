"use client";

import DierenService from "@services/dierenService";
import DierenOverviewTable from "@components/dieren/DierenOverviewTable";
import type { Dier, User } from "@types";
import { useEffect, useState } from "react";
import { useAsyncAction, useLocalStorage } from "hooks/mainHook";

const DierenPage = () => {
  const [dieren, setDieren] = useState<Dier[]>([]);
  const [user, setUser] = useLocalStorage<User | null>("loggedInUser", null);
  const [hiddenAnimals] = useLocalStorage<string[]>("hiddenAnimals", []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const allesDieren = await DierenService.getAllDieren();

        const zichtbareDieren = allesDieren.filter(
          (dier) => !hiddenAnimals.includes(dier.naam)
        );

        setDieren(zichtbareDieren);
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [hiddenAnimals]);

  const isFavoriet = (dier: Dier): boolean => {
    if (!user || !user.favorieten) return false;
    return user.favorieten.some((fav) => fav.naam === dier.naam);
  };

  const { execute: toggleFavoriet, loading: toggleLoading } = useAsyncAction(
    async (dier: Dier) => {
      if (!user) {
        alert("Je moet ingelogd zijn om favorieten toe te voegen");
        return;
      }
      const isFav = isFavoriet(dier);
      const updatedUser = await DierenService.toggleFavoriet(
        user.email,
        dier.naam,
        isFav
      );

      setUser(updatedUser);
    }
  );

  if (loading) {
    return (
      <main className="min-h-screen max-w-7xl mx-auto px-6 py-12">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Laden...</p>
        </div>
      </main>
    );
  }

  if (!dieren || dieren.length === 0) {
    return (
      <main className="min-h-screen max-w-7xl mx-auto px-6 py-12">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Geen dieren gevonden.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">Onze dieren</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dieren.map((dier: Dier) => (
            <DierenOverviewTable
              key={dier.naam}
              dier={dier}
              showFavorite={!!user}
              isFavoriet={user ? isFavoriet(dier) : false}
              onToggle={toggleFavoriet}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default DierenPage;
