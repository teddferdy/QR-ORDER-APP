import { useState } from "react";
import { fetchBundles } from "../services/productService";
import type { Bundle } from "../types";
import { useFetchEffect } from "./useFetch";

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

  const { isPending, refetch } = useFetchEffect(async (cancelled) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchBundles(storeId || undefined);
      if (!cancelled()) setBundles(result);
    } catch (err) {
      if (!cancelled()) setError(err instanceof Error ? err.message : "Gagal memuat bundle");
    } finally {
      if (!cancelled()) setLoading(false);
    }
  }, [storeId]);

  return { bundles, loading: loading || isPending, error, refetch };
}
