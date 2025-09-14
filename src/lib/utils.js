// src/lib/utils.js
const ENV = import.meta.env?.VITE_API_URL;
const FALLBACK = "https://signal-scale.onrender.com"; // correct backend
export const API_URL = (ENV || FALLBACK).replace(/\/+$/, "");

async function request(path, method = "GET", body) {
  const url = `${API_URL}${path}`;
  console.log("[Signal&Scale] →", method, url);
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : null,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text().catch(()=>res.statusText)}`);
  return res.json();
}

export const analyze = (payload) => request("/api/intelligence/analyze", "POST", payload);
export const runCulturalRadar = (payload) => request("/api/run/cultural_radar", "POST", payload);
export const runCompetitivePlaybook = (payload) => request("/api/run/competitive_playbook", "POST", payload);
