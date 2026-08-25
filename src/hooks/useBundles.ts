import { useState, useEffect, useCallback } from "react";
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

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchBundles(storeId || undefined);
      setBundles(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat bundle");
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { bundles, loading, error, refetch: fetchData };
}
