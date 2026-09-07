import { useState } from "react";
import { fetchCustomerMenu } from "../services/productService";
import type { Product } from "../types";
import type { MenuCategoryUI } from "../services/productService";
import { useFetchEffect } from "./useFetch";

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

  const { isPending, refetch } = useFetchEffect(async (cancelled) => {
    if (!storeId) {
      setProducts([]);
      setCategories([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await fetchCustomerMenu(storeId);
      if (!cancelled()) {
        setProducts(result.products);
        setCategories(result.categories);
      }
    } catch (err) {
      if (!cancelled()) setError(err instanceof Error ? err.message : "Gagal memuat menu");
    } finally {
      if (!cancelled()) setLoading(false);
    }
  }, [storeId]);

  return { products, categories, loading: loading || isPending, error, refetch };
}
