import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { Package } from "lucide-react";
import type { Bundle } from "../types";

interface BundleCardProps {
  bundle: Bundle;
}

const BundleCard: React.FC<BundleCardProps> = ({ bundle }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const addItem = useCartStore((state) => state.addItem);

  const href = (path: string) => {
    const sep = path.includes("?") ? "&" : "?";
    return `${path}${sep}table=${searchParams.get("table") || ""}&store=${searchParams.get("store") || ""}&session=${searchParams.get("session") || ""}`;
  };

  const firstItemImage =
    bundle.items[0]?.productImage ||
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=500&auto=format&fit=crop";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    bundle.items.forEach((item) => {
      addItem({
        id: `bundle-${bundle.id}-${item.productId}`,
        name: `${bundle.name} - ${item.productName}`,
        description: bundle.description || "",
        price: item.unitPrice,
        image: item.productImage || firstItemImage,
        images: [item.productImage || firstItemImage],
        category: "Special" as const,
        rating: 0,
        reviewsCount: 0,
        isBestSeller: false,
        isPromo: false,
        isVegetarian: false,
        estimatedTime: 0,
        stock: item.quantity || 999,
        storeId: searchParams.get("store") || "",
        ingredients: [],
      });
    });
  };

  return (
    <div
      onClick={() => { navigate(href(`/product/bundle-${bundle.id}`)); }}
      className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm dark:shadow-gray-900/30 overflow-hidden tap-scale cursor-pointer border border-gray-50 dark:border-gray-700/50 transition-colors"
    >
      <div className="relative">
        <img
          src={firstItemImage}
          alt={bundle.name}
          className="w-full h-44 object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          Bundle
        </span>
        {bundle.discountAmount > 0 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            Hemat Rp{bundle.discountAmount.toLocaleString()}
          </span>
        )}
        {!bundle.isAvailable && (
          <span className="absolute top-3 right-3 bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            Tidak Tersedia
          </span>
        )}
      </div>
      <div className="p-4 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-base line-clamp-1 text-gray-900 dark:text-gray-100">
            {bundle.name}
          </h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {bundle.description}
        </p>

        {/* Item list */}
        <div className="space-y-1">
          {bundle.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
            >
              <span className="flex items-center gap-1">
                <Package size={10} />
                {item.productName} x{item.quantity}
              </span>
              <span>
                Rp{item.unitPrice.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary text-lg">
              Rp{bundle.bundlePrice.toLocaleString()}
            </span>
            {bundle.originalPrice > bundle.bundlePrice && (
              <span className="text-xs text-gray-400 dark:text-gray-500 line-through">
                Rp{bundle.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          {bundle.isAvailable ? (
            <button
              onClick={handleAddToCart}
              className="bg-primary/10 text-primary p-2.5 rounded-full hover:bg-primary hover:text-white transition-all shadow-sm"
            >
              <Package size={18} strokeWidth={2.5} />
            </button>
          ) : (
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium px-3 py-2">
              Tidak tersedia
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BundleCard;
