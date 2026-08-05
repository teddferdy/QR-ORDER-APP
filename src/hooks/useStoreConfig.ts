import { useState, useEffect, useCallback } from "react";
import { fetchStoreConfig } from "../services/storeService";
import type { StoreConfig } from "../services/storeService";

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

  const fetchData = useCallback(async () => {
    if (!storeId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await fetchStoreConfig(storeId);
      setConfig(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat konfigurasi");
      setConfig(DEFAULT_CONFIG);
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { config, loading, error, refetch: fetchData };
}
