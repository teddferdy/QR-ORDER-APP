import React, { useState, useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import CartSummary from '../components/CartSummary';
import Skeleton from '../components/Skeleton';

const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart } =
    useCartStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (items.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-6xl mb-4">🛒</p>
        <p className="text-lg font-medium">Keranjang masih kosong nih.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-primary font-bold underline"
        >
          Mulai Pesan
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 pb-20">
        <Skeleton width="40%" height="2rem" borderRadius="0.5rem" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl flex items-center gap-4">
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
        <h2 className="text-2xl font-bold">Keranjang Anda</h2>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 font-medium"
        >
          Kosongkan
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-2xl flex items-center gap-4"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold truncate">{item.name}</h4>
              {item.customization?.size && (
                <p className="text-xs text-gray-400">{item.customization.size}</p>
              )}
              {item.customization?.spiciness && (
                <p className="text-xs text-gray-400">
                  Pedas: {item.customization.spiciness}
                </p>
              )}
              {item.customization?.notes && (
                <p className="text-xs text-gray-400 italic">
                  "{item.customization.notes}"
                </p>
              )}
              <p className="text-sm text-gray-500">
                Rp{item.price.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold"
              >
                −
              </button>
              <span className="font-bold w-6 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold"
              >
                +
              </button>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-400 ml-2 hover:text-red-600"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <CartSummary />

      <button
        onClick={() => navigate('/checkout')}
        className="w-full bg-primary text-white py-4 rounded-2xl font-bold tap-scale"
      >
        Lanjut ke Checkout
      </button>
    </div>
  );
};

export default CartPage;