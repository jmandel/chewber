import React, { useEffect, useState } from "react";
import { api } from "../api";

export function TagBrowser(props: { onPick: (tag: string) => void }) {
  const [tags, setTags] = useState<string[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    api.getTags().then((r) => setTags(r.tags)).catch(() => setTags([]));
  }, []);

  const shown = tags
    .filter((t) => t.toLowerCase().includes(filter.toLowerCase()))
    .slice(0, 50);

  return (
    <div className="card">
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Browse tags</div>
      <input placeholder="Filter tags…" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: "100%" }} />
      <div style={{ marginTop: 10, maxHeight: 200, overflow: "auto" }}>
        {shown.map((t) => (
          <div key={t} style={{ padding: "6px 0", borderBottom: "1px solid #26262b" }}>
            <button style={{ width: "100%", textAlign: "left" }} onClick={() => props.onPick(t)}>
              #{t}
            </button>
          </div>
        ))}
        {!shown.length ? <div className="muted" style={{ marginTop: 8 }}>No tags yet.</div> : null}
      </div>
    </div>
  );
}
