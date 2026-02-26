function toHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function fingerprintStructuredQuery(q: any): Promise<string> {
  // Stable key ordering
  const normalized = {
    barcode: (q.barcode ?? null)?.toString().trim() || null,
    name: (q.name ?? "").toString().trim().toLowerCase(),
    brand: (q.brand ?? "").toString().trim().toLowerCase() || null,
    kind: (q.kind ?? "unknown").toString(),
    variant: (q.variant ?? "").toString().trim().toLowerCase() || null,
    expectedCategory: (q.expectedCategory ?? "unknown").toString(),
    isOrganic: (q.isOrganic ?? "unknown").toString()
  };
  const payload = JSON.stringify(normalized);
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(payload));
  return toHex(digest);
}
