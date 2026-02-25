"use client";

import type React from "react";

import { useContext, useState } from "react";
import type { Dier } from "@types";
import DierenZonderVerantwoordelijkeOvervieuwTable from "@components/werknemer/DierenZonderVerantwoordelijkeOvervieuwTable";
import VerantwoordelijkhedenOverviewTable from "@components/werknemer/VerantwoordelijkhedenOverviewTable";
import DierenService from "@services/dierenService";
import { UserService } from "@services/userService";
import { AuthContext } from "@context/AuthContext";
import { useFetchData } from "hooks/mainHook";

const ToewijzingPage = () => {
  const [draggedDier, setDraggedDier] = useState<Dier | null>(null);
  const [dragSource, setDragSource] = useState<
    "assigned" | "unassigned" | null
  >(null);

  const context = useContext(AuthContext);
  const user = context?.user;

  const {
    data: verantwoordelijkDieren = [],
    loading: loadingAssigned,
    refresh: refreshAssigned,
  } = useFetchData(async () => {
    if (!user?.id) return [];
    return await DierenService.getMetVerzorger(user.id);
  }, [user?.id]);

  const {
    data: dierenZonderVerantwoordelijke = [],
    loading: loadingUnassigned,
    refresh: refreshUnassigned,
  } = useFetchData(async () => {
    return await DierenService.getZonderVerzorger();
  }, []);

  const loading = loadingAssigned || loadingUnassigned;

  const handleDragStart = (dier: Dier, source: "assigned" | "unassigned") => {
    setDraggedDier(dier);
    setDragSource(source);
  };

  const handleDragEnd = () => {
    setDraggedDier(null);
    setDragSource(null);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDropToAssigned = async (event: React.DragEvent) => {
    event.preventDefault();

    if (!draggedDier || !user || dragSource !== "unassigned") return;

    try {
      await UserService.assignVerantwoordelijke(user.email, draggedDier.naam);

      await refreshUnassigned();
      await refreshAssigned();
    } catch (error) {
      console.error("Error assigning verantwoordelijke:", error);
      alert("Er ging iets mis bij het toewijzen van de verantwoordelijkheid.");
    } finally {
      setDraggedDier(null);
      setDragSource(null);
    }
  };

  const handleDropToUnassigned = async (event: React.DragEvent) => {
    event.preventDefault();

    if (!draggedDier || !user || dragSource !== "assigned") return;

    try {
      await UserService.unassignVerantwoordelijke(user.email, draggedDier.naam);

      await refreshUnassigned();
      await refreshAssigned();
    } catch (error) {
      console.error("Error unassigning verantwoordelijke:", error);
      alert(
        "Er ging iets mis bij het verwijderen van de verantwoordelijkheid."
      );
    } finally {
      setDraggedDier(null);
      setDragSource(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">Laden...</p>
          </div>
        </div>
      </main>
    );
  }

  if (
    !user ||
    !["WERKNEMER", "ADMIN"].includes((user.rol?.toString() ?? "").toUpperCase())
  ) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="border-2 border-green-700 border-foreground/20 rounded-lg p-8 text-center">
            <h1 className="text-2xl font-semibold text-foreground mb-4">
              Toegang geweigerd
            </h1>
            <p className="text-muted-foreground">
              U moet een werknemer of admin zijn om deze pagina te bekijken.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="px-6 py-12">
        <div className="flex flex-col md:flex-row gap-6">
          <div
            className={`w-full md:w-1/2 mx-auto border-2 border-green-700 border-foreground/20 rounded-lg p-8 transition-all ${
              dragSource === "unassigned"
                ? "ring-4 ring-green-500/50 bg-green-50/5"
                : ""
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDropToAssigned}
          >
            <h1 className="text-2xl font-semibold text-foreground text-center mb-6">
              U bent verantwoordelijk voor deze dieren:
            </h1>
            {dragSource === "unassigned" && (
              <p className="text-center text-sm text-green-600 dark:text-green-400 mb-4 font-medium">
                Sleep hier om uzelf als verzorger toe te wijzen
              </p>
            )}
            <div className="space-y-4">
              {(verantwoordelijkDieren?.length ?? 0) === 0 ? (
                <p className="text-center text-muted-foreground">
                  U bent voor geen enkel dier verantwoordelijk.
                </p>
              ) : (
                (verantwoordelijkDieren ?? []).map((dier: Dier, index: number) => (
                  <VerantwoordelijkhedenOverviewTable
                    key={`${dier.naam}-right-${index}`}
                    dier={dier}
                    onDragStart={() => handleDragStart(dier, "assigned")}
                    onDragEnd={handleDragEnd}
                  />
                ))
              )}
            </div>
          </div>

          <div
            className={`w-full md:w-1/2 border-2 border-blue-700 border-foreground/20 rounded-lg p-8 transition-all ${
              dragSource === "assigned"
                ? "ring-4 ring-blue-500/50 bg-blue-50/5"
                : ""
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDropToUnassigned}
          >
            <h1 className="text-2xl font-semibold text-foreground text-center mb-6">
              Dieren zonder verantwoordelijke:
            </h1>
            {dragSource === "assigned" && (
              <p className="text-center text-sm text-blue-600 dark:text-blue-400 mb-4 font-medium">
                Sleep hier om uzelf als verzorger te verwijderen
              </p>
            )}
            <div className="space-y-4">
              {(dierenZonderVerantwoordelijke?.length ?? 0) === 0 ? (
                <p className="text-center text-muted-foreground">
                  Geen dieren zonder verantwoordelijke.
                </p>
              ) : (
                (dierenZonderVerantwoordelijke ?? []).map(
                  (dier: Dier, index: number) => (
                    <DierenZonderVerantwoordelijkeOvervieuwTable
                      key={`${dier.naam}-right-${index}`}
                      dier={dier}
                      onDragStart={() => handleDragStart(dier, "unassigned")}
                      onDragEnd={handleDragEnd}
                    />
                  )
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ToewijzingPage;
