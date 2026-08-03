import React, { useState, useEffect } from 'react';
import { useOrderStore } from '../store/useOrderStore';
import OrderStatusTracker from '../components/OrderStatusTracker';
import { useNavigate } from 'react-router-dom';
import Skeleton from '../components/Skeleton';

const OrdersPage: React.FC = () => {
  const { orders } = useOrderStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-6xl mb-4">📋</p>
        <p className="text-lg font-medium">Belum ada pesanan nih.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-primary font-bold underline"
        >
          Lihat Menu
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 pb-20">
        <Skeleton width="30%" height="2rem" borderRadius="0.5rem" />
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 space-y-4">
              <div className="flex justify-between">
                <Skeleton width="30%" height="1.2rem" borderRadius="0.5rem" />
                <Skeleton width="5rem" height="2rem" borderRadius="9999px" />
              </div>
              <Skeleton width="100%" height="4rem" borderRadius="1rem" />
              <div className="space-y-2">
                <Skeleton width="80%" height="0.8rem" borderRadius="0.5rem" />
                <Skeleton width="60%" height="0.8rem" borderRadius="0.5rem" />
              </div>
              <Skeleton width="40%" height="1.5rem" borderRadius="0.5rem" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-2xl font-bold">Status Pesanan</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-3xl shadow-sm overflow-hidden"
          >
            <div className="p-4 flex justify-between items-center border-b border-gray-100">
              <div>
                <h3 className="font-bold">
                  Pesanan #{order.id.slice(0, 6).toUpperCase()}
                </h3>
                <p className="text-xs text-gray-500">
                  Meja {order.tableNumber}
                  {order.customerName && ` • ${order.customerName}`}
                </p>
              </div>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                {order.status}
              </span>
            </div>

            <div className="p-4 space-y-3">
              <OrderStatusTracker currentStatus={order.status} compact />

              <div className="space-y-2">
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
              </div>

              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary">
                  Rp{order.total.toLocaleString()}
                </span>
              </div>

              <div className="text-xs text-gray-400">
                {new Date(order.createdAt).toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;