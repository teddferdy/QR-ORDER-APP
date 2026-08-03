import React from 'react';
import { useOrderStore } from '../store/useOrderStore';
import { useCartStore } from '../store/useCartStore';
import { useNavigate } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';
import type { Order } from '../types';

const OrderHistoryPage: React.FC = () => {
  const { orders } = useOrderStore();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      const product = {
        id: item.productId,
        name: item.name,
        description: '',
        price: item.price,
        image: item.image,
        category: 'Makanan' as const,
        rating: 0,
        reviewsCount: 0,
        isBestSeller: false,
        isPromo: false,
        isVegetarian: false,
        estimatedTime: 0,
        stock: 0,
        storeId: order.storeId ?? '',
        ingredients: [],
      };
      addItem(product, item.customization);
    });
    navigate('/cart');
  };

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-2xl font-bold">Riwayat Pesanan</h2>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-6xl mb-4">📜</p>
          <p>Belum ada riwayat pesanan.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl shadow-sm overflow-hidden"
            >
              <div className="p-4 flex justify-between items-center border-b border-gray-100">
                <div>
                  <h3 className="font-bold">
                    #{order.id.slice(0, 6).toUpperCase()}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                  {order.status}
                </span>
              </div>

              <div className="p-4 space-y-2">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
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
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    Rp{order.total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => handleReorder(order)}
                  className="w-full flex items-center justify-center gap-2 bg-secondary text-primary py-3 rounded-2xl font-bold text-sm tap-scale"
                >
                  <RotateCcw size={16} />
                  Pesan Ulang
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;