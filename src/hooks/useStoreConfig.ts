import { useState } from "react";
import { fetchStoreConfig } from "../services/storeService";
import type { StoreConfig } from "../services/storeService";
import { useFetchEffect } from "./useFetch";

interface UseStoreConfigResult {
  config: StoreConfig;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const DEFAULT_CONFIG: StoreConfig = {
  taxRate: 0.11,
  serviceChargeRate: 0.05,
  storeName: "",
};

export function useStoreConfig(storeId: string | null): UseStoreConfigResult {
  const [config, setConfig] = useState<StoreConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isPending, refetch } = useFetchEffect(async (cancelled) => {
    if (!storeId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await fetchStoreConfig(storeId);
      if (!cancelled()) setConfig(result);
    } catch (err) {
      if (!cancelled()) {
        setError(err instanceof Error ? err.message : "Gagal memuat konfigurasi");
        setConfig(DEFAULT_CONFIG);
      }
    } finally {
      if (!cancelled()) setLoading(false);
    }
  }, [storeId]);

  return { config, loading: loading || isPending, error, refetch };
}
