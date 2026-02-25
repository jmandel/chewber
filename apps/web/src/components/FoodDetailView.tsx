import React, { useState } from "react";
import type { FoodDetail } from "../api";

function renderMarkdown(md: string): string {
  // Lightweight MD→HTML: headings, bold, italic, lists, links, paragraphs
  return md
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    // headings
    .replace(/^### (.+)$/gm, '<h4 style="margin:16px 0 6px;font-size:14px">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 style="margin:20px 0 8px;font-size:15px">$1</h3>')
    .replace(/^# (.+)$/gm, '<h2 style="margin:24px 0 10px;font-size:17px">$1</h2>')
    // bold / italic
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // unordered list items
    .replace(/^- (.+)$/gm, '<li style="margin-left:20px;margin-bottom:2px">$1</li>')
    // links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:#60a5fa">$1</a>')
    // line breaks → <br> for non-empty lines that aren't already HTML
    .replace(/^(?!<[hla-z])(\S.*)$/gm, '<p style="margin:4px 0">$1</p>')
    // collapse blank lines
    .replace(/\n{3,}/g, "\n\n");
}

export function FoodDetailView({ food }: { food: FoodDetail }) {
  const [tab, setTab] = useState<"report" | "data">("report");
  const f = food;

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      {/* Tab bar */}
      <div style={{ display: "flex", borderBottom: "1px solid #27272a" }}>
        <TabBtn active={tab === "report"} onClick={() => setTab("report")}>
          Report
        </TabBtn>
        <TabBtn active={tab === "data"} onClick={() => setTab("data")}>
          Data
        </TabBtn>
      </div>

      <div style={{ padding: 20 }}>
        {tab === "report" && (
          f.report_md ? (
            <div
              className="md-body"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(f.report_md) }}
            />
          ) : (
            <div className="muted" style={{ fontSize: 13, padding: 20, textAlign: "center" }}>
              No research report available.
            </div>
          )
        )}

        {tab === "data" && (
          <>
            {f.score_breakdown ? (
              <Section title="Score breakdown">
                <pre className="json-pre">{JSON.stringify(f.score_breakdown, null, 2)}</pre>
              </Section>
            ) : null}
            {f.abstraction ? (
              <Section title="Abstraction (structured)">
                <pre className="json-pre">{JSON.stringify(f.abstraction, null, 2)}</pre>
              </Section>
            ) : null}
            {f.barcode ? <KV label="Barcode" value={f.barcode} /> : null}
            {f.category_path ? <KV label="Category" value={f.category_path} /> : null}
            {f.tags?.length ? <KV label="Tags" value={f.tags.join(", ")} /> : null}
            {f.updated_at ? <KV label="Updated" value={new Date(f.updated_at).toLocaleString()} /> : null}
          </>
        )}
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: "12px 16px",
        fontSize: 14,
        fontWeight: active ? 700 : 400,
        background: active ? "#27272a" : "transparent",
        color: active ? "#e4e4e7" : "#888",
        border: "none",
        borderBottom: active ? "2px solid #3b82f6" : "2px solid transparent",
        borderRadius: 0,
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #1e1e22", fontSize: 13 }}>
      <span className="muted">{label}</span>
      <span>{value}</span>
    </div>
  );
}
