import React, { useState } from 'react';
import BrandSetup from './components/BrandSetup';
import DynamicDashboard from './components/DynamicDashboard'; // make sure this is the default export
import './App.css';

export default function App() {
  const [brandConfig, setBrandConfig] = useState(null);
  const [currentView, setCurrentView] = useState('setup');

  const handleBrandSetupComplete = (setupData) => {
    setBrandConfig(setupData);
    setCurrentView('dashboard');
  };

  const handleReconfigure = () => {
    setBrandConfig(null);
    setCurrentView('setup');
  };

  return (
    <div className="App">
      {currentView === 'setup' && (
        <BrandSetup onComplete={handleBrandSetupComplete} />
      )}

      {currentView === 'dashboard' && brandConfig && (
        <DynamicDashboard
          brandConfig={brandConfig}
          onReconfigure={handleReconfigure}
        />
      )}
    </div>
  );
}
