// src/lib/utils.js
const API_URL = import.meta.env.VITE_API_URL;

export async function postJSON(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

// Example wrappers:
export const runDynamicAnalysis = (payload) =>
  postJSON("/api/intelligence/analyze", payload);

export const runCulturalRadar = (payload) =>
  postJSON("/api/run/cultural_radar", payload);
