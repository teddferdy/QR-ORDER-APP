import { useState, useEffect, useCallback } from "react";
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

  const fetchData = useCallback(async () => {
    if (!productId) {
      setLoading(false);
      setProduct(null);
      return;
    }
    setLoading(true);
    setError(null);
    setProduct(null);
    try {
      const result = await fetchProductById(productId, storeId || undefined);
      setProduct(result ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat produk");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [productId, storeId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { product, loading, error, refetch: fetchData };
}
