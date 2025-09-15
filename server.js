// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createProxyMiddleware } from "http-proxy-middleware";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

// Proxy all API requests
app.use(
  "/api",
  createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    xfwd: true,
    logLevel: "warn"
  })
);

// Serve built frontend
const distDir = path.join(__dirname, "dist");
app.use(express.static(distDir));

// Health check
app.get("/healthz", (_req, res) => res.json({ ok: true, frontend: "signal-scale" }));

// Fallback for SPA routing
app.get("*", (_req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[frontend] listening on ${PORT}, proxy -> ${BACKEND_URL}`);
});
