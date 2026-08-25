import React, { useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { useNavigate, useSearchParams } from "react-router-dom";
import CartSummary from "../components/CartSummary";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { useSettingsStore } from "../store/useSettingsStore";
import { useCheckoutStore } from "../store/useCheckoutStore";

const CheckoutPage: React.FC = () => {
  const { items, subtotal } = useCartStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { settings } = useSettingsStore();
  const { setCheckoutData } = useCheckoutStore();

  const href = (path: string) => {
    const sep = path.includes("?") ? "&" : "?";
    return `${path}${sep}table=${searchParams.get("table") || ""}&store=${searchParams.get("store") || ""}&session=${searchParams.get("session") || ""}`;
  };
  const [tableNumber, setTableNumber] = useState(settings.tableNumber || "");
  const [customerName, setCustomerName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
          <ShoppingCart
            size={36}
            className="text-gray-400 dark:text-gray-500"
          />
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          Keranjang kosong.
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

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!tableNumber.trim()) errs.tableNumber = "Nomor meja wajib diisi";
    if (tableNumber.trim() && !/^\d+$/.test(tableNumber.trim()))
      errs.tableNumber = "Nomor meja harus berupa angka";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const checkoutData = {
      tableNumber: tableNumber.trim(),
      customerName: customerName.trim() || undefined,
      storeId: settings.storeId,
      subtotal: subtotal(),
    };
    setCheckoutData(checkoutData);
    navigate(href("/payment"));
  };

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
          Checkout
        </h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 space-y-5 border border-gray-50 dark:border-gray-700/50 shadow-sm">
        <h3 className="font-bold text-gray-900 dark:text-gray-100">
          Informasi Meja
        </h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Nomor Meja <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="Contoh: 5"
            className={`w-full p-3.5 border-2 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors ${
              errors.tableNumber
                ? "border-red-300 dark:border-red-500"
                : "border-gray-200 dark:border-gray-600 focus:border-primary"
            }`}
          />
          {errors.tableNumber && (
            <p className="text-red-500 text-xs mt-1.5 font-medium">
              {errors.tableNumber}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Nama Pelanggan
            <span className="text-gray-400 dark:text-gray-500">
              {" "}
              (opsional)
            </span>
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Nama kamu"
            className="w-full p-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
          />
        </div>
      </div>

      <CartSummary />

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 space-y-2 border border-gray-50 dark:border-gray-700/50 shadow-sm">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {item.name} x{item.quantity}
            </span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Rp{item.totalPrice.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-primary text-white py-4 rounded-2xl font-bold tap-scale shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
      >
        Lanjut ke Pembayaran
      </button>
    </div>
  );
};

export default CheckoutPage;
