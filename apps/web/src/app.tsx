import React, { useState, useCallback, useRef, useEffect } from "react";
import { Routes, Route, useNavigate, useNavigationType, useParams, useLocation, useSearchParams, Link, type LinkProps } from "react-router-dom";
import { marked } from "marked";
import {
  api,
  type AssistResponse,
  type FoodDetail,
  type FoodSummary,
  type RelatedFood,
  type Category,
  type PriorAnswer,
  type StructuredFoodQuery,
  type AdditiveListItem,
  type AdditiveDetail,
  type QueueJob,
} from "./api";
import { JobStatusView } from "./components/JobStatusView";
import {
  useFoodStore,
  useCategoryStore,
  useAdditiveStore,
  useQueueStore,
  useFlowStore,
  useUIStore,
  useSearchStore,
  useCompareStore,
  type FlowStep,
  type CategorySort,
} from "./stores";
import { usePrefetch } from "./hooks/usePrefetch";
import {
  useFoodDetail, useRecentFoods, useTopRated, useAlternatives, useRelatedFoods,
  useCategories, useCatCounts, useCategoryFoods, useCategoryAllFoods,
  useAdditivesList, useAdditiveDetail, useAdditiveFoods,
  useQueueJobs, useResearchLog,
} from "./hooks/useStoreData";

// ── PrefetchLink — Link that prefetches store data on hover ──
function PrefetchLink({ to, children, ...rest }: LinkProps & { to: string }) {
  const prefetch = usePrefetch();
  return (
    <Link to={to} onMouseEnter={() => prefetch(to)} onTouchStart={() => prefetch(to)} {...rest}>
      {children}
    </Link>
  );
}

// ── Flow overlay ──
function FlowOverlay() {
  const flow = useFlowStore(s => s.flow);
  const setFlow = useFlowStore(s => s.setFlow);
  const nav = useNavigate();
  if (flow.kind === "idle") return null;
  return (
    <>
      {flow.kind === "thinking" && (
        <FocusCard><div className="spinner" /><div style={{ fontWeight: 700, marginTop: 16, fontSize: 18 }}>Analyzing…</div><div className="muted" style={{ marginTop: 4 }}>{flow.label}</div></FocusCard>
      )}
      {flow.kind === "resolving" && (
        <FocusCard><div className="spinner" /><div style={{ fontWeight: 700, marginTop: 16 }}>Looking up…</div>
          <div className="muted" style={{ marginTop: 4, fontFamily: flow.query.barcode ? "monospace" : undefined }}>
            {flow.query.barcode || `${flow.query.name}${flow.query.brand ? ` by ${flow.query.brand}` : ""}`}
          </div>
        </FocusCard>
      )}
      {flow.kind === "error" && (
        <div className="card" style={{ borderColor: "var(--coral)" }}>
          <div style={{ fontWeight: 700, color: "var(--coral)" }}>Something went wrong</div>
          <div style={{ marginTop: 8, fontSize: 13, wordBreak: "break-word" }}>{flow.message}</div>
          <button onClick={() => { setFlow({ kind: "idle" }); nav("/"); }} style={{ marginTop: 12, width: "100%" }}>Start over</button>
        </div>
      )}
    </>
  );
}

