import { useState, useEffect, useCallback } from "react";
import { fetchCustomerPromos } from "../services/productService";
import type { PromoCampaign } from "../types";

interface UsePromosResult {
  promos: PromoCampaign[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePromos(storeId: string | null): UsePromosResult {
  const [promos, setPromos] = useState<PromoCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchCustomerPromos(storeId || undefined);
      setPromos(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat promo");
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { promos, loading, error, refetch: fetchData };
}
