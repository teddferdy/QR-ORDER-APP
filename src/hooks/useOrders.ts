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

const BASE_POLL_INTERVAL = 10000;
const MAX_POLL_INTERVAL = 60000;
const POLL_BACKOFF_MULTIPLIER = 1.5;
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_BASE_DELAY = 1000;

export function useOrders(
  storeId: string | null,
  options?: { tableId?: string; page?: number; limit?: number },
): UseOrdersResult {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prevStatusesRef = useRef<Map<string, string>>(new Map());
  const pollIntervalRef = useRef<number>(BASE_POLL_INTERVAL);
  const retryCountRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
      let hasChange = false;
      for (const [id, status] of newStatuses) {
        const prev = prevStatusesRef.current.get(id);
        if (prev && prev !== status) {
          hasChange = true;
          const label =
            status === "Ditolak"
              ? "Ditolak oleh kasir"
              : status === "Dibatalkan"
                ? "Dibatalkan"
                : `Status berubah: ${status}`;
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
      retryCountRef.current = 0;
      if (hasChange) {
        pollIntervalRef.current = BASE_POLL_INTERVAL;
      } else {
        pollIntervalRef.current = Math.min(
          pollIntervalRef.current * POLL_BACKOFF_MULTIPLIER,
          MAX_POLL_INTERVAL,
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal memuat pesanan";
      setError(msg);
      retryCountRef.current += 1;
      if (retryCountRef.current <= MAX_RETRY_ATTEMPTS) {
        const delay =
          RETRY_BASE_DELAY * Math.pow(2, retryCountRef.current - 1);
        setTimeout(() => {
          fetchData();
        }, delay);
      }
    }
  }, [storeId, options?.tableId, options?.page, options?.limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!storeId) return;

    const handleVisibility = () => {
      isVisibleRef.current = !document.hidden;
      if (isVisibleRef.current) {
        fetchData();
        if (pollTimerRef.current) {
          clearInterval(pollTimerRef.current);
        }
        pollTimerRef.current = setInterval(fetchData, pollIntervalRef.current);
      } else {
        if (pollTimerRef.current) {
          clearInterval(pollTimerRef.current);
          pollTimerRef.current = null;
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    pollTimerRef.current = setInterval(fetchData, pollIntervalRef.current);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, [storeId, fetchData]);

  return { orders, total, loading, error, refetch: fetchData };
}