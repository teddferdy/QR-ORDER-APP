import { useState, useEffect, useCallback, useTransition } from "react";
import { fetchProductById } from "../services/productService";
import type { Product } from "../types";

interface UseProductResult {
  product: Product | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProduct(
  productId: string | null,
  storeId?: string | null,
): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;

    startTransition(async () => {
      if (!productId) {
        setProduct(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      setProduct(null);
      try {
        const result = await fetchProductById(productId, storeId || undefined);
        if (!cancelled) setProduct(result ?? null);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Gagal memuat produk");
          setProduct(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [productId, storeId, trigger]);

  const refetch = useCallback(() => { setTrigger((t) => t + 1); }, []);

  return { product, loading: loading || isPending, error, refetch };
}
