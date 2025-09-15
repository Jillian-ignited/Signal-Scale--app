import React, { useState } from "react";
import BrandSetup from "./components/BrandSetup";
import DynamicDashboard from "./components/DynamicDashboard";
import "./App.css";

export default function App() {
  const [brandConfig, setBrandConfig] = useState(null);

  return (
    <div className="App" style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      {!brandConfig ? (
        <BrandSetup onComplete={(cfg) => setBrandConfig(cfg)} />
      ) : (
        <DynamicDashboard brandConfig={brandConfig} onReconfigure={() => setBrandConfig(null)} />
      )}
    </div>
  );
}
