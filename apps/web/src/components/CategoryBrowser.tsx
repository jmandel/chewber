import React, { useEffect, useState } from "react";
import { api } from "../api";

export function CategoryBrowser(props: { onPick: (category: string) => void }) {
  const [categories, setCategories] = useState<string[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    api.getCategories().then((r) => setCategories(r.categories)).catch(() => setCategories([]));
  }, []);

  const shown = categories
    .filter((c) => c.toLowerCase().includes(filter.toLowerCase()))
    .slice(0, 50);

  return (
    <div className="card">
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Browse categories</div>
      <input placeholder="Filter categories…" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: "100%" }} />
      <div style={{ marginTop: 10, maxHeight: 240, overflow: "auto" }}>
        {shown.map((c) => (
          <div key={c} style={{ padding: "6px 0", borderBottom: "1px solid #26262b" }}>
            <button style={{ width: "100%", textAlign: "left" }} onClick={() => props.onPick(c)}>
              {c}
            </button>
          </div>
        ))}
        {!shown.length ? <div className="muted" style={{ marginTop: 8 }}>No categories yet.</div> : null}
      </div>
    </div>
  );
}
