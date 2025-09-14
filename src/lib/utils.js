// src/lib/utils.js
import { API_URL } from "./apiBase";

export async function postJSON(path, body) {
  const url = `${API_URL.replace(/\/+$/, "")}${path}`;
  console.log("[Signal&Scale] POST", url);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

export const runDynamicAnalysis = (payload) =>
  postJSON("/api/intelligence/analyze", payload);
