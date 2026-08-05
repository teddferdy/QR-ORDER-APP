import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { useCartStore } from "../store/useCartStore";
import { Star, ChevronLeft, Send } from "lucide-react";
import CustomizationPanel from "../components/CustomizationPanel";
import Skeleton from "../components/Skeleton";
import type { Size, Spiciness, Review } from "../types";
import { fetchProductReviews } from "../services/productService";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const store = searchParams.get("store");

  const { product, loading, error } = useProduct(id || null, store);
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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    if (product && store) {
      fetchProductReviews(product.id, store).then((result) => {
        setReviews(result.reviews);
        setAverageRating(result.averageRating);
        setTotalReviews(result.totalReviews);
      });
    }
  }, [product, store]);

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

  const handleReviewSubmit = async () => {
    if (reviewRating === 0 || !reviewComment.trim()) return;
    setReviewSubmitting(true);
    try {
      const { createReview } = await import("../services/reviewService");
      await createReview({
        productId: product.id,
        storeId: store || "",
        rating: reviewRating,
        comment: reviewComment.trim(),
        orderId: "",
      });
      setReviews((prev) => [
        {
                      id: Date.now().toString(),
                      userId: "",
                      userName: "Anda",
                      rating: reviewRating,
                      comment: reviewComment.trim(),
                      createdAt: new Date().toISOString(),
                      orderId: "",
                      productId: product.id,
                    },
        ...prev,
      ]);
      setAverageRating(
        (prev) => (prev * totalReviews + reviewRating) / (totalReviews + 1),
      );
      setTotalReviews((prev) => prev + 1);
      setReviewRating(0);
      setReviewComment("");
      setShowReviewForm(false);
    } catch {
      /* ignore */
    } finally {
      setReviewSubmitting(false);
    }
  };

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
            {averageRating > 0 ? averageRating.toFixed(1) : product.rating}
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
              <span className="font-bold">
                {averageRating > 0 ? averageRating.toFixed(1) : product.rating}
              </span>
            </div>
            <span className="text-gray-400 dark:text-gray-500 text-sm">
              ({totalReviews > 0 ? totalReviews : product.reviewsCount} ulasan)
            </span>
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-gray-100 dark:border-gray-700 rounded-2xl p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      {review.userName}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < review.rating ? "#f59e0b" : "none"}
                        stroke={i < review.rating ? "#f59e0b" : "#d1d5db"}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                Belum ada ulasan untuk produk ini.
              </p>
            </div>
          )}

          {!showReviewForm ? (
            <button
              onClick={() => setShowReviewForm(true)}
              className="w-full flex items-center justify-center gap-2 bg-primary/10 text-primary py-3 rounded-2xl font-bold text-sm tap-scale hover:bg-primary hover:text-white transition-colors"
            >
              <Star size={16} />
              Tulis Ulasan
            </button>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rating
                </p>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setReviewRating(i + 1)}
                      className="p-1"
                    >
                      <Star
                        size={20}
                        fill={i < reviewRating ? "#f59e0b" : "none"}
                        stroke={i < reviewRating ? "#f59e0b" : "#d1d5db"}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Komentar
                </p>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Tulis pengalamanmu..."
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowReviewForm(false);
                    setReviewRating(0);
                    setReviewComment("");
                  }}
                  className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3 rounded-2xl font-bold text-sm"
                >
                  Batal
                </button>
                <button
                  onClick={handleReviewSubmit}
                  disabled={reviewSubmitting}
                  className="flex-1 bg-primary text-white py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-1.5"
                >
                  <Send size={14} />
                  {reviewSubmitting ? "Mengirim..." : "Kirim"}
                </button>
              </div>
            </div>
          )}
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