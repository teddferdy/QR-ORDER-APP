// P5-02: stable idempotency key for ONE logical customer-order checkout
// attempt. Generated once per attempt and reused across retries of that same
// attempt, so a dropped/lost HTTPS response after server-side success can
// never cause a second independent order — the backend dedupes customer
// orders on (store, idempotencyKey) in /order/customer-create.
export function createIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}