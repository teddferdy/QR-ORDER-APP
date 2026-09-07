import { useState } from "react";
import { fetchProductById } from "../services/productService";
import type { Product } from "../types";
import { useFetchEffect } from "./useFetch";

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

  const { isPending, refetch } = useFetchEffect(
    async (cancelled) => {
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
        if (!cancelled()) setProduct(result ?? null);
      } catch (err) {
        if (!cancelled()) {
          setError(err instanceof Error ? err.message : "Gagal memuat produk");
          setProduct(null);
        }
      } finally {
        if (!cancelled()) setLoading(false);
      }
    },
    [productId, storeId],
  );

  return { product, loading: loading || isPending, error, refetch };
}
