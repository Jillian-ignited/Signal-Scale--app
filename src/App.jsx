import React, { useState } from "react";

export default function App() {
  const [brandName, setBrandName] = useState("Crooks & Castles");
  const [brandUrl, setBrandUrl] = useState("");
  const [competitors, setCompetitors] = useState(
    "Ed Hardy | https://edhardyoriginals.com\nAffliction | https://www.afflictionclothing.com\nHellstar"
  );
  const [result, setResult] = useState("No results yet.");

  const buildPayload = () => {
    const comps = competitors
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, url] = line.split("|").map((s) => (s || "").trim());
        return { name: name || null, url: url || null };
      });

    return { brand: { name: brandName || null, url: brandUrl || null, meta: null }, competitors: comps };
  };

  const callApi = async (path, payload, expectBlob = false) => {
    const url = path.startsWith("/api") ? path : `/api${path}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (expectBlob) {
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`API ${res.status} ${res.statusText}: ${t || "[no body]"}`);
      }
      return await res.blob();
    }

    const raw = await res.text().catch(() => "");
    let data = null;
    try { data = raw ? JSON.parse(raw) : null; } catch { /* non-JSON */ }
    if (!res.ok) throw new Error(`API ${res.status} ${res.statusText}: ${data ? JSON.stringify(data) : (raw || "[no body]")}`);
    return data ?? { ok: true, notice: "Empty JSON body returned." };
  };

  const analyze = async () => {
    const payload = buildPayload();
    setResult(JSON.stringify({ status: "sending", payload }, null, 2));
    try {
      const data = await callApi("/api/intelligence/analyze", payload);
      setResult(JSON.stringify(data, null, 2));
    } catch (e) {
      setResult(`❌ ${e.message}`);
    }
  };

  const exportCsv = async () => {
    const payload = buildPayload();
    setResult(JSON.stringify({ status: "exporting", payload }, null, 2));
    try {
      const blob = await callApi("/api/intelligence/export", payload, true);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "signal_scale_export.csv";
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
      setResult(JSON.stringify({ ok: true, message: "CSV downloaded." }, null, 2));
    } catch (e) { setResult(`❌ ${e.message}`); }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Signal & Scale — Competitive Intelligence</h1>
      <p className="text-sm text-zinc-600 mb-4">Proxying <code>/api</code> to your backend. No CORS.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <label className="block">
            <span className="font-medium">Brand Name</span>
            <input className="mt-1 w-full border rounded p-2" value={brandName} onChange={(e) => setBrandName(e.target.value)} />
          </label>

          <label className="block">
            <span className="font-medium">Brand URL (optional)</span>
            <input className="mt-1 w-full border rounded p-2" value={brandUrl} onChange={(e) => setBrandUrl(e.target.value)} />
          </label>

          <label className="block">
            <span className="font-medium">Competitors (one per line; use “Name | URL”)</span>
            <textarea className="mt-1 w-full border rounded p-2 h-40" value={competitors} onChange={(e) => setCompetitors(e.target.value)} />
          </label>

          <div className="flex gap-2">
            <button onClick={analyze} className="px-3 py-2 rounded bg-black text-white">Analyze</button>
            <button onClick={exportCsv} className="px-3 py-2 rounded border">Export CSV</button>
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Result</label>
          <pre className="bg-zinc-100 p-3 rounded min-h-[240px] whitespace-pre-wrap">{result}</pre>
        </div>
      </div>
    </div>
  );
}
