import apiClient from "./apiClient";

interface WaiterRequestData {
  id: number;
  store: number;
  requestNumber: string;
  tableId: number | null;
  orderId: number | null;
  type: string;
  notes: string | null;
  customerName: string | null;
  status: string;
  resolvedAt: string | null;
  createdAt: string;
  table: { id: number; name: string } | null;
}

export interface WaiterRequestItem {
  id: string;
  requestNumber: string;
  type: string;
  tableName: string;
  notes: string | null;
  status: string;
  createdAt: string;
}

export interface WaiterRequestPayload {
  store: number;
  tableId?: number;
  orderId?: number;
  type: string;
  notes?: string;
  customerName?: string;
}

const TYPE_LABELS: Record<string, string> = {
  sendok: "Sendok",
  tisu: "Tisu",
  refill: "Refill",
  bill: "Bill",
  call: "Panggil Pelayan",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  done: "Done",
};

function mapType(type: string): string {
  return TYPE_LABELS[type] || type;
}

function mapStatus(status: string): string {
  return STATUS_LABELS[status] || status;
}

function mapRequest(data: WaiterRequestData): WaiterRequestItem {
  return {
    id: String(data.id),
    requestNumber: data.requestNumber,
    type: mapType(data.type),
    tableName: data.table?.name || (data.tableId ? `Meja ${data.tableId}` : ""),
    notes: data.notes,
    status: mapStatus(data.status),
    createdAt: data.createdAt,
  };
}

export async function createWaiterRequest(
  payload: WaiterRequestPayload,
): Promise<WaiterRequestItem> {
  const { data } = await apiClient.post(
    "/waiter-request/customer-create",
    payload,
  );
  return mapRequest(data.data);
}

export async function fetchMyWaiterRequests(
  storeId: string,
  tableId?: string,
): Promise<WaiterRequestItem[]> {
  try {
    const { data } = await apiClient.get("/waiter-request/customer-list", {
      params: { store: storeId, tableId: tableId || undefined },
    });
    const requests = data.data || [];
    if (!Array.isArray(requests)) return [];
    return requests.map(mapRequest);
  } catch {
    return [];
  }
}
