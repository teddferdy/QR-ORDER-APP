import { useState, useEffect, useCallback } from "react";
import { fetchCustomerOrders } from "../services/orderService";
import type { Order } from "../types";

interface UseOrdersResult {
  orders: Order[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useOrders(
  storeId: string | null,
  options?: { tableId?: string; page?: number; limit?: number },
): UseOrdersResult {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
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
      const result = await fetchCustomerOrders(storeId, options);
      setOrders(result.orders);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat pesanan");
    } finally {
      setLoading(false);
    }
  }, [storeId, options?.tableId, options?.page, options?.limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { orders, total, loading, error, refetch: fetchData };
}
