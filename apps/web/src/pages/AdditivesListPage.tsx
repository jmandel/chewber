import React, { useState, useCallback, useRef, useEffect } from "react";
import { useSearchParams, useNavigate, useNavigationType } from "react-router-dom";
import { usePrefetch } from "../hooks/usePrefetch";
import { useAdditivesList } from "../hooks/useStoreData";
import { BackLink, ADDITIVE_RISK_STYLES, ScorePill } from "../components/shared";

const FUNC_CATEGORY_MAP: Record<string, string> = {
  // Colors
  "food colour": "Color", "food color": "Color", "colour": "Color", "color additive": "Color",
  "food color additive": "Color", "food colour additive": "Color", "colour additive": "Color",
  "color_additive": "Color", "color (surface decoration)": "Color",
  "color (decorative surface coating)": "Color", "surface decorative color additive": "Color",
  // Preservatives
  "preservative": "Preservative", "preservative (antimicrobial)": "Preservative",
  "acidity regulator/preservative": "Preservative", "antioxidant preservative": "Antioxidant",
  // Acidity regulators
  "acidity regulator": "Acidity Regulator", "acidity regulator / ph control agent": "Acidity Regulator",
  "acidulant/ph control agent": "Acidity Regulator", "humectant and ph control agent": "Acidity Regulator",
  "acidity regulator / sequestrant / emulsifier": "Acidity Regulator",
  // Emulsifiers
  "emulsifier": "Emulsifier",
  // Thickeners & Stabilizers
  "thickener": "Thickener", "stabilizer": "Thickener", "thickener/stabilizer": "Thickener",
  "thickener and stabilizer": "Thickener", "stabilizer/thickener": "Thickener",
  "stabilizer/thickener and formulation aid": "Thickener", "gelling agent": "Thickener",
  // Sweeteners
  "sweetener": "Sweetener", "high-intensity sweetener": "Sweetener",
  // Antioxidants
  "antioxidant": "Antioxidant",
  // Flavor enhancers
  "flavour enhancer": "Flavor", "flavoring agent and adjuvant": "Flavor",
  // Anti-caking
  "anti-caking agent": "Anti-caking", "anticaking_agent": "Anti-caking",
  // Glazing
  "glazing agent": "Glazing", "glazing_agent": "Glazing",
  // Gases
  "packaging gas": "Gas", "propellant gas": "Gas", "propellant/packaging gas": "Gas",
  // Other
  "sequestrant": "Other", "firming agent": "Other", "carrier solvent": "Other",
  "carrier/solvent": "Other", "enzyme (processing aid)": "Other", "bulking agent": "Other",
  "nutrient supplement": "Other", "humectant": "Other", "raising agent": "Other",
  "antifoaming agent": "Other", "flour treatment agent": "Other",
};

const FUNC_CATEGORY_ORDER = ["Color", "Preservative", "Acidity Regulator", "Emulsifier", "Thickener", "Sweetener", "Antioxidant", "Flavor", "Anti-caking", "Glazing", "Gas", "Other"];

const FUNC_CATEGORY_ICONS: Record<string, string> = {
  "Color": "🎨", "Preservative": "🛡️", "Acidity Regulator": "⚗️", "Emulsifier": "🔗",
  "Thickener": "🧪", "Sweetener": "🍬", "Antioxidant": "🍊", "Flavor": "👅",
  "Anti-caking": "🧂", "Glazing": "✨", "Gas": "💨", "Other": "📦",
};

