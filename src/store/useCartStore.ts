import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, CartItemCustomization } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, customization?: CartItemCustomization) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateCustomization: (productId: string, customization: CartItemCustomization) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
  tax: () => number;
  serviceCharge: () => number;
  totalPrice: () => number;
}

const TAX_RATE = 0.11;
const SERVICE_CHARGE_RATE = 0.05;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, customization) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) =>
            item.id === product.id &&
            JSON.stringify(item.customization) === JSON.stringify(customization)
        );

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === product.id &&
              JSON.stringify(item.customization) === JSON.stringify(customization)
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          const totalPrice = product.price;
          set({
            items: [
              ...currentItems,
              {
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                image: product.image,
                category: product.category,
                quantity: 1,
                customization,
                totalPrice,
              },
            ],
          });
        }
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
              : item
          ),
        });
      },
      updateCustomization: (productId, customization) => {
        set({
          items: get().items.map((item) =>
            item.id === productId
              ? { ...item, customization, totalPrice: item.price * item.quantity }
              : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      subtotal: () =>
        get().items.reduce((acc, item) => acc + item.totalPrice, 0),
      tax: () => get().subtotal() * TAX_RATE,
      serviceCharge: () => get().subtotal() * SERVICE_CHARGE_RATE,
      totalPrice: () =>
        get().subtotal() + get().tax() + get().serviceCharge(),
    }),
    {
      name: 'bisamakan-cart',
    }
  )
);