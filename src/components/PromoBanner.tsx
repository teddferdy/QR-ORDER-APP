import React, { useState, useEffect, useCallback, useRef } from "react";
import type { PromoCampaign } from "../types";

interface PromoBannerProps {
  promos: PromoCampaign[];
  className?: string;
}

const AUTO_SCROLL_MS = 4000;

function formatDiscountText(promo: PromoCampaign): string {
  if (promo.discountType === "percentage") {
    const max = promo.maxDiscount
      ? ` (maks. Rp${promo.maxDiscount.toLocaleString("id-ID")})`
      : "";
    return `Diskon ${promo.discountValue}%${max}`;
  }
  if (promo.discountType === "fixed") {
    return `Diskon Rp${promo.discountValue.toLocaleString("id-ID")}`;
  }
  if (promo.discountType === "free_item") {
    return "Beli Gratis Item";
  }
  if (promo.discountType === "buy_x_get_y") {
    return `Beli ${promo.discountValue} Gratis 1`;
  }
  return promo.description || "Penawaran Spesial";
}

const GRADIENTS = [
  "from-orange-500 via-rose-500 to-pink-600",
  "from-emerald-500 via-teal-500 to-cyan-600",
  "from-violet-500 via-purple-500 to-fuchsia-600",
  "from-amber-500 via-orange-500 to-red-500",
  "from-blue-500 via-indigo-500 to-purple-600",
];

const PromoBanner: React.FC<PromoBannerProps> = ({ promos, className = "" }) => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);

  const total = promos.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (total <= 1) return;
    timerRef.current = setInterval(next, AUTO_SCROLL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [next, total]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (Math.abs(touchDeltaX.current) > 50) {
      if (touchDeltaX.current < 0) next();
      else prev();
    }
    if (total > 1) {
      timerRef.current = setInterval(next, AUTO_SCROLL_MS);
    }
  };

  if (total === 0) return null;

  const promo = promos[current];
  const gradient = GRADIENTS[current % GRADIENTS.length];

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl ${className}`}>
      <div
        className={`bg-gradient-to-br ${gradient} relative min-h-[160px] md:min-h-[200px] p-5 md:p-6 flex flex-col justify-between select-none`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0 space-y-2">
            <span className="inline-block bg-white/25 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              {promo.type.replace(/_/g, " ")}
            </span>
            <h3 className="text-white font-display text-lg md:text-xl font-bold leading-tight line-clamp-2">
              {promo.name}
            </h3>
            <p className="text-white/90 text-sm font-semibold">
              {formatDiscountText(promo)}
            </p>
            {promo.minPurchase > 0 && (
              <p className="text-white/70 text-xs">
                Min. belanja Rp{promo.minPurchase.toLocaleString("id-ID")}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-white/70 text-xs">
            {new Date(promo.startDate).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
            })}{" "}
            -{" "}
            {new Date(promo.endDate).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
          {promo.code && (
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-mono font-bold px-2.5 py-1 rounded-lg">
              {promo.code}
            </span>
          )}
        </div>
      </div>

      {total > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors"
            aria-label="Sebelumnya"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors"
            aria-label="Selanjutnya"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {total > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {promos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { setCurrent(idx); }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === current
                  ? "w-5 bg-white"
                  : "w-1.5 bg-white/50"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PromoBanner;
