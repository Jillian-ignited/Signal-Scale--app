// src/lib/utils.js
const ENV = import.meta.env?.VITE_API_URL;
const FALLBACK = "https://signal-scale.onrender.com";
export const API_URL = (ENV || FALLBACK).replace(/\/+$/, "");

async function request(path, method = "GET", body) {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : null,
  });
  // If server returns non-JSON (e.g., 422 HTML), throw a clean error
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch {}
  if (!res.ok) {
    const msg = json?.detail || json?.message || text || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return json ?? text;
}

export const analyze = (payload) =>
  request("/api/intelligence/analyze", "POST", payload);

// Export helpers
export async function exportReport(data, format = "md") {
  const url = `${API_URL}/api/export/report?format=${encodeURIComponent(format)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, format }),
  });
  if (!res.ok) throw new Error(`Export failed: ${await res.text()}`);

  // Decide filename & blob type based on Content-Type
  const ct = res.headers.get("content-type") || "";
  const blob = await res.blob();
  const a = document.createElement("a");
  const downloadName =
    (res.headers.get("content-disposition") || "").match(/filename="([^"]+)"/)?.[1] ||
    `signal_scale_report.${format}`;
  a.href = URL.createObjectURL(blob);
  a.download = downloadName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}
