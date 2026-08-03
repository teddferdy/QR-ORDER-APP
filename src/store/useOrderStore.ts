import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, OrderStatus, WaiterRequest } from '../types';

const sampleOrders: Order[] = [
  {
    id: 'ord001',
    tableNumber: '5',
    customerName: 'Ahmad',
    items: [
      {
        productId: '1',
        name: 'Nasi Goreng Spesial',
        price: 35000,
        quantity: 1,
        customization: { size: 'Medium', spiciness: 'Medium' },
        totalPrice: 35000,
        image: 'https://images.unsplash.com/photo-1512058560566-42724afbc2db?q=80&w=500&auto=format&fit=crop',
      },
      {
        productId: '3',
        name: 'Es Teh Manis',
        price: 8000,
        quantity: 2,
        customization: { size: 'Large' },
        totalPrice: 16000,
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=500&auto=format&fit=crop',
      },
    ],
    subtotal: 51000,
    tax: 5610,
    serviceCharge: 2550,
    total: 59160,
    paymentMethod: 'QRIS',
    status: 'Sudah Diantar',
    createdAt: '2025-07-20T12:30:00Z',
    statusHistory: [
      { status: 'Menunggu Konfirmasi', timestamp: '2025-07-20T12:30:00Z' },
      { status: 'Diproses', timestamp: '2025-07-20T12:32:00Z' },
      { status: 'Sedang Dimasak', timestamp: '2025-07-20T12:35:00Z' },
      { status: 'Siap Diantar', timestamp: '2025-07-20T12:45:00Z' },
      { status: 'Sudah Diantar', timestamp: '2025-07-20T12:50:00Z' },
    ],
  },
  {
    id: 'ord002',
    tableNumber: '3',
    customerName: '',
    items: [
      {
        productId: '6',
        name: 'Rendang Daging',
        price: 55000,
        quantity: 1,
        customization: { size: 'Large', spiciness: 'Spicy' },
        totalPrice: 55000,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=500&auto=format&fit=crop',
      },
      {
        productId: '8',
        name: 'Kopi Susu Gula Aren',
        price: 18000,
        quantity: 1,
        customization: { size: 'Medium' },
        totalPrice: 18000,
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=500&auto=format&fit=crop',
      },
    ],
    subtotal: 73000,
    tax: 8030,
    serviceCharge: 3650,
    total: 84680,
    paymentMethod: 'Tunai',
    status: 'Menunggu Konfirmasi',
    createdAt: '2025-07-21T18:15:00Z',
    statusHistory: [
      { status: 'Menunggu Konfirmasi', timestamp: '2025-07-21T18:15:00Z' },
    ],
  },
];

interface OrderState {
  orders: Order[];
  activeOrderId: string | null;
  waiterRequests: WaiterRequest[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  setActiveOrder: (orderId: string | null) => void;
  getActiveOrder: () => Order | undefined;
  getOrderById: (orderId: string) => Order | undefined;
  addWaiterRequest: (request: WaiterRequest) => void;
  resolveWaiterRequest: (requestId: string) => void;
  getWaiterRequests: () => WaiterRequest[];
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: sampleOrders,
      activeOrderId: null,
      waiterRequests: [],
      addOrder: (order) =>
        set({
          orders: [order, ...get().orders],
          activeOrderId: order.id,
        }),
      updateOrderStatus: (orderId, status) =>
        set({
          orders: get().orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status,
                  statusHistory: [
                    ...o.statusHistory,
                    { status, timestamp: new Date().toISOString() },
                  ],
                }
              : o
          ),
        }),
      setActiveOrder: (orderId) => set({ activeOrderId: orderId }),
      getActiveOrder: () =>
        get().orders.find((o) => o.id === get().activeOrderId),
      getOrderById: (orderId) =>
        get().orders.find((o) => o.id === orderId),
      addWaiterRequest: (request) =>
        set({
          waiterRequests: [request, ...get().waiterRequests],
        }),
      resolveWaiterRequest: (requestId) =>
        set({
          waiterRequests: get().waiterRequests.map((r) =>
            r.id === requestId ? { ...r, status: 'Received' } : r
          ),
        }),
      getWaiterRequests: () =>
        get().waiterRequests.filter((r) => r.status === 'Pending'),
    }),
    {
      name: 'bisamakan-orders',
    }
  )
);