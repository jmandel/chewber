import React, { useEffect, useRef, useState } from "react";

export function BarcodeScanner(props: { onBarcode: (barcode: string) => void }) {
  const [manualBarcode, setManualBarcode] = useState("");
  const [scanning, setScanning] = useState(false);
  const [detected, setDetected] = useState<string | null>(null);
  const scanningRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  async function startScan() {
    if (!("BarcodeDetector" in window)) {
      alert("BarcodeDetector API not available in this browser. Please type the barcode manually.");
      return;
    }
    setScanning(true);
    setDetected(null);
    scanningRef.current = true;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (!videoRef.current) { stopScan(); return; }
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      const detector = new (window as any).BarcodeDetector({
        formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "code_39", "itf"]
      });

      const tick = async () => {
        if (!videoRef.current || !scanningRef.current) return;
        try {
          const codes = await detector.detect(videoRef.current);
          if (codes?.length) {
            const raw = codes[0].rawValue;
            if (raw) {
              // Draw highlight on canvas
              drawDetection(codes[0]);
              setDetected(raw);
              // Brief pause to show the detection, then fire
              await new Promise(r => setTimeout(r, 400));
              stopScan();
              props.onBarcode(raw);
              return;
            }
          }
        } catch {
          // ignore
        }
        if (scanningRef.current) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    } catch (e: any) {
      stopScan();
      alert("Camera error: " + String(e?.message ?? e));
    }
  }

  function drawDetection(code: any) {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (code.cornerPoints?.length) {
      ctx.strokeStyle = "#00ff88";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(code.cornerPoints[0].x, code.cornerPoints[0].y);
      for (let i = 1; i < code.cornerPoints.length; i++) {
        ctx.lineTo(code.cornerPoints[i].x, code.cornerPoints[i].y);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }

  function stopScan() {
    scanningRef.current = false;
    setScanning(false);
    const v = videoRef.current;
    const stream = v?.srcObject as MediaStream | null;
    if (stream) stream.getTracks().forEach((t) => t.stop());
    if (v) v.srcObject = null;
  }

  useEffect(() => {
    return () => { scanningRef.current = false; stopScan(); };
  }, []);

  return (
    <div className="card">
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Barcode</div>

      {/* Live scanner */}
      {scanning ? (
        <div style={{ position: "relative", marginBottom: 12 }}>
          <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", background: "#000" }}>
            <video
              ref={videoRef}
              style={{ width: "100%", display: "block" }}
              muted
              playsInline
            />
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute", top: 0, left: 0,
                width: "100%", height: "100%",
                pointerEvents: "none"
              }}
            />
            {/* Scan reticle overlay */}
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: "70%", height: 120,
              border: detected ? "3px solid #00ff88" : "2px solid rgba(255,255,255,0.5)",
              borderRadius: 12,
              boxShadow: detected ? "0 0 20px rgba(0,255,136,0.4)" : "none",
              transition: "all 0.2s ease",
              pointerEvents: "none"
            }} />
          </div>

          {detected ? (
            <div style={{
              marginTop: 8, padding: "8px 12px",
              background: "#0a2f1a", border: "1px solid #00ff88",
              borderRadius: 8, fontWeight: 700,
              color: "#00ff88", textAlign: "center"
            }}>
              ✓ {detected}
            </div>
          ) : (
            <div className="muted" style={{ marginTop: 8, fontSize: 12, textAlign: "center" }}>
              Point camera at a barcode — it will scan automatically
            </div>
          )}

          <button
            onClick={stopScan}
            style={{ marginTop: 8, width: "100%" }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={startScan}
            style={{
              width: "100%", padding: "12px 16px",
              fontSize: 16, fontWeight: 700,
              marginBottom: 12
            }}
          >
            📷 Scan barcode with camera
          </button>

          <div className="row">
            <input
              value={manualBarcode}
              placeholder="Or type barcode (EAN/UPC)"
              onChange={(e) => setManualBarcode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && manualBarcode.trim()) {
                  props.onBarcode(manualBarcode.trim());
                }
              }}
              style={{ flex: "1 1 260px" }}
            />
            <button
              disabled={!manualBarcode.trim()}
              onClick={() => props.onBarcode(manualBarcode.trim())}
            >
              Lookup
            </button>
          </div>
        </>
      )}
    </div>
  );
}
