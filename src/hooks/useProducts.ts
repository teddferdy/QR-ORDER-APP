import { useState, useEffect, useCallback } from "react";
import { fetchCustomerMenu } from "../services/productService";
import type { Product } from "../types";
import type { MenuCategoryUI } from "../services/productService";

interface UseProductsResult {
  products: Product[];
  categories: MenuCategoryUI[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProducts(storeId: string | null): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<MenuCategoryUI[]>([]);
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
      const result = await fetchCustomerMenu(storeId);
      setProducts(result.products);
      setCategories(result.categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat menu");
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { products, categories, loading, error, refetch: fetchData };
}
