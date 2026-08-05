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

export async function fetchStoreConfig(storeId: string): Promise<StoreConfig> {
  try {
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
  } catch {
    return { taxRate: 0.11, serviceChargeRate: 0.05, storeName: "" };
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