function normalizeFuncCategory(raw: string | null): string {
  if (!raw) return "Other";
  return FUNC_CATEGORY_MAP[raw.toLowerCase().trim()] || "Other";
}
export function AdditivesListPage() {
  const { additives: data, loaded } = useAdditivesList();
  const prefetch = usePrefetch();
  const [sp, setSp] = useSearchParams();
  const searchText = sp.get("q") || "";
  const riskFilter = sp.get("risk") || "all";
  const funcFilter = sp.get("func") || "all";
  const sortBy = (sp.get("sort") || "risk") as "risk" | "name" | "code";
  const setFilter = useCallback((key: string, value: string, defaultVal: string) => {
    setSp(prev => { const next = new URLSearchParams(prev); if (value === defaultVal) next.delete(key); else next.set(key, value); return next; }, { replace: true });
  }, [setSp]);
  const setSearchText = useCallback((v: string) => setFilter("q", v, ""), [setFilter]);
  const setRiskFilter = useCallback((v: string) => setFilter("risk", v, "all"), [setFilter]);
  const setFuncFilter = useCallback((v: string) => setFilter("func", v, "all"), [setFilter]);
  const setSortBy = useCallback((v: string) => setFilter("sort", v, "risk"), [setFilter]);
  const nav = useNavigate();
  const navType = useNavigationType();
  const catScrollRef = useRef<HTMLDivElement>(null);

  // Restore scroll on back
  useEffect(() => { if (navType === "POP" && data) { const saved = sessionStorage.getItem('al-scroll'); if (saved) { requestAnimationFrame(() => window.scrollTo(0, parseInt(saved, 10))); sessionStorage.removeItem('al-scroll'); } } }, [navType, data]);
  useEffect(() => { const el = catScrollRef.current; if (!el) return; const active = el.querySelector('.al-cat-chip.active') as HTMLElement; if (active) active.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }); }, [funcFilter]);

  if (!loaded) return <div style={{ textAlign: "center", padding: 40 }}><div className="spinner" /></div>;
  if (!data) return <div className="muted" style={{ textAlign: "center", padding: 40 }}>Failed to load additives</div>;

  const total = data.length;
  const catCounts: Record<string, number> = {};
  for (const a of data) { const cat = normalizeFuncCategory(a.function_category); catCounts[cat] = (catCounts[cat] || 0) + 1; }
  const riskCounts: Record<string, number> = { risk_free: 0, limited: 0, moderate: 0, high: 0 };
  for (const a of data) riskCounts[a.risk_level] = (riskCounts[a.risk_level] || 0) + 1;

  let filtered = data.filter(a => {
    const search = searchText.toLowerCase();
    if (search && !a.code.toLowerCase().includes(search) && !(a.name && a.name.toLowerCase().includes(search)) && !(a.description && a.description.toLowerCase().includes(search))) return false;
    if (riskFilter !== "all" && a.risk_level !== riskFilter) return false;
    if (funcFilter !== "all" && normalizeFuncCategory(a.function_category) !== funcFilter) return false;
    return true;
  });
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "risk") { const oA = ADDITIVE_RISK_STYLES[a.risk_level]?.order ?? 9, oB = ADDITIVE_RISK_STYLES[b.risk_level]?.order ?? 9; if (oA !== oB) return oA - oB; return a.code.localeCompare(b.code); }
    if (sortBy === "name") return (a.name ?? a.code).localeCompare(b.name ?? b.code);
    return (parseInt(a.code.replace(/[^0-9]/g, "")) || 9999) - (parseInt(b.code.replace(/[^0-9]/g, "")) || 9999);
  });

  return (
    <div className="additives-list-page">
      <BackLink />

      {/* Header */}
      <div className="al-header">
        <h1 className="al-title">Food Additives</h1>
        <div className="al-subtitle">243 E-numbers · researched &amp; risk-rated</div>
      </div>

      {/* Risk distribution bar */}
      <div className="al-risk-bar">
        {(["high", "moderate", "limited", "risk_free"] as const).map(level => {
          const count = riskCounts[level] || 0;
          const pct = (count / total) * 100;
          const s = ADDITIVE_RISK_STYLES[level];
          if (!pct) return null;
          return (
            <div
              key={level}
              className={`al-risk-segment${riskFilter === level ? " active" : ""}`}
              style={{ width: `${pct}%`, background: s.bg, borderBottom: `3px solid ${s.fg}` }}
              onClick={() => setRiskFilter(riskFilter === level ? "all" : level)}
              title={`${level.replace("_", " ")}: ${count}`}
            />
          );
        })}
      </div>
      <div className="al-risk-legend">
        {(["high", "moderate", "limited", "risk_free"] as const).map(level => {
          const s = ADDITIVE_RISK_STYLES[level];
          const count = riskCounts[level] || 0;
          const active = riskFilter === level;
          return (
            <button
              key={level}
              className={`al-risk-legend-item${active ? " active" : ""}`}
              onClick={() => setRiskFilter(riskFilter === level ? "all" : level)}
            >
              <span className="al-risk-dot" style={{ background: s.fg }} />
              <span className="al-risk-label">{s.marker} {count}</span>
            </button>
          );
        })}
      </div>

      {/* Sticky filters area */}
      <div className="al-filters">
        {/* Search */}
        <div className="al-search-wrap">
          <span className="al-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search additives..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="al-search"
          />
          {searchText && (
            <button className="al-search-clear" onClick={() => setSearchText("")}>✕</button>
          )}
        </div>

        {/* Function category chips - horizontal scroll */}
        <div className="al-cat-scroll" ref={catScrollRef}>
          <button
            className={`al-cat-chip${funcFilter === "all" ? " active" : ""}`}
            onClick={() => setFuncFilter("all")}
          >
            All
          </button>
          {FUNC_CATEGORY_ORDER.filter(cat => catCounts[cat]).map(cat => (
            <button
              key={cat}
              className={`al-cat-chip${funcFilter === cat ? " active" : ""}`}
              onClick={() => setFuncFilter(funcFilter === cat ? "all" : cat)}
            >
              {FUNC_CATEGORY_ICONS[cat]} {cat}
              <span className="al-cat-count">{catCounts[cat]}</span>
            </button>
          ))}
        </div>

        {/* Sort + count row */}
        <div className="al-toolbar">
          <div className="al-count">{sorted.length} result{sorted.length !== 1 ? "s" : ""}</div>
          <div className="al-sort">
            <label className="al-sort-label">Sort:</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as "risk" | "name" | "code")}
              className="al-sort-select"
            >
              <option value="risk">Risk level</option>
              <option value="name">Name A–Z</option>
              <option value="code">E-number</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="al-grid">
        {sorted.map(add => {
          const rs = ADDITIVE_RISK_STYLES[add.risk_level] || ADDITIVE_RISK_STYLES.limited;
          const cat = normalizeFuncCategory(add.function_category);
          return (
            <div
              key={add.code}
              className="al-card"
              onClick={() => { sessionStorage.setItem('al-scroll', String(window.scrollY)); nav(`/additive/${encodeURIComponent(add.code)}`); }} onMouseEnter={() => prefetch(`/additive/${encodeURIComponent(add.code)}`)}
              style={{ borderLeftColor: rs.fg }}
            >
              <div className="al-card-top">
                <div className="al-card-info">
                  <div className="al-card-name">{add.name ?? add.code}</div>
                  <div className="al-card-meta">
                    <span className="al-card-code">{add.code}</span>
                    <span className="al-card-func">{FUNC_CATEGORY_ICONS[cat]} {cat}</span>
                  </div>
                </div>
                <span
                  className="al-card-badge"
                  style={{ background: rs.bg, color: rs.fg, borderColor: rs.border }}
                >
                  {rs.marker} {add.risk_level.replace("_", " ")}
                </span>
              </div>
              {add.description && (
                <div className="al-card-desc">{add.description.length > 120 ? add.description.slice(0, 120) + "…" : add.description}</div>
              )}
            </div>
          );
        })}
      </div>

      {sorted.length === 0 && (
        <div className="al-empty">
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔬</div>
          <div>No additives match your filters</div>
          <button className="al-empty-reset" onClick={() => { setSearchText(""); setRiskFilter("all"); setFuncFilter("all"); }}>Reset filters</button>
        </div>
      )}
    </div>
  );
}
