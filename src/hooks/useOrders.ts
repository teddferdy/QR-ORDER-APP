import { useState, useEffect, useCallback, useRef } from "react";
import { fetchCustomerOrders } from "../services/orderService";
import type { Order } from "../types";

interface UseOrdersResult {
  orders: Order[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const POLL_INTERVAL = 10000;

export function useOrders(
  storeId: string | null,
  options?: { tableId?: string; page?: number; limit?: number },
): UseOrdersResult {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prevStatusesRef = useRef<Map<string, string>>(new Map());

  const fetchData = useCallback(async () => {
    if (!storeId) {
      setLoading(false);
      return;
    }
    setLoading(false);
    setError(null);
    try {
      const result = await fetchCustomerOrders(storeId, options);
      const newOrders = result.orders;
      const newStatuses = new Map<string, string>();
      for (const o of newOrders) {
        newStatuses.set(o.id, o.status);
      }
      for (const [id, status] of newStatuses) {
        const prev = prevStatusesRef.current.get(id);
        if (prev && prev !== status) {
          const label = status === "Ditolak" ? "Ditolak oleh kasir" : status === "Dibatalkan" ? "Dibatalkan" : `Status berubah: ${status}`;
          if ("Notification" in window) {
            try {
              await Notification.requestPermission();
              new Notification("BISA-MAKAN", { body: label, tag: id });
            } catch {
              /* ignore */
            }
          }
        }
      }
      prevStatusesRef.current = newStatuses;
      setOrders(newOrders);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat pesanan");
    }
  }, [storeId, options?.tableId, options?.page, options?.limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!storeId) return;
    const interval = setInterval(fetchData, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [storeId, fetchData]);

  return { orders, total, loading, error, refetch: fetchData };
}
