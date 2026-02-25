"use client";

import { useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State om de waarde op te slaan
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // Functie om de waarde te updaten
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Sta toe dat value een functie is voor hetzelfde API als useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(`Error saving ${key} to localStorage:`, error);
    }
  };

  // Functie om de waarde te verwijderen
  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.log(`Error removing ${key} from localStorage:`, error);
    }
  };

  return [storedValue, setValue, removeValue] as const;
}
