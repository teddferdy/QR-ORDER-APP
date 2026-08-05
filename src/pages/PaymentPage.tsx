import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { useOrderStore } from "../store/useOrderStore";
import { useCheckoutStore } from "../store/useCheckoutStore";
import { useStoreConfig } from "../hooks/useStoreConfig";
import type { PaymentMethod } from "../types";
import PaymentMethods from "../components/PaymentMethods";
import { ChevronLeft, PartyPopper } from "lucide-react";
import Skeleton from "../components/Skeleton";

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items, clearCart } = useCartStore();
  const createOrder = useOrderStore((state) => state.createOrder);
  const { data: checkoutData, clearCheckoutData } = useCheckoutStore();
  const store = searchParams.get("store");
  const { config } = useStoreConfig(store);

  const href = (path: string) => {
    const sep = path.includes("?") ? "&" : "?";
    return `${path}${sep}table=${searchParams.get("table") || ""}&store=${searchParams.get("store") || ""}`;
  };

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("QRIS");
  const [splitCount, setSplitCount] = useState(2);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!checkoutData || items.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-5xl mb-4">📋</p>
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          Tidak ada data pembayaran.
        </p>
        <button
          onClick={() => navigate(href("/"))}
          className="mt-4 text-primary font-bold text-sm"
        >
          Kembali ke Menu
        </button>
      </div>
    );
  }

  const { tableNumber, customerName, storeId, subtotal } = checkoutData;
  const tax = Math.round(subtotal * config.taxRate);
  const serviceCharge = Math.round(subtotal * config.serviceChargeRate);
  const total = subtotal + tax + serviceCharge;

  const handlePayment = async () => {
    setProcessing(true);
    setPaymentError(null);
    try {
      const order = await createOrder({
        store: Number(storeId),
        tableId: tableNumber ? Number(tableNumber) : undefined,
        customerName: customerName || undefined,
        paymentMethod: selectedMethod,
        splitCount: selectedMethod === "split" ? splitCount : undefined,
        items: items.map((item) => ({
          productId: Number(item.id),
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          notes: item.customization?.notes,
          options: item.customization?.size
            ? [{ name: "size", value: item.customization.size }]
            : undefined,
          modifiers: item.customization?.addOns?.map((a) => ({
            id: Number(a.id),
            name: a.name,
            price: a.price,
          })),
        })),
      });

      clearCart();
      clearCheckoutData();
      setSuccess(true);
      void order;
    } catch (err) {
      setPaymentError(
        err instanceof Error
          ? err.message
          : "Gagal membuat pesanan. Coba lagi.",
      );
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-20 space-y-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 mb-2">
          <PartyPopper size={48} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Pesanan Berhasil!
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Pesananmu sedang diproses. Tunggu ya!
        </p>
        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={() => navigate(href("/orders"))}
            className="bg-primary text-white px-8 py-3.5 rounded-2xl font-bold tap-scale shadow-lg shadow-primary/20"
          >
            Lihat Pesanan
          </button>
          <button
            onClick={() => navigate(href("/"))}
            className="text-primary font-bold text-sm"
          >
            Pesan Lagi
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 pb-20">
        <div className="flex items-center gap-3">
          <Skeleton width="2rem" height="2rem" borderRadius="50%" />
          <Skeleton width="30%" height="2rem" borderRadius="0.5rem" />
        </div>
        <Skeleton width="100%" height="14rem" borderRadius="1.5rem" />
        <Skeleton width="100%" height="12rem" borderRadius="1.5rem" />
        <Skeleton width="100%" height="3rem" borderRadius="1rem" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Pembayaran
        </h2>
      </div>

      {paymentError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
          <p className="text-red-600 dark:text-red-400 text-sm font-medium">
            {paymentError}
          </p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 space-y-3 border border-gray-50 dark:border-gray-700/50 shadow-sm">
        <h3 className="font-bold text-gray-900 dark:text-gray-100">
          Ringkasan Pesanan
        </h3>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Meja</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {tableNumber}
          </span>
        </div>
        {customerName && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Pelanggan</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {customerName}
            </span>
          </div>
        )}
        <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
            <span className="text-gray-700 dark:text-gray-300">
              Rp{subtotal.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              Pajak ({Math.round(config.taxRate * 100)}%)
            </span>
            <span className="text-gray-700 dark:text-gray-300">
              Rp{tax.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              Service ({Math.round(config.serviceChargeRate * 100)}%)
            </span>
            <span className="text-gray-700 dark:text-gray-300">
              Rp{serviceCharge.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100 dark:border-gray-700">
          <span className="text-gray-900 dark:text-gray-100">Total</span>
          <span className="text-primary">Rp{total.toLocaleString()}</span>
        </div>
      </div>

      <PaymentMethods
        selectedMethod={selectedMethod}
        onSelect={setSelectedMethod}
        splitCount={splitCount}
        onSplitChange={setSplitCount}
        total={total}
      />

      <button
        onClick={handlePayment}
        disabled={processing}
        className="w-full bg-primary text-white py-4 rounded-2xl font-bold tap-scale disabled:opacity-50 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Memproses...
          </span>
        ) : (
          `Bayar Sekarang — Rp${total.toLocaleString()}`
        )}
      </button>
    </div>
  );
};

export default PaymentPage;
