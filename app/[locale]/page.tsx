"use client";

import type React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { User } from "@types";
import { useTranslations } from "next-intl";
import { useLocalStorage } from "hooks/mainHook";

const Home: React.FC = () => {
  const [user] = useLocalStorage<User | null>("loggedInUser", null);

  const t = useTranslations("homepage");

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-white to-secondary">
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        {user ? (
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight text-balance">
            {t("welcome-IN")} {user.naam}
          </h1>
        ) : (
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight text-balance">
            {t("welcome-NI")}
          </h1>
        )}

        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          {t("descriptie")}
        </p>

        <Link
          href="/dieren"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold"
        >
          {t("link")} <ArrowRight size={20} />
        </Link>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {(["box1", "box2", "box3"] as const).map((key) => (
            <div
              key={key}
              className="bg-white p-6 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t(`boxes.${key}.title`)}
              </h3>
              <p className="text-muted-foreground">
                {t(`boxes.${key}.message`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16 text-center bg-primary/5 rounded-lg">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          {t("footer.klaar")}
        </h2>
        <p className="text-muted-foreground mb-6">{t("footer.tekst")}</p>
        <Link
          href="/dieren"
          className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold"
        >
          {t("footer.link")}
        </Link>
      </section>
    </main>
  );
};

export default Home;
