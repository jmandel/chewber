/**
 * Minimal Server-Sent Events helper for Hono.
 */
export function sseHeaders(): Record<string, string> {
  return {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no"
  };
}

export function formatSseEvent(opts: {
  event?: string;
  data: any;
  id?: string | number;
  retryMs?: number;
}): string {
  const lines: string[] = [];
  if (opts.id != null) lines.push(`id: ${opts.id}`);
  if (opts.event) lines.push(`event: ${opts.event}`);
  if (opts.retryMs != null) lines.push(`retry: ${opts.retryMs}`);

  const dataStr = typeof opts.data === "string" ? opts.data : JSON.stringify(opts.data);
  for (const line of dataStr.split(/\r?\n/)) {
    lines.push(`data: ${line}`);
  }
  lines.push(""); // terminator
  return lines.join("\n") + "\n";
}
