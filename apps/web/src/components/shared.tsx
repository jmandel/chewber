import React from "react";
import { Link, type LinkProps, useNavigate } from "react-router-dom";
import { marked } from "marked";
import type { FoodSummary, Category } from "../api";
import { usePrefetch } from "../hooks/usePrefetch";
import { useCatCounts } from "../hooks/useStoreData";

// ── PrefetchLink ─────────────────────────────────────────────
export function PrefetchLink({ to, children, ...rest }: LinkProps & { to: string }) {
  const prefetch = usePrefetch();
  return (
    <Link to={to} onMouseEnter={() => prefetch(to)} onTouchStart={() => prefetch(to)} {...rest}>
      {children}
    </Link>
  );
}

// ── Score pill ──────────────────────────────────────────────
export function ScorePill({ score, size = 20 }: { score: number | null; size?: number }) {
  const color = score == null ? "var(--fog)" : score >= 75 ? "var(--kale)" : score >= 50 ? "var(--amber)" : score >= 25 ? "var(--tangerine)" : "var(--coral)";
  return <div style={{ fontSize: size, fontWeight: 900, color, flexShrink: 0, minWidth: 36, textAlign: "right" }}>{score ?? "—"}</div>;
}

// ── Food list item ──────────────────────────────────────────
export function FoodListItem({ food, onClick, noBorder, onHover }: { food: FoodSummary; onClick: () => void; noBorder?: boolean; onHover?: () => void }) {
  const organic = food.organic;
  return (
    <div onClick={onClick} onMouseEnter={onHover} onTouchStart={onHover} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: noBorder ? "none" : "1px solid var(--slate)", cursor: "pointer", gap: 12 }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{food.canonical_name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 1 }}>
          {food.brand && <span className="muted" style={{ fontSize: 12 }}>{food.brand}</span>}
          {organic && organic !== "unknown" && (
            <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3, lineHeight: 1.3, background: organic === "yes" ? "color-mix(in srgb, var(--kale) 18%, transparent)" : "color-mix(in srgb, var(--fog) 10%, transparent)", color: organic === "yes" ? "var(--kale)" : "var(--fog)", border: `1px solid ${organic === "yes" ? "var(--kale)" : "var(--fog)"}`, opacity: organic === "yes" ? 1 : 0.5 }}>{organic === "yes" ? "Organic" : "Conventional"}</span>
          )}
        </div>
      </div>
      <ScorePill score={food.score ?? null} />
    </div>
  );
}

// ── OrganicPill ─────────────────────────────────────────────
export function OrganicPill({ organic }: { organic?: string }) {
  if (!organic || organic === "unknown") return null;
  const yes = organic === "yes";
  return (
    <span style={{
      display: "inline-block", fontSize: 10, fontWeight: 700, letterSpacing: "0.03em",
      padding: "2px 6px", borderRadius: 4, lineHeight: 1.3, whiteSpace: "nowrap",
      background: yes ? "color-mix(in srgb, var(--kale) 18%, transparent)" : "color-mix(in srgb, var(--fog) 12%, transparent)",
      color: yes ? "var(--kale)" : "var(--fog)",
      border: `1px solid ${yes ? "var(--kale)" : "var(--fog)"}`,
      opacity: yes ? 1 : 0.6
    }}>{yes ? "Organic" : "Conventional"}</span>
  );
}

// ── Markdown renderer ───────────────────────────────────────
export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string;
}

// ── Layout helpers ──────────────────────────────────────────
export function BackLink({ onBeforeBack }: { onBeforeBack?: () => void } = {}) {
  const nav = useNavigate();
  return (
    <div onClick={() => { onBeforeBack?.(); nav(-1); }} style={{ cursor: "pointer", marginBottom: 12, fontSize: 14 }}>
      <span className="muted">← Back</span>
    </div>
  );
}

export function FocusCard({ children }: { children: React.ReactNode }) {
  return <div style={{ maxWidth: 480, margin: "0 auto" }}><div className="card" style={{ textAlign: "center", padding: "40px 24px" }}>{children}</div></div>;
}

export function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: "12px 16px", fontSize: 14, fontWeight: active ? 700 : 400,
      background: active ? "var(--slate)" : "transparent", color: active ? "var(--cream)" : "var(--fog)",
      border: "none", borderBottom: active ? "2px solid var(--kale)" : "2px solid transparent",
      borderRadius: 0, cursor: "pointer",
    }}>{children}</button>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: 16 }}><div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>{title}</div>{children}</div>;
}

export function KV({ label, value }: { label: string; value: string }) {
  return <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--slate)", fontSize: 13 }}><span className="muted">{label}</span><span>{value}</span></div>;
}

// ── Category helpers ────────────────────────────────────────
const TRAIT_PATTERNS = /^(high|low|good|no|many|contains|calorie)-/;
export function isCategory(tag: string) { return !TRAIT_PATTERNS.test(tag); }

export function FoodCategories({ tags }: { tags?: string[] }) {
  const nav = useNavigate();
  const counts = useCatCounts();
  const allCats = (tags ?? []).filter(isCategory);
  if (allCats.length === 0) return null;
  const sorted = Object.keys(counts).length > 0
    ? [...allCats].sort((a, b) => (counts[b] ?? 0) - (counts[a] ?? 0))
    : allCats;

  return (
    <div className="food-cats" style={{
      display: "flex", gap: 5, marginTop: 8, marginBottom: 8,
      overflowX: "auto", WebkitOverflowScrolling: "touch",
      scrollbarWidth: "none",
    }}>
      {sorted.map(t => (
        <span key={t} className="badge" onClick={() => nav(`/category/${encodeURIComponent(t)}`)}
          style={{ cursor: "pointer", fontSize: 11, padding: "3px 8px", whiteSpace: "nowrap", flexShrink: 0 }}>
          {t.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ")}
        </span>
      ))}
    </div>
  );
}

export function CategoryChip({ category, onClick }: { category: Category; onClick: () => void }) {
  return (
    <span onClick={onClick} className="badge" style={{
      cursor: "pointer", padding: "5px 10px", fontSize: 12, display: "inline-flex",
      alignItems: "center", gap: 5
    }}>
      {category.display_name}
      <span style={{ opacity: 0.5, fontSize: 10 }}>{category.food_count}</span>
    </span>
  );
}

// ── Additive risk-level styling ─────────────────────────────
export const ADDITIVE_RISK_STYLES: Record<string, { bg: string; fg: string; border: string; marker: string; penalty?: number; order: number }> = {
  risk_free: { bg: "rgba(96,165,250,0.12)", fg: "#60a5fa", border: "rgba(96,165,250,0.35)", marker: "✓", order: 3 },
  limited:   { bg: "rgba(212,162,76,0.15)",  fg: "#d4a24c", border: "rgba(212,162,76,0.35)",  marker: "●", order: 2, penalty: 3 },
  moderate:  { bg: "rgba(234,138,60,0.15)",  fg: "#ea8a3c", border: "rgba(234,138,60,0.35)",  marker: "▲", order: 1, penalty: 10 },
  high:      { bg: "rgba(220,60,60,0.18)",   fg: "#dc3c3c", border: "rgba(220,60,60,0.40)",   marker: "✕", order: 0, penalty: 30 },
};
