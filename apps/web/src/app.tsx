import React, { useState, useCallback, useRef, useEffect } from "react";
import { Routes, Route, useNavigate, useNavigationType, useParams, useLocation, Link } from "react-router-dom";
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
} from "./api";
import { JobStatusView } from "./components/JobStatusView";

// ── Transient step types (within a route, not URL-driven) ───
type FlowStep =
  | { kind: "idle" }
  | { kind: "thinking"; label: string }
  | { kind: "clarify"; assist: AssistResponse; rawText: string; priorAnswers: PriorAnswer[] }
  | { kind: "resolving"; query: StructuredFoodQuery }
  | { kind: "researching"; jobId: string; label?: string }
  | { kind: "error"; message: string };

// Shared flow state so input screens can trigger lookups that
// transition through thinking → resolving → researching → done
function useFlowState() {
  const [flow, setFlow] = useState<FlowStep>({ kind: "idle" });
  const [imageIds, setImageIds] = useState<string[]>([]);
  const nav = useNavigate();

  async function search(rawText: string) {
    setFlow({ kind: "thinking", label: rawText });
    try {
      const res = await api.assist(rawText, imageIds);
      if (res.rejected) {
        setFlow({ kind: "error", message: res.rejection_reason || "That doesn\u2019t appear to be a food or beverage." });
        return;
      }
      if (res.needs_followup && res.questions.length > 0) {
        setFlow({ kind: "clarify", assist: res, rawText, priorAnswers: [] });
      } else {
        await resolve(res.structured_query, rawText);
      }
    } catch (e: any) {
      setFlow({ kind: "error", message: String(e?.message ?? e) });
    }
  }

  async function lookupBarcode(barcode: string) {
    setFlow({ kind: "resolving", query: { name: `Barcode ${barcode}`, barcode } });
    try {
      const query = { name: barcode, barcode, kind: "unknown" as const };
      const r = await api.resolve({ structured_query: query, rawText: `barcode: ${barcode}`, imageIds });
      if (r.kind === "found") {
        nav(`/food/${encodeURIComponent(r.food.id)}`, { replace: true });
      } else {
        setFlow({ kind: "researching", jobId: r.job_id, label: `Barcode ${barcode}` });
      }
    } catch (e: any) {
      setFlow({ kind: "error", message: `Barcode lookup failed: ${e?.message ?? e}` });
    }
  }

  async function submitClarification(answers: PriorAnswer[], rawText: string, allPriorAnswers: PriorAnswer[]) {
    const accumulated = [...allPriorAnswers, ...answers];
    setFlow({ kind: "thinking", label: rawText });
    try {
      const res = await api.assist(rawText, imageIds, undefined, accumulated);
      if (res.rejected) {
        setFlow({ kind: "error", message: res.rejection_reason || "That doesn\u2019t appear to be a food or beverage." });
        return;
      }
      if (res.needs_followup && res.questions.length > 0) {
        // Another round needed
        setFlow({ kind: "clarify", assist: res, rawText, priorAnswers: accumulated });
      } else {
        // Done clarifying — resolve
        await resolve(res.structured_query, rawText);
      }
    } catch (e: any) {
      setFlow({ kind: "error", message: String(e?.message ?? e) });
    }
  }

  async function resolve(query: StructuredFoodQuery, rawText?: string) {
    setFlow({ kind: "resolving", query });
    try {
      const r = await api.resolve({ structured_query: query, rawText, imageIds });
      if (r.kind === "rejected") {
        setFlow({ kind: "error", message: r.reason || "That doesn\u2019t appear to be a food or beverage." });
      } else if (r.kind === "found") {
        nav(`/food/${encodeURIComponent(r.food.id)}`, { replace: true });
      } else {
        const name = query.name + (query.brand ? ` by ${query.brand}` : "");
        setFlow({ kind: "researching", jobId: r.job_id, label: name });
      }
    } catch (e: any) {
      setFlow({ kind: "error", message: String(e?.message ?? e) });
    }
  }

  const onJobCompleted = useCallback(async (foodId: string) => {
    try {
      const f = await api.getFood(foodId);
      setFlow({ kind: "idle" });
      nav(`/food/${encodeURIComponent(f.slug ?? f.id)}`, { replace: true });
    } catch (e: any) {
      setFlow({ kind: "error", message: String(e?.message ?? e) });
    }
  }, [nav]);

  function skipClarification() {
    if (flow.kind === "clarify") {
      resolve(flow.assist.structured_query, flow.rawText);
    }
  }

  return { flow, setFlow, imageIds, setImageIds, search, lookupBarcode, submitClarification, skipClarification, resolve, onJobCompleted, nav };
}

