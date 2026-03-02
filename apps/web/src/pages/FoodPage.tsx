import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { FoodDetail, FoodSummary } from "../api";
import { api } from "../api";
import { useUIStore, useFoodStore } from "../stores";
import { usePrefetch } from "../hooks/usePrefetch";
import {
  useFoodDetail, useAlternatives, useRelatedFoods, useResearchLog,
} from "../hooks/useStoreData";
import {
  PrefetchLink, ScorePill, FoodListItem, BackLink, FocusCard,
  TabBtn, Section, KV, OrganicPill, renderMarkdown,
  FoodCategories, isCategory, ADDITIVE_RISK_STYLES,
} from "../components/shared";

function ShareButton({ food }: { food: FoodDetail }) {
  const [copied, setCopied] = useState(false);

  const score = food.score != null ? food.score : null;
  const zagat = food.abstraction?.zagat_line as string | undefined;
  const name = food.canonical_name;
  const brand = food.brand;

  const title = score != null
    ? `${name}${brand ? ` (${brand})` : ""} — ${score}/100 on Chewber`
    : `${name}${brand ? ` (${brand})` : ""} — Chewber`;

  const text = zagat
    ? `"${zagat}"`
    : score != null
      ? `Scored ${score}/100`
      : "Check this food out";

  const url = window.location.href;

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(`${title}\n${text}\n${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
    }
  }

  return (
    <button
      onClick={handleShare}
      aria-label="Share"
      style={{
        position: "absolute", top: 12, right: 12,
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 36, height: 36, padding: 0,
        background: "transparent", border: "none", borderRadius: "50%",
        color: copied ? "var(--kale)" : "var(--fog)", cursor: "pointer",
        transition: "color 0.2s, background 0.2s",
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "color-mix(in srgb, var(--fog) 10%, transparent)")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      {copied ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--kale)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
      )}
    </button>
  );
}


export function FoodPage() {
  const { slug } = useParams<{ slug: string }>();
  const nav = useNavigate();
  const decoded = slug ? decodeURIComponent(slug) : undefined;
  const { food } = useFoodDetail(decoded);

  if (!food) return <FocusCard><div className="spinner" /><div style={{ fontWeight: 700, marginTop: 16 }}>Loading…</div></FocusCard>;

  return (
    <>
      <ScoreHero food={food} />
      <FoodCategories tags={food.tags} />
      <FoodDetailView food={food} />
      <HealthierAlternatives food={food} />
      <RelatedFoods foodId={food.id} />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={() => nav("/")} className="btn-full" style={{ flex: 1 }}>← New search</button>
        <button onClick={() => nav(`/compare?ids=${encodeURIComponent(food.slug ?? food.id)}`)} className="btn-full" style={{ flex: 1 }}>⚖️ Compare</button>
      </div>
    </>
  );
}
function isStubData(food: FoodDetail): boolean {
  const abs = food.abstraction;
  if (!abs) return false;
  const rationale = abs?.notes?.rationale ?? "";
  const name = abs?.identification?.canonical_name ?? food.canonical_name ?? "";
  return (
    rationale.includes("DEMO MODE") ||
    rationale.includes("stub provider") ||
    name.includes("DEMO MODE") ||
    (abs?.notes?.confidence === 0 && (abs?.notes?.missing_fields ?? []).includes("all"))
  );
}

function isIncompleteReport(food: FoodDetail): boolean {
  return (
    food.score == null &&
    !!food.report_md &&
    (food.report_md.includes("⚠️ Incomplete") ||
     food.report_md.includes("⚠️ Partial") ||
     food.report_md.includes("⚠️ DEMO MODE"))
  );
}

function AdminDeleteButton({ food }: { food: FoodDetail }) {
  const nav = useNavigate();
  const adminKey = useUIStore(s => s.adminKey);
  const [confirming, setConfirming] = useState(false);
  if (!adminKey) return null;

  async function handleDelete() {
    try { await api.deleteFood(food.id, adminKey!); nav("/", { replace: true }); }
    catch (e: any) { alert(`Delete failed: ${e.message}`); setConfirming(false); }
  }

  if (confirming) {
    return (
      <div style={{ position: "absolute", top: 12, left: 12, display: "flex", alignItems: "center", gap: 4, background: "var(--charcoal)", border: "1px solid var(--coral)", borderRadius: 8, padding: "4px 8px", zIndex: 2 }}>
        <span style={{ fontSize: 11, color: "var(--coral)", fontWeight: 600 }}>Delete?</span>
        <button onClick={handleDelete} style={{ fontSize: 11, padding: "2px 8px", background: "var(--coral)", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: 600 }}>Yes</button>
        <button onClick={() => setConfirming(false)} style={{ fontSize: 11, padding: "2px 8px", background: "transparent", color: "var(--fog)", border: "1px solid var(--fog)", borderRadius: 4, cursor: "pointer" }}>No</button>
      </div>
    );
  }
  return (
    <button onClick={() => setConfirming(true)} aria-label="Delete" style={{ position: "absolute", top: 12, left: 12, display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, padding: 0, background: "transparent", border: "none", borderRadius: "50%", color: "var(--fog)", cursor: "pointer", opacity: 0.5, transition: "opacity 0.2s" }}
      onMouseEnter={e => (e.currentTarget.style.opacity = "1")} onMouseLeave={e => (e.currentTarget.style.opacity = "0.5")}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
    </button>
  );
}
function ScoreHero({ food }: { food: FoodDetail }) {
  const score = food.score;
  const stub = isStubData(food);
  const incomplete = isIncompleteReport(food);
  const color = score == null ? "var(--fog)" : score >= 75 ? "var(--kale)" : score >= 50 ? "var(--amber)" : score >= 25 ? "var(--tangerine)" : "var(--coral)";
  const label = stub ? "Demo data — not real" : incomplete ? "Incomplete analysis" : score == null ? "Score unavailable" : score >= 85 ? "Excellent" : score >= 65 ? "Good" : score >= 40 ? "Mediocre" : "Poor";
  return (
    <div className="card" style={{ textAlign: "center", padding: "28px 16px", position: "relative" }}>
      <ShareButton food={food} />
      <AdminDeleteButton food={food} />
      {stub && (
        <div style={{
          background: "color-mix(in srgb, var(--tangerine) 15%, var(--midnight))", border: "1px solid var(--tangerine)", borderRadius: 8,
          padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "var(--tangerine)", textAlign: "left"
        }}>
          ⚠️ <strong>DEMO MODE</strong> — No LLM is configured. This is placeholder data, not a real food analysis.
          Set <code>CHEWBER_LLM_PROVIDER</code> to <code>openrouter</code> for real results.
        </div>
      )}
      {incomplete && !stub && (
        <div style={{
          background: "color-mix(in srgb, var(--amber) 15%, var(--midnight))", border: "1px solid var(--amber)", borderRadius: 8,
          padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "var(--amber)", textAlign: "left"
        }}>
          ⚠️ <strong>Incomplete</strong> — The research agent could not fully analyze this food.
          Some nutrition data may be missing. Score may be unavailable.
        </div>
      )}
      <div style={{ fontSize: 64, fontWeight: 900, color, lineHeight: 1, opacity: stub ? 0.4 : 1 }}>{score ?? "?"}</div>
      <div style={{ fontSize: 13, color: stub ? "var(--amber)" : color, fontWeight: 600, marginTop: 4 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, marginTop: 10 }}>{food.canonical_name}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 4 }}>
        {food.brand && <span className="muted" style={{ fontSize: 14 }}>{food.brand}</span>}
        <OrganicPill organic={food.abstraction?.organic?.is_certified_organic} />
      </div>
    </div>
  );
}

// ── Food detail with tabs ───────────────────────────────────

function FoodDetailView({ food }: { food: FoodDetail }) {
  const zagat = food.abstraction?.zagat_line as string | undefined;
  const [tab, setTab] = useState<"summary" | "report" | "data" | "log">("summary");
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ display: "flex", borderBottom: "1px solid var(--slate)" }}>
        <TabBtn active={tab === "summary"} onClick={() => setTab("summary")}>Summary</TabBtn>
        <TabBtn active={tab === "report"} onClick={() => setTab("report")}>Report</TabBtn>
        <TabBtn active={tab === "data"} onClick={() => setTab("data")}>Data</TabBtn>
        <TabBtn active={tab === "log"} onClick={() => setTab("log")}>Log</TabBtn>
      </div>
      <div style={{ padding: "16px 20px", overflow: "hidden" }}>
        {tab === "summary" && (
          <div>
            {zagat ? (
              <div style={{
                fontSize: 17, fontStyle: "italic", lineHeight: 1.5,
                color: "var(--cream)", padding: "8px 0 16px"
              }}>
                “{zagat}”
              </div>
            ) : (
              <div className="muted" style={{ textAlign: "center", padding: 20 }}>No summary available yet.</div>
            )}
            {food.abstraction && <SummaryDetails food={food} />}
          </div>
        )}
        {tab === "report" && (
          food.report_md
            ? <div className="md-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(food.report_md) }} />
            : <div className="muted" style={{ textAlign: "center", padding: 20 }}>No report available yet.</div>
        )}
        {tab === "data" && (
          <div style={{ overflow: "hidden" }}>
            {food.score_breakdown && <Section title="Score breakdown"><pre className="json-pre">{JSON.stringify(food.score_breakdown, null, 2)}</pre></Section>}
            {food.abstraction && <Section title="Abstraction"><pre className="json-pre">{JSON.stringify(food.abstraction, null, 2)}</pre></Section>}
            {food.barcode && <KV label="Barcode" value={food.barcode} />}
            {food.category_path && <KV label="Category" value={food.category_path} />}
            {food.tags?.length ? <KV label="Tags" value={food.tags.join(", ")} /> : null}
            {food.updated_at && <KV label="Updated" value={new Date(food.updated_at).toLocaleString()} />}
          </div>
        )}
        {tab === "log" && <ResearchLog foodId={food.id} />}
      </div>
    </div>
  );
}

// ── Additive risk-level styling ──────────────────────────
// Palette: sequential luminance (blue→amber→orange→red) safe for
// deuteranopia, protanopia, and tritanopia.  Each level also carries
// a distinct shape marker so information is never color-only.
function normalizeCode(raw: string): string {
  let c = raw.trim();
  if (c.startsWith("en:")) c = c.slice(3).split("-")[0];
  return c.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function SummaryDetails({ food }: { food: FoodDetail }) {
  const abs = food.abstraction;
  if (!abs) return null;
  const nutr = abs.nutrition_per_100;
  const cls = abs.classification;
  const org = abs.organic;

  return (
    <div style={{ fontSize: 13 }}>
      {/* Key nutrition highlights */}
      {nutr && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--fog)", marginBottom: 6 }}>Nutrition per 100{nutr.unit_basis === "per_100ml" ? " mL" : " g"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px" }}>
            {nutr.energy_kcal != null && <KV label="Calories" value={`${fmtN(nutr.energy_kcal)} kcal`} />}
            {nutr.sodium_mg != null && <KV label="Sodium" value={`${fmtN(nutr.sodium_mg)} mg`} />}
            {nutr.total_fat_g != null && <KV label="Fat" value={`${fmtN(nutr.total_fat_g)} g`} />}
            {nutr.saturated_fat_g != null && <KV label="Sat. fat" value={`${fmtN(nutr.saturated_fat_g)} g`} />}
            {nutr.carbohydrates_g != null && <KV label="Carbs" value={`${fmtN(nutr.carbohydrates_g)} g`} />}
            {nutr.sugars_g != null && <KV label="Sugars" value={`${fmtN(nutr.sugars_g)} g`} />}
            {nutr.protein_g != null && <KV label="Protein" value={`${fmtN(nutr.protein_g)} g`} />}
            {nutr.fiber_g != null && <KV label="Fiber" value={`${fmtN(nutr.fiber_g)} g`} />}
          </div>
        </div>
      )}

      {/* Additives grouped by risk level */}
      {abs.additives && abs.additives.length > 0 && (() => {
        const groups = ["high", "moderate", "limited", "risk_free"]
          .map(level => ({
            level,
            items: abs.additives.filter((a: any) => (a.risk_level ?? "risk_free") === level)
          }))
          .filter(g => g.items.length > 0);
        return (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--fog)", marginBottom: 6 }}>Additives ({abs.additives.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {groups.map(({ level, items }) => {
                const s = ADDITIVE_RISK_STYLES[level as keyof typeof ADDITIVE_RISK_STYLES];
                return (
                  <fieldset key={level} style={{
                    border: `1px solid ${s.border}`,
                    borderRadius: 6,
                    padding: "8px 10px 6px",
                    margin: 0,
                  }}>
                    <legend style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "0 6px",
                      fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em",
                      color: s.fg,
                    }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: 14, height: 14, borderRadius: 3,
                        background: s.bg, border: `1px solid ${s.border}`,
                        fontSize: 8, lineHeight: 1, color: s.fg
                      }}>{s.marker}</span>
                      {level === "risk_free" ? "risk free" : level === "high" ? "high risk" : `${level} risk`}
                    </legend>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {items.map((a: any, i: number) => {
                        const code = a.code ? normalizeCode(a.code) : null;
                        const badge = (
                          <span className="badge" title={`${level.replace("_", " ")}${s.penalty ? ` (−${s.penalty} pts)` : ""}`} style={{
                            fontSize: 11, padding: "2px 8px",
                            background: s.bg, color: s.fg, border: `1px solid ${s.border}`
                          }}>{a.name ?? a.code ?? "unknown"}</span>
                        );
                        return code ? (
                          <PrefetchLink key={i} to={`/additive/${code}`} style={{ textDecoration: "none" }}>{badge}</PrefetchLink>
                        ) : (
                          <span key={i}>{badge}</span>
                        );
                      })}
                    </div>
                  </fieldset>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Ingredients */}
      {abs.ingredients && (abs.ingredients as any).ingredients_list?.length > 0 ? (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--fog)", marginBottom: 6 }}>Ingredients ({(abs.ingredients as any).ingredients_list.length})</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {(abs.ingredients as any).ingredients_list.map((ing: string, i: number) => (
              <span key={i} style={{
                fontSize: 11, padding: "3px 8px", borderRadius: 4,
                background: "var(--slate)", color: "var(--fog)",
              }}>{ing}</span>
            ))}
          </div>
        </div>
      ) : abs.ingredients?.ingredients_text ? (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--fog)", marginBottom: 6 }}>Ingredients</div>
          <div style={{ fontSize: 12, color: "var(--fog)", lineHeight: 1.55 }}>{abs.ingredients.ingredients_text}</div>
        </div>
      ) : null}

      {/* Quick facts */}
      <div>
        {cls?.nutri_score_category && !["unknown", "general_food"].includes(cls.nutri_score_category) && <KV label="Category" value={cls.nutri_score_category.replace("_", " ")} />}

        {cls?.fvp_percent != null && <KV label="Fruit/veg/nut %" value={`${fmtN(cls.fvp_percent)}%`} />}
      </div>
    </div>
  );
}
function HealthierAlternatives({ food }: { food: FoodDetail }) {
  const nav = useNavigate();
  const prefetch = usePrefetch();
  const alternatives = useAlternatives(food);
  if (alternatives.length === 0 || food.score == null || food.score >= 75) return null;
  return (
    <div className="card" style={{ marginTop: 8, borderLeft: "3px solid var(--kale)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}><span style={{ fontSize: 18 }}>🔄</span><span style={{ fontWeight: 700, fontSize: 15, color: "var(--kale)" }}>Healthier Alternatives</span></div>
      <div style={{ fontSize: 12, color: "var(--fog)", marginBottom: 10 }}>Similar foods with a higher health score</div>
      {alternatives.map((f, i) => { const diff = (f.score ?? 0) - (food.score ?? 0); return (
        <div key={f.id}><div onClick={() => nav(`/food/${encodeURIComponent(f.slug ?? f.id)}`)} onMouseEnter={() => prefetch(`/food/${encodeURIComponent(f.slug ?? f.id)}`)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", cursor: "pointer", gap: 12, borderBottom: i < alternatives.length - 1 ? "1px solid var(--slate)" : "none" }}>
          <div style={{ minWidth: 0, flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.canonical_name}</div>{f.brand && <div className="muted" style={{ fontSize: 12 }}>{f.brand}</div>}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}><span style={{ fontSize: 11, fontWeight: 700, color: "var(--kale)", background: "color-mix(in srgb, var(--kale) 15%, transparent)", padding: "2px 7px", borderRadius: 6 }}>+{diff}</span><ScorePill score={f.score ?? null} /></div>
        </div></div>); })}
    </div>
  );
}

function RelatedFoods({ foodId }: { foodId: string }) {
  const nav = useNavigate();
  const prefetch = usePrefetch();
  const related = useRelatedFoods(foodId);
  if (related.length === 0) return null;
  return (
    <div className="card" style={{ marginTop: 8 }}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Related Foods</div>
      {related.map((f, i) => (
        <div key={f.id}>
          <FoodListItem food={f} onClick={() => nav(`/food/${encodeURIComponent(f.slug ?? f.id)}`)} onHover={() => prefetch(`/food/${encodeURIComponent(f.slug ?? f.id)}`)} noBorder />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, paddingLeft: 2, paddingBottom: 8 }}>
            {f.shared_tags.filter(isCategory).map(t => <span key={t} className="badge" style={{ fontSize: 9, padding: "1px 6px", opacity: 0.7 }}>{t.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ")}</span>)}
          </div>
          {i < related.length - 1 && <div style={{ borderBottom: "1px solid var(--slate)" }} />}
        </div>
      ))}
    </div>
  );
}
function ResearchLog({ foodId }: { foodId: string }) {
  const log = useResearchLog(foodId);
  if (!log) return <div className="muted" style={{ textAlign: "center", padding: 20 }}>Loading…</div>;
  const { job, events } = log;
  if (!job) return <div className="muted" style={{ textAlign: "center", padding: 20 }}>No research job found for this food.</div>;
  const LEVEL_COLORS: Record<string, { bg: string; fg: string }> = {
    info: { bg: "color-mix(in srgb, var(--blue) 10%, var(--charcoal))", fg: "var(--fog)" },
    tool: { bg: "color-mix(in srgb, var(--kale) 10%, var(--charcoal))", fg: "var(--kale)" },
    warn: { bg: "color-mix(in srgb, var(--amber) 10%, var(--charcoal))", fg: "var(--amber)" },
    error: { bg: "color-mix(in srgb, var(--coral) 10%, var(--charcoal))", fg: "var(--coral)" },
    debug: { bg: "var(--charcoal)", fg: "var(--fog)" },
  };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 12 }}>
        <span className="muted">Job {job.id}</span>
        <span className="muted">{job.status} • {job.finished_at ? new Date(job.finished_at).toLocaleString() : ""}</span>
      </div>
      <div style={{ maxHeight: 500, overflowY: "auto" }}>
        {events.map((ev: any) => { const c = LEVEL_COLORS[ev.level] ?? LEVEL_COLORS.info; return <LogRow key={ev.id} ev={ev} bg={c.bg} fg={c.fg} />; })}
      </div>
    </div>
  );
}
function LogRow({ ev, bg, fg }: { ev: any; bg: string; fg: string }) {
  const [open, setOpen] = useState(false);
  const hasData = ev.data && Object.keys(ev.data).length > 0;
  return (
    <div style={{ padding: "6px 10px", marginBottom: 2, borderRadius: 6, background: bg, cursor: hasData ? "pointer" : "default" }}
      onClick={() => hasData && setOpen(!open)}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: fg, minWidth: 32 }}>{ev.level}</span>
        <span style={{ flex: 1, color: "var(--cream)" }}>{ev.message}</span>
        <span className="muted" style={{ fontSize: 11, flexShrink: 0 }}>{new Date(ev.ts).toLocaleTimeString()}</span>
        {hasData && <span style={{ fontSize: 11, color: "var(--fog)" }}>{open ? "▴" : "▾"}</span>}
      </div>
      {open && hasData && (
        <pre style={{ marginTop: 6, padding: "8px 10px", background: "var(--midnight)", borderRadius: 4, fontSize: 11, color: "var(--fog)", overflow: "auto", maxHeight: 240, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {JSON.stringify(ev.data, null, 2)}
        </pre>
      )}
    </div>
  );
}

function fmtN(v: number): string {
  if (Number.isInteger(v)) return String(v);
  const r = Math.round(v * 10) / 10;
  return Number.isInteger(r) ? String(r) : r.toFixed(1);
}

