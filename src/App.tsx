import React from 'react';
import { TaxDataProvider } from './context/TaxDataContext';
import GlobeVisualization from './components/GlobeVisualization';

function App() {
  return (
    <TaxDataProvider>
      <div className="w-full h-screen overflow-hidden">
        <GlobeVisualization />
      </div>
    </TaxDataProvider>
  );
}

export default App;
