import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CheckoutData {
  tableNumber: string;
  customerName?: string;
  storeId?: string;
  subtotal: number;
}

interface CheckoutState {
  data: CheckoutData | null;
  setCheckoutData: (data: CheckoutData) => void;
  clearCheckoutData: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      data: null,
      setCheckoutData: (data) => set({ data }),
      clearCheckoutData: () => set({ data: null }),
    }),
    {
      name: "bisamakan-checkout",
    },
  ),
);
