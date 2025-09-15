import React, { useEffect, useState } from "react";
import { analyzeIntelligence } from "../lib/utils";

export default function DynamicDashboard({ brandConfig, onReconfigure }) {
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  const runAnalysis = async () => {
    setStatus("loading");
    setErr("");
    try {
      // brandConfig already shaped to backend model: {brand, competitors[], questions[]}
      const result = await analyzeIntelligence(brandConfig ?? {});
      setData(result);
      setStatus("done");
    } catch (e) {
      setErr(e?.message || "Analysis failed");
      setStatus("error");
    }
  };

  useEffect(() => {
    runAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <header style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 style={{ margin: 0 }}>Signal & Scale — Dashboard</h1>
        <button onClick={onReconfigure} style={{ padding: "6px 10px", cursor: "pointer" }}>
          ← Reconfigure
        </button>
        <button onClick={runAnalysis} style={{ padding: "6px 10px", cursor: "pointer" }}>
          Re-run Analysis
        </button>
      </header>

      <section style={{ background: "#111", color: "#eee", padding: 12, borderRadius: 8 }}>
        <strong>Request</strong>
        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
{JSON.stringify(brandConfig ?? {}, null, 2)}
        </pre>
      </section>

      {status === "loading" && <p>Running analysis…</p>}
      {status === "error" && (
        <p style={{ color: "tomato" }}>
          Error: {err}. Check your backend logs and CORS settings.
        </p>
      )}

      {status === "done" && (
        <>
          <section style={{ background: "#f7f7f7", padding: 12, borderRadius: 8 }}>
            <strong>Response</strong>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
{JSON.stringify(data, null, 2)}
            </pre>
          </section>

          <section style={{ display: "grid", gap: 8 }}>
            <h3>Highlights</h3>
            <div style={{ display: "grid", gap: 8 }}>
              <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
                <div><strong>Mode:</strong> {data?.mode ?? "n/a"}</div>
                <div><strong>Brand:</strong> {data?.brand ?? "n/a"}</div>
                <div><strong>Competitors:</strong> {(data?.competitors || []).join(", ")}</div>
              </div>

              {(data?.summary?.top_trends || data?.outputs?.cultural_radar) && (
                <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
                  <strong>Top Trends</strong>
                  <ul>
                    {(data?.summary?.top_trends || []).map((t, i) => (
                      <li key={i}>{t.name} — {t.momentum} ({t.state})</li>
                    ))}
                  </ul>
                </div>
              )}

              {(data?.summary?.quick_wins || data?.outputs?.competitive_playbook) && (
                <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
                  <strong>Quick Wins</strong>
                  <ul>
                    {(data?.summary?.quick_wins || []).map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