// ── App shell ──
export function App() {
  const flow = useFlowStore(s => s.flow);
  const setFlow = useFlowStore(s => s.setFlow);
  const setNavigate = useFlowStore(s => s.setNavigate);
  const submitClarification = useFlowStore(s => s.submitClarification);
  const skipClarification = useFlowStore(s => s.skipClarification);
  const location = useLocation();
  const navType = useNavigationType();
  const nav = useNavigate();

  // Wire navigator for flowStore (only dependency on useEffect left — wiring)
  useEffect(() => { setNavigate(nav); }, [nav, setNavigate]);
  useEffect(() => { if (navType === "POP" && flow.kind !== "idle") setFlow({ kind: "idle" }); }, [location.pathname]);
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  return (
    <div className="container">
      <Header />
      {flow.kind !== "idle" ? (
        flow.kind === "clarify" ? (
          <ClarifyStep
            assist={flow.assist} rawText={flow.rawText} priorAnswers={flow.priorAnswers}
            onSubmit={(answers) => submitClarification(answers, flow.rawText, flow.priorAnswers)}
            onSkip={skipClarification} onBack={() => setFlow({ kind: "idle" })}
          />
        ) : <FlowOverlay />
      ) : (
        <Routes>
          <Route path="/" element={<PickScreen />} />
          <Route path="/text" element={<TextStep />} />
          <Route path="/barcode" element={<BarcodeStep />} />
          <Route path="/photo" element={<PhotoStep />} />
          <Route path="/queue" element={<QueuePage />} />
          <Route path="/job/:jobId" element={<JobPage />} />
          <Route path="/food/:slug" element={<FoodPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/additives" element={<AdditivesListPage />} />
          <Route path="/additive/:code" element={<AdditivePage />} />
        </Routes>
      )}
    </div>
  );
}

// ── About overlay ───────────────────────────────────────────
function AboutOverlay({ onClose }: { onClose: () => void }) {
  const [taps, setTaps] = useState(0);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyVal, setKeyVal] = useState("");
  const adminKey = useUIStore(s => s.adminKey);
  const setAdminKey = useUIStore(s => s.setAdminKey);
  const clearAdmin = useUIStore(s => s.clearAdmin);
  const adminActive = !!adminKey;
  const tapTimer = useRef<any>(null);

  function handleTap() {
    setTaps(prev => {
      const next = prev + 1;
      clearTimeout(tapTimer.current);
      tapTimer.current = setTimeout(() => setTaps(0), 1500);
      if (next >= 5) {
        setTaps(0);
        if (adminActive) { clearAdmin(); setShowKeyInput(false); }
        else setShowKeyInput(true);
      }
      return next;
    });
  }

  function handleKeySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (keyVal.trim()) { setAdminKey(keyVal.trim()); setShowKeyInput(false); setKeyVal(""); }
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "var(--overlay-bg)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--charcoal)", borderRadius: "var(--radius)", border: "1px solid var(--slate)", maxWidth: 440, width: "100%", maxHeight: "80vh", display: "flex", flexDirection: "column", fontSize: 14, lineHeight: 1.6, color: "var(--cream)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 24px", borderBottom: "1px solid var(--slate)", flexShrink: 0 }}>
          <img src="/tuber-header.png" alt="" height={32} style={{ display: "block" }} />
          <span style={{ flex: 1, fontSize: 20, fontWeight: 900, letterSpacing: "-0.5px" }}>Chewber</span>
          <button onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", color: "var(--fog)", cursor: "pointer", fontSize: 22, lineHeight: 1, padding: "4px 8px", borderRadius: "var(--radius-sm)" }}>✕</button>
        </div>
        <div style={{ padding: "20px 24px", overflowY: "auto" }}>
          <p style={{ marginBottom: 12 }}>Scan a barcode, search by name, or snap a photo — Chewber gives every food a <strong>0–100 health score</strong> so you can compare at a glance.</p>
          <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--fog)", marginBottom: 6 }}>How scoring works</h4>
          <p style={{ marginBottom: 8 }}>Each score combines three factors:</p>
          <ul style={{ paddingLeft: 18, marginBottom: 12 }}>
            <li style={{ marginBottom: 4 }}><strong>Nutrition (60%)</strong> — based on the Nutri-Score algorithm: energy, sugars, saturated fat, sodium, fibre, protein, and fruit/veg content per 100 g.</li>
            <li style={{ marginBottom: 4 }}><strong>Additives (30%)</strong> — each additive is classified by risk level (from well-studied databases). High-risk additives like partially hydrogenated oils cap the score at 49.</li>
            <li style={{ marginBottom: 4 }}><strong>Organic bonus (10%)</strong> — certified organic products get up to 10 extra points.</li>
          </ul>
          <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--fog)", marginBottom: 6 }}>Reading the score</h4>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12, fontSize: 13 }}>
            <span style={{ padding: "2px 10px", borderRadius: 6, background: "#3D8B5F", color: "#fff", fontWeight: 700 }}>85–100 Excellent</span>
            <span style={{ padding: "2px 10px", borderRadius: 6, background: "#D4A24C", color: "#fff", fontWeight: 700 }}>65–84 Good</span>
            <span style={{ padding: "2px 10px", borderRadius: 6, background: "#C8714A", color: "#fff", fontWeight: 700 }}>40–64 Mediocre</span>
            <span style={{ padding: "2px 10px", borderRadius: 6, background: "#C44D3E", color: "#fff", fontWeight: 700 }}>0–39 Poor</span>
          </div>
          <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--fog)", marginBottom: 6 }}>Data sources</h4>
          <p style={{ marginBottom: 16, fontSize: 13 }}>Chewber cross-references Open Food Facts, USDA FoodData Central, and manufacturer labels. When data is missing, an AI research agent gathers and verifies it.</p>
          <button onClick={onClose} style={{ width: "100%", padding: "10px 0", borderRadius: "var(--radius-sm)", border: "1px solid var(--slate)", background: "transparent", color: "var(--cream)", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Close</button>
          <div onClick={handleTap} style={{ marginTop: 16, textAlign: "center", fontSize: 11, color: "var(--fog)", opacity: 0.4, cursor: "default", userSelect: "none" }}>v1.0 {adminActive ? "✓" : ""}</div>
          {showKeyInput && (
            <form onSubmit={handleKeySubmit} style={{ marginTop: 8, display: "flex", gap: 6 }}>
              <input type="password" value={keyVal} onChange={e => setKeyVal(e.target.value)} placeholder="Key" autoFocus style={{ flex: 1, fontSize: 12, padding: "6px 8px", background: "var(--slate)", border: "1px solid var(--fog)", borderRadius: 4, color: "var(--cream)" }} />
              <button type="submit" style={{ fontSize: 12, padding: "6px 12px", background: "var(--kale)", border: "none", borderRadius: 4, color: "#fff", cursor: "pointer", fontWeight: 600 }}>Set</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Header ──────────────────────────────────────────────────
function QueueIndicator() {
  const queueStatus = useQueueStore(s => s.queueStatus);
  const startPolling = useQueueStore(s => s.startStatusPolling);
  useEffect(() => { const stop = startPolling(); return stop; }, [startPolling]);

  const total = (queueStatus?.queued ?? 0) + (queueStatus?.running ?? 0);
  if (!total) return null;
  const label = queueStatus!.running
    ? `${queueStatus!.running} researching${queueStatus!.queued ? `, ${queueStatus!.queued} queued` : ""}`
    : `${queueStatus!.queued} queued`;
  return (
    <span title={label} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--fog)", padding: "3px 8px", background: "color-mix(in srgb, var(--sky) 15%, transparent)", borderRadius: 12, whiteSpace: "nowrap" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: queueStatus!.running ? "var(--sky)" : "var(--fog)", animation: queueStatus!.running ? "pulse 1.5s infinite" : "none" }} />
      {label}
    </span>
  );
}

function Header() {
  const menuOpen = useUIStore(s => s.menuOpen);
  const toggleMenu = useUIStore(s => s.toggleMenu);
  const closeMenu = useUIStore(s => s.closeMenu);
  const showAbout = useUIStore(s => s.showAbout);
  const openAbout = useUIStore(s => s.openAbout);
  const closeAbout = useUIStore(s => s.closeAbout);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) closeMenu(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen, closeMenu]);

  return (
    <>
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 7, textDecoration: "none", color: "inherit" }}>
            <img src="/tuber-header.png" alt="" height={36} style={{ display: 'block', marginTop: -6 }} />
            <span style={{ fontSize: 21, fontWeight: 900, letterSpacing: "-0.5px", lineHeight: 1 }}>Chewber</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <QueueIndicator />
            <div ref={menuRef} style={{ position: "relative" }}>
              <button onClick={toggleMenu} aria-label="Menu" style={{ background: "none", border: "none", padding: "6px 4px", cursor: "pointer", color: "var(--fog)", fontSize: 20, lineHeight: 1, flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </button>
              {menuOpen && (
                <div style={{ position: "absolute", right: 0, top: "100%", marginTop: 6, background: "var(--charcoal)", border: "1px solid var(--slate)", borderRadius: "var(--radius-sm)", minWidth: 180, padding: "6px 0", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", zIndex: 100 }}>
                  <Link to="/categories" onClick={closeMenu} className="menu-item" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", color: "var(--cream)", textDecoration: "none", fontSize: 14 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--fog)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                    Categories
                  </Link>
                  <Link to="/additives" onClick={closeMenu} className="menu-item" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", color: "var(--cream)", textDecoration: "none", fontSize: 14 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--fog)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H2v7l6.29 6.29c.94.94 2.48.94 3.42 0l4.58-4.58c.94-.94.94-2.48 0-3.42L9 5z"/><circle cx="6" cy="9" r="1"/></svg>
                    Food additives
                  </Link>
                  <Link to="/queue" onClick={closeMenu} className="menu-item" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", color: "var(--cream)", textDecoration: "none", fontSize: 14 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--fog)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                    Research queue
                  </Link>
                  <button onClick={() => { closeMenu(); openAbout(); }} className="menu-item" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", color: "var(--cream)", background: "none", border: "none", fontSize: 14, cursor: "pointer", width: "100%", textAlign: "left" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--fog)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    About Chewber
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showAbout && <AboutOverlay onClose={closeAbout} />}
    </>
  );
}

// ── Pick screen ─────────────────────────────────────────────
function PickScreen() {
  const nav = useNavigate();
  const prefetch = usePrefetch();
  const recent = useRecentFoods();
  const topRated = useTopRated();
  const { categories } = useCategories();
  const [catFilter, setCatFilter] = useState("");

  const filteredCats = catFilter
    ? categories.filter(c => c.display_name.toLowerCase().includes(catFilter.toLowerCase()) || c.slug.includes(catFilter.toLowerCase()))
    : categories;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Link to="/text" className="pick-btn">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--fog)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span><strong>Search</strong><br/><span className="muted">Type a food or product name</span></span>
        </Link>
        <Link to="/barcode" className="pick-btn">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--fog)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="7" y1="8" x2="7" y2="16"/><line x1="11" y1="8" x2="11" y2="16"/><line x1="15" y1="8" x2="15" y2="13"/><line x1="19" y1="8" x2="19" y2="16"/></svg>
          <span><strong>Barcode scan</strong><br/><span className="muted">Camera or type EAN/UPC</span></span>
        </Link>
        <Link to="/photo" className="pick-btn">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--fog)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          <span><strong>Photo</strong><br/><span className="muted">Snap a label or ingredient list</span></span>
        </Link>
      </div>

      {recent.length > 0 && (
        <div className="card" style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Recent</div>
          {recent.map(f => (
            <FoodListItem key={f.id} food={f} onClick={() => nav(`/food/${encodeURIComponent(f.slug ?? f.id)}`)} onHover={() => prefetch(`/food/${encodeURIComponent(f.slug ?? f.id)}`)} />
          ))}
        </div>
      )}

      {topRated.length > 0 && (
        <div className="card" style={{ marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: 16 }}>⭐</span>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Top Rated</span>
          </div>
          {topRated.map(f => (
            <FoodListItem key={f.id} food={f} onClick={() => nav(`/food/${encodeURIComponent(f.slug ?? f.id)}`)} onHover={() => prefetch(`/food/${encodeURIComponent(f.slug ?? f.id)}`)} />
          ))}
        </div>
      )}

      {categories.length > 0 && (
        <div className="card" style={{ marginTop: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Categories</div>
          {categories.length > 8 && (
            <input placeholder="Filter categories…" value={catFilter} onChange={e => setCatFilter(e.target.value)}
              style={{ width: "100%", marginBottom: 8, fontSize: 13, padding: "8px 12px" }} />
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxHeight: 240, overflowY: "auto" }}>
            {filteredCats.length === 0 && <div className="muted" style={{ fontSize: 13 }}>None found.</div>}
            {filteredCats.map(c => (
              <CategoryChip key={c.slug} category={c} onClick={() => nav(`/category/${encodeURIComponent(c.slug)}`)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Score pill ──────────────────────────────────────────────
function ScorePill({ score, size = 20 }: { score: number | null; size?: number }) {
  const color = score == null ? "var(--fog)" : score >= 75 ? "var(--kale)" : score >= 50 ? "var(--amber)" : score >= 25 ? "var(--tangerine)" : "var(--coral)";
  return <div style={{ fontSize: size, fontWeight: 900, color, flexShrink: 0, minWidth: 36, textAlign: "right" }}>{score ?? "—"}</div>;
}

function FoodListItem({ food, onClick, noBorder, onHover }: { food: FoodSummary; onClick: () => void; noBorder?: boolean; onHover?: () => void }) {
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

// ── Text search (store-driven) ──────────────────────────────
function TextStep() {
  const nav = useNavigate();
  const prefetch = usePrefetch();
  const search = useFlowStore(s => s.search);
  const query = useSearchStore(s => s.query);
  const hits = useSearchStore(s => s.hits);
  const setQuery = useSearchStore(s => s.setQuery);
  const clearSearch = useSearchStore(s => s.clearSearch);
  useEffect(() => () => { clearSearch(); }, [clearSearch]);

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <BackLink />
      <div className="card">
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>What food are you looking for?</div>
        <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && query.trim()) search(query.trim()); }}
          placeholder="e.g. Cheerios, red onion, Kerrygold butter"
          style={{ width: "100%", fontSize: 16, padding: "12px 14px", marginBottom: 0 }} />
        <button disabled={!query.trim()} onClick={() => search(query.trim())} className="btn-primary btn-full" style={{ marginTop: 12 }}>
          {hits.length > 0 ? "🔍 New analysis →" : "Search"}
        </button>
        {hits.length > 0 && (
          <div style={{ borderTop: "1px solid var(--slate)", marginTop: 12, paddingTop: 8 }}>
            <div className="muted" style={{ fontSize: 11, marginBottom: 6 }}>Already analyzed</div>
            {hits.map(f => (
              <FoodListItem key={f.id} food={f} onClick={() => nav(`/food/${encodeURIComponent(f.slug ?? f.id)}`)} onHover={() => prefetch(`/food/${encodeURIComponent(f.slug ?? f.id)}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
function BarcodeStep() {
  const [manual, setManual] = useState("");
  const [scanning, setScanning] = useState(false);
  const [detected, setDetected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sessionRef = useRef(0);

  useEffect(() => {
    startScan();
    return () => { stopScan(); };
  }, []);

  async function startScan() {
    if (!("BarcodeDetector" in window)) {
      setError("Barcode scanning isn't supported in this browser. Please type the barcode number instead.");
      return;
    }
    const id = ++sessionRef.current;
    const alive = () => sessionRef.current === id;

    setScanning(true);
    setDetected(null);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 } }
      });
      if (!alive() || !videoRef.current) {
        stream.getTracks().forEach(t => t.stop());
        return;
      }
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      if (!alive()) return;

      const detector = new (window as any).BarcodeDetector({
        formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "code_39", "itf"]
      });

      const tick = async () => {
        if (!alive() || !videoRef.current) return;
        try {
          const codes = await detector.detect(videoRef.current);
          if (codes?.length && codes[0].rawValue) {
            setDetected(codes[0].rawValue);
            await new Promise(r => setTimeout(r, 400));
            if (!alive()) return;
            stopScan();
            useFlowStore.getState().lookupBarcode(codes[0].rawValue);
            return;
          }
        } catch {}
        if (alive()) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    } catch (e: any) {
      if (!alive()) return;
      stopScan();
      setError("Camera error: " + String(e?.message ?? e));
    }
  }

  function stopScan() {
    sessionRef.current++;
    setScanning(false);
    const v = videoRef.current;
    const stream = v?.srcObject as MediaStream | null;
    if (stream) stream.getTracks().forEach(t => t.stop());
    if (v) v.srcObject = null;
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <BackLink onBeforeBack={stopScan} />
      <div className="card">
        {scanning && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", background: "var(--midnight)" }}>
              <video ref={videoRef} style={{ width: "100%", display: "block" }} muted playsInline />
              <div style={{
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                width: "70%", height: 100,
                border: detected ? "3px solid var(--kale)" : "2px solid var(--fog)",
                borderRadius: 12, transition: "all 0.2s", pointerEvents: "none"
              }} />
            </div>
            {detected
              ? <div style={{ marginTop: 8, padding: 10, background: "color-mix(in srgb, var(--kale) 15%, var(--midnight))", border: "1px solid var(--kale)", borderRadius: 8, fontWeight: 700, color: "var(--kale)", textAlign: "center" }}>✓ {detected}</div>
              : <div className="muted" style={{ marginTop: 8, textAlign: "center", fontSize: 13 }}>Point camera at barcode — it will scan automatically</div>}
            <button onClick={stopScan} className="btn-full" style={{ marginTop: 8 }}>Cancel</button>
          </div>
        )}

        {!scanning && (
          <>
            <button onClick={startScan} className="btn-primary btn-full"
              style={{ padding: "14px 16px", fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="7" y1="8" x2="7" y2="16"/><line x1="11" y1="8" x2="11" y2="16"/><line x1="15" y1="8" x2="15" y2="13"/><line x1="19" y1="8" x2="19" y2="16"/></svg> Scan barcode with camera
            </button>

            {error && (
              <div style={{
                padding: "10px 14px", marginBottom: 12, fontSize: 13, borderRadius: 8,
                background: "color-mix(in srgb, var(--amber) 12%, var(--midnight))",
                border: "1px solid var(--amber)", color: "var(--amber)"
              }}>{error}</div>
            )}

            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }} className="muted">Or type barcode</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={manual} onChange={e => setManual(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && manual.trim()) useFlowStore.getState().lookupBarcode(manual.trim()); }}
                placeholder="EAN / UPC number" inputMode="numeric"
                style={{ flex: 1, fontSize: 16, padding: "12px 14px" }} />
              <button disabled={!manual.trim()} onClick={() => useFlowStore.getState().lookupBarcode(manual.trim())}>Look up</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PhotoStep() {
  const [uploading, setUploading] = useState(false);
  const submitted = useRef(false);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      for (const f of Array.from(files)) fd.append("images", f);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      const ids: string[] = json.image_ids ?? [];
      if (ids.length && !submitted.current) {
        submitted.current = true;
        useFlowStore.getState().setImageIds(ids);
        useFlowStore.getState().search("Identify this food from the uploaded photo");
      }
    } catch (e: any) { alert("Upload failed: " + String(e?.message ?? e)); }
    finally { setUploading(false); }
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <BackLink />
      <div className="card">
        {uploading ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div className="spinner" />
            <div style={{ fontWeight: 700, marginTop: 12 }}>Uploading & analyzing…</div>
          </div>
        ) : (
          <>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Snap or upload a food photo</div>
            <div className="muted" style={{ fontSize: 13, marginBottom: 14 }}>Label, ingredients list, or nutrition facts</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label className="btn-primary btn-full" style={{ display: "grid", gridTemplateColumns: "24px 1fr", alignItems: "center", gap: 12, padding: "14px 20px", cursor: "pointer", fontSize: 16, fontWeight: 700, justifyItems: "start" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ justifySelf: "center" }}><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
                <span>Take photo</span>
                <input type="file" accept="image/*" capture="environment" onChange={e => handleFiles(e.target.files)} style={{ display: "none" }} />
              </label>
              <label className="btn-full" style={{ display: "grid", gridTemplateColumns: "24px 1fr", alignItems: "center", gap: 12, padding: "12px 20px", cursor: "pointer", fontSize: 15, border: "1px solid var(--slate)", borderRadius: "var(--radius-sm)", background: "transparent", color: "var(--cream)", justifyItems: "start" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ justifySelf: "center" }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                <span>Choose from gallery</span>
                <input type="file" accept="image/*" multiple onChange={e => handleFiles(e.target.files)} style={{ display: "none" }} />
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Clarification step ──────────────────────────────────────
function ClarifyStep(props: {
  assist: AssistResponse; rawText: string; priorAnswers: PriorAnswer[];
  onSubmit: (answers: PriorAnswer[]) => void;
  onSkip: () => void; onBack: () => void;
}) {
  const { assist } = props;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const submittedRef = useRef(false);

  function setAnswer(id: string, v: string) {
    const next = { ...answers, [id]: v };
    setAnswers(next);
    // Auto-submit on definitive single-answer taps (select/yesno)
    // but not multiselect — user may want to tap more options
    const allAnswered = assist.questions.every(q => next[q.id]);
    if (allAnswered && !submittedRef.current) {
      submittedRef.current = true;
      doSubmit(next);
    }
  }

  function toggleMulti(id: string, v: string) {
    const cur = (answers[id] ?? "").split(",").filter(Boolean);
    const vals = cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v];
    setAnswers(p => ({ ...p, [id]: vals.join(",") }));
  }

  const roundNumber = props.priorAnswers.length > 0 ? 2 : 1;
  const allAnswered = assist.questions.every(q => answers[q.id]);

  function doSubmit(ans: Record<string, string> = answers) {
    const newAnswers: PriorAnswer[] = assist.questions
      .filter(q => ans[q.id])
      .map(q => ({ question_id: q.id, answer: ans[q.id] }));
    props.onSubmit(newAnswers);
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <div onClick={props.onBack} style={{ cursor: "pointer", marginBottom: 12, fontSize: 14 }}><span className="muted">← Back</span></div>
      <div className="card">
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
          Quick clarification{roundNumber > 1 ? ` (follow-up)` : ""}
        </div>
        <div className="muted" style={{ fontSize: 13, marginBottom: 16 }}>
          Found <strong>{assist.structured_query.name}</strong>
          {assist.structured_query.brand ? ` by ${assist.structured_query.brand}` : ""}.
          {" "}{assist.why_questions}
        </div>
        {assist.questions.map(q => (
          <div key={q.id} style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{q.question}</div>
            {q.reason && <div className="muted" style={{ fontSize: 12, marginBottom: 8 }}>{q.reason}</div>}
            {q.type === "select" && q.options && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {q.options.map(o => (
                  <button key={o.value} onClick={() => setAnswer(q.id, o.value)}
                    className={answers[q.id] === o.value ? "chip chip-active" : "chip"}>{o.label}</button>
                ))}
              </div>
            )}
            {q.type === "multiselect" && q.options && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {q.options.map(o => {
                  const selected = (answers[q.id] ?? "").split(",").filter(Boolean);
                  const isActive = selected.includes(o.value);
                  return (
                    <button key={o.value} onClick={() => toggleMulti(q.id, o.value)}
                      className={isActive ? "chip chip-active" : "chip"}>{o.label}</button>
                  );
                })}
              </div>
            )}
            {q.type === "yesno" && (
              <div style={{ display: "flex", gap: 8 }}>
                {[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }, { label: "Not sure", value: "unknown" }].map(o => (
                  <button key={o.value} onClick={() => setAnswer(q.id, o.value)} style={{ flex: 1 }}
                    className={answers[q.id] === o.value ? "chip chip-active" : "chip"}>{o.label}</button>
                ))}
              </div>
            )}
          </div>
        ))}
        <button disabled={!allAnswered} onClick={() => doSubmit()} className="btn-primary btn-full" style={{ marginBottom: 8 }}>
          {assist.has_more_rounds ? "Next →" : "Continue →"}
        </button>
        <button onClick={props.onSkip} className="btn-full muted">Skip — search anyway</button>
      </div>
    </div>
  );
}

// ── Share button ────────────────────────────────────────────
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


// ── Queue page (store-driven) ───────────────────────────────
function QueuePage() {
  const { jobs, loaded } = useQueueJobs();
  // Poll for updates while on this page
  const fetchJobs = useQueueStore(s => s.fetchJobs);
  useEffect(() => { const iv = setInterval(fetchJobs, 3000); return () => clearInterval(iv); }, [fetchJobs]);

  const active = jobs.filter(j => j.status === "running" || j.status === "queued");
  const completed = jobs.filter(j => j.status === "succeeded");
  const failed = jobs.filter(j => j.status === "failed");

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <BackLink />
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Research Queue</h2>
      {!loaded && <div className="muted" style={{ textAlign: "center", padding: 20 }}><div className="spinner" /></div>}
      {loaded && active.length === 0 && completed.length === 0 && failed.length === 0 && (
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
  failed:    { bg: "color-mix(in srgb, var(--coral) 20%, transparent)", fg: "var(--coral)", label: "Failed" },
};

function QueueJobRow({ job }: { job: QueueJob }) {
  const badge = STATUS_BADGE[job.status] ?? STATUS_BADGE.queued;
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
    </div>
  );
  return linkTo ? <PrefetchLink to={linkTo} style={{ textDecoration: "none", color: "inherit" }}>{inner}</PrefetchLink> : inner;
}

// ── Job page ────────────────────────────────────────────────
function JobPage() {
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

// ── Food page (instant from store, no flicker) ──────────────
function FoodPage() {
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

function OrganicPill({ organic }: { organic?: string }) {
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

// ── Food detail with tabs ───────────────────────────────────
function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string;
}

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
const ADDITIVE_RISK_STYLES: Record<string, { bg: string; fg: string; border: string; marker: string; penalty?: number; order: number }> = {
  risk_free: { bg: "rgba(96,165,250,0.12)", fg: "#60a5fa", border: "rgba(96,165,250,0.35)", marker: "✓", order: 3 },
  limited:   { bg: "rgba(212,162,76,0.15)",  fg: "#d4a24c", border: "rgba(212,162,76,0.35)",  marker: "●", order: 2, penalty: 3 },
  moderate:  { bg: "rgba(234,138,60,0.15)",  fg: "#ea8a3c", border: "rgba(234,138,60,0.35)",  marker: "▲", order: 1, penalty: 10 },
  high:      { bg: "rgba(220,60,60,0.18)",   fg: "#dc3c3c", border: "rgba(220,60,60,0.40)",   marker: "✕", order: 0, penalty: 30 },
};

/** Normalize E-code for linking (e.g. "e322" → "E322") */
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

function AdditivesListPage() {
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

// ── Additive Detail Page ──────────────────────────────────

// ── Additive detail page (store-driven) ─────────────────────
function AdditivePage() {
  const { code } = useParams<{ code: string }>();
  const { detail: data } = useAdditiveDetail(code);
  const [tab, setTab] = useState<"overview" | "report">("overview");

  if (!data) return <div style={{ textAlign: "center", padding: 40 }}><div className="spinner" /></div>;

  const riskLevel = data.risk_level || "limited";
  const rstyle = ADDITIVE_RISK_STYLES[riskLevel] || ADDITIVE_RISK_STYLES.limited;
  const hasResearch = !!data.research;
  const abstraction = data.research?.abstraction;
  const funcCategory = data.function_category || abstraction?.function?.primary_category;

  return (
    <div className="additive-page">
      <PrefetchLink to="/additives" className="additive-breadcrumb">← All additives</PrefetchLink>
      <div className="additive-hero">
        <div className="additive-hero-top">
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 className="additive-hero-name">{data.name ?? data.code}</h1>
            <div className="additive-hero-meta">
              <span className="additive-hero-code">{data.code}</span>
              {funcCategory && <span className="additive-hero-func">{funcCategory}</span>}
            </div>
          </div>
          <span className="additive-risk-badge" style={{ background: rstyle.bg, color: rstyle.fg, borderColor: rstyle.border }}>
            <span className="additive-risk-marker">{rstyle.marker}</span>{riskLevel.replace("_", " ")}
          </span>
        </div>
        {data.justification && <p className="additive-hero-summary">{data.justification}</p>}
      </div>
      {hasResearch && (
        <div className="additive-tabs">
          <button className={`additive-tab${tab === "overview" ? " active" : ""}`} onClick={() => setTab("overview")}>Overview</button>
          <button className={`additive-tab${tab === "report" ? " active" : ""}`} onClick={() => setTab("report")}>Full Report</button>
        </div>
      )}
      {!hasResearch ? (
        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Basic Information</div>
          <div className="muted" style={{ fontSize: 12, marginBottom: 12 }}>Detailed research pending for this additive.</div>
          {data.description && <div style={{ marginBottom: 12 }}><div style={{ fontWeight: 600, fontSize: 12, color: "var(--fog)", marginBottom: 4 }}>Description</div><div style={{ fontSize: 13 }}>{data.description}</div></div>}
        </div>
      ) : tab === "overview" && abstraction ? (
        <AdditiveOverview abstraction={abstraction} />
      ) : tab === "report" && data.research?.report_md ? (
        <div className="card" style={{ padding: 20 }}><div className="md-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(data.research.report_md) }} /></div>
      ) : null}
      <AdditiveFoodsSection code={data.code} />
    </div>
  );
}

function AdditiveFoodsSection({ code }: { code: string }) {
  const foods = useAdditiveFoods(code);
  const nav = useNavigate();
  const prefetch = usePrefetch();
  if (!foods || foods.length === 0) return null;
  return (
    <div className="additive-section">
      <div className="additive-section-head">Found in</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {foods.map(f => (
          <div key={f.id} className="card additive-food-row" onClick={() => nav(`/food/${encodeURIComponent(f.slug ?? f.id)}`)} onMouseEnter={() => prefetch(`/food/${encodeURIComponent(f.slug ?? f.id)}`)}>
            {f.score != null && <ScorePill score={f.score} size={18} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.canonical_name}</div>
              {f.brand && <div className="muted" style={{ fontSize: 11 }}>{f.brand}</div>}
            </div>
            <span className="muted" style={{ fontSize: 14 }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}
function AdditiveSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="additive-section">
      <div className="additive-section-head">{title}</div>
      <div className="card additive-section-body">{children}</div>
    </div>
  );
}

function AdditiveKV({ label, value, stacked }: { label: string; value: string; stacked?: boolean }) {
  return (
    <div className={`additive-kv${stacked ? " stacked" : ""}`}>
      <span className="additive-kv-label">{label}</span>
      <span className="additive-kv-value">{value}</span>
    </div>
  );
}

function RegulatoryRow({ agency, region, status, details, note }: {
  agency: string; region: string; status: string; details?: string; note?: string;
}) {
  const statusUpper = status.toUpperCase();
  const isApproved = /approved|gras/i.test(status);
  return (
    <div className="additive-reg-row">
      <div className="additive-reg-header">
        <div>
          <span style={{ fontWeight: 600, fontSize: 13 }}>{agency}</span>
          <span className="muted" style={{ fontSize: 11, marginLeft: 6 }}>{region}</span>
        </div>
        <span className={`additive-reg-status${isApproved ? " approved" : ""}`}>{statusUpper}</span>
      </div>
      {details && <div className="additive-reg-details">{details}</div>}
      {note && <div className="additive-reg-note">{note}</div>}
    </div>
  );
}

function AdditiveOverview({ abstraction }: { abstraction: Record<string, any> }) {
  const identity = abstraction.identity || {};
  const func = abstraction.function || {};
  const regulatory = abstraction.regulatory || {};
  const safety = abstraction.safety_evidence || {};
  const risk = abstraction.risk_assessment || {};
  const sources = abstraction.sources || [];
  const [sourcesOpen, setSourcesOpen] = useState(true);

  // Group sources by type
  const sourcesByType: Record<string, any[]> = {};
  for (const s of sources) {
    const t = s.type || "other";
    if (!sourcesByType[t]) sourcesByType[t] = [];
    sourcesByType[t].push(s);
  }

  return (
    <div className="additive-overview">

      {/* Identity */}
      {identity && (
        <AdditiveSection title="Identity">
          {identity.chemical_class && <AdditiveKV label="Chemical class" value={identity.chemical_class} stacked />}
          {identity.origin && <AdditiveKV label="Origin" value={identity.origin} />}
          {identity.cas_numbers?.length > 0 && (
            <AdditiveKV label="CAS" value={identity.cas_numbers.join(", ")} stacked />
          )}
          {identity.synonyms?.length > 0 && (
            <div className="additive-synonyms">
              {identity.synonyms.map((s: string, i: number) => (
                <span key={i} className="additive-synonym-chip">{s}</span>
              ))}
            </div>
          )}
        </AdditiveSection>
      )}

      {/* Function */}
      {func && (func.mechanism || func.common_food_categories?.length > 0) && (
        <AdditiveSection title="How it works">
          {func.mechanism && <p className="additive-mechanism">{func.mechanism}</p>}
          {func.secondary_categories?.length > 0 && (
            <div className="additive-func-tags">
              {func.secondary_categories.map((c: string, i: number) => (
                <span key={i} className="additive-func-tag">{c}</span>
              ))}
            </div>
          )}
          {func.common_food_categories?.length > 0 && (
            <div className="additive-food-cats">
              <div className="additive-kv-label" style={{ marginBottom: 4 }}>Commonly found in</div>
              <div className="additive-food-cat-list">
                {func.common_food_categories.map((c: string, i: number) => (
                  <span key={i}>{c}</span>
                ))}
              </div>
            </div>
          )}
        </AdditiveSection>
      )}

      {/* Regulatory */}
      {regulatory && Object.keys(regulatory).filter(k => !['iarc_classification','notable_bans'].includes(k)).length > 0 && (
        <AdditiveSection title="Regulatory status">
          {regulatory.efsa && (
            <RegulatoryRow
              agency="EFSA" region="Europe"
              status={regulatory.efsa.status || "N/A"}
              details={[
                regulatory.efsa.adi?.value != null ? `ADI: ${regulatory.efsa.adi.value} ${regulatory.efsa.adi.unit}` : null,
                regulatory.efsa.last_evaluation_year ? `Evaluated ${regulatory.efsa.last_evaluation_year}` : null,
              ].filter(Boolean).join(" · ") || undefined}
              note={regulatory.efsa.key_finding}
            />
          )}
          {regulatory.fda && (
            <RegulatoryRow
              agency="FDA" region="USA"
              status={regulatory.fda.status || "N/A"}
              details={regulatory.fda.cfr_citation || undefined}
            />
          )}
          {regulatory.jecfa && (
            <RegulatoryRow
              agency="JECFA" region="International"
              status={regulatory.jecfa.adi?.value != null ? `ADI: ${regulatory.jecfa.adi.value} ${regulatory.jecfa.adi.unit}` : "Evaluated"}
              details={regulatory.jecfa.last_evaluation_year ? `Evaluated ${regulatory.jecfa.last_evaluation_year}` : undefined}
            />
          )}
          {regulatory.iarc_classification && (
            <div className="additive-reg-row">
              <div className="additive-reg-header">
                <span style={{ fontWeight: 600, fontSize: 13 }}>IARC</span>
                <span className="additive-reg-details">{regulatory.iarc_classification}</span>
              </div>
            </div>
          )}
          {regulatory.notable_bans?.length > 0 && (
            <div className="additive-alert danger">
              <span className="additive-alert-icon">⚠</span>
              <span>Banned in {regulatory.notable_bans.join(", ")}</span>
            </div>
          )}
        </AdditiveSection>
      )}

      {/* Safety Evidence */}
      {safety && (safety.concerns?.length > 0 || safety.no_concern_confirmed?.length > 0 || safety.adi_exceedance) && (
        <AdditiveSection title="Safety evidence">
          {safety.concerns?.length > 0 && (
            <div className="additive-concerns">
              {safety.concerns.map((c: any, i: number) => (
                <div key={i} className="additive-concern">
                  <div className="additive-concern-header">
                    <span className="additive-concern-cat">{c.category}</span>
                    {c.evidence_strength && (
                      <span className={`additive-evidence-strength ${c.evidence_strength}`}>
                        {c.evidence_strength}
                      </span>
                    )}
                  </div>
                  <p className="additive-concern-text">{c.summary}</p>
                  {c.key_references?.length > 0 && (
                    <div className="additive-concern-refs">{c.key_references.join(" · ")}</div>
                  )}
                </div>
              ))}
            </div>
          )}
          {safety.no_concern_confirmed?.length > 0 && (
            <div className="additive-safe-notes">
              <div className="additive-safe-label">✓ No concern confirmed</div>
              {safety.no_concern_confirmed.map((note: string, i: number) => (
                <p key={i} className="additive-safe-note">{note}</p>
              ))}
            </div>
          )}
          {safety.adi_exceedance?.at_risk && (
            <div className="additive-alert warning">
              <div className="additive-alert-title">⚠ ADI Exceedance Risk</div>
              {safety.adi_exceedance.populations?.length > 0 && (
                <div className="additive-alert-pops">
                  {safety.adi_exceedance.populations.map((p: string, i: number) => (
                    <span key={i} className="additive-pop-chip">{p}</span>
                  ))}
                </div>
              )}
              {safety.adi_exceedance.notes && (
                <p className="additive-alert-note">{safety.adi_exceedance.notes}</p>
              )}
            </div>
          )}
        </AdditiveSection>
      )}

      {/* Risk Assessment */}
      {risk?.recommended_level && (
        <AdditiveSection title="Risk assessment">
          <div className="additive-risk-summary">
            <span
              className="additive-risk-badge"
              style={{
                background: ADDITIVE_RISK_STYLES[risk.recommended_level]?.bg || "var(--slate)",
                color: ADDITIVE_RISK_STYLES[risk.recommended_level]?.fg || "var(--cream)",
                borderColor: ADDITIVE_RISK_STYLES[risk.recommended_level]?.border || "var(--fog)",
              }}
            >
              <span className="additive-risk-marker">{ADDITIVE_RISK_STYLES[risk.recommended_level]?.marker || ""}</span>
              {risk.recommended_level.replace("_", " ")}
            </span>
            {risk.confidence != null && (
              <div className="additive-confidence">
                <div className="additive-confidence-label">{Math.round(risk.confidence * 100)}% confidence</div>
                <div className="additive-confidence-track">
                  <div className="additive-confidence-fill" style={{ width: `${risk.confidence * 100}%` }} />
                </div>
              </div>
            )}
          </div>
          {risk.rationale && <p className="additive-rationale">{risk.rationale}</p>}
          {risk.key_factors?.length > 0 && (
            <ul className="additive-factors">
              {risk.key_factors.map((f: string, i: number) => <li key={i}>{f}</li>)}
            </ul>
          )}
        </AdditiveSection>
      )}

      {/* Sources */}
      {sources.length > 0 && (
        <div className="additive-section">
          <button className="additive-sources-toggle" onClick={() => setSourcesOpen(!sourcesOpen)}>
            <span className="additive-section-head" style={{ margin: 0 }}>Sources</span>
            <span className="additive-sources-count">{sources.length}</span>
            <span className="additive-sources-chevron" style={{ transform: sourcesOpen ? "rotate(180deg)" : "none" }}>▾</span>
          </button>
          {sourcesOpen && (
            <div className="additive-sources-list">
              {Object.entries(sourcesByType).map(([type, items]) => {
                const typeIcon = type === "regulatory" ? "🏛" : type === "study" ? "🔬" : type === "database" ? "🗄" : "📄";
                return (
                  <div key={type} className="additive-source-group">
                    <div className="additive-source-type">{typeIcon} {type}</div>
                    {items.map((s: any, i: number) => {
                      let domain = "";
                      try { domain = new URL(s.url).hostname.replace(/^www\./, ""); } catch {}
                      return (
                        <div key={i} className="additive-source-card">
                          {s.url ? (
                            <a href={s.url} target="_blank" rel="noopener" className="additive-source-link">
                              <span className="additive-source-title">{s.title || s.url}</span>
                              {domain && <span className="additive-source-domain">{domain} ↗</span>}
                            </a>
                          ) : (
                            <span className="additive-source-title muted">{s.title}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Research log (store-driven) ─────────────────────────────
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

// ── Category browse page ────────────────────────────────────

// ── Categories page (store-driven) ──────────────────────────
function CategoriesPage() {
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
  if (scored.length === 0) return null;
  const buckets = { excellent: 0, good: 0, mediocre: 0, poor: 0 };
  for (const f of scored) {
    const s = f.score!;
    if (s >= 85) buckets.excellent++;
    else if (s >= 65) buckets.good++;
    else if (s >= 40) buckets.mediocre++;
    else buckets.poor++;
  }
  const total = scored.length;
  const segments: { key: string; count: number; color: string; label: string }[] = [
    { key: "excellent", count: buckets.excellent, color: "var(--kale)", label: "Excellent" },
    { key: "good", count: buckets.good, color: "var(--amber)", label: "Good" },
    { key: "mediocre", count: buckets.mediocre, color: "var(--tangerine)", label: "Mediocre" },
    { key: "poor", count: buckets.poor, color: "var(--coral)", label: "Poor" },
  ];
  return (
    <div style={{ marginBottom: 16 }}>
      <div className="al-risk-bar">
        {segments.map(seg => {
          const pct = (seg.count / total) * 100;
          if (!pct) return null;
          return (
            <div
              key={seg.key}
              className="al-risk-segment"
              style={{ width: `${pct}%`, background: seg.color, borderBottom: `3px solid ${seg.color}` }}
              title={`${seg.label}: ${seg.count}`}
            />
          );
        })}
      </div>
      <div className="al-risk-legend">
        {segments.map(seg => (
          <span key={seg.key} className="al-risk-legend-item">
            <span className="al-risk-dot" style={{ background: seg.color }} />
            <span className="al-risk-label">{seg.label} {seg.count}</span>
          </span>
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


function CategoryPage() {
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
      {!loading && allFoods && allFoods.length > 0 && <div className="card" style={{ marginTop: 8 }}><div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Score Distribution</div><CategoryScoreBar foods={allFoods} /></div>}
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

// ── Healthier alternatives & related (store-driven) ─────────
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
function fmtN(v: number): string {
  if (Number.isInteger(v)) return String(v);
  const r = Math.round(v * 10) / 10;
  return Number.isInteger(r) ? String(r) : r.toFixed(1);
}

function truncName(name: string, maxWords = 4): string {
  const words = name.split(/\s+/);
  return words.length > maxWords ? words.slice(0, maxWords).join(" ") + "…" : name;
}


function ComparePage() {
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

// ── Shared small components ─────────────────────────────────
function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: "12px 16px", fontSize: 14, fontWeight: active ? 700 : 400,
      background: active ? "var(--slate)" : "transparent", color: active ? "var(--cream)" : "var(--fog)",
      border: "none", borderBottom: active ? "2px solid var(--kale)" : "2px solid transparent",
      borderRadius: 0, cursor: "pointer",
    }}>{children}</button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: 16 }}><div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>{title}</div>{children}</div>;
}
function KV({ label, value }: { label: string; value: string }) {
  return <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--slate)", fontSize: 13 }}><span className="muted">{label}</span><span>{value}</span></div>;
}


const TRAIT_PATTERNS = /^(high|low|good|no|many|contains|calorie)-/;
function isCategory(tag: string) { return !TRAIT_PATTERNS.test(tag); }

function FoodCategories({ tags }: { tags?: string[] }) {
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

function CategoryChip({ category, onClick }: { category: Category; onClick: () => void }) {
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

function BackLink({ onBeforeBack }: { onBeforeBack?: () => void } = {}) {
  const nav = useNavigate();
  return (
    <div onClick={() => { onBeforeBack?.(); nav(-1); }} style={{ cursor: "pointer", marginBottom: 12, fontSize: 14 }}>
      <span className="muted">← Back</span>
    </div>
  );
}
function FocusCard({ children }: { children: React.ReactNode }) {
  return <div style={{ maxWidth: 480, margin: "0 auto" }}><div className="card" style={{ textAlign: "center", padding: "40px 24px" }}>{children}</div></div>;
}
