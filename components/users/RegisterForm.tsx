"use client";

import InputField from "@components/ui/InputField";
import { UserService } from "@services/userService";
import { useRouter } from "next/navigation";
import { useState } from "react";

const RegisterForm = () => {
  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [passwoord, setPasswoord] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newUser = { naam, email, passwoord};
      const user = await UserService.register(newUser);
      router.push("/");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unknown error");
    }
  };

  return (
    <div className="flex justify-center pt-20 bg-[hsl(var(--background))] min-h-screen">
      <form
        onSubmit={handleRegister}
        className="bg-[hsl(var(--card))] p-8 rounded-xl shadow-lg w-full max-w-md border border-[hsl(var(--border))]"
      >
        <h4 className="text-2xl font-semibold mb-6 text-center text-[hsl(var(--foreground))]">
          Register Formulier
        </h4>

        <InputField
          title="Naam:"
          label="u naam"
          value={naam}
          onChange={(e) => setNaam(e.target.value)}
        />

        <InputField
          title="Email:"
          label="email@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputField
          title="Passwoord:"
          label="passwoord123"
          value={passwoord}
          secure
          onChange={(e) => setPasswoord(e.target.value)}
        />

        <button
          type="submit"
          className="w-full mt-5 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] py-2 rounded-lg font-medium hover:brightness-110 transition-all"
        >
          Registreer
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
