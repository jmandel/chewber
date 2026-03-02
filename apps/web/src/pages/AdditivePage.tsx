import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePrefetch } from "../hooks/usePrefetch";
import { useAdditiveDetail, useAdditiveFoods } from "../hooks/useStoreData";
import { PrefetchLink, ScorePill, BackLink, ADDITIVE_RISK_STYLES, renderMarkdown } from "../components/shared";

export function AdditivePage() {
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

