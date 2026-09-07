import { useState } from "react";
import { fetchCustomerPromos } from "../services/productService";
import type { PromoCampaign } from "../types";
import { useFetchEffect } from "./useFetch";

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

  const { isPending, refetch } = useFetchEffect(async (cancelled) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchCustomerPromos(storeId || undefined);
      if (!cancelled()) setPromos(result);
    } catch (err) {
      if (!cancelled()) setError(err instanceof Error ? err.message : "Gagal memuat promo");
    } finally {
      if (!cancelled()) setLoading(false);
    }
  }, [storeId]);

  return { promos, loading: loading || isPending, error, refetch };
}
