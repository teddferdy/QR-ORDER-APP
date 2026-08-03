import React, { useState, useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useNavigate } from 'react-router-dom';
import CartSummary from '../components/CartSummary';
import { ChevronLeft } from 'lucide-react';
import Skeleton from '../components/Skeleton';
import { useSettingsStore } from '../store/useSettingsStore';

const CheckoutPage: React.FC = () => {
  const { items, totalPrice } = useCartStore();
  const navigate = useNavigate();
  const { settings } = useSettingsStore();
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (items.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-6xl mb-4">🛒</p>
        <p>Keranjang kosong.</p>
      </div>
    );
  }

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!tableNumber.trim()) errs.tableNumber = 'Nomor meja wajib diisi';
    if (tableNumber.trim() && !/^\d+$/.test(tableNumber.trim()))
      errs.tableNumber = 'Nomor meja harus berupa angka';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    navigate('/payment', {
      state: {
        tableNumber: tableNumber.trim(),
        customerName: customerName.trim() || undefined,
        storeId: settings.storeId,
        total: totalPrice(),
      },
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-20">
        <div className="flex items-center gap-3">
          <Skeleton width="2rem" height="2rem" borderRadius="50%" />
          <Skeleton width="30%" height="2rem" borderRadius="0.5rem" />
        </div>
        <Skeleton width="100%" height="14rem" borderRadius="1.5rem" />
        <Skeleton width="100%" height="10rem" borderRadius="1.5rem" />
        <Skeleton width="100%" height="8rem" borderRadius="1.5rem" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold">Checkout</h2>
      </div>

      <div className="bg-white rounded-3xl p-6 space-y-4">
        <h3 className="font-bold">Informasi Meja</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nomor Meja <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="Contoh: 5"
            className={`w-full p-3 border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${
              errors.tableNumber ? 'border-red-300' : 'border-gray-200'
            }`}
          />
          {errors.tableNumber && (
            <p className="text-red-500 text-xs mt-1">
              {errors.tableNumber}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Pelanggan
            <span className="text-gray-400"> (opsional)</span>
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Nama kamu"
            className="w-full p-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <CartSummary />

      <div className="bg-white rounded-3xl p-4 space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between text-sm"
          >
            <span className="text-gray-600">
              {item.name} x{item.quantity}
            </span>
            <span className="font-medium">
              Rp{item.totalPrice.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-primary text-white py-4 rounded-2xl font-bold tap-scale"
      >
        Lanjut ke Pembayaran
      </button>
    </div>
  );
};

export default CheckoutPage;