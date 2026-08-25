import apiClient from "./apiClient";
import type { Product, Category, AddOn, Review, Bundle, PromoCampaign } from "../types";

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
  reviews?: BackendReview[];
  averageRating?: number;
  totalReviews?: number;
}

interface BackendReview {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
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

function mapBackendReviewToFrontend(br: BackendReview, productId: string): Review {
  return {
    id: String(br.id),
    userId: "",
    userName: br.userName,
    rating: br.rating,
    comment: br.comment,
    createdAt: br.createdAt,
    orderId: "",
    productId,
  };
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
    rating: bp.averageRating ?? 0,
    reviewsCount: bp.totalReviews ?? bp.reviews?.length ?? 0,
    reviews: bp.reviews?.map((r) => mapBackendReviewToFrontend(r, String(bp.id))),
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

export async function fetchProductReviews(
  productId: string,
  storeId: string,
): Promise<{ reviews: Review[]; averageRating: number; totalReviews: number }> {
  try {
    const { data } = await apiClient.get<CustomerMenuResponse>(
      "/order/customer-menu",
      {
        params: { store: storeId },
      },
    );
    const raw = data.data.products.find(
      (p) => String(p.id) === String(productId),
    );
    if (!raw) return { reviews: [], averageRating: 0, totalReviews: 0 };
    const reviews =
      raw.reviews?.map((r) => ({
        id: String(r.id),
        userId: "",
        userName: r.userName,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        orderId: "",
        productId: String(raw.id),
      })) || [];
    return {
      reviews,
      averageRating: raw.averageRating ?? 0,
      totalReviews: raw.totalReviews ?? reviews.length,
    };
  } catch {
    return { reviews: [], averageRating: 0, totalReviews: 0 };
  }
}

// ─── Product Bundles ─────────────────────────────────────────────

interface BackendBundleItem {
  id: number;
  bundleId: number;
  product: number;
  quantity: number;
  unitPrice: number;
  isOptional: boolean;
  productData: {
    id: number;
    nameProduct: string;
    price: number;
    image: string | null;
    stock: number;
  } | null;
}

interface BackendBundle {
  id: number;
  store: number[] | null;
  name: string;
  sku: string;
  description: string | null;
  image: string | null;
  bundlePrice: number;
  originalPrice: number;
  discountAmount: number;
  discountPercentage: string;
  minQuantity: number;
  maxQuantity: number | null;
  isAvailable: boolean;
  status: string;
  validFrom: string;
  validUntil: string;
  items: BackendBundleItem[];
}

interface BundleListResponse {
  message: string;
  data: {
    items: BackendBundle[];
  };
}

function mapBackendBundleToFrontend(bb: BackendBundle): Bundle {
  const items = (bb.items || []).map((bi) => ({
    id: String(bi.id),
    bundleId: String(bi.bundleId),
    productId: String(bi.product),
    productName: bi.productData?.nameProduct || "",
    productImage: bi.productData?.image || "",
    quantity: bi.quantity,
    unitPrice: bi.unitPrice,
    isOptional: bi.isOptional,
  }));

  return {
    id: String(bb.id),
    name: bb.name,
    sku: bb.sku,
    description: bb.description || "",
    image: bb.image,
    bundlePrice: bb.bundlePrice,
    originalPrice: bb.originalPrice,
    discountAmount: bb.discountAmount,
    discountPercentage: parseFloat(bb.discountPercentage) || 0,
    minQuantity: bb.minQuantity,
    maxQuantity: bb.maxQuantity,
    isAvailable: bb.isAvailable,
    status: bb.status,
    validFrom: bb.validFrom,
    validUntil: bb.validUntil,
    items,
  };
}

export async function fetchBundles(storeId?: string): Promise<Bundle[]> {
  const { data } = await apiClient.get<BundleListResponse>(
    "/product-bundle/get-all",
    {
      params: {
        page: 1,
        limit: 50,
        ...(storeId ? { store: storeId } : {}),
      },
    },
  );
  return (data.data.items || [])
    .filter((b) => b.status === "active" && b.isAvailable)
    .map(mapBackendBundleToFrontend);
}

// ─── Customer Promos (Banner) ─────────────────────────────────────

interface CustomerPromoResponse {
  success: boolean;
  message: string;
  data: Array<{
    id: number;
    name: string;
    description: string | null;
    code: string | null;
    type: string;
    discountType: string;
    discountValue: number;
    maxDiscount: number | null;
    minPurchase: number;
    startDate: string;
    endDate: string;
    startTime: string | null;
    endTime: string | null;
    daysOfWeek: string[] | null;
    applicableTo: string;
    priority: number;
  }>;
}

function mapBackendPromoToFrontend(bp: CustomerPromoResponse["data"][number]): PromoCampaign {
  return {
    id: String(bp.id),
    name: bp.name,
    description: bp.description || "",
    code: bp.code || "",
    type: bp.type,
    discountType: bp.discountType,
    discountValue: bp.discountValue,
    maxDiscount: bp.maxDiscount,
    minPurchase: bp.minPurchase,
    startDate: bp.startDate,
    endDate: bp.endDate,
    startTime: bp.startTime,
    endTime: bp.endTime,
    daysOfWeek: bp.daysOfWeek,
    applicableTo: bp.applicableTo,
    priority: bp.priority,
  };
}

export async function fetchCustomerPromos(storeId?: string): Promise<PromoCampaign[]> {
  const { data } = await apiClient.get<CustomerPromoResponse>(
    "/promo/customer-active",
    {
      params: storeId ? { store: storeId } : {},
    },
  );
  return (data.data || []).map(mapBackendPromoToFrontend);
}
