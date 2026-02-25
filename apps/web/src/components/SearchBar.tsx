import React, { useState } from "react";

export function SearchBar(props: {
  onSearch: (q: string) => void;
  busy?: boolean;
}) {
  const [q, setQ] = useState("");

  return (
    <div className="card">
      <div style={{ fontWeight: 600, marginBottom: 8 }}>🔍 Text search</div>
      <div className="row">
        <input
          style={{ flex: "1 1 300px" }}
          value={q}
          placeholder="e.g. Cheerios, red onion, Kerrygold butter…"
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && q.trim()) props.onSearch(q.trim());
          }}
        />
        <button
          disabled={props.busy || !q.trim()}
          onClick={() => props.onSearch(q.trim())}
        >
          {props.busy ? "Working…" : "Search"}
        </button>
      </div>
    </div>
  );
}
