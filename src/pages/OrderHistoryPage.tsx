import React from "react";
import { useOrderStore } from "../store/useOrderStore";
import { useCartStore } from "../store/useCartStore";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RotateCcw, History } from "lucide-react";
import type { Order } from "../types";

const OrderHistoryPage: React.FC = () => {
  const orders = useOrderStore((state) => state.orders);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const addItem = useCartStore((state) => state.addItem);

  const href = (path: string) => {
    const sep = path.includes("?") ? "&" : "?";
    return `${path}${sep}table=${searchParams.get("table") || ""}&store=${searchParams.get("store") || ""}`;
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
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
    });
    navigate(href("/cart"));
  };

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Riwayat Pesanan
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-24">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
            <History size={36} className="text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Belum ada riwayat pesanan.
          </p>
        </div>
      ) : (
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
                  <span className="text-gray-900 dark:text-gray-100">
                    Total
                  </span>
                  <span className="text-primary">
                    Rp{order.total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="px-5 pb-5">
                <button
                  onClick={() => handleReorder(order)}
                  className="w-full flex items-center justify-center gap-2 bg-primary/10 text-primary py-3 rounded-2xl font-bold text-sm tap-scale hover:bg-primary hover:text-white transition-colors"
                >
                  <RotateCcw size={16} />
                  Pesan Ulang
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
