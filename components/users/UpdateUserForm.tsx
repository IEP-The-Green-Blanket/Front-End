"use client";
import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import InputField from "@components/ui/InputField";
import { AuthContext } from "@context/AuthContext";
import { UserService } from "@services/userService";

const UpdateUserForm = () => {
    const context = useContext(AuthContext);
    const user = context?.user;
    const router = useRouter();

    const [naam, setNaam] = useState("");
    const [email, setEmail] = useState("");
    const [wachtwoord, setWachtwoord] = useState("");
    const [herhaalWachtwoord, setHerhaalWachtwoord] = useState("");

    useEffect(() => {
        if (user) {
            setNaam(user.naam);
            setEmail(user.email);
        }
    }, [user]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!wachtwoord) {
            return alert("Voer uw huidige of een nieuw wachtwoord in om te bevestigen.");
        }

        if (wachtwoord !== herhaalWachtwoord) {
            return alert("Wachtwoorden komen niet overeen!");
        }

        try {
            await UserService.updateUser({
                id: user!.id!,
                naam,
                email,
                passwoord: wachtwoord
            });

            if (context?.logout) {
                await context.logout();
            }
            alert("Gegevens succesvol aangepast! Log aub opnieuw in met uw nieuwe gegevens.");
            router.push("/login");

        } catch (error: any) {
            console.error("Update Error:", error);
            alert(error.message || "Er is iets misgegaan bij het updaten.");
        }
    };

    if (!user) {
        return (
            <div className="p-10 text-center border-2 border-dashed border-gray-300">
                <p className="font-bold uppercase text-gray-400">User laden...</p>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleUpdate}
            className="border-2 border-gray-300 p-6 flex flex-col gap-4 bg-white shadow-sm"
        >
            <div className="border-b-2 border-gray-300 pb-2 mb-4">
                <h3 className="text-center font-bold uppercase italic">
                    Gegevensaanpassing Formulier
                </h3>
            </div>

            <InputField
                title="Naam"
                value={naam || ""}
                onChange={(e) => setNaam(e.target.value)}
            />
            <InputField
                title="Email"
                value={email || ""}
                onChange={(e) => setEmail(e.target.value)}
            />

            <InputField
                title="Nieuw of Huidig Wachtwoord"
                value={wachtwoord}
                secure
                onChange={(e) => setWachtwoord(e.target.value)}
            />
            <InputField
                title="Herhaal Wachtwoord"
                value={herhaalWachtwoord}
                secure
                onChange={(e) => setHerhaalWachtwoord(e.target.value)}
            />

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-2">
                <p className="text-sm text-yellow-700">
                    <strong>Pas op:</strong> Na het aanpassen word je automatisch uitgelogd om je gegevens te verifiëren.
                </p>
            </div>

            <button
                type="submit"
                className="mt-4 border-2 border-black py-3 font-bold uppercase hover:bg-gray-100 transition-colors"
            >
                Gegevens Opslaan
            </button>
        </form>
    );
};

export default UpdateUserForm;