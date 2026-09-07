import type { Bundle, Product } from "../types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=500&auto=format&fit=crop";

// A bundle is one purchasable unit on the backend — order/customer-create
// resolves it server-side from `bundleId` alone (see BE-POS-App
// api/controller/order.js createCustomerOrder). This builds the synthetic
// "product" useCartStore.addItem expects, carrying bundleId/bundleItems
// through so it stays a single, correctly-identified cart line — used by
// both BundleCard (fresh add) and OrderHistoryPage (bundle reorder).
export function bundleToCartProduct(bundle: Bundle): Product {
  const image =
    bundle.image || bundle.items[0]?.productImage || FALLBACK_IMAGE;
  return {
    id: `bundle-${bundle.id}`,
    name: bundle.name,
    description: bundle.description || "",
    price: bundle.bundlePrice,
    image,
    images: [image],
    category: "Special",
    rating: 0,
    reviewsCount: 0,
    isBestSeller: false,
    isPromo: false,
    isVegetarian: false,
    estimatedTime: 0,
    stock: 999,
    storeId: "",
    ingredients: [],
    bundleId: bundle.id,
    bundleItems: bundle.items.map((item) => ({
      name: item.productName,
      quantity: item.quantity,
    })),
  };
}
