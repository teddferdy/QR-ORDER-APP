import apiClient from "./apiClient";

interface TaxConfigItem {
  id: number;
  store: number | null;
  name: string;
  rate: number;
  type: "ppn" | "service_charge" | "other";
  status: string;
  description: string | null;
}

interface TaxConfigResponse {
  success: boolean;
  message: string;
  data: TaxConfigItem[];
}

interface LocationPublicItem {
  id: number;
  store: number;
  name: string;
  city: string;
  province: string;
  detailLocation: string;
  latitude: number | null;
  longitude: number | null;
  status: string;
}

interface LocationPublicResponse {
  success: boolean;
  message: string;
  data: LocationPublicItem[];
}

export interface StoreConfig {
  taxRate: number;
  serviceChargeRate: number;
  storeName: string;
}

const DEFAULT_STORE_CONFIG: StoreConfig = {
  taxRate: 0.11,
  serviceChargeRate: 0.05,
  storeName: "",
};

// In-memory only (module-scoped, never persisted to localStorage/
// sessionStorage — lost on reload, exactly like every other unmounted
// hook's state was before this cache existed). Keyed by storeId so two
// stores can never share a config. Holds the *raw* (throwing) request
// promise, not a resolved value — a failed request is evicted immediately
// (see the .catch below) rather than cached, so it can never be mistaken
// for a successful config on a later call; only a genuinely successful
// response is ever reused across callers/pages for the same storeId.
const storeConfigCache = new Map<string, Promise<StoreConfig>>();

async function fetchStoreConfigFromApi(storeId: string): Promise<StoreConfig> {
  const [taxRes, locRes] = await Promise.all([
    apiClient.get<TaxConfigResponse>("/tax-config/public", {
      params: { store: storeId, status: "active" },
    }),
    apiClient.get<LocationPublicResponse>("/location/get-location-public"),
  ]);

  const taxConfigs = taxRes.data.data || [];
  const taxConfig = taxConfigs.find(
    (t) => t.type === "ppn" && t.status === "active",
  );
  const serviceConfig = taxConfigs.find(
    (t) => t.type === "service_charge" && t.status === "active",
  );

  const locations = locRes.data.data || [];
  const store = locations.find(
    (l) => l.store === Number(storeId) || l.id === Number(storeId),
  );

  return {
    taxRate: taxConfig ? taxConfig.rate / 100 : 0.11,
    serviceChargeRate: serviceConfig ? serviceConfig.rate / 100 : 0.05,
    storeName: store?.name || "",
  };
}

export async function fetchStoreConfig(storeId: string): Promise<StoreConfig> {
  try {
    let pending = storeConfigCache.get(storeId);
    if (!pending) {
      pending = fetchStoreConfigFromApi(storeId);
      storeConfigCache.set(storeId, pending);
      // Never cache a failure as if it were data: if this request fails,
      // drop it from the cache so the next call (for this storeId, from any
      // consumer) retries fresh instead of reusing a broken result.
      pending.catch(() => {
        if (storeConfigCache.get(storeId) === pending) {
          storeConfigCache.delete(storeId);
        }
      });
    }
    return await pending;
  } catch {
    // Preserves the exact pre-existing external contract: fetchStoreConfig
    // itself never rejects, it always resolves — to real data on success,
    // to these safe defaults on failure.
    return DEFAULT_STORE_CONFIG;
  }
}

export interface StoreLocation {
  id: number;
  store: number;
  name: string;
  city: string;
  province: string;
}

export async function fetchPublicStores(): Promise<StoreLocation[]> {
  try {
    const { data } = await apiClient.get<LocationPublicResponse>(
      "/location/get-location-public",
    );
    return data.data || [];
  } catch {
    return [];
  }
}
