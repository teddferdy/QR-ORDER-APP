import React, { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { useCartStore } from "../store/useCartStore";
import { Star, ChevronLeft } from "lucide-react";
import CustomizationPanel from "../components/CustomizationPanel";
import Skeleton from "../components/Skeleton";
import type { Size, Spiciness } from "../types";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const store = searchParams.get("store");

  const { product, loading, error } = useProduct(id, store);
  const addItem = useCartStore((state) => state.addItem);

  const href = (path: string) => {
    const sep = path.includes("?") ? "&" : "?";
    return `${path}${sep}table=${searchParams.get("table") || ""}&store=${searchParams.get("store") || ""}`;
  };

  const [selectedSize, setSelectedSize] = useState<Size | undefined>();
  const [selectedSpiciness, setSelectedSpiciness] = useState<
    Spiciness | undefined
  >();
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  if (loading) {
    return (
      <div className="pb-20 space-y-6">
        <Skeleton width="3rem" height="3rem" borderRadius="50%" />
        <Skeleton width="100%" height="16rem" borderRadius="1.5rem" />
        <div className="space-y-4 px-4">
          <Skeleton width="70%" height="2rem" borderRadius="0.5rem" />
          <Skeleton width="100%" height="0.8rem" borderRadius="0.5rem" />
          <Skeleton width="60%" height="0.8rem" borderRadius="0.5rem" />
          <div className="flex gap-4 mt-4">
            <Skeleton width="5rem" height="2.5rem" borderRadius="9999px" />
            <Skeleton width="5rem" height="2.5rem" borderRadius="9999px" />
            <Skeleton width="5rem" height="2.5rem" borderRadius="9999px" />
          </div>
          <Skeleton width="100%" height="10rem" borderRadius="1.5rem" />
          <Skeleton width="100%" height="8rem" borderRadius="1.5rem" />
        </div>
      </div>
    );
  }

  if (error || !product)
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">😕</p>
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          {error || "Produk tidak ditemukan"}
        </p>
        <button
          onClick={() => navigate(href("/"))}
          className="mt-4 text-primary font-bold text-sm"
        >
          Kembali ke Menu
        </button>
      </div>
    );

  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOnId)
        ? prev.filter((a) => a !== addOnId)
        : [...prev, addOnId],
    );
  };

  const handleAddToCart = () => {
    const customization = {
      size: selectedSize,
      spiciness: selectedSpiciness,
      addOns: product.addOns?.filter((a) => selectedAddOns.includes(a.id)),
      notes: notes || undefined,
    };
    addItem(product, customization);
    navigate(href("/cart"));
  };

  const addOnTotal = selectedAddOns.reduce((sum, addOnId) => {
    const addOn = product.addOns?.find((a) => a.id === addOnId);
    return sum + (addOn?.price || 0);
  }, 0);

  const finalPrice = product.price + addOnTotal;

  return (
    <div className="pb-20">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 p-2.5 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="relative mb-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover rounded-3xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-3xl" />
        {product.isPromo && (
          <span className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            Promo
          </span>
        )}
      </div>

      <div className="space-y-5">
        <div className="flex items-start justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {product.name}
          </h1>
          <div className="flex items-center gap-1.5 text-accent text-sm font-bold bg-accent/10 px-3 py-1.5 rounded-full">
            <Star size={14} fill="currentColor" />
            {product.rating}
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
            ⏱ Estimasi {product.estimatedTime} menit
          </span>
          <span
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${product.stock > 0 ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400" : "bg-red-50 dark:bg-red-900/20 text-red-500"}`}
          >
            {product.stock > 0 ? `✅ Stok: ${product.stock}` : "❌ Habis"}
          </span>
        </div>

        {product.ingredients.length > 0 && (
          <div>
            <h4 className="font-bold text-sm mb-3 text-gray-900 dark:text-gray-100">
              Bahan-bahan
            </h4>
            <div className="flex gap-2 flex-wrap">
              {product.ingredients.map((ing) => (
                <span
                  key={ing}
                  className="bg-secondary dark:bg-gray-700 px-3 py-1.5 rounded-full text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-600"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}

        <CustomizationPanel
          product={product}
          selectedSize={selectedSize}
          selectedSpiciness={selectedSpiciness}
          selectedAddOns={selectedAddOns}
          notes={notes}
          onSizeChange={setSelectedSize}
          onSpicinessChange={setSelectedSpiciness}
          onAddOnToggle={handleAddOnToggle}
          onNotesChange={setNotes}
        />

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 space-y-4 border border-gray-50 dark:border-gray-700/50 shadow-sm">
          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
            Ulasan Pembeli
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-accent">
              <Star size={16} fill="currentColor" />
              <span className="font-bold">{product.rating}</span>
            </div>
            <span className="text-gray-400 dark:text-gray-500 text-sm">
              ({product.reviewsCount} ulasan)
            </span>
          </div>
          <div className="text-center py-6">
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Ulasan akan segera hadir.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 space-y-4 border border-gray-50 dark:border-gray-700/50 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              Harga
            </span>
            <span className="font-bold text-2xl text-primary">
              Rp{finalPrice.toLocaleString()}
            </span>
          </div>
          {addOnTotal > 0 && (
            <div className="text-xs text-gray-400 dark:text-gray-500">
              (+ Rp{addOnTotal.toLocaleString()} topping)
            </div>
          )}
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold tap-scale shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {product.stock > 0 ? "Tambah ke Keranjang" : "Stok Habis"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
