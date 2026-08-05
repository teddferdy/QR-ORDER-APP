import React, { useState, useEffect, useCallback } from "react";
import { useCartStore } from "../store/useCartStore";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RotateCcw, History, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import type { Order } from "../types";
import { fetchCustomerOrders } from "../services/orderService";
import { fetchProductById } from "../services/productService";
import Skeleton from "../components/Skeleton";

const STATUS_FILTERS: { id: string; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "completed", label: "Selesai" },
  { id: "cancelled", label: "Dibatalkan" },
  { id: "rejected", label: "Ditolak" },
];

const COMPLETED_STATUSES = new Set(["Sudah Diantar", "Dibatalkan", "Ditolak"]);

const OrderHistoryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const store = searchParams.get("store");

  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const limit = 10;

  const href = (path: string) => {
    const sep = path.includes("?") ? "&" : "?";
    return `${path}${sep}table=${searchParams.get("table") || ""}&store=${searchParams.get("store") || ""}`;
  };

  const fetchOrders = useCallback(async () => {
    if (!store) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchCustomerOrders(store, {
        page,
        limit,
      });
      let filtered = result.orders;
      if (statusFilter === "completed") {
        filtered = filtered.filter((o) => COMPLETED_STATUSES.has(o.status));
      } else if (statusFilter === "cancelled") {
        filtered = filtered.filter(
          (o) => o.status === "Dibatalkan",
        );
      } else if (statusFilter === "rejected") {
        filtered = filtered.filter(
          (o) => o.status === "Ditolak",
        );
      }
      setOrders(filtered);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat riwayat");
    } finally {
      setLoading(false);
    }
  }, [store, page, limit, statusFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
  }, [fetchOrders]);

  const [reorderLoading, setReorderLoading] = useState(false);
  const [reorderError, setReorderError] = useState<string | null>(null);

  const handleReorder = async (order: Order) => {
    setReorderLoading(true);
    setReorderError(null);
    const unavailableItems: string[] = [];
    const availableItems = [];

    for (const item of order.items) {
      try {
        const product = await fetchProductById(item.productId, store || undefined);
        if (product && product.stock > 0) {
          availableItems.push({
            ...item,
            productId: product.id,
            image: product.image,
          });
        } else {
          unavailableItems.push(item.name);
        }
      } catch {
        availableItems.push(item);
      }
    }

    if (availableItems.length === 0) {
      setReorderError("Semua item dalam pesanan ini tidak tersedia lagi.");
      setReorderLoading(false);
      return;
    }

    for (const item of availableItems) {
      const product = {
        id: item.productId || `reorder-${order.id}-${item.name}`,
        name: item.name,
        description: "",
        price: item.price,
        image: item.image || "",
        category: "Makanan" as const,
        rating: 0,
        reviewsCount: 0,
        isBestSeller: false,
        isPromo: false,
        isVegetarian: false,
        estimatedTime: 15,
        stock: 99,
        storeId: order.storeId || "",
        ingredients: [],
      };
      addItem(product, item.customization);
    }

    setReorderLoading(false);

    if (unavailableItems.length > 0) {
      setReorderError(
        `Tidak dapat memesan ulang: ${unavailableItems.join(", ")}. Item tidak tersedia.`
      );
    }

    navigate(href("/cart"));
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Riwayat Pesanan
      </h2>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => {
              setStatusFilter(f.id);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              statusFilter === f.id
                ? "bg-primary text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {reorderError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-300">{reorderError}</p>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 space-y-4 border border-gray-50 dark:border-gray-700/50"
            >
              <div className="flex justify-between">
                <Skeleton width="30%" height="1.2rem" borderRadius="0.5rem" />
                <Skeleton width="5rem" height="2rem" borderRadius="9999px" />
              </div>
              <Skeleton width="100%" height="4rem" borderRadius="1rem" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">⚠️</p>
          <p className="text-gray-500 dark:text-gray-400 font-medium">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-4 text-primary font-bold text-sm flex items-center gap-1.5 mx-auto"
          >
            <RotateCcw size={14} /> Coba Lagi
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-24">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
            <History size={36} className="text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Tidak ada riwayat pesanan.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm dark:shadow-gray-900/30 overflow-hidden border border-gray-50 dark:border-gray-700/50"
              >
                <div className="p-5 flex justify-between items-center border-b border-gray-100 dark:border-gray-700">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">
                      #
                      {(order.orderNumber || order.id).slice(0, 10).toUpperCase()}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold">
                    {order.status}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        Rp{item.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between font-bold">
                    <span className="text-gray-900 dark:text-gray-100">Total</span>
                    <span className="text-primary">
                      Rp{order.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <button
                    onClick={() => handleReorder(order)}
                    disabled={reorderLoading}
                    className="w-full flex items-center justify-center gap-2 bg-primary/10 text-primary py-3 rounded-2xl font-bold text-sm tap-scale hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
                  >
                    <RotateCcw size={16} />
                    {reorderLoading ? "Memeriksa..." : "Pesan Ulang"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 py-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex items-center gap-1 px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium disabled:opacity-30"
              >
                <ChevronLeft size={16} /> Sebelumnya
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Halaman {page} dari {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="flex items-center gap-1 px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium disabled:opacity-30"
              >
                Selanjutnya <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderHistoryPage;