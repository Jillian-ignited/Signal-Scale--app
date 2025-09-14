import React, { useState } from 'react';
import BrandSetup from './components/BrandSetup';
import Dashboard from './components/DynamicDashboard';
import './App.css';

function App() {
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
        <Dashboard 
          brandConfig={brandConfig} 
          onReconfigure={handleReconfigure}
        />
      )}
    </div>
  );
}

export default App;