// ── Flow overlay — renders transient states on top of route content ──
function FlowOverlay({ flow, setFlow, onJobCompleted }: {
  flow: FlowStep;
  setFlow: (f: FlowStep) => void;
  onJobCompleted: (foodId: string) => Promise<void>;
}) {
  const nav = useNavigate();
  if (flow.kind === "idle") return null;

  return (
    <>
      {flow.kind === "thinking" && (
        <FocusCard>
          <div className="spinner" />
          <div style={{ fontWeight: 700, marginTop: 16, fontSize: 18 }}>Analyzing…</div>
          <div className="muted" style={{ marginTop: 4 }}>{flow.label}</div>
        </FocusCard>
      )}

      {flow.kind === "resolving" && (
        <FocusCard>
          <div className="spinner" />
          <div style={{ fontWeight: 700, marginTop: 16 }}>Looking up…</div>
          <div className="muted" style={{ marginTop: 4, fontFamily: flow.query.barcode ? "monospace" : undefined }}>
            {flow.query.barcode || `${flow.query.name}${flow.query.brand ? ` by ${flow.query.brand}` : ""}`}
          </div>
        </FocusCard>
      )}

      {flow.kind === "researching" && (
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div className="card" style={{ textAlign: "center", padding: "16px 20px", marginBottom: 0, borderBottom: "none", borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Researching…</div>
            <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>{flow.label ?? "Gathering nutrition data"}</div>
          </div>
          <JobStatusView jobId={flow.jobId} onCompleted={onJobCompleted} />
        </div>
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

// ── App shell ───────────────────────────────────────────────
export function App() {
  const fs = useFlowState();
  const location = useLocation();
  const navType = useNavigationType();

  // Reset flow state on browser back/forward (POP navigation)
  useEffect(() => {
    if (navType === "POP" && fs.flow.kind !== "idle") {
      fs.setFlow({ kind: "idle" });
    }
  }, [location.pathname]);

  return (
    <div className="container">
      <Header />
      {fs.flow.kind !== "idle" ? (
        <FlowOverlayConnected fs={fs} />
      ) : (
        <Routes>
          <Route path="/" element={<PickScreen />} />
          <Route path="/text" element={<TextStep fs={fs} />} />
          <Route path="/barcode" element={<BarcodeStep fs={fs} />} />
          <Route path="/photo" element={<PhotoStep fs={fs} />} />
          <Route path="/food/:slug" element={<FoodPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/additives" element={<AdditivesListPage />} />
          <Route path="/additive/:code" element={<AdditivePage />} />
        </Routes>
      )}
    </div>
  );
}

// Connected flow overlay that wires up clarify callbacks
function FlowOverlayConnected({ fs }: { fs: ReturnType<typeof useFlowState> }) {
  if (fs.flow.kind === "clarify") {
    return (
      <ClarifyStep
        assist={fs.flow.assist}
        rawText={fs.flow.rawText}
        priorAnswers={fs.flow.priorAnswers}
        onSubmit={(answers) => fs.submitClarification(answers, fs.flow.kind === "clarify" ? fs.flow.rawText : "", fs.flow.kind === "clarify" ? fs.flow.priorAnswers : [])}
        onSkip={fs.skipClarification}
        onBack={() => fs.setFlow({ kind: "idle" })}
      />
    );
  }
  return <FlowOverlay flow={fs.flow} setFlow={fs.setFlow} onJobCompleted={fs.onJobCompleted} />;
}

// ── Admin mode ──────────────────────────────────────────────
const ADMIN_LS_KEY = "chewber_admin";
function getAdminKey(): string | null { return localStorage.getItem(ADMIN_LS_KEY); }
function setAdminKey(key: string) { localStorage.setItem(ADMIN_LS_KEY, key); }
function clearAdminKey() { localStorage.removeItem(ADMIN_LS_KEY); }
function isAdmin(): boolean { return !!getAdminKey(); }

// ── About overlay ───────────────────────────────────────────
function AboutOverlay({ onClose }: { onClose: () => void }) {
  const [taps, setTaps] = useState(0);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyVal, setKeyVal] = useState("");
  const [adminActive, setAdminActive] = useState(isAdmin());
  const tapTimer = useRef<any>(null);

  function handleTap() {
    setTaps(prev => {
      const next = prev + 1;
      clearTimeout(tapTimer.current);
      tapTimer.current = setTimeout(() => setTaps(0), 1500);
      if (next >= 5) {
        setTaps(0);
        if (adminActive) {
          clearAdminKey();
          setAdminActive(false);
          setShowKeyInput(false);
        } else {
          setShowKeyInput(true);
        }
      }
      return next;
    });
  }

  function handleKeySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (keyVal.trim()) {
      setAdminKey(keyVal.trim());
      setAdminActive(true);
      setShowKeyInput(false);
      setKeyVal("");
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "var(--overlay-bg)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--charcoal)", borderRadius: "var(--radius)",
          border: "1px solid var(--slate)", maxWidth: 440, width: "100%",
          maxHeight: "80vh", display: "flex", flexDirection: "column",
          fontSize: 14, lineHeight: 1.6, color: "var(--cream)"
        }}
      >
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: "16px 24px",
          borderBottom: "1px solid var(--slate)", flexShrink: 0
        }}>
          <img src="/tuber-header.png" alt="" height={32} style={{ display: "block" }} />
          <span style={{ flex: 1, fontSize: 20, fontWeight: 900, letterSpacing: "-0.5px" }}>Chewber</span>
          <button onClick={onClose} aria-label="Close" style={{
            background: "none", border: "none", color: "var(--fog)", cursor: "pointer",
            fontSize: 22, lineHeight: 1, padding: "4px 8px", borderRadius: "var(--radius-sm)"
          }}>✕</button>
        </div>
        <div style={{ padding: "20px 24px", overflowY: "auto" }}>
          <p style={{ marginBottom: 12 }}>
            Scan a barcode, search by name, or snap a photo — Chewber gives every food
            a <strong>0–100 health score</strong> so you can compare at a glance.
          </p>
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
          <p style={{ marginBottom: 16, fontSize: 13 }}>
            Chewber cross-references Open Food Facts, USDA FoodData Central, and
            manufacturer labels. When data is missing, an AI research agent gathers
            and verifies it.
          </p>
          <button onClick={onClose} style={{
            width: "100%", padding: "10px 0", borderRadius: "var(--radius-sm)",
            border: "1px solid var(--slate)", background: "transparent", color: "var(--cream)",
            fontWeight: 600, fontSize: 14, cursor: "pointer"
          }}>Close</button>
          {/* Hidden admin activation: tap version text 5x */}
          <div onClick={handleTap} style={{
            marginTop: 16, textAlign: "center", fontSize: 11, color: "var(--fog)",
            opacity: 0.4, cursor: "default", userSelect: "none",
          }}>
            v1.0 {adminActive ? "✓" : ""}
          </div>
          {showKeyInput && (
            <form onSubmit={handleKeySubmit} style={{ marginTop: 8, display: "flex", gap: 6 }}>
              <input
                type="password" value={keyVal} onChange={e => setKeyVal(e.target.value)}
                placeholder="Key" autoFocus
                style={{ flex: 1, fontSize: 12, padding: "6px 8px", background: "var(--slate)", border: "1px solid var(--fog)", borderRadius: 4, color: "var(--cream)" }}
              />
              <button type="submit" style={{
                fontSize: 12, padding: "6px 12px", background: "var(--kale)", border: "none",
                borderRadius: 4, color: "#fff", cursor: "pointer", fontWeight: 600
              }}>Set</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Header ──────────────────────────────────────────────────
function Header() {
  const [showAbout, setShowAbout] = useState(false);
  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 7, textDecoration: "none", color: "inherit" }}>
            <img src="/tuber-header.png" alt="" height={36} style={{ display: 'block', marginTop: -6 }} />
            <span style={{ fontSize: 21, fontWeight: 900, letterSpacing: "-0.5px", lineHeight: 1 }}>Chewber</span>
          </Link>
          <button
            onClick={() => setShowAbout(true)}
            aria-label="About Chewber"
            style={{
              background: "none", border: "none", padding: "6px 2px",
              cursor: "pointer", color: "var(--fog)", fontSize: 13,
              flexShrink: 0
            }}
          >About</button>
        </div>
        <Link to="/" style={{ textDecoration: "none" }}>
        </Link>
      </div>
      {showAbout && <AboutOverlay onClose={() => setShowAbout(false)} />}
    </>
  );
}

// ── Pick screen ─────────────────────────────────────────────
function PickScreen() {
  const nav = useNavigate();
  const [recent, setRecent] = useState<FoodSummary[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [catFilter, setCatFilter] = useState("");

  useEffect(() => {
    api.getRecentFoods(10).then(r => setRecent(r.foods)).catch(() => {});
    api.getCategories().then(r => setCategories(r.categories.filter(c => c.food_count > 0))).catch(() => {});
  }, []);

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

      <Link to="/additives" style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, padding: "10px 14px", fontSize: 13, color: "var(--fog)", textDecoration: "none", borderRadius: "var(--radius-sm)" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--fog)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H2v7l6.29 6.29c.94.94 2.48.94 3.42 0l4.58-4.58c.94-.94.94-2.48 0-3.42L9 5z"/><circle cx="6" cy="9" r="1"/></svg>
        Food additive database
        <span style={{ marginLeft: "auto", fontSize: 11 }}>243 additives →</span>
      </Link>

      {recent.length > 0 && (
        <div className="card" style={{ marginTop: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Recent</div>
          {recent.map(f => (
            <FoodListItem key={f.id} food={f} onClick={() => nav(`/food/${encodeURIComponent(f.slug ?? f.id)}`)} />
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
  const color =
    score == null ? "var(--fog)"
    : score >= 75 ? "var(--kale)" : score >= 50 ? "var(--amber)"
    : score >= 25 ? "var(--tangerine)" : "var(--coral)";
  return (
    <div style={{ fontSize: size, fontWeight: 900, color, flexShrink: 0, minWidth: 36, textAlign: "right" }}>
      {score ?? "—"}
    </div>
  );
}

// ── Shared food list item ───────────────────────────────────
function FoodListItem({ food, onClick, noBorder }: { food: FoodSummary; onClick: () => void; noBorder?: boolean }) {
  const organic = food.organic;
  return (
    <div onClick={onClick} style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "10px 0", borderBottom: noBorder ? "none" : "1px solid var(--slate)", cursor: "pointer", gap: 12
    }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{food.canonical_name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 1 }}>
          {food.brand && <span className="muted" style={{ fontSize: 12 }}>{food.brand}</span>}
          {organic && organic !== "unknown" && (
            <span style={{
              fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3, lineHeight: 1.3,
              background: organic === "yes" ? "color-mix(in srgb, var(--kale) 18%, transparent)" : "color-mix(in srgb, var(--fog) 10%, transparent)",
              color: organic === "yes" ? "var(--kale)" : "var(--fog)",
              border: `1px solid ${organic === "yes" ? "var(--kale)" : "var(--fog)"}`,
              opacity: organic === "yes" ? 1 : 0.5
            }}>{organic === "yes" ? "Organic" : "Conventional"}</span>
          )}
        </div>
      </div>
      <ScorePill score={food.score ?? null} />
    </div>
  );
}

// ── Text search ─────────────────────────────────────────────
function TextStep({ fs }: { fs: ReturnType<typeof useFlowState> }) {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<FoodSummary[]>([]);
  const timerRef = useRef<any>(null);

  function onChange(val: string) {
    setQ(val);
    clearTimeout(timerRef.current);
    const trimmed = val.trim();
    if (trimmed.length < 2) { setHits([]); return; }
    timerRef.current = setTimeout(() => {
      api.searchFoods(trimmed).then(r => setHits(r.foods.slice(0, 6))).catch(() => {});
    }, 200);
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <BackLink />
      <div className="card">
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>What food are you looking for?</div>
        <input autoFocus value={q} onChange={e => onChange(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && q.trim()) fs.search(q.trim()); }}
          placeholder="e.g. Cheerios, red onion, Kerrygold butter"
          style={{ width: "100%", fontSize: 16, padding: "12px 14px", marginBottom: 0 }} />

        <button disabled={!q.trim()} onClick={() => fs.search(q.trim())} className="btn-primary btn-full" style={{ marginTop: 12 }}>
          {hits.length > 0 ? "🔍 New analysis →" : "Search"}
        </button>

        {hits.length > 0 && (
          <div style={{ borderTop: "1px solid var(--slate)", marginTop: 12, paddingTop: 8 }}>
            <div className="muted" style={{ fontSize: 11, marginBottom: 6 }}>Already analyzed</div>
            {hits.map(f => (
              <FoodListItem key={f.id} food={f} onClick={() => nav(`/food/${encodeURIComponent(f.slug ?? f.id)}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Barcode step ────────────────────────────────────────────
function BarcodeStep({ fs }: { fs: ReturnType<typeof useFlowState> }) {
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
            fs.lookupBarcode(codes[0].rawValue);
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
                onKeyDown={e => { if (e.key === "Enter" && manual.trim()) fs.lookupBarcode(manual.trim()); }}
                placeholder="EAN / UPC number" inputMode="numeric"
                style={{ flex: 1, fontSize: 16, padding: "12px 14px" }} />
              <button disabled={!manual.trim()} onClick={() => fs.lookupBarcode(manual.trim())}>Look up</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Photo step ──────────────────────────────────────────────
function PhotoStep({ fs }: { fs: ReturnType<typeof useFlowState> }) {
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
        fs.setImageIds(ids);
        fs.search("Identify this food from the uploaded photo");
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
            {q.type === "select" && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {q.options.map(o => (
                  <button key={o.value} onClick={() => setAnswer(q.id, o.value)}
                    className={answers[q.id] === o.value ? "chip chip-active" : "chip"}>{o.label}</button>
                ))}
              </div>
            )}
            {q.type === "multiselect" && (
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

// ── Food detail page ────────────────────────────────────────
function FoodPage() {
  const { slug } = useParams<{ slug: string }>();
  const nav = useNavigate();
  const [food, setFood] = useState<FoodDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    api.getFood(decodeURIComponent(slug))
      .then(f => setFood(f))
      .catch(e => setError(String(e?.message ?? e)));
  }, [slug]);

  if (error) return (
    <div className="card" style={{ borderColor: "var(--coral)" }}>
      <div style={{ fontWeight: 700, color: "var(--coral)" }}>Something went wrong</div>
      <div style={{ marginTop: 8, fontSize: 13, wordBreak: "break-word" }}>{error}</div>
      <button onClick={() => nav("/")} style={{ marginTop: 12, width: "100%" }}>Start over</button>
    </div>
  );

  if (!food) return (
    <FocusCard>
      <div className="spinner" />
      <div style={{ fontWeight: 700, marginTop: 16 }}>Loading…</div>
    </FocusCard>
  );

  return (
    <>
      <ScoreHero food={food} />
      <FoodCategories tags={food.tags} />
      <FoodDetailView food={food} />
      <RelatedFoods foodId={food.id} />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={() => nav("/")} className="btn-full" style={{ flex: 1 }}>← New search</button>
        <button onClick={() => nav(`/compare?ids=${encodeURIComponent(food.slug ?? food.id)}`)} className="btn-full" style={{ flex: 1 }}>⚖️ Compare</button>
      </div>
    </>
  );
}

// ── Score hero ──────────────────────────────────────────────
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
  const [confirming, setConfirming] = useState(false);
  if (!isAdmin()) return null;

  async function handleDelete() {
    const key = getAdminKey();
    if (!key) return;
    try {
      await api.deleteFood(food.id, key);
      nav("/", { replace: true });
    } catch (e: any) {
      alert(`Delete failed: ${e.message}`);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div style={{
        position: "absolute", top: 12, left: 12, display: "flex", alignItems: "center", gap: 4,
        background: "var(--charcoal)", border: "1px solid var(--coral)", borderRadius: 8,
        padding: "4px 8px", zIndex: 2,
      }}>
        <span style={{ fontSize: 11, color: "var(--coral)", fontWeight: 600 }}>Delete?</span>
        <button onClick={handleDelete} style={{
          fontSize: 11, padding: "2px 8px", background: "var(--coral)", color: "#fff",
          border: "none", borderRadius: 4, cursor: "pointer", fontWeight: 600
        }}>Yes</button>
        <button onClick={() => setConfirming(false)} style={{
          fontSize: 11, padding: "2px 8px", background: "transparent", color: "var(--fog)",
          border: "1px solid var(--fog)", borderRadius: 4, cursor: "pointer"
        }}>No</button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      aria-label="Delete"
      style={{
        position: "absolute", top: 12, left: 12,
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 36, height: 36, padding: 0,
        background: "transparent", border: "none", borderRadius: "50%",
        color: "var(--fog)", cursor: "pointer", opacity: 0.5,
        transition: "opacity 0.2s",
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
      onMouseLeave={e => (e.currentTarget.style.opacity = "0.5")}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      </svg>
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
          Set <code>CHEWBER_LLM_PROVIDER</code> to <code>openai</code> or <code>openrouter</code> for real results.
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

function normalizeCode(raw: string): string {
  let c = raw.trim();
  if (c.startsWith("en:")) c = c.slice(3).split("-")[0];
  return c.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function getAdditiveRisk(additive: any, breakdown: any): string {
  if (!breakdown?.additives?.deductions) return "risk_free";
  const code = additive.code ? normalizeCode(additive.code) : null;
  const name = (additive.name ?? "").toLowerCase();
  for (const d of breakdown.additives.deductions) {
    const dCode = d.code ? normalizeCode(d.code) : null;
    if (code && dCode && code === dCode) return d.risk_level;
    // Also match by base code (E150D matches E150A etc.)
    if (code && dCode) {
      const baseA = code.replace(/[A-Z]+$/, "");
      const baseB = dCode.replace(/[A-Z]+$/, "");
      if (baseA === baseB && baseA.length > 1) return d.risk_level;
    }
    if (name && d.name && d.name.toLowerCase() === name) return d.risk_level;
  }
  return "risk_free";
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
            {nutr.energy_kcal != null && <KV label="Calories" value={`${nutr.energy_kcal} kcal`} />}
            {nutr.sugars_g != null && <KV label="Sugars" value={`${nutr.sugars_g} g`} />}
            {nutr.saturated_fat_g != null && <KV label="Sat. fat" value={`${nutr.saturated_fat_g} g`} />}
            {nutr.sodium_mg != null && <KV label="Sodium" value={`${nutr.sodium_mg} mg`} />}
            {nutr.fiber_g != null && <KV label="Fiber" value={`${nutr.fiber_g} g`} />}
            {nutr.protein_g != null && <KV label="Protein" value={`${nutr.protein_g} g`} />}
          </div>
        </div>
      )}

      {/* Additives with risk-level coloring */}
      {abs.additives && abs.additives.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--fog)", marginBottom: 6 }}>Additives ({abs.additives.length})</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {[...abs.additives].sort((a: any, b: any) => {
              const ra = getAdditiveRisk(a, food.score_breakdown);
              const rb = getAdditiveRisk(b, food.score_breakdown);
              return (ADDITIVE_RISK_STYLES[ra]?.order ?? 9) - (ADDITIVE_RISK_STYLES[rb]?.order ?? 9);
            }).map((a: any, i: number) => {
              const risk = getAdditiveRisk(a, food.score_breakdown);
              const style = ADDITIVE_RISK_STYLES[risk];
              const code = a.code ? normalizeCode(a.code) : null;
              const badge = (
                <span className="badge" title={`${risk.replace("_", " ")}${style.penalty ? ` (−${style.penalty} pts)` : ""}`} style={{
                  fontSize: 11, padding: "2px 8px",
                  background: style.bg, color: style.fg, border: `1px solid ${style.border}`
                }}>{style.marker} {a.name ?? a.code ?? "unknown"}</span>
              );
              return code ? (
                <Link key={i} to={`/additive/${code}`} style={{ textDecoration: "none" }}>
                  {badge}
                </Link>
              ) : (
                <span key={i}>{badge}</span>
              );
            })}
          </div>
          <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 8, fontSize: 10, color: "var(--fog)" }}>
            {["risk_free", "limited", "moderate", "high"].map(level => (
              <span key={level} style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: ADDITIVE_RISK_STYLES[level as keyof typeof ADDITIVE_RISK_STYLES].bg, border: `1px solid ${ADDITIVE_RISK_STYLES[level as keyof typeof ADDITIVE_RISK_STYLES].border}` }} />
                {ADDITIVE_RISK_STYLES[level as keyof typeof ADDITIVE_RISK_STYLES].marker} {level.replace("_", " ")}
              </span>
            ))}
          </div>
        </div>
      )}

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
        {cls?.nutri_score_category && cls.nutri_score_category !== "unknown" && <KV label="Category" value={cls.nutri_score_category.replace("_", " ")} />}

        {cls?.fvp_percent != null && <KV label="Fruit/veg/nut %" value={`${cls.fvp_percent}%`} />}
      </div>
    </div>
  );
}

// ── Additives List Page ───────────────────────────────────
// ── Category normalization for additives list ──────────────
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
  const [data, setData] = useState<{ count: number; additives: AdditiveListItem[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [funcFilter, setFuncFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"risk" | "name" | "code">("risk");

  const nav = useNavigate();
  const catScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getAdditives()
      .then(setData)
      .catch(e => setError(String(e?.message ?? e)));
  }, []);



  // Auto-scroll active category chip into view on mobile
  useEffect(() => {
    const el = catScrollRef.current;
    if (!el) return;
    const active = el.querySelector('.al-cat-chip.active') as HTMLElement;
    if (active) active.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [funcFilter]);

  if (error) return <div className="muted" style={{ textAlign: "center", padding: 40 }}>Failed to load additives: {error}</div>;
  if (!data) return <div style={{ textAlign: "center", padding: 40 }}><div className="spinner" /></div>;

  // Compute category counts from full data
  const catCounts: Record<string, number> = {};
  for (const a of data.additives) {
    const cat = normalizeFuncCategory(a.function_category);
    catCounts[cat] = (catCounts[cat] || 0) + 1;
  }

  // Risk counts from full data
  const riskCounts: Record<string, number> = { risk_free: 0, limited: 0, moderate: 0, high: 0 };
  for (const a of data.additives) riskCounts[a.risk_level] = (riskCounts[a.risk_level] || 0) + 1;
  const total = data.additives.length;

  // Filter
  let filtered = data.additives.filter(a => {
    const search = searchText.toLowerCase();
    if (search && !a.code.toLowerCase().includes(search) && !(a.name && a.name.toLowerCase().includes(search)) && !(a.description && a.description.toLowerCase().includes(search))) return false;
    if (riskFilter !== "all" && a.risk_level !== riskFilter) return false;
    if (funcFilter !== "all" && normalizeFuncCategory(a.function_category) !== funcFilter) return false;
    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "risk") {
      const orderA = ADDITIVE_RISK_STYLES[a.risk_level]?.order ?? 9;
      const orderB = ADDITIVE_RISK_STYLES[b.risk_level]?.order ?? 9;
      if (orderA !== orderB) return orderA - orderB;
      return a.code.localeCompare(b.code);
    } else if (sortBy === "name") {
      return (a.name ?? a.code).localeCompare(b.name ?? b.code);
    } else {
      // By E-number (numeric part)
      const numA = parseInt(a.code.replace(/[^0-9]/g, "")) || 9999;
      const numB = parseInt(b.code.replace(/[^0-9]/g, "")) || 9999;
      return numA - numB;
    }
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
              onClick={() => nav(`/additive/${encodeURIComponent(add.code)}`)}
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
function AdditivePage() {
  const { code } = useParams<{ code: string }>();
  const [data, setData] = useState<AdditiveDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"overview" | "report">("overview");
  const nav = useNavigate();

  useEffect(() => {
    if (!code) return;
    api.getAdditive(code)
      .then(setData)
      .catch(e => setError(String(e?.message ?? e)));
  }, [code]);

  if (error) return <div className="muted" style={{ textAlign: "center", padding: 40 }}>Failed to load additive: {error}</div>;
  if (!data) return <div style={{ textAlign: "center", padding: 40 }}><div className="spinner" /></div>;

  const riskLevel = data.risk_level || "limited";
  const rstyle = ADDITIVE_RISK_STYLES[riskLevel] || ADDITIVE_RISK_STYLES.limited;
  const hasResearch = !!data.research;
  const abstraction = data.research?.abstraction;
  const funcCategory = data.function_category || abstraction?.function?.primary_category;

  return (
    <div className="additive-page">
      {/* Breadcrumb */}
      <Link to="/additives" className="additive-breadcrumb">← All additives</Link>

      {/* Hero header */}
      <div className="additive-hero">
        <div className="additive-hero-top">
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 className="additive-hero-name">{data.name ?? data.code}</h1>
            <div className="additive-hero-meta">
              <span className="additive-hero-code">{data.code}</span>
              {funcCategory && <span className="additive-hero-func">{funcCategory}</span>}
            </div>
          </div>
          <span
            className="additive-risk-badge"
            style={{ background: rstyle.bg, color: rstyle.fg, borderColor: rstyle.border }}
          >
            <span className="additive-risk-marker">{rstyle.marker}</span>
            {riskLevel.replace("_", " ")}
          </span>
        </div>
        {data.justification && (
          <p className="additive-hero-summary">{data.justification}</p>
        )}
      </div>

      {/* Tabs */}
      {hasResearch && (
        <div className="additive-tabs">
          <button
            className={`additive-tab${tab === "overview" ? " active" : ""}`}
            onClick={() => setTab("overview")}
          >Overview</button>
          <button
            className={`additive-tab${tab === "report" ? " active" : ""}`}
            onClick={() => setTab("report")}
          >Full Report</button>
        </div>
      )}

      {/* Content */}
      {!hasResearch ? (
        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Basic Information</div>
          <div className="muted" style={{ fontSize: 12, marginBottom: 12 }}>Detailed research pending for this additive.</div>
          {data.description && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 12, color: "var(--fog)", marginBottom: 4 }}>Description</div>
              <div style={{ fontSize: 13 }}>{data.description}</div>
            </div>
          )}
        </div>
      ) : tab === "overview" && abstraction ? (
        <AdditiveOverview abstraction={abstraction} />
      ) : tab === "report" && data.research?.report_md ? (
        <div className="card" style={{ padding: 20 }}>
          <div className="md-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(data.research.report_md) }} />
        </div>
      ) : null}

      {/* Foods containing this additive */}
      <AdditiveFoods code={data.code} />
    </div>
  );
}

function AdditiveFoods({ code }: { code: string }) {
  const [foods, setFoods] = useState<FoodSummary[] | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    api.getAdditiveFoods(code)
      .then(r => setFoods(r.foods))
      .catch(() => setFoods([]));
  }, [code]);

  if (foods === null || foods.length === 0) return null;

  return (
    <div className="additive-section">
      <div className="additive-section-head">Found in</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {foods.map(f => (
          <div
            key={f.id}
            className="card additive-food-row"
            onClick={() => nav(`/food/${encodeURIComponent(f.slug ?? f.id)}`)}
          >
            {f.score != null && <ScorePill score={f.score} size={18} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {f.canonical_name}
              </div>
              {f.brand && <div className="muted" style={{ fontSize: 11 }}>{f.brand}</div>}
            </div>
            <span className="muted" style={{ fontSize: 14 }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Additive Overview (structured abstraction) ────────────

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

function ResearchLog({ foodId }: { foodId: string }) {
  const [events, setEvents] = useState<any[] | null>(null);
  const [job, setJob] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getJobByFood(foodId).then(r => {
      setJob(r.job);
      setEvents(r.events);
    }).catch(e => setError(String(e?.message ?? e)));
  }, [foodId]);

  if (error) return <div className="muted" style={{ textAlign: "center", padding: 20 }}>Failed to load log: {error}</div>;
  if (events === null) return <div className="muted" style={{ textAlign: "center", padding: 20 }}>Loading…</div>;
  if (!job) return <div className="muted" style={{ textAlign: "center", padding: 20 }}>No research job found for this food.</div>;

  const LEVEL_COLORS: Record<string, { bg: string; fg: string }> = {
    info:  { bg: "color-mix(in srgb, var(--blue) 10%, var(--charcoal))", fg: "var(--fog)" },
    tool:  { bg: "color-mix(in srgb, var(--kale) 10%, var(--charcoal))", fg: "var(--kale)" },
    warn:  { bg: "color-mix(in srgb, var(--amber) 10%, var(--charcoal))", fg: "var(--amber)" },
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
        {events.map((ev: any) => {
          const c = LEVEL_COLORS[ev.level] ?? LEVEL_COLORS.info;
          return <LogRow key={ev.id} ev={ev} bg={c.bg} fg={c.fg} />;
        })}
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
function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const nav = useNavigate();
  const [foods, setFoods] = useState<FoodSummary[]>([]);
  const [catName, setCatName] = useState(
    slug ? slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : ""
  );
  const [catDesc, setCatDesc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    // Fetch category display name + description
    api.getCategories().then(r => {
      const cat = r.categories.find(c => c.slug === slug);
      if (cat) { setCatName(cat.display_name); setCatDesc(cat.description ?? null); }
    }).catch(() => {});
    // Fetch foods with this tag
    api.searchFoodsByTag(slug).then(r => {
      setFoods(r.foods);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <BackLink />
      <div className="card">
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{catName}</div>
        {catDesc && <div className="muted" style={{ fontSize: 13, marginBottom: 4 }}>{catDesc}</div>}
        <div className="muted" style={{ fontSize: 13, marginBottom: 12 }}>{foods.length} food{foods.length !== 1 ? "s" : ""}</div>
        {loading && <div className="muted" style={{ textAlign: "center", padding: 20 }}>Loading…</div>}
        {!loading && foods.length === 0 && <div className="muted" style={{ textAlign: "center", padding: 20 }}>No foods in this category yet.</div>}
        {foods.map(f => (
          <FoodListItem key={f.id} food={f} onClick={() => nav(`/food/${encodeURIComponent(f.slug ?? f.id)}`)} />
        ))}
      </div>
    </div>
  );
}

// ── Related foods section ───────────────────────────────────
function RelatedFoods({ foodId }: { foodId: string }) {
  const nav = useNavigate();
  const [related, setRelated] = useState<RelatedFood[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRelatedFoods(foodId, 6).then(r => {
      setRelated(r.related);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [foodId]);

  if (loading || related.length === 0) return null;

  return (
    <div className="card" style={{ marginTop: 8 }}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Related Foods</div>
      {related.map((f, i) => (
        <div key={f.id}>
          <FoodListItem food={f} onClick={() => nav(`/food/${encodeURIComponent(f.slug ?? f.id)}`)} noBorder />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, paddingLeft: 2, paddingBottom: 8 }}>
            {f.shared_tags.filter(isCategory).map(t => (
              <span key={t} className="badge" style={{ fontSize: 9, padding: "1px 6px", opacity: 0.7 }}>
                {t.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ")}
              </span>
            ))}
          </div>
          {i < related.length - 1 && <div style={{ borderBottom: "1px solid var(--slate)" }} />}
        </div>
      ))}
    </div>
  );
}

// ── Compare page ──────────────────────────────────────
function truncName(name: string, maxWords = 4): string {
  const words = name.split(/\s+/);
  return words.length > maxWords ? words.slice(0, maxWords).join(" ") + "…" : name;
}

function ComparePage() {
  const nav = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialIds = (params.get("ids") ?? "").split(",").filter(Boolean);

  const [foods, setFoods] = useState<FoodDetail[]>([]);
  const [searchQ, setSearchQ] = useState("");
  const [hits, setHits] = useState<FoodSummary[]>([]);
  const [suggestions, setSuggestions] = useState<FoodSummary[]>([]);
  const timerRef = useRef<any>(null);

  // Load initial foods
  useEffect(() => {
    for (const id of initialIds) {
      api.getFood(id).then(f => setFoods(prev => prev.some(p => p.id === f.id) ? prev : [...prev, f])).catch(() => {});
    }
  }, []);

  // Keep URL in sync with selected foods (use slugs for clean URLs)
  useEffect(() => {
    const slugs = foods.map(f => f.slug ?? f.id).join(",");
    const url = slugs ? `/compare?ids=${encodeURIComponent(slugs)}` : "/compare";
    window.history.replaceState(null, "", url);
  }, [foods]);

  // Fetch suggestions based on the first food's categories, fallback to recent
  useEffect(() => {
    if (foods.length === 0) { setSuggestions([]); return; }
    const loadedIds = new Set(foods.map(f => f.id));
    const cats = (foods[0]?.tags ?? []).filter(isCategory);

    const tagFetches = cats.slice(0, 4).map(slug =>
      api.searchFoodsByTag(slug).then(r => r.foods).catch(() => [] as FoodSummary[])
    );

    Promise.all(tagFetches).then(async groups => {
      const seen = new Set<string>();
      const all: FoodSummary[] = [];
      for (const g of groups) {
        for (const f of g) {
          if (!loadedIds.has(f.id) && !seen.has(f.id)) { seen.add(f.id); all.push(f); }
        }
      }
      // Fallback: if no category matches, show recent foods
      if (all.length === 0) {
        try {
          const recent = await api.getRecentFoods(10);
          for (const f of recent.foods) {
            if (!loadedIds.has(f.id) && !seen.has(f.id)) { seen.add(f.id); all.push(f); }
          }
        } catch {}
      }
      setSuggestions(all);
    });
  }, [foods.map(f => f.id).join(",")]);

  function onSearch(val: string) {
    setSearchQ(val);
    clearTimeout(timerRef.current);
    if (val.trim().length < 2) { setHits([]); return; }
    timerRef.current = setTimeout(() => {
      api.searchFoods(val.trim()).then(r => setHits(r.foods.filter(f => !foods.some(e => e.id === f.id)).slice(0, 5))).catch(() => {});
    }, 200);
  }

  function addFood(id: string) {
    api.getFood(id).then(f => {
      setFoods(prev => prev.some(p => p.id === f.id) ? prev : [...prev, f]);
      setSearchQ(""); setHits([]);
    }).catch(() => {});
  }

  function removeFood(id: string) {
    setFoods(prev => prev.filter(f => f.id !== id));
  }

  const nutrKeys: { key: string; label: string; unit: string }[] = [
    { key: "energy_kcal", label: "Calories", unit: "kcal" },
    { key: "protein_g", label: "Protein", unit: "g" },
    { key: "fiber_g", label: "Fiber", unit: "g" },
    { key: "sugars_g", label: "Sugars", unit: "g" },
    { key: "saturated_fat_g", label: "Sat. Fat", unit: "g" },
    { key: "total_fat_g", label: "Total Fat", unit: "g" },
    { key: "sodium_mg", label: "Sodium", unit: "mg" },
  ];

  // For coloring: lower is better for sugar/fat/sodium, higher is better for protein/fiber
  const higherBetter = new Set(["energy_kcal", "protein_g", "fiber_g"]);

  function getNutr(food: FoodDetail, key: string): number | null {
    return food.abstraction?.nutrition_per_100?.[key] ?? null;
  }

  function bestWorst(key: string): { bestId: string | null; worstId: string | null } {
    const vals = foods.map(f => ({ id: f.id, v: getNutr(f, key) })).filter(x => x.v != null);
    if (vals.length < 2) return { bestId: null, worstId: null };
    vals.sort((a, b) => a.v! - b.v!);
    const hb = higherBetter.has(key);
    return { bestId: hb ? vals[vals.length - 1].id : vals[0].id, worstId: hb ? vals[0].id : vals[vals.length - 1].id };
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <BackLink />
      <div className="card" style={{ marginBottom: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Compare Foods</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={searchQ} onChange={e => onSearch(e.target.value)} placeholder="Add a food to compare…"
            style={{ flex: 1, fontSize: 14, padding: "10px 12px" }} />
        </div>
        {hits.length > 0 && (
          <div style={{ borderTop: "1px solid var(--slate)", marginTop: 8, paddingTop: 4 }}>
            {hits.map(f => (
              <div key={f.id} onClick={() => addFood(f.id)} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 0", borderBottom: "1px solid var(--slate)", cursor: "pointer", fontSize: 13
              }}>
                <span>{f.canonical_name}{f.brand ? ` — ${f.brand}` : ""}</span>
                <ScorePill score={f.score ?? null} size={16} />
              </div>
            ))}
          </div>
        )}
        {hits.length === 0 && !searchQ && suggestions.length > 0 && (
          <div style={{ borderTop: "1px solid var(--slate)", marginTop: 8, paddingTop: 6 }}>
            <div className="muted" style={{ fontSize: 11, marginBottom: 4 }}>or pick one…</div>
            {suggestions.map(f => (
              <div key={f.id} onClick={() => addFood(f.id)} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "7px 0", borderBottom: "1px solid var(--slate)", cursor: "pointer", fontSize: 13,
              }}>
                <span>{f.canonical_name}{f.brand ? ` — ${f.brand}` : ""}</span>
                <ScorePill score={f.score ?? null} size={16} />
              </div>
            ))}
          </div>
        )}
      </div>

      {foods.length === 0 && (
        <div className="card muted" style={{ textAlign: "center", padding: 32 }}>Search above to add foods to compare.</div>
      )}

      {foods.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              {/* Name row */}
              <tr>
                <th style={{ padding: "6px 8px", minWidth: 80 }} />
                {foods.map(f => (
                  <th key={f.id} style={{ padding: "6px 8px 0", textAlign: "center", minWidth: 100, verticalAlign: "top" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>{truncName(f.canonical_name)}</div>
                  </th>
                ))}
              </tr>
              {/* Brand row */}
              <tr>
                <th style={{ padding: 0 }} />
                {foods.map(f => (
                  <th key={f.id} style={{ padding: "1px 8px 0", textAlign: "center", verticalAlign: "top", fontWeight: 400 }}>
                    {f.brand ? <div className="muted" style={{ fontSize: 11 }}>{f.brand}</div> : <div style={{ fontSize: 11 }}> </div>}
                  </th>
                ))}
              </tr>
              {/* Score + remove row */}
              <tr style={{ borderBottom: "2px solid var(--slate)" }}>
                <th style={{ textAlign: "left", padding: "4px 8px", fontSize: 12, color: "var(--fog)", fontWeight: 400 }}>per 100g</th>
                {foods.map(f => (
                  <th key={f.id} style={{ padding: "4px 8px", textAlign: "center", verticalAlign: "middle" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <ScorePill score={f.score ?? null} size={24} />
                      <button onClick={() => removeFood(f.id)} style={{
                        background: "none", border: "none", color: "var(--fog)", cursor: "pointer",
                        fontSize: 11, padding: "2px 4px", lineHeight: 1
                      }}>✕</button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {nutrKeys.map(({ key, label, unit }) => {
                const { bestId, worstId } = bestWorst(key);
                return (
                  <tr key={key} style={{ borderBottom: "1px solid var(--slate)" }}>
                    <td style={{ padding: "8px", fontWeight: 600, color: "var(--fog)" }}>{label}</td>
                    {foods.map(f => {
                      const v = getNutr(f, key);
                      const isBest = f.id === bestId;
                      const isWorst = f.id === worstId;
                      return (
                        <td key={f.id} style={{
                          padding: "8px", textAlign: "center", fontWeight: isBest ? 700 : 400,
                          color: isBest ? "var(--kale)" : isWorst ? "var(--coral)" : "var(--cream)"
                        }}>
                          {v != null ? `${v} ${unit}` : "—"}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              <tr style={{ borderBottom: "1px solid var(--slate)" }}>
                <td style={{ padding: "8px", fontWeight: 600, color: "var(--fog)" }}>Additives</td>
                {foods.map(f => (
                  <td key={f.id} style={{ padding: "8px", textAlign: "center" }}>
                    {f.abstraction?.additives?.length ?? "—"}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: "8px", fontWeight: 600, color: "var(--fog)" }}>Categories</td>
                {foods.map(f => (
                  <td key={f.id} style={{ padding: "8px", textAlign: "center" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
                      {(f.tags ?? []).filter(isCategory).map(t => (
                        <span key={t} className="badge" style={{ fontSize: 9, padding: "1px 5px" }}>
                          {t.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ")}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
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

// Cache category counts so we don't re-fetch on every render
let _catCountCache: Record<string, number> | null = null;
let _catCountPromise: Promise<Record<string, number>> | null = null;
function getCatCounts(): Promise<Record<string, number>> {
  if (_catCountCache) return Promise.resolve(_catCountCache);
  if (!_catCountPromise) {
    _catCountPromise = api.getCategories().then(r => {
      const m: Record<string, number> = {};
      for (const c of r.categories) m[c.slug] = c.food_count;
      _catCountCache = m;
      return m;
    }).catch(() => ({}));
  }
  return _catCountPromise;
}

function FoodCategories({ tags }: { tags?: string[] }) {
  const nav = useNavigate();
  const [counts, setCounts] = useState<Record<string, number> | null>(_catCountCache);
  const allCats = (tags ?? []).filter(isCategory);

  useEffect(() => {
    if (!counts) getCatCounts().then(setCounts);
  }, []);

  if (allCats.length === 0) return null;

  const sorted = counts
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
