import React, { useState, useEffect } from "react";
import { useCartStore } from "../store/useCartStore";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Trash2, ShoppingBag } from "lucide-react";
import CartSummary from "../components/CartSummary";
import Skeleton from "../components/Skeleton";

const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  const href = (path: string) => {
    const sep = path.includes("?") ? "&" : "?";
    return `${path}${sep}table=${searchParams.get("table") || ""}&store=${searchParams.get("store") || ""}`;
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
          <ShoppingBag size={36} className="text-gray-400 dark:text-gray-500" />
        </div>
        <p className="text-lg font-bold text-gray-700 dark:text-gray-300">
          Keranjang masih kosong nih.
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
          Yuk pilih menu favoritmu!
        </p>
        <button
          onClick={() => navigate(href("/"))}
          className="mt-6 bg-primary text-white px-8 py-3 rounded-2xl font-bold tap-scale shadow-lg shadow-primary/20"
        >
          Mulai Pesan
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 pb-20">
        <Skeleton width="40%" height="2rem" borderRadius="0.75rem" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-4 rounded-2xl flex items-center gap-4 border border-gray-50 dark:border-gray-700/50"
            >
              <Skeleton width="4rem" height="4rem" borderRadius="0.75rem" />
              <div className="flex-1 space-y-2">
                <Skeleton width="60%" height="1rem" borderRadius="0.5rem" />
                <Skeleton width="40%" height="0.8rem" borderRadius="0.5rem" />
              </div>
              <Skeleton width="5rem" height="2rem" borderRadius="0.5rem" />
            </div>
          ))}
        </div>
        <Skeleton width="100%" height="12rem" borderRadius="1.5rem" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Keranjang Anda
        </h2>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 font-medium hover:text-red-600 px-3 py-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          Kosongkan
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        {searchParams.get("table") && (
          <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">
            Meja {searchParams.get("table")}
          </span>
        )}
        {searchParams.get("store") && (
          <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full font-medium">
            Store {searchParams.get("store")}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-2xl flex items-center gap-4 border border-gray-50 dark:border-gray-700/50 shadow-sm"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 rounded-xl object-cover"
              loading="lazy"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold truncate text-gray-900 dark:text-gray-100">
                {item.name}
              </h4>
              {item.customization?.size && (
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {item.customization.size}
                </p>
              )}
              {item.customization?.spiciness && (
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Pedas: {item.customization.spiciness}
                </p>
              )}
              {item.customization?.notes && (
                <p className="text-xs text-gray-400 dark:text-gray-500 italic truncate">
                  "{item.customization.notes}"
                </p>
              )}
              <p className="text-sm font-medium text-primary mt-0.5">
                Rp{item.price.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                −
              </button>
              <span className="font-bold w-6 text-center text-gray-900 dark:text-gray-100">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold hover:bg-primary hover:text-white transition-colors"
              >
                +
              </button>
              <button
                onClick={() => removeItem(item.id)}
                className="text-gray-300 dark:text-gray-600 ml-2 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <CartSummary />

      <button
        onClick={() => navigate(href("/checkout"))}
        className="w-full bg-primary text-white py-4 rounded-2xl font-bold tap-scale shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
      >
        Lanjut ke Checkout
      </button>
    </div>
  );
};

export default CartPage;
