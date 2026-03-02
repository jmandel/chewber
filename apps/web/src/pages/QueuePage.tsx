import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api, type QueueJob } from "../api";
import { JobStatusView } from "../components/JobStatusView";
import { useQueueStore, useFoodStore, useUIStore } from "../stores";
import { usePrefetch } from "../hooks/usePrefetch";
import { useQueueJobs } from "../hooks/useStoreData";
import { BackLink, FocusCard, PrefetchLink } from "../components/shared";

export function QueuePage() {
  const { jobs, loaded } = useQueueJobs();
  // Poll for updates while on this page
  const fetchJobs = useQueueStore(s => s.fetchJobs);
  useEffect(() => { const iv = setInterval(fetchJobs, 3000); return () => clearInterval(iv); }, [fetchJobs]);

  const active = jobs.filter(j => j.status === "running" || j.status === "queued");
  const completed = jobs.filter(j => j.status === "succeeded" && j.result_food_id);
  const notFound = jobs.filter(j => j.status === "succeeded" && !j.result_food_id);
  const failed = jobs.filter(j => j.status === "failed");

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <BackLink />
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Research Queue</h2>
      {!loaded && <div className="muted" style={{ textAlign: "center", padding: 20 }}><div className="spinner" /></div>}
      {loaded && active.length === 0 && completed.length === 0 && notFound.length === 0 && failed.length === 0 && (
        <div className="card muted" style={{ textAlign: "center" }}>No research jobs yet.</div>
      )}
      {active.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Active</div>
          {active.map(j => <QueueJobRow key={j.id} job={j} />)}
        </div>
      )}
      {failed.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Failed</div>
          {failed.map(j => <QueueJobRow key={j.id} job={j} />)}
        </div>
      )}
      {notFound.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Not Found</div>
          {notFound.map(j => <QueueJobRow key={j.id} job={j} />)}
        </div>
      )}
      {completed.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Completed</div>
          {completed.map(j => <QueueJobRow key={j.id} job={j} />)}
        </div>
      )}
    </div>
  );
}

const STATUS_BADGE: Record<string, { bg: string; fg: string; label: string }> = {
  queued:    { bg: "color-mix(in srgb, var(--fog) 20%, transparent)", fg: "var(--fog)", label: "Queued" },
  running:   { bg: "color-mix(in srgb, var(--sky) 20%, transparent)", fg: "var(--sky)", label: "Running" },
  succeeded: { bg: "color-mix(in srgb, var(--kale) 20%, transparent)", fg: "var(--kale)", label: "Done" },
  not_found: { bg: "color-mix(in srgb, var(--fog) 20%, transparent)", fg: "var(--fog)", label: "Not Found" },
  failed:    { bg: "color-mix(in srgb, var(--coral) 20%, transparent)", fg: "var(--coral)", label: "Failed" },
};

function QueueJobRow({ job }: { job: QueueJob }) {
  const isNotFound = job.status === "succeeded" && !job.result_food_id;
  const badge = isNotFound ? STATUS_BADGE.not_found : (STATUS_BADGE[job.status] ?? STATUS_BADGE.queued);
  const isActive = job.status === "running" || job.status === "queued";
  const adminKey = useUIStore(s => s.adminKey);
  const retryJob = useQueueStore(s => s.retryJob);
  const linkTo = isActive ? `/job/${encodeURIComponent(job.id)}`
    : job.food_slug ? `/food/${encodeURIComponent(job.food_slug)}`
    : job.result_food_id ? `/food/${encodeURIComponent(job.result_food_id)}` : null;
  const [retrying, setRetrying] = useState(false);
  const timeAgo = (iso: string) => { const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000); if (s < 60) return "just now"; if (s < 3600) return `${Math.floor(s / 60)}m ago`; if (s < 86400) return `${Math.floor(s / 3600)}h ago`; return `${Math.floor(s / 86400)}d ago`; };

  async function handleRetry(e: React.MouseEvent) {
    e.preventDefault(); e.stopPropagation();
    if (!adminKey) return;
    setRetrying(true);
    try { await retryJob(job.id, adminKey); } catch (err: any) { alert(`Retry failed: ${err.message}`); } finally { setRetrying(false); }
  }

  const inner = (
    <div className="card" style={{ padding: "12px 14px", marginBottom: 6, cursor: linkTo ? "pointer" : "default" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.food_name ?? job.label ?? job.id}</div>
          {job.food_brand && <div className="muted" style={{ fontSize: 12 }}>{job.food_brand}</div>}
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", padding: "2px 8px", borderRadius: 8, background: badge.bg, color: badge.fg, whiteSpace: "nowrap" }}>{badge.label}</span>
        <span className="muted" style={{ fontSize: 11, flexShrink: 0 }}>{timeAgo(job.created_at)}</span>
      </div>
      {isActive && job.progress > 0 && (
        <div style={{ height: 3, background: "var(--slate)", borderRadius: 2, marginTop: 8, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${Math.round(job.progress)}%`, background: "var(--sky)", borderRadius: 2, transition: "width 0.3s" }} />
        </div>
      )}
      {job.status === "failed" && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          {job.error && <div className="muted" style={{ fontSize: 11, color: "var(--coral)", flex: 1 }}>{job.error}</div>}
          {!!adminKey && <button onClick={handleRetry} disabled={retrying} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 4, cursor: "pointer", background: "none", border: "1px solid var(--fog)", color: "var(--fog)", fontWeight: 600, flexShrink: 0, opacity: retrying ? 0.5 : 1 }}>{retrying ? "…" : "Retry"}</button>}
        </div>
      )}
      {isNotFound && job.error && (
        <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>{job.error}</div>
      )}
    </div>
  );
  return linkTo ? <PrefetchLink to={linkTo} style={{ textDecoration: "none", color: "inherit" }}>{inner}</PrefetchLink> : inner;
}

// ── Job page ────────────────────────────────────────────────
export function JobPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const nav = useNavigate();
  const fetchFood = useFoodStore(s => s.fetchFood);
  const [label, setLabel] = useState<string>("Gathering nutrition data");
  const [notFound, setNotFound] = useState(false);

  // One-time: check if job already completed → redirect
  const checkedRef = useRef(false);
  if (jobId && !checkedRef.current) {
    checkedRef.current = true;
    api.getJob(jobId).then(job => {
      if (job.label) setLabel(job.label);
      if (job.status === "succeeded" && job.result_food_id) {
        fetchFood(job.result_food_id).then(f => {
          nav(`/food/${encodeURIComponent(f?.slug ?? f?.id ?? job.result_food_id!)}`, { replace: true });
        });
      }
    }).catch(() => setNotFound(true));
  }

  const onCompleted = useCallback(async (foodId: string) => {
    const f = await fetchFood(foodId);
    nav(`/food/${encodeURIComponent(f?.slug ?? f?.id ?? foodId)}`, { replace: true });
  }, [nav, fetchFood]);

  if (!jobId || notFound) return <FocusCard><div>Job not found</div><Link to="/">← Home</Link></FocusCard>;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <BackLink />
      <div className="card" style={{ textAlign: "center", padding: "16px 20px", marginBottom: 0, borderBottom: "none", borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>Researching…</div>
        <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>{label}</div>
      </div>
      <JobStatusView jobId={jobId} onCompleted={onCompleted} />
    </div>
  );
}
