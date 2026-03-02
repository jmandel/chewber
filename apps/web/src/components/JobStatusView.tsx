import React, { useEffect, useRef, useState } from "react";
import { API_BASE, api, type JobEvent, type JobStatus } from "../api";

export function JobStatusView(props: {
  jobId: string;
  onCompleted: (foodId: string) => void;
}) {
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [events, setEvents] = useState<JobEvent[]>([]);
  const [streaming, setStreaming] = useState(true);
  const eventsEndRef = useRef<HTMLDivElement>(null);

  const onCompletedRef = useRef(props.onCompleted);
  onCompletedRef.current = props.onCompleted;

  // Auto-scroll events
  useEffect(() => {
    eventsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  useEffect(() => {
    let cancelled = false;
    async function poll() {
      while (!cancelled) {
        try {
          const s = await api.getJob(props.jobId);
          if (!cancelled) setStatus(s);
          if (s.status === "succeeded" && s.result_food_id) {
            onCompletedRef.current(s.result_food_id);
            return;
          }
          if (s.status === "succeeded" || s.status === "failed") return;
        } catch {}
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
    poll();
    return () => { cancelled = true; };
  }, [props.jobId]);

  useEffect(() => {
    if (!streaming) return;
    const es = new EventSource(`${API_BASE}/api/jobs/${encodeURIComponent(props.jobId)}/stream`);
    es.addEventListener("job_event", (e: MessageEvent) => {
      try {
        const ev = JSON.parse(e.data) as JobEvent;
        setEvents((prev) => [...prev, ev]);
      } catch {}
    });
    es.addEventListener("job_status", (e: MessageEvent) => {
      try { setStatus(JSON.parse(e.data) as JobStatus); } catch {}
    });
    es.onerror = () => {};
    return () => es.close();
  }, [props.jobId, streaming]);

  const pct = status ? Math.round(status.progress) : 0;

  return (
    <div className="card" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
      {/* Progress bar */}
      <div style={{ height: 4, background: "var(--log-progress-track)", borderRadius: 2, marginBottom: 12, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "#3b82f6", transition: "width 0.3s", borderRadius: 2 }} />
      </div>

      {status?.status === "succeeded" && !status.result_food_id && status.error && (
        <div style={{ background: "var(--surface-2, #f5f5f5)", border: "1px solid var(--border, #ddd)", borderRadius: 8, padding: "12px 16px", marginBottom: 12, fontSize: 14, color: "var(--fg, #333)" }}>
          <strong>Product not found</strong>
          <p style={{ margin: "6px 0 0" }}>{status.error}</p>
        </div>
      )}
      {status?.error && !(status.status === "succeeded" && !status.result_food_id) && (
        <div style={{ background: "var(--log-error-banner-bg)", border: "1px solid var(--log-error-banner-border)", borderRadius: 8, padding: "8px 12px", marginBottom: 12, fontSize: 13, color: "var(--log-error-banner-fg)" }}>
          {status.error}
        </div>
      )}

      {/* Event log */}
      <div style={{ maxHeight: 360, overflowY: "auto", fontSize: 13 }}>
        {events.length === 0 && (
          <div className="muted" style={{ textAlign: "center", padding: 12 }}>Waiting for events…</div>
        )}
        {events.map((ev) => <EventRow key={ev.id} ev={ev} />)}
        <div ref={eventsEndRef} />
      </div>
    </div>
  );
}

const LEVEL_STYLES: Record<string, { bg: string; fg: string; label: string }> = {
  info:  { bg: "var(--log-info-bg)",  fg: "var(--log-info-fg)",  label: "info" },
  tool:  { bg: "var(--log-tool-bg)",  fg: "var(--log-tool-fg)",  label: "tool" },
  warn:  { bg: "var(--log-warn-bg)",  fg: "var(--log-warn-fg)",  label: "warn" },
  error: { bg: "var(--log-error-bg)", fg: "var(--log-error-fg)", label: "error" },
  debug: { bg: "var(--log-debug-bg)", fg: "var(--log-debug-fg)", label: "debug" },
};

function EventRow({ ev }: { ev: JobEvent }) {
  const [expanded, setExpanded] = useState(false);
  const style = LEVEL_STYLES[ev.level] ?? LEVEL_STYLES.info;
  const hasData = ev.data && Object.keys(ev.data).length > 0;

  return (
    <div style={{
      padding: "6px 10px", marginBottom: 2, borderRadius: 6,
      background: style.bg, cursor: hasData ? "pointer" : "default"
    }} onClick={() => hasData && setExpanded(!expanded)}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{
          fontSize: 10, fontWeight: 700, textTransform: "uppercase",
          color: style.fg, minWidth: 32
        }}>{style.label}</span>
        <span style={{ flex: 1, color: "var(--log-message-fg)" }}>{ev.message}</span>
        <span className="muted" style={{ fontSize: 11, flexShrink: 0 }}>
          {new Date(ev.ts).toLocaleTimeString()}
        </span>
        {hasData && (
          <span style={{ fontSize: 11, color: "var(--log-expand-fg)", marginLeft: 4 }}>{expanded ? "▴" : "▾"}</span>
        )}
      </div>
      {expanded && hasData && (
        <pre style={{
          marginTop: 6, padding: "8px 10px", background: "var(--log-pre-bg)",
          borderRadius: 4, fontSize: 11, color: "var(--log-pre-fg)",
          overflow: "auto", maxHeight: 200, whiteSpace: "pre-wrap",
          wordBreak: "break-word"
        }}>{JSON.stringify(ev.data, null, 2)}</pre>
      )}
    </div>
  );
}
