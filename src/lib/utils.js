// src/lib/utils.js
const ENV = import.meta.env?.VITE_API_URL;
const FALLBACK = "https://signal-scale.onrender.com";
export const API_URL = (ENV || FALLBACK).replace(/\/+$/, "");

async function request(path, method = "GET", body) {
  const url = `${API_URL}${path}`;
  console.log("[Signal&Scale] →", method, url, body);
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : null,
  });
  if (!res.ok) {
    let msg = res.statusText;
    try { msg = await res.text(); } catch {}
    throw new Error(`API request failed: ${res.status} ${msg}`);
  }
  return res.json();
}

export const analyze = (payload = {}) =>
  request("/api/intelligence/analyze", "POST", payload);
