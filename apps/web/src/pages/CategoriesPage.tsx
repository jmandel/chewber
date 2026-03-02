import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { FoodSummary } from "../api";
import type { CategorySort } from "../stores";
import { usePrefetch } from "../hooks/usePrefetch";
import { useCategories, useCategoryFoods, useCategoryAllFoods } from "../hooks/useStoreData";
import { ScorePill, FoodListItem, BackLink } from "../components/shared";

export function CategoriesPage() {
  const nav = useNavigate();
  const { categories, loaded } = useCategories();
  const [filter, setFilter] = useState("");
  const filtered = filter ? categories.filter(c => c.display_name.toLowerCase().includes(filter.toLowerCase()) || c.slug.includes(filter.toLowerCase())) : categories;
  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <BackLink />
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Categories</h2>
      {categories.length > 8 && <input placeholder="Filter categories…" value={filter} onChange={e => setFilter(e.target.value)} style={{ width: "100%", marginBottom: 12, fontSize: 14, padding: "10px 14px" }} />}
      {!loaded && <div className="muted" style={{ textAlign: "center", padding: 20 }}><div className="spinner" /></div>}
      {loaded && filtered.length === 0 && <div className="card muted" style={{ textAlign: "center" }}>No categories found.</div>}
      {filtered.map(c => (
        <div key={c.slug} onClick={() => nav(`/category/${encodeURIComponent(c.slug)}`)} className="card" style={{ padding: "12px 14px", marginBottom: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div><div style={{ fontWeight: 600, fontSize: 14 }}>{c.display_name}</div>{c.description && <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{c.description}</div>}</div>
          <span className="muted" style={{ fontSize: 13, flexShrink: 0, marginLeft: 12 }}>{c.food_count}</span>
        </div>
      ))}
    </div>
  );
}

function CategoryScoreBar({ foods }: { foods: FoodSummary[] }) {
  const scored = foods.filter(f => f.score != null);
  if (scored.length < 2) return null;
  const buckets = { excellent: 0, good: 0, mediocre: 0, poor: 0 };
  for (const f of scored) {
    const s = f.score!;
    if (s >= 85) buckets.excellent++;
    else if (s >= 65) buckets.good++;
    else if (s >= 40) buckets.mediocre++;
    else buckets.poor++;
  }
  const total = scored.length;
  const segments: { key: string; count: number; color: string; label: string; range: string }[] = [
    { key: "excellent", count: buckets.excellent, color: "var(--kale)", label: "Excellent", range: "85\u2013100" },
    { key: "good", count: buckets.good, color: "var(--amber)", label: "Good", range: "65\u201384" },
    { key: "mediocre", count: buckets.mediocre, color: "var(--tangerine)", label: "Mediocre", range: "40\u201364" },
    { key: "poor", count: buckets.poor, color: "var(--coral)", label: "Poor", range: "0\u201339" },
  ];
  const active = segments.filter(s => s.count > 0);

  // Compute which segments are wide enough for inline text (~12ch minimum)
  const INLINE_THRESHOLD = 22; // percent needed for "Label N (R)" inline
  const LABEL_THRESHOLD = 14;  // percent needed for just "Label N"

  // Build callout positions: cumulative % center of each narrow segment
  let cumPct = 0;
  const positioned = active.map(seg => {
    const pct = (seg.count / total) * 100;
    const centerPct = cumPct + pct / 2;
    cumPct += pct;
    const fitsFullLabel = pct >= INLINE_THRESHOLD;
    const fitsShortLabel = pct >= LABEL_THRESHOLD;
    return { ...seg, pct, centerPct, fitsFullLabel, fitsShortLabel };
  });
  const callouts = positioned.filter(s => !s.fitsShortLabel);

  return (
    <div style={{ marginBottom: callouts.length > 0 ? 0 : 16 }}>
      {/* Bar + callouts wrapper */}
      <div style={{ position: "relative", marginBottom: callouts.length > 0 ? 40 : 0 }}>
        {/* Stacked bar */}
        <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", height: 34 }}>
          {positioned.map(seg => (
            <div
              key={seg.key}
              style={{
                width: `${seg.pct}%`, background: seg.color, minWidth: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, color: "#fff",
                textShadow: "0 1px 2px rgba(0,0,0,0.4)", whiteSpace: "nowrap",
                padding: "0 4px", overflow: "hidden",
              }}
              title={`${seg.label} ${seg.count} (${seg.range})`}
            >
              {seg.fitsFullLabel
                ? `${seg.label} ${seg.count} (${seg.range})`
                : seg.fitsShortLabel
                  ? `${seg.label} ${seg.count}`
                  : ""}
            </div>
          ))}
        </div>
        {/* Callout dots + lines + labels for narrow segments */}
        {callouts.map(seg => (
          <div key={seg.key} style={{
            position: "absolute", left: `${seg.centerPct}%`, top: 0,
            transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center",
            pointerEvents: "none",
          }}>
            {/* Dot centered on bar */}
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#fff", border: `2px solid ${seg.color}`,
              marginTop: 13, /* vertically center in 34px bar */
              flexShrink: 0,
            }} />
            {/* Connecting line */}
            <div style={{ width: 2, height: 10, background: seg.color, opacity: 0.5 }} />
            {/* Label */}
            <div style={{
              fontSize: 10, fontWeight: 600, whiteSpace: "nowrap",
              color: seg.color, lineHeight: 1.3, textAlign: "center",
            }}>
              {seg.label} {seg.count}
              <span style={{ color: "var(--fog)", fontWeight: 400 }}> ({seg.range})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryTopFoods({ foods, onClickFood }: { foods: FoodSummary[]; onClickFood: (f: FoodSummary) => void }) {
  const top3 = foods.filter(f => f.score != null).sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).slice(0, 3);
  if (top3.length === 0) return null;
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <div className="card cat-top-card" style={{ marginBottom: 8, border: "1px solid color-mix(in srgb, var(--kale) 40%, var(--slate))" }}>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, color: "var(--kale)" }}>🏆 Best in Category</div>
      {top3.map((f, i) => (
        <div key={f.id} onClick={() => onClickFood(f)} style={{
          display: "flex", alignItems: "center", gap: 10, padding: "7px 0",
          borderBottom: i < top3.length - 1 ? "1px solid var(--slate)" : "none",
          cursor: "pointer"
        }}>
          <span style={{ fontSize: 18, flexShrink: 0, width: 28, textAlign: "center" }}>{medals[i]}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.canonical_name}</div>
            {f.brand && <div className="muted" style={{ fontSize: 11 }}>{f.brand}</div>}
          </div>
          <ScorePill score={f.score ?? null} size={18} />
        </div>
      ))}
    </div>
  );
}


