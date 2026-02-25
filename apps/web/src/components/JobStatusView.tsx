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
          if (s.status === "failed") return;
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
      <div style={{ height: 4, background: "#27272a", borderRadius: 2, marginBottom: 12, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "#3b82f6", transition: "width 0.3s", borderRadius: 2 }} />
      </div>

      {status?.error && (
        <div style={{ background: "#2a1010", border: "1px solid #ff4444", borderRadius: 8, padding: "8px 12px", marginBottom: 12, fontSize: 13, color: "#ff8888" }}>
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
  info:  { bg: "#1e293b", fg: "#94a3b8", label: "info" },
  tool:  { bg: "#0f2a1e", fg: "#4ade80", label: "tool" },
  warn:  { bg: "#2a2206", fg: "#facc15", label: "warn" },
  error: { bg: "#2a1010", fg: "#f87171", label: "error" },
  debug: { bg: "#1a1a1e", fg: "#666",    label: "debug" },
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
        <span style={{ flex: 1, color: "#d4d4d8" }}>{ev.message}</span>
        <span className="muted" style={{ fontSize: 11, flexShrink: 0 }}>
          {new Date(ev.ts).toLocaleTimeString()}
        </span>
        {hasData && (
          <span style={{ fontSize: 11, color: "#666", marginLeft: 4 }}>{expanded ? "▴" : "▾"}</span>
        )}
      </div>
      {expanded && hasData && (
        <pre style={{
          marginTop: 6, padding: "8px 10px", background: "#0e0e12",
          borderRadius: 4, fontSize: 11, color: "#a1a1aa",
          overflow: "auto", maxHeight: 200, whiteSpace: "pre-wrap",
          wordBreak: "break-word"
        }}>{JSON.stringify(ev.data, null, 2)}</pre>
      )}
    </div>
  );
}
