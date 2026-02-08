import React from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import { downloadTemplate, handleCSVUpload } from '../../utils/csvHandlers';

export default function CustomInputTab() {
  const {
    currentScenarioName, setCurrentScenarioName,
    editingBundles, setEditingBundles,
    newBundleName, setNewBundleName,
    newBundleCPL, setNewBundleCPL,
    newBundleListings, setNewBundleListings,
    customScenarios,
    addBundle, removeBundle, saveCustomScenario,
    loadScenarioForEdit, deleteScenario,
  } = useSimulator();

  return (
    <div className="bg-slate-800 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Create Custom Scenario</h2>

      {/* Scenario Name */}
      <div className="mb-4">
        <label className="block text-sm text-slate-400 mb-2">Scenario Name</label>
        <input
          type="text"
          value={currentScenarioName}
          onChange={(e) => setCurrentScenarioName(e.target.value)}
          placeholder="e.g., Q1 2026 Projections"
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
        />
      </div>

      {/* CSV Upload/Download */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={downloadTemplate}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
        >
          Download CSV Template
        </button>
        <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm cursor-pointer transition-colors">
          Upload CSV
          <input
            type="file"
            accept=".csv"
            onChange={(e) => handleCSVUpload(e, setEditingBundles)}
            className="hidden"
          />
        </label>
      </div>

      {/* Manual Bundle Input */}
      <div className="bg-slate-700 rounded-lg p-4 mb-4">
        <h3 className="text-sm font-semibold mb-3 text-slate-300">Add Bundle Manually</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            value={newBundleName}
            onChange={(e) => setNewBundleName(e.target.value)}
            placeholder="Bundle Name (e.g., Plus)"
            className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white text-sm"
          />
          <input
            type="number"
            step="0.01"
            value={newBundleCPL}
            onChange={(e) => setNewBundleCPL(e.target.value)}
            placeholder="CPL (e.g., 15.00)"
            className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white text-sm"
          />
          <input
            type="number"
            value={newBundleListings}
            onChange={(e) => setNewBundleListings(e.target.value)}
            placeholder="Listings (e.g., 500)"
            className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white text-sm"
          />
          <button
            onClick={addBundle}
            className="bg-emerald-600 hover:bg-emerald-700 rounded px-4 py-2 text-sm font-semibold transition-colors"
          >
            Add Bundle
          </button>
        </div>
      </div>

      {/* Bundle List */}
      {editingBundles.length > 0 && (
        <div className="bg-slate-700 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-semibold mb-3 text-slate-300">Current Bundles ({editingBundles.length})</h3>
          <div className="space-y-2">
            {editingBundles.map((bundle, index) => (
              <div key={index} className="flex items-center justify-between bg-slate-600 rounded px-3 py-2">
                <div className="flex gap-4 text-sm">
                  <span className="font-semibold text-white">{bundle.name}</span>
                  <span className="text-slate-300">CPL: {bundle.cpl.toFixed(2)} KD</span>
                  <span className="text-slate-300">Listings: {bundle.listings}</span>
                  <span className="text-slate-400">Revenue: {(bundle.cpl * bundle.listings).toFixed(0)} KD</span>
                </div>
                <button
                  onClick={() => removeBundle(index)}
                  className="text-red-400 hover:text-red-300 text-sm font-semibold"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex gap-3">
        <button
          onClick={saveCustomScenario}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
        >
          Save Scenario
        </button>
        <button
          onClick={() => {
            setEditingBundles([]);
            setCurrentScenarioName('');
          }}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Saved Scenarios */}
      {Object.keys(customScenarios).length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-700">
          <h3 className="text-lg font-semibold mb-3">Saved Scenarios</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.keys(customScenarios).map(scenarioName => (
              <div key={scenarioName} className="bg-slate-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{scenarioName}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => loadScenarioForEdit(scenarioName)}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteScenario(scenarioName)}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  {Object.keys(customScenarios[scenarioName]).length} bundles
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
