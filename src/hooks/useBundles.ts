import { useState, useEffect, useCallback, useTransition } from "react";
import { fetchBundles } from "../services/productService";
import type { Bundle } from "../types";

interface UseBundlesResult {
  bundles: Bundle[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBundles(storeId: string | null): UseBundlesResult {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;

    startTransition(async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchBundles(storeId || undefined);
        if (!cancelled) setBundles(result);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Gagal memuat bundle");
      } finally {
        if (!cancelled) setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [storeId, trigger]);

  const refetch = useCallback(() => { setTrigger((t) => t + 1); }, []);

  return { bundles, loading: loading || isPending, error, refetch };
}
