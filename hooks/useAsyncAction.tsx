"use client";

import { useState, useCallback } from "react";

export function useAsyncAction<T, Args extends any[]>(
  asyncFunction: (...args: Args) => Promise<T>
) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await asyncFunction(...args);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Er is een fout opgetreden";
        setError(errorMessage);
        console.error("Action error:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
  }, []);

  return { execute, loading, error, reset };
}
