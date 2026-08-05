import React, { useEffect, useState } from "react";
import { useOrderStore } from "../store/useOrderStore";
import CallWaiterButton from "../components/CallWaiterButton";
import { Headphones, RefreshCw } from "lucide-react";
import { useSettingsStore } from "../store/useSettingsStore";
import { useSearchParams } from "react-router-dom";

const statusStyle: Record<string, { badge: string; label: string }> = {
  Pending: {
    badge:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
    label: "Menunggu",
  },
  Approved: {
    badge: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    label: "Disetujui",
  },
  Rejected: {
    badge: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
    label: "Ditolak",
  },
  Done: {
    badge:
      "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    label: "Selesai",
  },
};

const typeIcon: Record<string, string> = {
  Sendok: "🥄",
  Tisu: "🧻",
  Refill: "🥤",
  Bill: "🧾",
  "Panggil Pelayan": "🧑‍🍳",
};

const WaiterPage: React.FC = () => {
  const allRequests = useOrderStore((state) => state.waiterRequests);
  const fetchWaiterRequests = useOrderStore(
    (state) => state.fetchWaiterRequests,
  );
  const { settings } = useSettingsStore();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  const storeId = searchParams.get("store") || settings.storeId || "1";
  const tableId =
    searchParams.get("table") || settings.tableNumber || undefined;

  useEffect(() => {
    let active = true;
    fetchWaiterRequests(storeId, tableId)
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId, tableId]);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Pelayan
        </h2>
        <button
          onClick={() => fetchWaiterRequests(storeId, tableId).catch(() => {})}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 space-y-5 border border-gray-50 dark:border-gray-700/50 shadow-sm">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
            <Headphones size={36} className="text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
              Butuh Bantuan?
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Minta bantuan pelayan kapan saja. Pilih kebutuhanmu di bawah.
            </p>
          </div>
        </div>
        <CallWaiterButton />
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-gray-900 dark:text-gray-100">
          Riwayat Permintaan
        </h3>
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-3">
              Memuat permintaan...
            </p>
          </div>
        ) : allRequests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">✨</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Belum ada permintaan.
            </p>
          </div>
        ) : (
          allRequests.map((req) => {
            const st = statusStyle[req.status] || statusStyle.Pending;
            return (
              <div
                key={req.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-50 dark:border-gray-700/50 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {typeIcon[req.type] || "🧑‍🍳"}
                    </span>
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-gray-100">
                        {req.type}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(req.createdAt).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${st.badge}`}
                  >
                    {st.label}
                  </span>
                </div>
                {req.notes && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 rounded-xl px-3 py-2">
                    {req.notes}
                  </p>
                )}
                <p className="text-[10px] uppercase tracking-wide text-gray-300 dark:text-gray-600 font-bold">
                  {req.requestNumber}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default WaiterPage;
