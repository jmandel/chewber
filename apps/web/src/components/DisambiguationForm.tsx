import React, { useMemo, useState } from "react";
import type { HelperQuestion, StructuredFoodQuery } from "../api";

export function DisambiguationForm(props: {
  structured: StructuredFoodQuery;
  questions: HelperQuestion[];
  onSubmit: (merged: StructuredFoodQuery) => void;
}) {
  const initial = useMemo(() => ({} as Record<string, string>), []);
  const [answers, setAnswers] = useState<Record<string, string>>(initial);

  function set(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  const QUERY_FIELDS = new Set(["variant", "isOrganic", "kind", "expectedCategory", "brand", "country", "language", "notes"]);

  function submit() {
    const merged: StructuredFoodQuery = { ...props.structured };
    for (const q of props.questions) {
      const v = answers[q.id];
      if (!v) continue;
      const field = q.field;
      if (field && QUERY_FIELDS.has(field)) {
        (merged as any)[field] = v;
      } else {
        merged.notes = ((merged.notes ?? "") + `\n${q.id}: ${v}`).trim();
      }
    }
    props.onSubmit(merged);
  }

  return (
    <div className="card">
      <div style={{ fontWeight: 700, marginBottom: 6 }}>A couple quick questions</div>
      <div className="muted" style={{ fontSize: 12 }}>
        Chewber asks only when needed to create a precise query.
      </div>

      <div style={{ marginTop: 12 }}>
        {props.questions.map((q) => (
          <div key={q.id} style={{ marginBottom: 10 }}>
            <div style={{ fontWeight: 600 }}>{q.question}</div>
            {q.reason ? <div className="muted" style={{ fontSize: 12 }}>{q.reason}</div> : null}

            {q.type === "select" ? (
              <select value={answers[q.id] ?? ""} onChange={(e) => set(q.id, e.target.value)} style={{ width: "100%", marginTop: 6 }}>
                <option value="" disabled>
                  Select…
                </option>
                {q.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : null}

            {q.type === "yesno" ? (
              <select value={answers[q.id] ?? ""} onChange={(e) => set(q.id, e.target.value)} style={{ width: "100%", marginTop: 6 }}>
                <option value="" disabled>
                  Select…
                </option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="unknown">Not sure</option>
              </select>
            ) : null}
          </div>
        ))}
      </div>

      <div className="row" style={{ marginTop: 8 }}>
        <button onClick={submit}>Continue</button>
      </div>
    </div>
  );
}
