import React, { useState, useCallback, useRef, useEffect } from "react";
import { Routes, Route, useNavigate, useNavigationType, useParams, useLocation, Link } from "react-router-dom";
import {
  api,
  type AssistResponse,
  type FoodDetail,
  type FoodSummary,
  type PriorAnswer,
  type StructuredFoodQuery,
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
      if (r.kind === "found") {
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
      nav(`/food/${encodeURIComponent(f.id)}`, { replace: true });
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
          <Route path="/food/:id" element={<FoodPage />} />
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

// ── About overlay ───────────────────────────────────────────
function AboutOverlay({ onClose }: { onClose: () => void }) {
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
            <span style={{ padding: "2px 10px", borderRadius: 6, background: "#3D8B5F", color: "#fff", fontWeight: 700 }}>75–100 Excellent</span>
            <span style={{ padding: "2px 10px", borderRadius: 6, background: "#D4A24C", color: "#fff", fontWeight: 700 }}>50–74 Good</span>
            <span style={{ padding: "2px 10px", borderRadius: 6, background: "#C8714A", color: "#fff", fontWeight: 700 }}>25–49 Mediocre</span>
            <span style={{ padding: "2px 10px", borderRadius: 6, background: "#C44D3E", color: "#fff", fontWeight: 700 }}>0–24 Poor</span>
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
            <img src="/tuber-header.png" alt="" height={24} style={{ display: 'block' }} />
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
          <div className="muted" style={{ fontSize: 10.5, marginTop: 3, letterSpacing: "0.01em" }}>Food score in seconds</div>
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
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [catFilter, setCatFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  useEffect(() => {
    api.getRecentFoods(10).then(r => setRecent(r.foods)).catch(() => {});
    api.getCategories().then(r => setCategories(r.categories)).catch(() => {});
    api.getTags().then(r => setTags(r.tags)).catch(() => {});
  }, []);

  const filteredCats = catFilter
    ? categories.filter(c => c.toLowerCase().includes(catFilter.toLowerCase()))
    : categories;
  const filteredTags = tagFilter
    ? tags.filter(t => t.toLowerCase().includes(tagFilter.toLowerCase()))
    : tags;

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 480, margin: "0 auto" }}>
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
        <div className="card" style={{ marginTop: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Recent</div>
          {recent.map(f => (
            <div key={f.id} onClick={() => nav(`/food/${encodeURIComponent(f.id)}`)} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 0", borderBottom: "1px solid var(--slate)", cursor: "pointer", gap: 12
            }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.canonical_name}</div>
                <div className="muted" style={{ fontSize: 12 }}>{f.brand ?? ""}</div>
              </div>
              <ScorePill score={f.score ?? null} />
            </div>
          ))}
        </div>
      )}

      {categories.length > 0 && (
        <div className="card" style={{ marginTop: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Categories</div>
          <input placeholder="Filter…" value={catFilter} onChange={e => setCatFilter(e.target.value)}
            style={{ width: "100%", marginBottom: 8, fontSize: 13, padding: "8px 12px" }} />
          <div style={{ maxHeight: 200, overflowY: "auto" }}>
            {filteredCats.length === 0 && <div className="muted" style={{ fontSize: 13 }}>None found.</div>}
            {filteredCats.map(c => (
              <div key={c} className="muted" style={{ padding: "6px 0", fontSize: 13, cursor: "pointer", borderBottom: "1px solid var(--slate)" }}
                onClick={() => nav("/text")}>{c}</div>
            ))}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div className="card" style={{ marginTop: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Tags</div>
          <input placeholder="Filter…" value={tagFilter} onChange={e => setTagFilter(e.target.value)}
            style={{ width: "100%", marginBottom: 8, fontSize: 13, padding: "8px 12px" }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxHeight: 200, overflowY: "auto" }}>
            {filteredTags.map(t => (
              <span key={t} className="badge" style={{ cursor: "pointer", padding: "4px 10px", fontSize: 12 }}
                onClick={() => nav("/text")}>{t}</span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// ── Score pill ──────────────────────────────────────────────
function ScorePill({ score }: { score: number | null }) {
  const color =
    score == null ? "var(--fog)"
    : score >= 75 ? "var(--kale)" : score >= 50 ? "var(--amber)"
    : score >= 25 ? "var(--tangerine)" : "var(--coral)";
  return (
    <div style={{ fontSize: 20, fontWeight: 900, color, flexShrink: 0, minWidth: 36, textAlign: "right" }}>
      {score ?? "—"}
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

        {hits.length > 0 && (
          <div style={{ borderTop: "1px solid var(--slate)", marginTop: 8, paddingTop: 8 }}>
            <div className="muted" style={{ fontSize: 11, marginBottom: 6 }}>Already analyzed</div>
            {hits.map(f => (
              <div key={f.id} onClick={() => nav(`/food/${encodeURIComponent(f.id)}`)} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 4px", borderBottom: "1px solid var(--slate)", cursor: "pointer", gap: 10
              }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.canonical_name}</div>
                  {f.brand && <div className="muted" style={{ fontSize: 12 }}>{f.brand}</div>}
                </div>
                <ScorePill score={f.score ?? null} />
              </div>
            ))}
          </div>
        )}

        <button disabled={!q.trim()} onClick={() => fs.search(q.trim())} className="btn-primary btn-full" style={{ marginTop: 12 }}>
          {hits.length > 0 ? "🔍 New analysis →" : "Search"}
        </button>
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
              📷 Scan barcode with camera
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
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.click(), 100);
    return () => clearTimeout(t);
  }, []);

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
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Snap or upload a food photo</div>
        <label className="btn-primary btn-full" style={{ display: "block", textAlign: "center", padding: 14, cursor: "pointer", marginBottom: 12 }}>
          {uploading ? "Uploading & analyzing…" : "📷 Take photo or choose from gallery"}
          <input ref={inputRef} type="file" accept="image/*" onChange={e => handleFiles(e.target.files)} style={{ display: "none" }} />
        </label>
        <div className="muted" style={{ fontSize: 13, textAlign: "center" }}>Photo will be analyzed automatically</div>
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

  const hasMultiselect = assist.questions.some(q => q.type === "multiselect");

  function setAnswer(id: string, v: string) {
    const next = { ...answers, [id]: v };
    setAnswers(next);
    // Auto-submit when all questions answered (skip for multiselect — user may tap more)
    if (!hasMultiselect) {
      const allAnswered = assist.questions.every(q => next[q.id]);
      if (allAnswered && !submittedRef.current) {
        submittedRef.current = true;
        doSubmit(next);
      }
    }
  }

  const toggleMulti = (id: string, v: string) => {
    const cur = (answers[id] ?? "").split(",").filter(Boolean);
    const next = cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v];
    setAnswers(p => ({ ...p, [id]: next.join(",") }));
  };

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

// ── Food detail page ────────────────────────────────────────
function FoodPage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [food, setFood] = useState<FoodDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api.getFood(decodeURIComponent(id))
      .then(f => setFood(f))
      .catch(e => setError(String(e?.message ?? e)));
  }, [id]);

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
      <FoodDetailView food={food} />
      <button onClick={() => nav("/")} className="btn-full" style={{ marginTop: 12 }}>← New search</button>
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

function ScoreHero({ food }: { food: FoodDetail }) {
  const score = food.score;
  const stub = isStubData(food);
  const incomplete = isIncompleteReport(food);
  const color = score == null ? "var(--fog)" : score >= 75 ? "var(--kale)" : score >= 50 ? "var(--amber)" : score >= 25 ? "var(--tangerine)" : "var(--coral)";
  const label = stub ? "Demo data — not real" : incomplete ? "Incomplete analysis" : score == null ? "Score unavailable" : score >= 75 ? "Excellent" : score >= 50 ? "Good" : score >= 25 ? "Mediocre" : "Poor";
  return (
    <div className="card" style={{ textAlign: "center", padding: "28px 16px" }}>
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
      {food.brand && <div className="muted" style={{ fontSize: 14 }}>{food.brand}</div>}
    </div>
  );
}

// ── Food detail with tabs ───────────────────────────────────
function renderMarkdown(md: string): string {
  return md
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/^### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^## (.+)$/gm, '<h3>$1</h3>')
    .replace(/^# (.+)$/gm, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/^(?!<[hla-z])(\S.*)$/gm, '<p>$1</p>')
    .replace(/\n{3,}/g, "\n\n");
}

function FoodDetailView({ food }: { food: FoodDetail }) {
  const [tab, setTab] = useState<"report" | "data" | "log">("report");
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ display: "flex", borderBottom: "1px solid var(--slate)" }}>
        <TabBtn active={tab === "report"} onClick={() => setTab("report")}>Report</TabBtn>
        <TabBtn active={tab === "data"} onClick={() => setTab("data")}>Data</TabBtn>
        <TabBtn active={tab === "log"} onClick={() => setTab("log")}>Log</TabBtn>
      </div>
      <div style={{ padding: "16px 20px", overflow: "hidden" }}>
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
