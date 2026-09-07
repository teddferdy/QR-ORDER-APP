// Strips a redundant leading "Meja" (any case/whitespace) from a
// backend-provided table name (Order.tableNumber already resolves to the
// real table.name when the backend has it — see orderService.ts — but a
// name like "Meja 6" concatenated with a caller's own "Meja " prefix would
// otherwise read as "Meja Meja 6"). Returns the bare designator only (e.g.
// "6"); callers combine it with their own existing "Meja " label/prefix
// exactly as before — this does not introduce a new display convention.
export function bareTableDesignator(rawName: string | null | undefined): string | null {
  const trimmed = rawName?.trim();
  if (!trimmed) return null;
  const stripped = trimmed.replace(/^meja\s+/i, "").trim();
  return stripped || null;
}
