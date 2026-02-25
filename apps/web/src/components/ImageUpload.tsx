import React, { useState } from "react";
import { API_BASE } from "../api";

export function ImageUpload(props: {
  onUploaded: (imageIds: string[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [imageIds, setImageIds] = useState<string[]>([]);

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      const form = new FormData();
      for (const f of Array.from(files)) form.append("images", f);

      const res = await fetch(API_BASE + "/api/upload", {
        method: "POST",
        body: form
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      const ids: string[] = json.image_ids ?? [];
      setImageIds((prev) => [...prev, ...ids]);
      props.onUploaded([...imageIds, ...ids]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Photo input</div>
      <div className="row">
        <input
          type="file"
          accept="image/*"
          multiple
          capture="environment"
          disabled={busy}
          onChange={(e) => upload(e.target.files)}
        />
        {busy ? <span className="muted">Uploading…</span> : null}
      </div>
      {imageIds.length ? (
        <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
          Uploaded images: {imageIds.length}
        </div>
      ) : (
        <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
          Upload photos of the front label, nutrition facts, and ingredients list for better results.
        </div>
      )}
    </div>
  );
}