export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const nav = useNavigate();
  const prefetch = usePrefetch();
  const { categories } = useCategories();
  const [sort, setSort] = useState<CategorySort>("recent");

  const cat = categories.find(c => c.slug === slug);
  const catName = cat?.display_name ?? (slug ? slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "");
  const catDesc = cat?.description ?? null;
  const foods = useCategoryFoods(slug, sort);
  const allFoods = useCategoryAllFoods(slug);
  const loading = foods === null;

  const sortOptions: { value: CategorySort; label: string }[] = [
    { value: "recent", label: "Recent" }, { value: "score_desc", label: "Best Score" }, { value: "score_asc", label: "Worst Score" },
  ];
  const goFood = (f: FoodSummary) => nav(`/food/${encodeURIComponent(f.slug ?? f.id)}`);

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <BackLink />
      <div className="card">
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{catName}</div>
        {catDesc && <div className="muted" style={{ fontSize: 13, marginBottom: 4 }}>{catDesc}</div>}
        <div className="muted" style={{ fontSize: 13, marginBottom: 12 }}>{foods?.length ?? 0} food{(foods?.length ?? 0) !== 1 ? "s" : ""}</div>
      </div>
      {!loading && allFoods && allFoods.length > 1 && <div className="card" style={{ marginTop: 8 }}><div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Score Distribution</div><CategoryScoreBar foods={allFoods} /></div>}
      {!loading && allFoods && allFoods.length > 0 && <div style={{ marginTop: 8 }}><CategoryTopFoods foods={allFoods} onClickFood={goFood} /></div>}
      <div className="card" style={{ marginTop: 8 }}>
        <div className="cat-sort-bar">{sortOptions.map(opt => (<button key={opt.value} className={`cat-sort-btn${sort === opt.value ? " active" : ""}`} onClick={() => setSort(opt.value)}>{opt.label}</button>))}</div>
        {loading && <div className="muted" style={{ textAlign: "center", padding: 20 }}>Loading…</div>}
        {!loading && foods!.length === 0 && <div className="muted" style={{ textAlign: "center", padding: 20 }}>No foods in this category yet.</div>}
        {foods && foods.map(f => <FoodListItem key={f.id} food={f} onClick={() => goFood(f)} onHover={() => prefetch(`/food/${encodeURIComponent(f.slug ?? f.id)}`)} />)}
      </div>
    </div>
  );
}
