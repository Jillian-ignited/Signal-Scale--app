// src/main.jsx (very top)
if (typeof window !== "undefined") {
  // If some old build still tries to hit the dead domain, stop early
  const bad = "signal-scale-backend.onrender.com";
  if (document.documentElement.innerHTML.includes(bad)) {
    // Force a hard reload once to bust caches
    localStorage.setItem("SS_BAD_URL_FLAG", "1");
    console.warn("Old backend URL found in build. Forcing hard reload.");
    location.reload(true);
  } else if (localStorage.getItem("SS_BAD_URL_FLAG") === "1") {
    console.log("Reloaded; clearing flag.");
    localStorage.removeItem("SS_BAD_URL_FLAG");
  }
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
