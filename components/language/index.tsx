"use client";

import type React from "react";

import { useRouter, usePathname, useParams } from "next/navigation";
import { type ChangeEvent, useTransition } from "react";
import { useTheme } from "@context/ThemeContext";

const Language: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();
  const { theme } = useTheme();

  const currentLocale = params?.locale
    ? Array.isArray(params.locale)
      ? params.locale[0]
      : params.locale
    : "nl";

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newLocale = event.target.value;

    startTransition(() => {
      const pathSegments = pathname.split("/");

      if (pathSegments.length > 1) {
        pathSegments[1] = newLocale;
      } else {
        pathSegments.push(newLocale);
      }

      const newPath = pathSegments.join("/");

      router.push(newPath);
      router.refresh();
    });
  };

  return (
    <div className="flex items-center">
      <label htmlFor="language" className="text-foreground font-medium mr-2">
        Language
      </label>
      <select
        id="language"
        className="p-1 border border-border rounded text-foreground bg-background cursor-pointer hover:border-muted-foreground transition-colors"
        value={currentLocale}
        onChange={handleLanguageChange}
        disabled={isPending}
      >
        <option value="en">English</option>
        <option value="nl">Nederlands</option>
      </select>
    </div>
  );
};

export default Language;
