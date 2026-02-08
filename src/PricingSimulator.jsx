import React from 'react';
import { SimulatorProvider, useSimulator } from './context/SimulatorContext';
import HistoricalDataTab from './components/tabs/HistoricalDataTab';
import CustomInputTab from './components/tabs/CustomInputTab';
import ABTestingTab from './components/tabs/ABTestingTab';
import PortfolioAnalysisTab from './components/tabs/PortfolioAnalysisTab';

function TabButton({ id, label, activeTab, setActiveTab }) {
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 font-semibold transition-colors ${
        activeTab === id
          ? 'text-blue-400 border-b-2 border-blue-400'
          : 'text-slate-400 hover:text-slate-200'
      }`}
    >
      {label}
    </button>
  );
}

function SimulatorContent() {
  const { activeTab, setActiveTab } = useSimulator();

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Bundle Pricing Decision Support Tool</h1>
        <p className="text-slate-400 mb-6">Simulate price changes with upgrade &amp; downgrade migration modeling</p>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-slate-700">
          <TabButton id="historical" label="Single Category Analysis" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton id="custom" label="Custom Input" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton id="abtest" label="A/B Testing" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton id="portfolio" label="Portfolio Analysis" activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Tab Content */}
        {activeTab === 'custom' && <CustomInputTab />}
        {activeTab === 'abtest' && <ABTestingTab />}
        {activeTab === 'portfolio' && <PortfolioAnalysisTab />}

        {/* Historical tab renders its own conditional sections */}
        <HistoricalDataTab />
      </div>
    </div>
  );
}

export default function PricingSimulator() {
  return (
    <SimulatorProvider>
      <SimulatorContent />
    </SimulatorProvider>
  );
}
