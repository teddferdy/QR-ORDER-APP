import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { useOrderStore } from "../store/useOrderStore";
import { useCheckoutStore } from "../store/useCheckoutStore";
import { useStoreConfig } from "../hooks/useStoreConfig";
import type { Order, PaymentMethod } from "../types";
import PaymentMethods from "../components/PaymentMethods";
import { ChevronLeft, PartyPopper } from "lucide-react";
import Skeleton from "../components/Skeleton";
import { buildOrderItemsPayload } from "../utils/buildOrderItemsPayload";
import { bareTableDesignator } from "../utils/tableDisplay";

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items, clearCart, subtotal } = useCartStore();
  const createOrder = useOrderStore((state) => state.createOrder);
  const { data: checkoutData, clearCheckoutData } = useCheckoutStore();
  const store = searchParams.get("store");
  const { config } = useStoreConfig(store);

  const href = (path: string) => {
    const sep = path.includes("?") ? "&" : "?";
    return `${path}${sep}table=${searchParams.get("table") || ""}&store=${searchParams.get("store") || ""}&session=${searchParams.get("session") || ""}`;
  };

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("QRIS");
  const [splitCount, setSplitCount] = useState(2);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Checked before the missing-checkout-data guard below: a successful
  // handlePayment() clears the cart and checkout snapshot as part of
  // finishing the order, which would otherwise make that guard fire on the
  // very next render and permanently hide this screen — the customer would
  // never see their own successful order's confirmation. Only genuinely
  // invalid entry to this page (no checkout data, success never set)
  // should fall through to the guard below.
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

        {confirmedOrder && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 space-y-3 border border-gray-50 dark:border-gray-700/50 shadow-sm mx-auto max-w-sm text-left">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                Nomor Pesanan
              </span>
              <span className="font-bold text-primary text-lg">
                {confirmedOrder.orderNumber || confirmedOrder.id}
              </span>
            </div>
            {confirmedOrder.tableNumber && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  Meja
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {bareTableDesignator(confirmedOrder.tableNumber) ?? confirmedOrder.tableNumber}
                </span>
              </div>
            )}
            {config.storeName && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  Restoran
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {config.storeName}
                </span>
              </div>
            )}
          </div>
        )}

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

  const { tableNumber, customerName } = checkoutData;
  // Derived from the live cart, not the subtotal snapshotted at checkout —
  // the submitted order payload below is also built from the live cart, so
  // this keeps what the customer is shown in sync with what they're
  // actually charged, even if the cart changed after Checkout (e.g. back
  // button + quantity edit).
  const subtotalValue = subtotal();
  const tax = Math.round(subtotalValue * config.taxRate);
  const serviceCharge = Math.round(subtotalValue * config.serviceChargeRate);
  const total = subtotalValue + tax + serviceCharge;

  const handlePayment = async () => {
    setProcessing(true);
    setPaymentError(null);
    try {
      // Table AND store binding must come from the QR-derived URL context,
      // not from checkout state a customer could have edited — the QR link
      // already encodes the real table/store ids (see FE-POS-App
      // TableQRModal), and the backend looks orders up by exactly those ids.
      const urlTable = searchParams.get("table");
      const urlStore = searchParams.get("store");
      const order = await createOrder({
        store: Number(urlStore),
        tableId: urlTable ? Number(urlTable) : undefined,
        customerName: customerName || undefined,
        paymentMethod: selectedMethod,
        session: searchParams.get("session") || undefined,
        splitCount: selectedMethod === "Split Bill" ? splitCount : undefined,
        items: buildOrderItemsPayload(items),
      });

      clearCart();
      clearCheckoutData();
      setConfirmedOrder(order);
      setSuccess(true);
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
    <div className="space-y-6 pb-40 md:pb-20">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          aria-label="Kembali"
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
        {config.storeName && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Restoran</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {config.storeName}
            </span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Meja</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {bareTableDesignator(tableNumber) ?? tableNumber}
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
              Rp{subtotalValue.toLocaleString()}
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

      {/* Fixed on mobile so the primary action stays reachable without
          scrolling past the order summary; bottom-[64px] clears the fixed
          mobile bottom nav (Layout.tsx), which sits below it. Reverts to a
          normal in-flow button on desktop (md:), where there is no bottom
          nav. */}
      <div className="fixed inset-x-0 bottom-[64px] z-40 bg-secondary/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-100 dark:border-gray-700/50 px-4 py-3 md:static md:inset-auto md:z-auto md:bg-transparent md:dark:bg-transparent md:backdrop-blur-none md:border-0 md:px-0 md:py-0">
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
    </div>
  );
};

export default PaymentPage;
