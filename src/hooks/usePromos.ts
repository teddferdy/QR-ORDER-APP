import { useState, useEffect, useCallback, useTransition } from "react";
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
  const [trigger, setTrigger] = useState(0);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;

    startTransition(async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchCustomerPromos(storeId || undefined);
        if (!cancelled) setPromos(result);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Gagal memuat promo");
      } finally {
        if (!cancelled) setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [storeId, trigger]);

  const refetch = useCallback(() => { setTrigger((t) => t + 1); }, []);

  return { promos, loading: loading || isPending, error, refetch };
}
