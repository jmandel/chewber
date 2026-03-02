import React, { useState, useCallback, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { type AssistResponse, type FoodSummary, type PriorAnswer } from "../api";
import { useFlowStore, useSearchStore } from "../stores";
import { usePrefetch } from "../hooks/usePrefetch";
import { useRecentFoods, useTopRated, useCategories } from "../hooks/useStoreData";
import { FoodListItem, BackLink, CategoryChip } from "../components/shared";

export function PickScreen() {
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

// ── Text search (store-driven) ──────────────────────────────
export function TextStep() {
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
export function BarcodeStep() {
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

export function PhotoStep() {
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
export function ClarifyStep(props: {
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

