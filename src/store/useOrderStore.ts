import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, OrderStatus, WaiterRequest } from "../types";
import {
  createCustomerOrder,
  fetchCustomerOrder,
} from "../services/orderService";
import {
  createWaiterRequest,
  fetchMyWaiterRequests,
} from "../services/waiterService";

interface OrderState {
  orders: Order[];
  activeOrderId: string | null;
  waiterRequests: WaiterRequest[];
  addOrder: (order: Order) => void;
  createOrder: (params: {
    store: number;
    tableId?: number;
    customerName?: string;
    notes?: string;
    paymentMethod?: string;
    splitCount?: number;
    items: {
      productId: number;
      productName: string;
      quantity: number;
      price: number;
      notes?: string;
      options?: unknown[];
      modifiers?: unknown[];
    }[];
  }) => Promise<Order>;
  refreshOrder: (orderId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  setActiveOrder: (orderId: string | null) => void;
  getActiveOrder: () => Order | undefined;
  getOrderById: (orderId: string) => Order | undefined;
  addWaiterRequest: (request: WaiterRequest) => void;
  submitWaiterRequest: (params: {
    store: number;
    type: string;
    tableId?: number;
    orderId?: string;
    notes?: string;
    customerName?: string;
  }) => Promise<void>;
  fetchWaiterRequests: (storeId: string, tableId?: string) => Promise<void>;
  getWaiterRequests: () => WaiterRequest[];
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      activeOrderId: null,
      waiterRequests: [],

      addOrder: (order) =>
        set({
          orders: [order, ...get().orders],
          activeOrderId: order.id,
        }),

      createOrder: async (params) => {
        const order = await createCustomerOrder(params);
        set({
          orders: [order, ...get().orders],
          activeOrderId: order.id,
        });
        return order;
      },

      refreshOrder: async (orderId) => {
        const order = await fetchCustomerOrder(orderId);
        if (order) {
          set({
            orders: get().orders.map((o) =>
              o.id === orderId ? { ...o, ...order } : o,
            ),
          });
        }
      },

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
              : o,
          ),
        }),

      setActiveOrder: (orderId) => set({ activeOrderId: orderId }),

      getActiveOrder: () =>
        get().orders.find((o) => o.id === get().activeOrderId),

      getOrderById: (orderId) => get().orders.find((o) => o.id === orderId),

      addWaiterRequest: (request) =>
        set({
          waiterRequests: [request, ...get().waiterRequests],
        }),

      submitWaiterRequest: async (params) => {
        const result = await createWaiterRequest(params);
        const request: WaiterRequest = {
          id: result.id,
          requestNumber: result.requestNumber,
          type: result.type as WaiterRequest["type"],
          tableName: result.tableName,
          notes: result.notes,
          createdAt: result.createdAt,
          status: "Pending",
        };
        set({
          waiterRequests: [request, ...get().waiterRequests],
        });
      },

      fetchWaiterRequests: async (storeId, tableId) => {
        const entries = await fetchMyWaiterRequests(storeId, tableId);
        const requests: WaiterRequest[] = entries.map((e) => ({
          id: e.id,
          requestNumber: e.requestNumber,
          type: e.type as WaiterRequest["type"],
          tableName: e.tableName,
          notes: e.notes,
          createdAt: e.createdAt,
          status: (e.status as WaiterRequest["status"]) || "Pending",
        }));
        set({ waiterRequests: requests });
      },

      getWaiterRequests: () =>
        get().waiterRequests.filter((r) => r.status === "Pending"),
    }),
    {
      name: "bisamakan-orders",
      partialize: (state) => ({
        orders: state.orders,
        activeOrderId: state.activeOrderId,
        waiterRequests: state.waiterRequests,
      }),
    },
  ),
);
