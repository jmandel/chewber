import React, { useState, useRef, useEffect } from "react";
import { Routes, Route, useNavigate, useNavigationType, useLocation, Link } from "react-router-dom";
import { useFlowStore, useUIStore, useQueueStore } from "./stores";
import { FocusCard } from "./components/shared";
import { PickScreen, TextStep, BarcodeStep, PhotoStep, ClarifyStep } from "./pages/PickScreen";
import { QueuePage, JobPage } from "./pages/QueuePage";
import { FoodPage } from "./pages/FoodPage";
import { AdditivesListPage } from "./pages/AdditivesListPage";
import { AdditivePage } from "./pages/AdditivePage";
import { CategoriesPage, CategoryPage } from "./pages/CategoriesPage";
import { ComparePage } from "./pages/ComparePage";

// ── Flow overlay ──────────────────────────────────────────────
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

// ── About overlay ─────────────────────────────────────────────
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

// ── Queue indicator ───────────────────────────────────────────
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

// ── Header ────────────────────────────────────────────────────
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

// ── App shell ─────────────────────────────────────────────────
export function App() {
  const flow = useFlowStore(s => s.flow);
  const setFlow = useFlowStore(s => s.setFlow);
  const setNavigate = useFlowStore(s => s.setNavigate);
  const submitClarification = useFlowStore(s => s.submitClarification);
  const skipClarification = useFlowStore(s => s.skipClarification);
  const location = useLocation();
  const navType = useNavigationType();
  const nav = useNavigate();

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
