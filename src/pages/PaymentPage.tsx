import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useOrderStore } from '../store/useOrderStore';
import type { PaymentMethod, OrderStatus } from '../types';
import PaymentMethods from '../components/PaymentMethods';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';
import Skeleton from '../components/Skeleton';

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCartStore();
  const addOrder = useOrderStore((state) => state.addOrder);

  const state = location.state as {
    tableNumber: string;
    customerName?: string;
    storeId?: string;
    total: number;
  } | null;

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('QRIS');
  const [splitCount, setSplitCount] = useState(2);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!state) {
    return (
      <div className="text-center py-20 text-gray-500">
        Tidak ada data pembayaran.
      </div>
    );
  }

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      const total = state.total;
      const tax = total * 0.11;
      const serviceCharge = total * 0.05;

      const newOrder = {
        id: Math.random().toString(36).substring(7),
        tableNumber: state.tableNumber,
        customerName: state.customerName,
        storeId: state.storeId || '',
        items: useCartStore.getState().items.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          customization: item.customization,
          totalPrice: item.totalPrice,
          image: item.image,
        })),
        subtotal: total,
        tax: Math.round(tax),
        serviceCharge: Math.round(serviceCharge),
        total: Math.round(total + tax + serviceCharge),
        paymentMethod: selectedMethod,
        splitCount: selectedMethod === 'Split Bill' ? splitCount : undefined,
        status: 'Menunggu Konfirmasi' as OrderStatus,
        createdAt: new Date().toISOString(),
        statusHistory: [
          { status: 'Menunggu Konfirmasi' as OrderStatus, timestamp: new Date().toISOString() },
        ],
      };

      addOrder(newOrder);
      clearCart();
      setProcessing(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <div className="text-center py-20 space-y-6">
        <div className="text-6xl">
          <CheckCircle2 size={80} className="mx-auto text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Pesanan Berhasil!</h2>
        <p className="text-gray-500">
          Pesananmu sedang diproses. Tunggu ya!
        </p>
        <button
          onClick={() => navigate('/orders')}
          className="bg-primary text-white px-8 py-3 rounded-2xl font-bold tap-scale"
        >
          Lihat Pesanan
        </button>
        <br />
        <button
          onClick={() => navigate('/')}
          className="text-primary font-bold underline"
        >
          Pesan Lagi
        </button>
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
        <button onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold">Pembayaran</h2>
      </div>

      <div className="bg-white rounded-3xl p-6 space-y-2">
        <h3 className="font-bold">Ringkasan Pesanan</h3>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Meja</span>
          <span className="font-medium">{state.tableNumber}</span>
        </div>
        {state.customerName && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Pelanggan</span>
            <span className="font-medium">{state.customerName}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Total</span>
          <span className="text-primary">
            Rp{state.total.toLocaleString()}
          </span>
        </div>
      </div>

      <PaymentMethods
        selectedMethod={selectedMethod}
        onSelect={setSelectedMethod}
        splitCount={splitCount}
        onSplitChange={setSplitCount}
        total={state.total}
      />

      <button
        onClick={handlePayment}
        disabled={processing}
        className="w-full bg-primary text-white py-4 rounded-2xl font-bold tap-scale disabled:opacity-50"
      >
        {processing ? 'Memproses...' : 'Bayar Sekarang'}
      </button>
    </div>
  );
};

export default PaymentPage;