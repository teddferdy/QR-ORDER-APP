import { useState, useEffect, useCallback, useRef, useTransition } from "react";
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
  options?: { tableId?: string; session?: string; page?: number; limit?: number },
): UseOrdersResult {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);
  const [, startTransition] = useTransition();
  const prevStatusesRef = useRef<Map<string, string>>(new Map());
  const pollIntervalRef = useRef<number>(BASE_POLL_INTERVAL);
  const retryCountRef = useRef<number>(0);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  });

  useEffect(() => {
    let cancelled = false;

    startTransition(async () => {
      if (!storeId) {
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(null);
      try {
        const result = await fetchCustomerOrders(storeId, optionsRef.current);
        if (cancelled) return;
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
              Notification.requestPermission()
                .then(() => {
                  new Notification("BISA-MAKAN", { body: label, tag: id });
                })
                .catch(() => {
                  /* ignore */
                });
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
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : "Gagal memuat pesanan";
        setError(msg);
        retryCountRef.current += 1;
        if (retryCountRef.current <= MAX_RETRY_ATTEMPTS) {
          const delay =
            RETRY_BASE_DELAY * Math.pow(2, retryCountRef.current - 1);
          setTimeout(() => {
            setTrigger((t) => t + 1);
          }, delay);
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [storeId, options?.tableId, options?.session, options?.page, options?.limit, trigger]);

  useEffect(() => {
    if (!storeId) return;

    const poll = () => {
      setTrigger((t) => t + 1);
    };

    pollTimerRef.current = setInterval(poll, pollIntervalRef.current);

    const handleVisibility = () => {
      if (!document.hidden) {
        poll();
        if (pollTimerRef.current) {
          clearInterval(pollTimerRef.current);
        }
        pollTimerRef.current = setInterval(poll, pollIntervalRef.current);
      } else {
        if (pollTimerRef.current) {
          clearInterval(pollTimerRef.current);
          pollTimerRef.current = null;
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, [storeId]);

  const refetch = useCallback(() => setTrigger((t) => t + 1), []);

  return { orders, total, loading, error, refetch };
}
