import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { FoodDetail, FoodSummary } from "../api";
import { useCompareStore } from "../stores";
import { PrefetchLink, ScorePill, BackLink } from "../components/shared";

function fmtN(v: number): string {
  if (Number.isInteger(v)) return String(v);
  const r = Math.round(v * 10) / 10;
  return Number.isInteger(r) ? String(r) : r.toFixed(1);
}

function truncName(name: string, maxWords = 4): string {
  const words = name.split(/\s+/);
  return words.length > maxWords ? words.slice(0, maxWords).join(" ") + "…" : name;
}

export function ComparePage() {
  const nav = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialIds = (params.get("ids") ?? "").split(",").filter(Boolean);
  const foods = useCompareStore(s => s.foods);
  const suggestions = useCompareStore(s => s.suggestions);
  const searchQ = useCompareStore(s => s.searchQ);
  const searchHits = useCompareStore(s => s.searchHits);
  const loadInitialFoods = useCompareStore(s => s.loadInitialFoods);
  const addFood = useCompareStore(s => s.addFood);
  const removeFood = useCompareStore(s => s.removeFood);
  const setSearchQ = useCompareStore(s => s.setSearchQ);

  const loadedRef = useRef(false);
  if (!loadedRef.current && initialIds.length > 0) { loadedRef.current = true; loadInitialFoods(initialIds); }

  // Keep URL in sync
  useEffect(() => { const slugs = foods.map(f => f.slug ?? f.id).join(","); window.history.replaceState(null, "", slugs ? `/compare?ids=${encodeURIComponent(slugs)}` : "/compare"); }, [foods]);

  const nutrKeys = [
    { key: "energy_kcal", label: "Calories", unit: "kcal" }, { key: "protein_g", label: "Protein", unit: "g" },
    { key: "fiber_g", label: "Fiber", unit: "g" }, { key: "sugars_g", label: "Sugars", unit: "g" },
    { key: "saturated_fat_g", label: "Sat. Fat", unit: "g" }, { key: "total_fat_g", label: "Total Fat", unit: "g" },
    { key: "carbohydrates_g", label: "Carbs", unit: "g" }, { key: "sodium_mg", label: "Sodium", unit: "mg" },
  ];
  const higherBetter = new Set(["energy_kcal", "protein_g", "fiber_g"]);
  function getNutr(food: FoodDetail, key: string): number | null { return food.abstraction?.nutrition_per_100?.[key] ?? null; }
  function bestWorst(key: string) {
    const vals = foods.map(f => ({ id: f.id, v: getNutr(f, key) })).filter(x => x.v != null);
    const empty = { bestIds: new Set<string>(), worstIds: new Set<string>() };
    if (vals.length < 2) return empty;
    vals.sort((a, b) => a.v! - b.v!);
    const lo = vals[0].v!, hi = vals[vals.length - 1].v!;
    if (lo === hi) return empty;
    const hb = higherBetter.has(key);
    return { bestIds: new Set(vals.filter(x => x.v === (hb ? hi : lo)).map(x => x.id)), worstIds: new Set(vals.filter(x => x.v === (hb ? lo : hi)).map(x => x.id)) };
  }

  const searchWidget = (
    <div className="card" style={{ marginBottom: 8 }}>
      <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder={foods.length === 0 ? "Search a food to start comparing…" : "Add another food…"} style={{ width: "100%", fontSize: 14, padding: "10px 12px" }} />
      {searchHits.length > 0 && <div style={{ borderTop: "1px solid var(--slate)", marginTop: 8, paddingTop: 4 }}>{searchHits.map(f => <div key={f.id} onClick={() => addFood(f.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--slate)", cursor: "pointer", fontSize: 13 }}><span>{f.canonical_name}{f.brand ? ` — ${f.brand}` : ""}</span><ScorePill score={f.score ?? null} size={16} /></div>)}</div>}
      {searchHits.length === 0 && !searchQ && suggestions.length > 0 && <div style={{ borderTop: "1px solid var(--slate)", marginTop: 8, paddingTop: 6 }}><div className="muted" style={{ fontSize: 11, marginBottom: 4 }}>Suggestions</div>{suggestions.slice(0, 5).map(f => <div key={f.id} onClick={() => addFood(f.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid var(--slate)", cursor: "pointer", fontSize: 13 }}><span>{f.canonical_name}{f.brand ? ` — ${f.brand}` : ""}</span><ScorePill score={f.score ?? null} size={16} /></div>)}</div>}
    </div>
  );

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <BackLink />

      {/* Empty state: search on top */}
      {foods.length === 0 && (
        <>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Compare Foods</div>
          {searchWidget}
        </>
      )}

      {/* Score comparison chart */}
      {foods.length > 0 && (() => {
        const scoreColor = (s: number | null) =>
          s == null ? "var(--fog)" : s >= 75 ? "var(--kale)" : s >= 50 ? "var(--amber)" : s >= 25 ? "var(--tangerine)" : "var(--coral)";
        const maxScore = Math.max(...foods.map(f => f.score ?? 0), 1);
        return (
          <div className="card" style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Chewber Score</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {foods.map(f => {
                const s = f.score ?? 0;
                const pct = Math.max((s / 100) * 100, 2);
                return (
                  <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ minWidth: 90, maxWidth: 90, fontSize: 11, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--fog)" }}>
                      {truncName(f.canonical_name, 3)}
                    </div>
                    <div style={{ flex: 1, height: 22, background: "var(--slate)", borderRadius: 4, overflow: "hidden", position: "relative" }}>
                      <div style={{
                        width: `${pct}%`, height: "100%", borderRadius: 4,
                        background: scoreColor(f.score ?? null),
                        transition: "width 0.4s ease",
                        display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 6,
                      }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
                          {f.score ?? "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Nutrient comparison chart */}
      {foods.length > 0 && (() => {
        const chartNutrients = [
          { key: "energy_kcal", label: "Calories", unit: "kcal" },
          { key: "protein_g", label: "Protein", unit: "g" },
          { key: "fiber_g", label: "Fiber", unit: "g" },
          { key: "sugars_g", label: "Sugars", unit: "g" },
          { key: "sodium_mg", label: "Sodium", unit: "mg" },
        ];
        const foodPalette = ["var(--kale)", "var(--amber)", "var(--tangerine)", "var(--coral)", "var(--blue)", "var(--fog)"];
        return (
          <div className="card" style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Key Nutrients <span style={{ fontWeight: 400, fontSize: 11, color: "var(--fog)" }}>per 100 g</span></div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
              {foods.map((f, i) => (
                <span key={f.id} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--cream)" }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: foodPalette[i % foodPalette.length], flexShrink: 0 }} />
                  {truncName(f.canonical_name, 3)}{f.brand ? ` (${f.brand})` : ""}
                </span>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {chartNutrients.map(({ key, label, unit }) => {
                const vals = foods.map(f => getNutr(f, key) ?? 0);
                const maxVal = Math.max(...vals, 0.01);
                return (
                  <div key={key}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--fog)", marginBottom: 3 }}>{label}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      {foods.map((f, i) => {
                        const v = getNutr(f, key);
                        const pct = v != null ? Math.max((v / maxVal) * 100, 2) : 0;
                        return (
                          <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ flex: 1, height: 16, background: "var(--slate)", borderRadius: 3, overflow: "hidden" }}>
                              <div style={{
                                width: `${pct}%`, height: "100%", borderRadius: 3,
                                background: foodPalette[i % foodPalette.length],
                                opacity: v != null ? 1 : 0.2,
                                transition: "width 0.4s ease",
                              }} />
                            </div>
                            <span style={{ minWidth: 52, fontSize: 11, color: "var(--cream)", textAlign: "right" }}>
                              {v != null ? `${fmtN(v)} ${unit}` : "—"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Comparison table */}
      {foods.length > 0 && (
        <div className="card" style={{ marginBottom: 8, padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: foods.length * 110 + 80 }}>
              <thead>
                <tr>
                  <th style={{ padding: "8px", minWidth: 70 }} />
                  {foods.map(f => (
                    <th key={f.id} style={{ padding: "8px 6px 2px", textAlign: "center", verticalAlign: "top" }}>
                      <PrefetchLink to={`/food/${f.slug ?? f.id}`} style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.2, color: "var(--cream)", textDecoration: "none" }}>
                        {truncName(f.canonical_name)}
                      </PrefetchLink>
                      {f.brand && <div className="muted" style={{ fontSize: 10, marginTop: 1 }}>{f.brand}</div>}
                    </th>
                  ))}
                </tr>
                <tr style={{ borderBottom: "2px solid var(--slate)" }}>
                  <th style={{ textAlign: "left", padding: "4px 8px", fontSize: 11, color: "var(--fog)", fontWeight: 400 }}>per 100g</th>
                  {foods.map(f => (
                    <th key={f.id} style={{ padding: "4px 6px 6px", textAlign: "center" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <ScorePill score={f.score ?? null} size={22} />
                        <button onClick={() => removeFood(f.id)} title="Remove" style={{
                          background: "none", border: "none", color: "var(--fog)", cursor: "pointer",
                          fontSize: 11, padding: "2px", lineHeight: 1, opacity: 0.6
                        }}>✕</button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {nutrKeys.map(({ key, label, unit }) => {
                  const { bestIds, worstIds } = bestWorst(key);
                  return (
                    <tr key={key} style={{ borderBottom: "1px solid var(--slate)" }}>
                      <td style={{ padding: "6px 8px", fontWeight: 600, fontSize: 12, color: "var(--fog)", whiteSpace: "nowrap" }}>{label}</td>
                      {foods.map(f => {
                        const v = getNutr(f, key);
                        const isBest = bestIds.has(f.id);
                        const isWorst = worstIds.has(f.id);
                        return (
                          <td key={f.id} style={{
                            padding: "6px", textAlign: "center", fontSize: 12,
                            fontWeight: isWorst ? 700 : 400,
                            fontStyle: isBest ? "italic" : "normal",
                            color: isBest ? "var(--kale)" : isWorst ? "var(--coral)" : "var(--cream)"
                          }}>
                            {v != null ? `${fmtN(v)} ${unit}` : "\u2014"}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                <tr>
                  <td style={{ padding: "6px 8px", fontWeight: 600, fontSize: 12, color: "var(--fog)" }}>Additives</td>
                  {foods.map(f => (
                    <td key={f.id} style={{ padding: "6px", textAlign: "center", fontSize: 12 }}>
                      {f.abstraction?.additives?.length ?? "\u2014"}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Search widget below table when foods exist */}
      {foods.length > 0 && searchWidget}
    </div>
  );
}
