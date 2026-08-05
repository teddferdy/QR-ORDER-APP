import apiClient from "./apiClient";
import type { Product, Category, AddOn } from "../types";

interface CustomerMenuResponse {
  message: string;
  data: {
    products: BackendProduct[];
    categories: BackendCategory[];
  };
}

interface BackendProduct {
  id: number;
  nameProduct: string;
  sku: string;
  image: string | null;
  barcode: string | null;
  brand: string | null;
  category: number;
  description: string | null;
  price: number;
  costPrice: number;
  isOption: boolean;
  options: unknown[];
  hasModifiers: boolean;
  modifiers: unknown[];
  stock: number;
  minStock: number;
  unit: string;
  baseUnit: string;
  conversionFactor: number;
  status: string;
  isAvailable: boolean;
  point: number;
  redeemPoints: number;
  tax: { id: number; name: string; rate: number } | null;
  priceTiers: unknown[];
  currencyId: number | null;
  currencyCode: string | null;
  createdBy: number | null;
  modifiedBy: number | null;
  tipeProduk: string;
  hppPerPorsi: number;
  foodCostPersen: number;
  marginPersen: number;
  isAvailableHariIni: boolean;
  composition: string[];
  estimationTime: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  categoryData: { name: string } | null;
}

interface BackendCategory {
  id: number;
  name: string;
  description: string | null;
  value: string;
  image: string | null;
  status: string;
  createdBy: number | null;
  modifiedBy: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

const CATEGORY_ICONS: Record<string, string> = {
  Makanan: "🍚",
  Minuman: "🥤",
  Dessert: "🍰",
  Snack: "🍟",
  Special: "⭐",
};

const CATEGORY_MAP: Record<string, Category> = {
  Makanan: "Makanan",
  Minuman: "Minuman",
  Dessert: "Dessert",
  Snack: "Snack",
  Special: "Special",
  "Makanan Berat": "Makanan Berat",
  "Minuman Dingin": "Minuman Dingin",
  makanan: "Makanan",
  minuman: "Minuman",
  dessert: "Dessert",
  snack: "Snack",
  special: "Special",
};

function mapCategoryName(name: string): Category {
  return CATEGORY_MAP[name] || "Makanan";
}

function mapBackendOptionsToFrontend(options: unknown[]): string[] {
  if (!Array.isArray(options)) return [];
  return options
    .filter(
      (opt): opt is { name: string; value: string } =>
        typeof opt === "object" &&
        opt !== null &&
        "name" in opt &&
        "value" in opt,
    )
    .map((opt) => opt.value || opt.name);
}

function mapBackendModifiersToFrontend(modifiers: unknown[]): AddOn[] {
  if (!Array.isArray(modifiers)) return [];
  return modifiers
    .filter(
      (mod): mod is { id: string | number; name: string; price: number } =>
        typeof mod === "object" &&
        mod !== null &&
        "name" in mod &&
        "price" in mod,
    )
    .map((mod, idx) => ({
      id: String(mod.id || idx),
      name: mod.name,
      price: mod.price,
    }));
}

export function mapBackendProductToFrontend(
  bp: BackendProduct,
  storeId?: string,
): Product {
  const sizes = mapBackendOptionsToFrontend(bp.options);
  const addOns = mapBackendModifiersToFrontend(bp.modifiers);
  const ingredients = Array.isArray(bp.composition)
    ? bp.composition.filter((c): c is string => typeof c === "string")
    : [];
  const categoryName = bp.categoryData?.name || "Makanan";

  return {
    id: String(bp.id),
    name: bp.nameProduct,
    description: bp.description || "",
    price: bp.price,
    image:
      bp.image ||
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=500&auto=format&fit=crop",
    category: mapCategoryName(categoryName),
    rating: 0,
    reviewsCount: 0,
    isBestSeller: false,
    isPromo: false,
    isVegetarian: false,
    estimatedTime: bp.estimationTime || 15,
    stock: bp.isAvailable ? bp.stock : 0,
    storeId: storeId || String(bp.category),
    sizes: sizes.length > 0 ? (sizes as Product["sizes"]) : undefined,
    spicinessLevels: undefined,
    addOns: addOns.length > 0 ? addOns : undefined,
    ingredients,
  };
}

export interface MenuCategoryUI {
  id: string;
  name: string;
  icon: string;
}

export async function fetchCustomerMenu(storeId: string): Promise<{
  products: Product[];
  categories: MenuCategoryUI[];
}> {
  const { data } = await apiClient.get<CustomerMenuResponse>(
    "/order/customer-menu",
    {
      params: { store: storeId },
    },
  );

  const seen = new Map<string, MenuCategoryUI>();
  const products = data.data.products.map((bp) => {
    const catName = bp.categoryData?.name || "Makanan";
    if (!seen.has(catName)) {
      seen.set(catName, {
        id: catName,
        name: catName,
        icon: CATEGORY_ICONS[catName] || "🍽️",
      });
    }
    return mapBackendProductToFrontend(bp, storeId);
  });

  return {
    products,
    categories: Array.from(seen.values()),
  };
}

export async function fetchProductById(
  productId: string,
  storeId?: string,
): Promise<Product | null> {
  try {
    if (!storeId) return null;
    const { data } = await apiClient.get<CustomerMenuResponse>(
      "/order/customer-menu",
      {
        params: { store: storeId },
      },
    );
    const raw = data.data.products.find(
      (p) => String(p.id) === String(productId),
    );
    if (!raw) return null;
    return mapBackendProductToFrontend(raw, storeId);
  } catch {
    return null;
  }
}
