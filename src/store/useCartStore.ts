import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product, CartItemCustomization } from "../types";

interface CartState {
  items: CartItem[];
  addItem: (product: Product, customization?: CartItemCustomization) => boolean;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateCustomization: (
    productId: string,
    customization: CartItemCustomization,
  ) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
  tax: () => number;
  serviceCharge: () => number;
  totalPrice: () => number;
}

const TAX_RATE = 0.11;
const SERVICE_CHARGE_RATE = 0.05;

function calcUnitPrice(
  basePrice: number,
  customization?: CartItemCustomization,
): number {
  const addOnTotal =
    customization?.addOns?.reduce((sum, a) => sum + a.price, 0) || 0;
  return basePrice + addOnTotal;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, customization) => {
        const currentItems = get().items;

        if (product.stock <= 0) return false;

        const existingItem = currentItems.find(
          (item) =>
            item.id === product.id &&
            JSON.stringify(item.customization) ===
              JSON.stringify(customization),
        );

        const addOnTotal =
          customization?.addOns?.reduce((sum, a) => sum + a.price, 0) || 0;
        const basePrice = product.price;
        const unitPrice = basePrice + addOnTotal;

        if (existingItem) {
          const newQty = existingItem.quantity + 1;
          if (newQty > product.stock) return false;

          set({
            items: currentItems.map((item) =>
              item.id === product.id &&
              JSON.stringify(item.customization) ===
                JSON.stringify(customization)
                ? { ...item, quantity: newQty, totalPrice: unitPrice * newQty }
                : item,
            ),
          });
        } else {
          set({
            items: [
              ...currentItems,
              {
                id: product.id,
                name: product.name,
                description: product.description,
                basePrice,
                price: unitPrice,
                image: product.image,
                category: product.category,
                quantity: 1,
                customization,
                totalPrice: unitPrice,
              },
            ],
          });
        }
        return true;
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === productId
              ? { ...item, quantity, totalPrice: item.price * quantity }
              : item,
          ),
        });
      },
      updateCustomization: (productId, customization) => {
        set({
          items: get().items.map((item) =>
            item.id === productId
              ? (() => {
                  const unitPrice = calcUnitPrice(
                    item.basePrice,
                    customization,
                  );
                  return {
                    ...item,
                    customization,
                    price: unitPrice,
                    totalPrice: unitPrice * item.quantity,
                  };
                })()
              : item,
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      totalItems: () =>
        get().items.reduce((acc, item) => acc + item.quantity, 0),
      subtotal: () =>
        get().items.reduce((acc, item) => acc + item.totalPrice, 0),
      tax: () => get().subtotal() * TAX_RATE,
      serviceCharge: () => get().subtotal() * SERVICE_CHARGE_RATE,
      totalPrice: () => get().subtotal() + get().tax() + get().serviceCharge(),
    }),
    {
      name: "bisamakan-cart",
    },
  ),
);
