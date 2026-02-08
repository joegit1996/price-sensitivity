import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useSimulator } from '../../context/SimulatorContext';
import { BUNDLE_TIER_ORDER } from '../../data/bundleTiers';
import { downloadHistoricalTemplate, downloadAddOnTemplate, handleHistoricalCSVUpload, handleAddOnCSVUpload, exportHistoricalData, exportAddOnData, resetHistoricalData, resetAddOnData } from '../../utils/csvHandlers';

export default function HistoricalDataTab() {
  const {
    historicalData, setHistoricalData,
    addOnData, setAddOnData, addOnLossRates, setAddOnLossRates,
    activeTab,
    categories, hasData, categoryData, availableBundles,
    selectedCategory, setSelectedCategory,
    selectedBundle, setSelectedBundle,
    bundleData,
    higherBundles, lowerBundles, isTopTier, isBottomTier,
    priceChange, setPriceChange,
    churnRate, setChurnRate,
    downgradeRates, setDowngradeRates,
    upgradeRates, setUpgradeRates,
    fixedKDLoss, setFixedKDLoss,
    showCalculations, setShowCalculations,
    totalDowngradeRate, totalUpgradeRate,
    categoryTotals,
    isMultiBundleMode, setIsMultiBundleMode,
    selectedBundles, setSelectedBundles,
    bundlePriceChanges, setBundlePriceChanges,
    bundleChurnRates, setBundleChurnRates,
    bundleDowngradeRates, setBundleDowngradeRates,
    bundleUpgradeRates, setBundleUpgradeRates,
    results, multiBundleResults,
    waterfallData, sensitivityData,
    bundleRevenueShare, bundleListingsShare,
    customScenarios,
  } = useSimulator();

  return (
    <>
      {/* Historical Data Tab - Data Management */}
      {activeTab === 'historical' && (
        <div className="bg-slate-800 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-300">Data Source</h3>
              <p className="text-xs text-slate-500">
                {Object.keys(historicalData).length} categories, {' '}
                {Object.values(historicalData).reduce((sum, cat) => sum + Object.keys(cat).length, 0)} bundles
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={downloadHistoricalTemplate}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs transition-colors"
              >
                Download Template
              </button>
              <button
                onClick={() => exportHistoricalData(historicalData)}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs transition-colors"
              >
                Export Current Data
              </button>
              <label className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-xs cursor-pointer transition-colors">
                Upload CSV
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleHistoricalCSVUpload(e, { setHistoricalData, selectedCategory, setSelectedCategory, setSelectedBundle })}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => resetHistoricalData({ setHistoricalData, setSelectedCategory, setSelectedBundle })}
                className="px-3 py-1.5 bg-red-600/50 hover:bg-red-600 rounded text-xs transition-colors"
              >
                Reset to Default
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add-On Revenue Data Management (Optional) */}
      {activeTab === 'historical' && (
        <div className="bg-slate-800 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-300">Add-On Revenue Data <span className="text-xs text-slate-500">(Optional)</span></h3>
              <p className="text-xs text-slate-500">
                {Object.keys(addOnData).length} categories with add-on data
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={downloadAddOnTemplate}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs transition-colors"
              >
                Download Template
              </button>
              <button
                onClick={() => exportAddOnData(addOnData)}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs transition-colors"
              >
                Export Current Data
              </button>
              <label className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded text-xs cursor-pointer transition-colors">
                Upload Add-On CSV
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleAddOnCSVUpload(e, setAddOnData)}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => resetAddOnData(setAddOnData)}
                className="px-3 py-1.5 bg-red-600/50 hover:bg-red-600 rounded text-xs transition-colors"
              >
                Reset to Default
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Section (visible when there's data to analyze) */}
      {((activeTab === 'historical') || (activeTab === 'custom' && Object.keys(customScenarios).length > 0)) && (
        <>
        {/* Category and Bundle Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800 rounded-lg p-4">
            <label className="block text-sm text-slate-400 mb-2">Select Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                const newBundles = Object.keys(bundleData[e.target.value] || {});
                if (!newBundles.includes(selectedBundle)) {
                  setSelectedBundle(newBundles.includes('Plus') ? 'Plus' : newBundles[0]);
                }
              }}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm text-slate-400">Pricing Mode</label>
              <button
                onClick={() => setIsMultiBundleMode(!isMultiBundleMode)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isMultiBundleMode
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {isMultiBundleMode ? 'Multi-Bundle Mode' : 'Single Bundle Mode'}
              </button>
            </div>

            {!isMultiBundleMode ? (
              <div>
                <label className="block text-sm text-slate-400 mb-2">Select Bundle to Analyze</label>
                <select
                  value={selectedBundle}
                  onChange={(e) => setSelectedBundle(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                >
                  {BUNDLE_TIER_ORDER.filter(b => availableBundles.includes(b)).map(bundle => (
                    <option key={bundle} value={bundle}>
                      {bundle} ({categoryData[bundle]?.avgCPL.toFixed(2)} KD/listing)
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm text-slate-400 mb-2">Select Bundles to Modify</label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {BUNDLE_TIER_ORDER.filter(b => availableBundles.includes(b)).map(bundle => (
                    <label key={bundle} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBundles[bundle] || false}
                        onChange={(e) => {
                          setSelectedBundles({
                            ...selectedBundles,
                            [bundle]: e.target.checked
                          });
                          // Initialize default values if selecting for first time
                          if (e.target.checked) {
                            if (!bundlePriceChanges[bundle]) {
                              setBundlePriceChanges({ ...bundlePriceChanges, [bundle]: 0 });
                            }
                            if (!bundleChurnRates[bundle]) {
                              setBundleChurnRates({ ...bundleChurnRates, [bundle]: 10 });
                            }
                          }
                        }}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-purple-600"
                      />
                      <span className="flex-1 text-sm text-white">
                        {bundle}
                        <span className="text-xs text-slate-400 ml-2">
                          ({categoryData[bundle]?.avgCPL.toFixed(2)} KD, {categoryData[bundle]?.totalListings} listings)
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  {Object.values(selectedBundles).filter(Boolean).length} bundle(s) selected
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bundle Position Indicator */}
        <div className="bg-slate-800 rounded-lg p-4 mb-6">
          <div className="text-sm text-slate-400 mb-3">
            {isMultiBundleMode ? 'Selected Bundles' : 'Bundle Tier Position'} for {selectedCategory}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {BUNDLE_TIER_ORDER.filter(b => availableBundles.includes(b)).map((bundle, i) => (
              <div
                key={bundle}
                className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                  isMultiBundleMode
                    ? selectedBundles[bundle]
                      ? 'bg-purple-600 text-white font-semibold'
                      : 'bg-slate-700 text-slate-400'
                    : bundle === selectedBundle
                    ? 'bg-blue-600 text-white font-semibold'
                    : higherBundles.includes(bundle)
                    ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700'
                    : lowerBundles.includes(bundle)
                    ? 'bg-amber-900/50 text-amber-400 border border-amber-700'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                {bundle}
                <span className="text-xs ml-1 opacity-70">
                  {categoryData[bundle]?.avgCPL.toFixed(0)} KD
                </span>
              </div>
            ))}
          </div>
          {!isMultiBundleMode && (
            <div className="flex gap-4 mt-2 text-xs">
              <span className="text-emerald-400">↑ Upgrade options</span>
              <span className="text-blue-400">● Selected</span>
              <span className="text-amber-400">↓ Downgrade options</span>
            </div>
          )}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-slate-800 rounded-lg p-3">
            <div className="text-slate-400 text-xs">Category Revenue</div>
            <div className="text-xl font-bold text-emerald-400">{categoryTotals.totalRevenue.toLocaleString()} KD</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-3">
            <div className="text-slate-400 text-xs">{selectedBundle} Revenue Share</div>
            <div className="text-xl font-bold text-blue-400">{bundleRevenueShare}%</div>
            <div className="text-xs text-slate-500">from {bundleListingsShare}% listings</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-3">
            <div className="text-slate-400 text-xs">Current CPL</div>
            <div className="text-xl font-bold text-purple-400">{results.currentCPL.toFixed(2)} KD</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-3">
            <div className="text-slate-400 text-xs">{selectedBundle} Listings</div>
            <div className="text-xl font-bold text-orange-400">{results.currentListings.toLocaleString()}</div>
          </div>
        </div>

        {/* Bundle Distribution Table */}
        <div className="bg-slate-800 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Bundle Distribution in {selectedCategory}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 px-3 text-slate-400 font-semibold">Bundle</th>
                  <th className="text-right py-2 px-3 text-slate-400 font-semibold">CPL</th>
                  <th className="text-right py-2 px-3 text-slate-400 font-semibold">Listings</th>
                  <th className="text-right py-2 px-3 text-slate-400 font-semibold">CPL Rev</th>
                  <th className="text-right py-2 px-3 text-slate-400 font-semibold">Add-On Rev</th>
                  <th className="text-right py-2 px-3 text-slate-400 font-semibold">Total Rev</th>
                  <th className="text-right py-2 px-3 text-slate-400 font-semibold">Total %</th>
                </tr>
              </thead>
              <tbody>
                {BUNDLE_TIER_ORDER.filter(bundle => availableBundles.includes(bundle)).map(bundle => {
                  const bundleInfo = categoryData[bundle];
                  const addOnRevenue = addOnData[selectedCategory]?.[bundle] || 0;
                  const totalBundleRevenue = bundleInfo.totalRevenue + addOnRevenue;

                  // Calculate category totals including add-ons
                  const categoryTotalWithAddOns = categoryTotals.totalRevenue +
                    Object.entries(addOnData[selectedCategory] || {}).reduce((sum, [b, rev]) => sum + rev, 0);

                  const revenuePct = ((totalBundleRevenue / categoryTotalWithAddOns) * 100).toFixed(1);
                  const isSelected = bundle === selectedBundle;

                  return (
                    <tr
                      key={bundle}
                      className={`border-b border-slate-700/50 ${isSelected ? 'bg-blue-900/20' : 'hover:bg-slate-700/30'}`}
                    >
                      <td className="py-2 px-3">
                        <span className={`font-semibold ${isSelected ? 'text-blue-400' : 'text-white'}`}>
                          {bundle} {isSelected && '●'}
                        </span>
                      </td>
                      <td className="text-right py-2 px-3 text-purple-400 font-mono">
                        {bundleInfo.avgCPL.toFixed(2)} KD
                      </td>
                      <td className="text-right py-2 px-3 text-orange-400 font-mono">
                        {bundleInfo.totalListings.toLocaleString()}
                      </td>
                      <td className="text-right py-2 px-3 text-emerald-400 font-mono">
                        {bundleInfo.totalRevenue.toLocaleString()} KD
                      </td>
                      <td className="text-right py-2 px-3 text-purple-300 font-mono">
                        {addOnRevenue > 0 ? `${addOnRevenue.toLocaleString()} KD` : '—'}
                      </td>
                      <td className="text-right py-2 px-3 text-cyan-400 font-mono font-semibold">
                        {totalBundleRevenue.toLocaleString()} KD
                      </td>
                      <td className="text-right py-2 px-3">
                        <div className="flex items-center justify-end gap-2">
                          <div className="flex-1 max-w-[80px] h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-cyan-500"
                              style={{ width: `${revenuePct}%` }}
                            />
                          </div>
                          <span className="text-slate-300 font-mono w-12">{revenuePct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-600 font-semibold">
                  <td className="py-2 px-3 text-slate-300">Total</td>
                  <td className="text-right py-2 px-3 text-slate-500">—</td>
                  <td className="text-right py-2 px-3 text-orange-400 font-mono">
                    {categoryTotals.totalListings.toLocaleString()}
                  </td>
                  <td className="text-right py-2 px-3 text-emerald-400 font-mono">
                    {categoryTotals.totalRevenue.toLocaleString()} KD
                  </td>
                  <td className="text-right py-2 px-3 text-purple-300 font-mono">
                    {Object.entries(addOnData[selectedCategory] || {}).reduce((sum, [b, rev]) => sum + rev, 0).toLocaleString()} KD
                  </td>
                  <td className="text-right py-2 px-3 text-cyan-400 font-mono">
                    {(categoryTotals.totalRevenue + Object.entries(addOnData[selectedCategory] || {}).reduce((sum, [b, rev]) => sum + rev, 0)).toLocaleString()} KD
                  </td>
                  <td className="text-right py-2 px-3 text-slate-300 font-mono">100.0%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {/* Controls */}
          <div className="bg-slate-800 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">
              {isMultiBundleMode ? 'Multi-Bundle Controls' : 'Scenario Controls'}
            </h2>

            {!isMultiBundleMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Price Change: <span className="text-emerald-400 font-bold">{priceChange > 0 ? '+' : ''}{priceChange}%</span>
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="range"
                    min="-100"
                    max="500"
                    step="0.1"
                    value={priceChange}
                    onChange={(e) => setPriceChange(Number(e.target.value))}
                    className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="number"
                    min="-100"
                    max="500"
                    step="0.1"
                    value={priceChange}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPriceChange(Math.max(-100, Math.min(500, val)));
                    }}
                    className="w-20 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                  />
                </div>
                <div className="text-xs text-slate-500">New CPL: {results.newCPL.toFixed(2)} KD</div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Churn Rate: <span className="text-red-400 font-bold">{churnRate}%</span>
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={churnRate}
                    onChange={(e) => setChurnRate(Number(e.target.value))}
                    className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={churnRate}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setChurnRate(Math.max(0, Math.min(100, val)));
                    }}
                    className="w-20 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                  />
                </div>
                <div className="text-xs text-slate-500">Leave entirely: {Math.round(results.churnedListings)} listings</div>
              </div>

              {/* Downgrade Rates - Multiple Bundles */}
              {!isBottomTier && (
                <div className="border-t border-slate-700 pt-3">
                  <label className="block text-sm text-slate-400 mb-2">
                    Downgrade Distribution: <span className="text-amber-400 font-bold">{totalDowngradeRate}% total</span>
                  </label>
                  <div className="space-y-2">
                    {lowerBundles.map(bundle => (
                      <div key={bundle} className="bg-slate-700/30 rounded p-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-amber-400">{bundle}</span>
                          <span className="text-xs text-slate-400">
                            {downgradeRates[bundle] || 0}% → {categoryData[bundle]?.avgCPL.toFixed(2)} KD
                          </span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="0.1"
                            value={downgradeRates[bundle] || 0}
                            onChange={(e) => setDowngradeRates({
                              ...downgradeRates,
                              [bundle]: Number(e.target.value)
                            })}
                            className="flex-1 h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                          />
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={downgradeRates[bundle] || 0}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setDowngradeRates({
                                ...downgradeRates,
                                [bundle]: Math.max(0, Math.min(100, val))
                              });
                            }}
                            className="w-16 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upgrade Rates - Multiple Bundles */}
              {!isTopTier && (
                <div className="border-t border-slate-700 pt-3">
                  <label className="block text-sm text-slate-400 mb-2">
                    Upgrade Distribution: <span className="text-blue-400 font-bold">{totalUpgradeRate}% total</span>
                  </label>
                  <div className="space-y-2">
                    {higherBundles.map(bundle => (
                      <div key={bundle} className="bg-slate-700/30 rounded p-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-blue-400">{bundle}</span>
                          <span className="text-xs text-slate-400">
                            {upgradeRates[bundle] || 0}% → {categoryData[bundle]?.avgCPL.toFixed(2)} KD
                          </span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="0.1"
                            value={upgradeRates[bundle] || 0}
                            onChange={(e) => setUpgradeRates({
                              ...upgradeRates,
                              [bundle]: Number(e.target.value)
                            })}
                            className="flex-1 h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                          />
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={upgradeRates[bundle] || 0}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setUpgradeRates({
                                ...upgradeRates,
                                [bundle]: Math.max(0, Math.min(100, val))
                              });
                            }}
                            className="w-16 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fixed KD Loss */}
              <div className="border-t border-slate-700 pt-3">
                <label className="block text-sm text-slate-400 mb-1">
                  Fixed KD Loss: <span className="text-red-400 font-bold">{fixedKDLoss.toLocaleString()} KD</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={fixedKDLoss}
                  onChange={(e) => setFixedKDLoss(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-1.5 text-white text-sm"
                />
                <div className="text-xs text-slate-500 mt-1">Additional fixed costs/losses (e.g., implementation, marketing)</div>
              </div>

              {/* Add-On Loss Rates for All Bundles in Category */}
              {addOnData[selectedCategory] && Object.keys(addOnData[selectedCategory]).length > 0 && (
                <div className="border-t border-slate-700 pt-3">
                  <label className="block text-sm text-slate-400 mb-2">
                    Add-On Revenue Change % for {selectedCategory}
                  </label>
                  <div className="space-y-2">
                    {Object.entries(addOnData[selectedCategory])
                      .sort((a, b) => {
                        const orderA = BUNDLE_TIER_ORDER[a[0]] ?? 999;
                        const orderB = BUNDLE_TIER_ORDER[b[0]] ?? 999;
                        return orderA - orderB;
                      })
                      .map(([bundle, revenue]) => {
                        const currentRate = addOnLossRates[selectedCategory]?.[bundle] || 0;
                        const isSelected = bundle === selectedBundle;
                        return (
                          <div
                            key={bundle}
                            className="bg-slate-700/30 rounded p-2"
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className={`text-xs ${isSelected ? 'text-purple-400' : 'text-purple-300'}`}>
                                {bundle} {isSelected && '(selected)'}
                              </span>
                              <span className="text-xs text-slate-400">
                                {currentRate >= 0 ? '+' : ''}{currentRate}% → {revenue.toFixed(0)} KD
                              </span>
                            </div>
                            <div className="flex gap-2 items-center">
                              <input
                                type="range"
                                min="-100"
                                max="500"
                                step="0.1"
                                value={currentRate}
                                onChange={(e) => {
                                  const newRates = { ...addOnLossRates };
                                  if (!newRates[selectedCategory]) newRates[selectedCategory] = {};
                                  newRates[selectedCategory][bundle] = Number(e.target.value);
                                  setAddOnLossRates(newRates);
                                }}
                                className="flex-1 h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                              />
                              <input
                                type="number"
                                min="-100"
                                max="500"
                                step="0.1"
                                value={currentRate}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  const newRates = { ...addOnLossRates };
                                  if (!newRates[selectedCategory]) newRates[selectedCategory] = {};
                                  newRates[selectedCategory][bundle] = Math.max(-100, Math.min(500, val));
                                  setAddOnLossRates(newRates);
                                }}
                                className="w-16 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-xs"
                              />
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-700">
                <div className="text-xs text-slate-400">
                  Total: Stay {results.stayRate.toFixed(0)}% + Churn {results.effectiveChurn}% + Down {results.effectiveDowngrade.toFixed(0)}% + Up {results.effectiveUpgrade.toFixed(0)}% = 100%
                </div>
              </div>
            </div>
            ) : (
            <div className="space-y-4">
              {Object.keys(selectedBundles).filter(b => selectedBundles[b]).length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  Select bundles above to configure price changes
                </div>
              ) : (
                Object.keys(selectedBundles).filter(b => selectedBundles[b]).map(bundle => {
                  const bundleInfo = categoryData[bundle];
                  const bundleIndex = BUNDLE_TIER_ORDER.indexOf(bundle);
                  const lowerBundlesForThis = BUNDLE_TIER_ORDER.filter((b, i) =>
                    i > bundleIndex && availableBundles.includes(b)
                  );
                  const higherBundlesForThis = BUNDLE_TIER_ORDER.filter((b, i) =>
                    i < bundleIndex && availableBundles.includes(b)
                  );
                  const isBottomTierThis = lowerBundlesForThis.length === 0;
                  const isTopTierThis = higherBundlesForThis.length === 0;

                  return (
                    <div key={bundle} className="border border-purple-700 rounded-lg p-3 bg-purple-900/10">
                      <div className="font-semibold text-purple-400 mb-3 flex items-center justify-between">
                        <span>{bundle}</span>
                        <span className="text-xs text-slate-400">
                          {bundleInfo?.avgCPL.toFixed(2)} KD, {bundleInfo?.totalListings} listings
                        </span>
                      </div>

                      {/* Price Change */}
                      <div className="mb-3">
                        <label className="block text-xs text-slate-400 mb-1">
                          Price Change: <span className="text-emerald-400 font-bold">
                            {(bundlePriceChanges[bundle] || 0) > 0 ? '+' : ''}{bundlePriceChanges[bundle] || 0}%
                          </span>
                        </label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="range"
                            min="-100"
                            max="500"
                            step="0.1"
                            value={bundlePriceChanges[bundle] || 0}
                            onChange={(e) => setBundlePriceChanges({
                              ...bundlePriceChanges,
                              [bundle]: Number(e.target.value)
                            })}
                            className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                          />
                          <input
                            type="number"
                            min="-100"
                            max="500"
                            step="0.1"
                            value={bundlePriceChanges[bundle] || 0}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setBundlePriceChanges({
                                ...bundlePriceChanges,
                                [bundle]: Math.max(-100, Math.min(500, val))
                              });
                            }}
                            className="w-16 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-xs"
                          />
                        </div>
                      </div>

                      {/* Churn Rate */}
                      <div className="mb-3">
                        <label className="block text-xs text-slate-400 mb-1">
                          Churn Rate: <span className="text-red-400 font-bold">{bundleChurnRates[bundle] || 0}%</span>
                        </label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="0.1"
                            value={bundleChurnRates[bundle] || 0}
                            onChange={(e) => setBundleChurnRates({
                              ...bundleChurnRates,
                              [bundle]: Number(e.target.value)
                            })}
                            className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                          />
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={bundleChurnRates[bundle] || 0}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setBundleChurnRates({
                                ...bundleChurnRates,
                                [bundle]: Math.max(0, Math.min(100, val))
                              });
                            }}
                            className="w-16 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-xs"
                          />
                        </div>
                      </div>

                      {/* Downgrade Rates */}
                      {!isBottomTierThis && lowerBundlesForThis.length > 0 && (
                        <div className="mb-3 border-t border-slate-700 pt-2">
                          <label className="block text-xs text-slate-400 mb-2">Downgrade To:</label>
                          <div className="space-y-2">
                            {lowerBundlesForThis.map(targetBundle => (
                              <div key={targetBundle}>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs text-amber-400">{targetBundle}</span>
                                  <span className="text-xs text-slate-400">
                                    {bundleDowngradeRates[bundle]?.[targetBundle] || 0}%
                                  </span>
                                </div>
                                <div className="flex gap-2 items-center">
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    value={bundleDowngradeRates[bundle]?.[targetBundle] || 0}
                                    onChange={(e) => {
                                      const newRates = { ...bundleDowngradeRates };
                                      if (!newRates[bundle]) newRates[bundle] = {};
                                      newRates[bundle][targetBundle] = Number(e.target.value);
                                      setBundleDowngradeRates(newRates);
                                    }}
                                    className="flex-1 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                                  />
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    value={bundleDowngradeRates[bundle]?.[targetBundle] || 0}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      const newRates = { ...bundleDowngradeRates };
                                      if (!newRates[bundle]) newRates[bundle] = {};
                                      newRates[bundle][targetBundle] = Math.max(0, Math.min(100, val));
                                      setBundleDowngradeRates(newRates);
                                    }}
                                    className="w-14 bg-slate-700 border border-slate-600 rounded px-1 py-0.5 text-white text-xs"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Upgrade Rates */}
                      {!isTopTierThis && higherBundlesForThis.length > 0 && (
                        <div className="border-t border-slate-700 pt-2">
                          <label className="block text-xs text-slate-400 mb-2">Upgrade To:</label>
                          <div className="space-y-2">
                            {higherBundlesForThis.map(targetBundle => (
                              <div key={targetBundle}>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs text-blue-400">{targetBundle}</span>
                                  <span className="text-xs text-slate-400">
                                    {bundleUpgradeRates[bundle]?.[targetBundle] || 0}%
                                  </span>
                                </div>
                                <div className="flex gap-2 items-center">
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    value={bundleUpgradeRates[bundle]?.[targetBundle] || 0}
                                    onChange={(e) => {
                                      const newRates = { ...bundleUpgradeRates };
                                      if (!newRates[bundle]) newRates[bundle] = {};
                                      newRates[bundle][targetBundle] = Number(e.target.value);
                                      setBundleUpgradeRates(newRates);
                                    }}
                                    className="flex-1 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                                  />
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    value={bundleUpgradeRates[bundle]?.[targetBundle] || 0}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      const newRates = { ...bundleUpgradeRates };
                                      if (!newRates[bundle]) newRates[bundle] = {};
                                      newRates[bundle][targetBundle] = Math.max(0, Math.min(100, val));
                                      setBundleUpgradeRates(newRates);
                                    }}
                                    className="w-14 bg-slate-700 border border-slate-600 rounded px-1 py-0.5 text-white text-xs"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              {/* Fixed KD Loss - shared across modes */}
              <div className="border-t border-slate-700 pt-3">
                <label className="block text-sm text-slate-400 mb-1">
                  Fixed KD Loss: <span className="text-red-400 font-bold">{fixedKDLoss.toLocaleString()} KD</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={fixedKDLoss}
                  onChange={(e) => setFixedKDLoss(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-1.5 text-white text-sm"
                />
                <div className="text-xs text-slate-500 mt-1">Additional fixed costs/losses</div>
              </div>

              {/* Add-On Loss Rates for All Bundles in Category - Multi-Bundle Mode */}
              {addOnData[selectedCategory] && Object.keys(addOnData[selectedCategory]).length > 0 && (
                <div className="border-t border-slate-700 pt-3">
                  <label className="block text-sm text-slate-400 mb-2">
                    Add-On Revenue Change % for {selectedCategory}
                  </label>
                  <div className="space-y-2">
                    {Object.entries(addOnData[selectedCategory])
                      .sort((a, b) => {
                        const orderA = BUNDLE_TIER_ORDER.indexOf(a[0]);
                        const orderB = BUNDLE_TIER_ORDER.indexOf(b[0]);
                        return (orderA === -1 ? 999 : orderA) - (orderB === -1 ? 999 : orderB);
                      })
                      .map(([bundle, revenue]) => {
                        const currentRate = addOnLossRates[selectedCategory]?.[bundle] || 0;
                        const isSelected = selectedBundles[bundle];
                        return (
                          <div
                            key={bundle}
                            className={`bg-slate-700/30 rounded p-2 ${isSelected ? 'border border-purple-700/50' : ''}`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className={`text-xs ${isSelected ? 'text-purple-400' : 'text-purple-300'}`}>
                                {bundle} {isSelected && '(selected)'}
                              </span>
                              <span className="text-xs text-slate-400">
                                {currentRate >= 0 ? '+' : ''}{currentRate}% → {revenue.toFixed(0)} KD
                              </span>
                            </div>
                            <div className="flex gap-2 items-center">
                              <input
                                type="range"
                                min="-100"
                                max="500"
                                step="0.1"
                                value={currentRate}
                                onChange={(e) => {
                                  const newRates = { ...addOnLossRates };
                                  if (!newRates[selectedCategory]) newRates[selectedCategory] = {};
                                  newRates[selectedCategory][bundle] = Number(e.target.value);
                                  setAddOnLossRates(newRates);
                                }}
                                className="flex-1 h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                              />
                              <input
                                type="number"
                                min="-100"
                                max="500"
                                step="0.1"
                                value={currentRate}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  const newRates = { ...addOnLossRates };
                                  if (!newRates[selectedCategory]) newRates[selectedCategory] = {};
                                  newRates[selectedCategory][bundle] = Math.max(-100, Math.min(500, val));
                                  setAddOnLossRates(newRates);
                                }}
                                className="w-16 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-xs"
                              />
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              )}
            </div>
            )}
          </div>

          {/* Results */}
          <div className="bg-slate-800 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">
              {isMultiBundleMode ? 'Portfolio Impact' : 'Projected Impact'}
            </h2>

            {!isMultiBundleMode && results ? (
            <div>
            <div className={`p-4 rounded-lg mb-4 ${results.netRevenueChange >= 0 ? 'bg-emerald-900/30 border border-emerald-700' : 'bg-red-900/30 border border-red-700'}`}>
              <div className="text-sm text-slate-400">Net Revenue Change</div>
              <div className={`text-2xl font-bold ${results.netRevenueChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {results.netRevenueChange >= 0 ? '+' : ''}{Math.round(results.netRevenueChange).toLocaleString()} KD
              </div>
              <div className={`text-sm ${results.netRevenueChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {results.percentChange >= 0 ? '+' : ''}{results.percentChange.toFixed(2)}% of category revenue
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-700/50 rounded-lg p-2">
                <div className="text-xs text-slate-400">New {selectedBundle} Rev</div>
                <div className="text-lg font-semibold text-white">{Math.round(results.newBundleRevenue).toLocaleString()} KD</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-2">
                <div className="text-xs text-slate-400">Lost to Churn</div>
                <div className="text-lg font-semibold text-red-400">-{Math.round(results.lostRevenue).toLocaleString()} KD</div>
              </div>
              {!isBottomTier && (
                <div className="bg-slate-700/50 rounded-lg p-2">
                  <div className="text-xs text-slate-400">From Downgrades</div>
                  <div className="text-lg font-semibold text-amber-400">+{Math.round(results.downgradeRevenue).toLocaleString()} KD</div>
                </div>
              )}
              {!isTopTier && (
                <div className="bg-slate-700/50 rounded-lg p-2">
                  <div className="text-xs text-slate-400">From Upgrades</div>
                  <div className="text-lg font-semibold text-blue-400">+{Math.round(results.upgradeRevenue).toLocaleString()} KD</div>
                </div>
              )}
              {fixedKDLoss > 0 && (
                <div className="bg-slate-700/50 rounded-lg p-2">
                  <div className="text-xs text-slate-400">Fixed Loss</div>
                  <div className="text-lg font-semibold text-red-400">-{fixedKDLoss.toLocaleString()} KD</div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">New Category Revenue</span>
                <span className="font-semibold">{Math.round(results.newCategoryRevenue).toLocaleString()} KD</span>
              </div>
            </div>
            </div>
            ) : isMultiBundleMode && multiBundleResults ? (
            <div>
              {/* Category Totals */}
              <div className={`p-4 rounded-lg mb-4 ${multiBundleResults.categoryTotals.netChange >= 0 ? 'bg-emerald-900/30 border border-emerald-700' : 'bg-red-900/30 border border-red-700'}`}>
                <div className="text-sm text-slate-400">Net Category Change</div>
                <div className={`text-2xl font-bold ${multiBundleResults.categoryTotals.netChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {multiBundleResults.categoryTotals.netChange >= 0 ? '+' : ''}
                  {Math.round(multiBundleResults.categoryTotals.netChange).toLocaleString()} KD
                </div>
                <div className={`text-sm ${multiBundleResults.categoryTotals.percentChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {multiBundleResults.categoryTotals.percentChange >= 0 ? '+' : ''}
                  {multiBundleResults.categoryTotals.percentChange.toFixed(2)}% change
                </div>
              </div>


              {/* Bundle Breakdown Table */}
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-slate-700">
                    <tr>
                      <th className="text-left p-2 text-slate-400">Bundle</th>
                      <th className="text-right p-2 text-slate-400">Price Δ</th>
                      <th className="text-right p-2 text-slate-400">Listings</th>
                      <th className="text-right p-2 text-slate-400">Revenue Δ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BUNDLE_TIER_ORDER
                      .filter(b => multiBundleResults.byBundle[b])
                      .map(bundle => {
                        const result = multiBundleResults.byBundle[bundle];
                        return (
                          <tr key={bundle} className={`border-b border-slate-700 ${result.isSelected ? 'bg-purple-900/20' : ''}`}>
                            <td className="p-2">
                              <span className={result.isSelected ? 'text-purple-400 font-semibold' : 'text-white'}>
                                {bundle}
                              </span>
                            </td>
                            <td className="text-right p-2">
                              <span className={result.priceChangePercent !== 0 ? 'text-emerald-400' : 'text-slate-500'}>
                                {result.priceChangePercent > 0 ? '+' : ''}{result.priceChangePercent}%
                              </span>
                            </td>
                            <td className="text-right p-2">
                              <div className="text-white">{Math.round(result.projectedListings)}</div>
                              <div className={`text-xs ${result.listingChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {result.listingChange >= 0 ? '+' : ''}{Math.round(result.listingChange)}
                              </div>
                            </td>
                            <td className="text-right p-2">
                              <div className={`font-semibold ${result.totalRevenueChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {result.totalRevenueChange >= 0 ? '+' : ''}
                                {Math.round(result.totalRevenueChange).toLocaleString()}
                              </div>
                              <div className="text-xs text-slate-400">
                                {result.percentChange >= 0 ? '+' : ''}{result.percentChange.toFixed(1)}%
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Category Summary */}
              <div className="mt-4 pt-3 border-t border-slate-700 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Current Revenue</span>
                  <span className="font-semibold">{Math.round(multiBundleResults.categoryTotals.currentRevenue).toLocaleString()} KD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Projected Revenue</span>
                  <span className="font-semibold">{Math.round(multiBundleResults.categoryTotals.projectedRevenue).toLocaleString()} KD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Add-On Revenue Change</span>
                  <span className={`font-semibold ${multiBundleResults.categoryTotals.addOnRevenueChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {multiBundleResults.categoryTotals.addOnRevenueChange >= 0 ? '+' : ''}
                    {Math.round(multiBundleResults.categoryTotals.addOnRevenueChange).toLocaleString()} KD
                  </span>
                </div>
                {fixedKDLoss > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Fixed Loss</span>
                    <span className="text-red-400">-{fixedKDLoss.toLocaleString()} KD</span>
                  </div>
                )}
              </div>
            </div>
            ) : (
            <div className="text-center text-slate-400 py-8">
              {isMultiBundleMode ? 'Select bundles to see portfolio impact' : 'Configure scenario to see results'}
            </div>
            )}
          </div>

          {/* Insights */}
          <div className="bg-slate-800 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Key Insights</h2>

            {!isMultiBundleMode && results ? (
            <div className="space-y-3">
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="text-xs text-slate-400">Break-Even Churn (no migration)</div>
                <div className="text-xl font-bold text-amber-400">{results.breakEvenChurn.toFixed(1)}%</div>
                <div className="text-xs text-slate-500">Max churn before losing money at +{priceChange}%</div>
              </div>

              {!isTopTier && higherBundles.length > 0 && (
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-xs text-slate-400">Upgrade Revenue Potential</div>
                  <div className="text-lg font-bold text-blue-400">
                    +{((categoryData[higherBundles[higherBundles.length - 1]]?.avgCPL || 0) - results.newCPL).toFixed(2)} KD/listing
                  </div>
                  <div className="text-xs text-slate-500">
                    If customer upgrades to {higherBundles[higherBundles.length - 1]} instead of staying
                  </div>
                </div>
              )}

              <div className={`rounded-lg p-3 ${results.netRevenueChange >= 0 ? 'bg-emerald-900/30' : 'bg-red-900/30'}`}>
                <div className="text-xs text-slate-400">Recommendation</div>
                {results.netRevenueChange >= 0 ? (
                  <div className="text-sm text-emerald-400">
                    ✓ This scenario maintains/increases revenue
                  </div>
                ) : (
                  <div className="text-sm text-red-400">
                    ✗ Revenue loss - reduce price increase or improve retention
                  </div>
                )}
              </div>
            </div>
            ) : isMultiBundleMode && multiBundleResults ? (
            <div className="space-y-3">
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="text-xs text-slate-400">Bundles Modified</div>
                <div className="text-xl font-bold text-purple-400">
                  {Object.values(selectedBundles).filter(Boolean).length}
                </div>
                <div className="text-xs text-slate-500">
                  out of {BUNDLE_TIER_ORDER.filter(b => availableBundles.includes(b)).length} available
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="text-xs text-slate-400">Average Price Increase</div>
                <div className="text-lg font-bold text-emerald-400">
                  +{(Object.values(selectedBundles)
                    .filter(Boolean)
                    .reduce((sum, _, i) => {
                      const bundle = Object.keys(selectedBundles).filter(b => selectedBundles[b])[i];
                      return sum + (bundlePriceChanges[bundle] || 0);
                    }, 0) / Math.max(1, Object.values(selectedBundles).filter(Boolean).length)).toFixed(1)}%
                </div>
                <div className="text-xs text-slate-500">across selected bundles</div>
              </div>

              <div className={`rounded-lg p-3 ${multiBundleResults.categoryTotals.netChange >= 0 ? 'bg-emerald-900/30' : 'bg-red-900/30'}`}>
                <div className="text-xs text-slate-400">Portfolio Recommendation</div>
                {multiBundleResults.categoryTotals.netChange >= 0 ? (
                  <div className="text-sm text-emerald-400">
                    ✓ Portfolio changes increase overall revenue
                  </div>
                ) : (
                  <div className="text-sm text-red-400">
                    ✗ Portfolio changes decrease revenue - adjust strategy
                  </div>
                )}
              </div>

            </div>
            ) : (
            <div className="text-center text-slate-400 py-8 text-sm">
              {isMultiBundleMode ? 'Select bundles to see insights' : 'Configure scenario to see insights'}
            </div>
            )}
          </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Sensitivity: Net Change vs Churn Rate</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={sensitivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="churnRate" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  formatter={(value) => [`${value.toLocaleString()} KD`, 'Net Change']}
                  labelFormatter={(label) => `Churn: ${label}%`}
                />
                <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="netChange" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="text-xs text-slate-500 mt-2">Red line = break-even point</div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Listing Flow Visualization</h3>
            <div className="flex flex-col items-center justify-center h-64">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-white">{results.currentListings}</div>
                <div className="text-sm text-slate-400">Current {selectedBundle} Listings</div>
              </div>
              <div className="grid grid-cols-4 gap-2 w-full">
                <div className="text-center p-2 bg-slate-700 rounded">
                  <div className="text-lg font-bold text-emerald-400">{Math.round(results.stayingListings)}</div>
                  <div className="text-xs text-slate-400">Stay</div>
                  <div className="text-xs text-emerald-500">{results.stayRate.toFixed(0)}%</div>
                </div>
                <div className="text-center p-2 bg-slate-700 rounded">
                  <div className="text-lg font-bold text-red-400">{Math.round(results.churnedListings)}</div>
                  <div className="text-xs text-slate-400">Churn</div>
                  <div className="text-xs text-red-500">{results.effectiveChurn}%</div>
                </div>
                <div className="text-center p-2 bg-slate-700 rounded">
                  <div className="text-lg font-bold text-amber-400">{Math.round(results.downgradeListings)}</div>
                  <div className="text-xs text-slate-400">Downgrade</div>
                  <div className="text-xs text-amber-500">{results.effectiveDowngrade}%</div>
                </div>
                <div className="text-center p-2 bg-slate-700 rounded">
                  <div className="text-lg font-bold text-blue-400">{Math.round(results.upgradeListings)}</div>
                  <div className="text-xs text-slate-400">Upgrade</div>
                  <div className="text-xs text-blue-500">{results.effectiveUpgrade}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calculation Details (Collapsible) */}
        <div className="bg-slate-800 rounded-lg p-4 mb-6">
          <button
            onClick={() => setShowCalculations(!showCalculations)}
            className="flex items-center gap-2 text-lg font-semibold mb-2 hover:text-blue-400 transition-colors"
          >
            <span>{showCalculations ? '▼' : '▶'}</span>
            Calculation Details & Logic
          </button>

          {showCalculations && (
            <div className="mt-4 space-y-4 text-sm">
              {/* Worked Example */}
              <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                <h4 className="font-semibold text-cyan-400 mb-3">Worked Example (simple round numbers)</h4>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-slate-300 font-semibold mb-1">Single Bundle</h5>
                    <pre className="text-slate-400 text-xs overflow-x-auto whitespace-pre-wrap">
{`Standard: 100 listings × 10 KD = 1,000 KD revenue. Add-on revenue: 200 KD.
Price +20% → 12 KD. Add-on change: -50%.
Rates: 5% churn, 10% downgrade to Basic (8 KD), 5% upgrade to Premium (15 KD)

CPL Revenue:
  80 stay × 12      = 960 KD
  10 downgrade × 8  =  80 KD
   5 upgrade × 15   =  75 KD
   5 churn           =   0 KD (they left, no revenue)
  CPL total: 960 + 80 + 75 = 1,115 KD (was 1,000 KD)

Add-On Revenue (per-listing approach):
  Per-listing add-on: 200 KD / 100 listings = 2 KD/listing
  Adjusted rate: 2 KD × (1 + (-50%)) = 1 KD/listing
  Staying listings: 80
  New add-on revenue: 1 KD × 80 = 80 KD (was 200 KD)
  Add-on change: -120 KD

Net change: (1,115 - 1,000) + (-120) = -5 KD (-0.5%)`}
                    </pre>
                  </div>

                  <div className="border-t border-slate-700 pt-4">
                    <h5 className="text-slate-300 font-semibold mb-1">Multi-Bundle (same category, two bundles changed)</h5>
                    <pre className="text-slate-400 text-xs overflow-x-auto whitespace-pre-wrap">
{`Category:
  Basic:    200 listings × 5 KD  = 1,000 KD
  Standard: 100 listings × 10 KD = 1,000 KD
  Premium:   50 listings × 20 KD = 1,000 KD
  Category total: 3,000 KD

Changes: Basic +20% → 6 KD, Standard +10% → 11 KD, Premium unchanged

Basic (5% churn, 0% downgrade, 3% upgrade to Standard):
  Outgoing: 10 churn, 6 upgrade to Standard
  Incoming: 8 downgrades from Standard
  Final: (200 - 10 - 6 + 8) = 192 listings × 6 KD = 1,152 KD (was 1,000)

Standard (5% churn, 8% downgrade to Basic, 3% upgrade to Premium):
  Outgoing: 5 churn, 8 downgrade to Basic, 3 upgrade to Premium
  Incoming: 6 upgrades from Basic
  Final: (100 - 5 - 8 - 3 + 6) = 90 listings × 11 KD = 990 KD (was 1,000)

Premium (unchanged, no rates applied):
  Incoming: 3 upgrades from Standard
  Final: (50 + 3) = 53 listings × 20 KD = 1,060 KD (was 1,000)

Category total: 3,202 KD vs 3,000 KD → +202 KD (+6.7%)

Key: customers migrating between bundles are tracked both ways —
Standard's 8 downgrades become Basic's 8 incoming listings, and
Basic's 6 upgrades become Standard's 6 incoming listings.`}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-lg p-4">
                <h4 className="font-semibold text-blue-400 mb-2">Step 1: New Price</h4>
                <pre className="text-slate-300 overflow-x-auto">
{`Current price per listing: ${results.currentCPL.toFixed(2)} KD
Price change: +${priceChange}%

New price = ${results.currentCPL.toFixed(2)} × ${(1 + priceChange/100).toFixed(2)} = ${results.newCPL.toFixed(2)} KD`}
                </pre>
              </div>

              <div className="bg-slate-900 rounded-lg p-4">
                <h4 className="font-semibold text-emerald-400 mb-2">Step 2: Where Do Customers Go?</h4>
                <pre className="text-slate-300 overflow-x-auto">
{`Total listings: ${results.currentListings}

Stay:      ${results.currentListings} × ${results.stayRate.toFixed(1)}% = ${Math.round(results.stayingListings)} listings
Churn:     ${results.currentListings} × ${results.effectiveChurn}% = ${Math.round(results.churnedListings)} listings (lost)
Downgrade: ${results.currentListings} × ${results.effectiveDowngrade}% = ${Math.round(results.downgradeListings)} listings
Upgrade:   ${results.currentListings} × ${results.effectiveUpgrade}% = ${Math.round(results.upgradeListings)} listings`}
                </pre>
              </div>

              <div className="bg-slate-900 rounded-lg p-4">
                <h4 className="font-semibold text-amber-400 mb-2">Step 3: New Revenue From Each Group</h4>
                <pre className="text-slate-300 overflow-x-auto">
{`Staying customers (pay the new price):
  ${Math.round(results.stayingListings)} listings × ${results.newCPL.toFixed(2)} KD = ${Math.round(results.newBundleRevenue).toLocaleString()} KD

Downgraded customers (pay the lower bundle's price):
${lowerBundles.length > 0 ? lowerBundles.map(b => `  ${Math.round(results.downgradeDetails?.[b]?.listings || 0)} listings → ${b} @ ${(results.downgradeDetails?.[b]?.cpl || 0).toFixed(2)} KD = ${Math.round(results.downgradeDetails?.[b]?.revenue || 0).toLocaleString()} KD`).join('\n') : '  (none — this is the lowest bundle)'}
  Total: ${Math.round(results.downgradeRevenue).toLocaleString()} KD

Upgraded customers (pay the higher bundle's price):
${higherBundles.length > 0 ? higherBundles.map(b => `  ${Math.round(results.upgradeDetails?.[b]?.listings || 0)} listings → ${b} @ ${(results.upgradeDetails?.[b]?.cpl || 0).toFixed(2)} KD = ${Math.round(results.upgradeDetails?.[b]?.revenue || 0).toLocaleString()} KD`).join('\n') : '  (none — this is the highest bundle)'}
  Total: ${Math.round(results.upgradeRevenue).toLocaleString()} KD

Churned customers: 0 KD (they left)`}
                </pre>
              </div>

              {results.currentAddOnRevenue > 0 && (
              <div className="bg-slate-900 rounded-lg p-4">
                <h4 className="font-semibold text-pink-400 mb-2">Step 4: Add-On Revenue (Per-Listing)</h4>
                <pre className="text-slate-300 overflow-x-auto">
{`Current add-on revenue: ${results.currentAddOnRevenue.toLocaleString()} KD
Current listings: ${results.currentListings}
Per-listing add-on: ${results.currentAddOnRevenue.toLocaleString()} / ${results.currentListings} = ${results.avgAddOnPerListing.toFixed(2)} KD/listing

Add-on revenue change: ${(results.addOnLossRate * 100) >= 0 ? '+' : ''}${(results.addOnLossRate * 100).toFixed(1)}%
Adjusted per-listing: ${results.avgAddOnPerListing.toFixed(2)} × (1 + ${(results.addOnLossRate * 100).toFixed(1)}%) = ${results.adjustedAddOnPerListing.toFixed(2)} KD/listing

Staying listings: ${Math.round(results.stayingListings)}
New add-on revenue: ${results.adjustedAddOnPerListing.toFixed(2)} × ${Math.round(results.stayingListings)} = ${Math.round(results.newAddOnRevenue).toLocaleString()} KD
Add-on change: ${Math.round(results.addOnRevenueChange) >= 0 ? '+' : ''}${Math.round(results.addOnRevenueChange).toLocaleString()} KD`}
                </pre>
              </div>
              )}

              <div className="bg-slate-900 rounded-lg p-4">
                <h4 className="font-semibold text-purple-400 mb-2">Step {results.currentAddOnRevenue > 0 ? '5' : '4'}: Net Impact</h4>
                <pre className="text-slate-300 overflow-x-auto">
{`CPL revenue change = staying + downgraded + upgraded - old
CPL change = ${Math.round(results.newBundleRevenue).toLocaleString()} + ${Math.round(results.downgradeRevenue).toLocaleString()} + ${Math.round(results.upgradeRevenue).toLocaleString()} - ${results.currentRevenue.toLocaleString()} = ${Math.round(results.cplRevenueChange).toLocaleString()} KD
${results.currentAddOnRevenue > 0 ? `\nAdd-on revenue change: ${Math.round(results.addOnRevenueChange) >= 0 ? '+' : ''}${Math.round(results.addOnRevenueChange).toLocaleString()} KD` : ''}${fixedKDLoss > 0 ? `\nFixed KD loss: -${fixedKDLoss.toLocaleString()} KD` : ''}

Net change = ${Math.round(results.cplRevenueChange).toLocaleString()}${results.currentAddOnRevenue > 0 ? ` + (${Math.round(results.addOnRevenueChange).toLocaleString()})` : ''}${fixedKDLoss > 0 ? ` - ${fixedKDLoss.toLocaleString()}` : ''} = ${Math.round(results.netRevenueChange).toLocaleString()} KD
Percentage change: ${results.percentChange >= 0 ? '+' : ''}${results.percentChange.toFixed(2)}%`}
                </pre>
              </div>

            </div>
          )}
        </div>

        {/* Scenario Matrix */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Quick Reference: Scenario Matrix</h3>
          <p className="text-slate-400 text-sm mb-4">
            Net revenue change (KD) for {selectedBundle} in {selectedCategory} at different price/churn combinations
            <br />
            <span className="text-xs">(with {totalDowngradeRate}% total downgrade, {totalUpgradeRate}% total upgrade, {fixedKDLoss.toLocaleString()} KD fixed loss)</span>
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-2 px-2 text-left text-slate-400 text-xs">Churn ↓ / Price →</th>
                  {[10, 15, 20, 25, 30].map(p => (
                    <th key={p} className="py-2 px-2 text-center text-slate-400 text-xs">+{p}%</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[5, 10, 15, 20, 25, 30].map(churn => (
                  <tr key={churn} className="border-b border-slate-700/50">
                    <td className="py-2 px-2 text-slate-400 text-xs">{churn}%</td>
                    {[10, 15, 20, 25, 30].map(price => {
                      const bundleInfo = categoryData[selectedBundle];

                      const newCPL = bundleInfo.avgCPL * (1 + price / 100);
                      const effectiveDown = isBottomTier ? 0 : totalDowngradeRate;
                      const effectiveUp = isTopTier ? 0 : totalUpgradeRate;
                      const stayRate = Math.max(0, 100 - churn - effectiveDown - effectiveUp);

                      const stayingListings = bundleInfo.totalListings * (stayRate / 100);

                      const newBundleRev = stayingListings * newCPL;

                      // Calculate downgrade revenue across all bundles
                      let downgradeRev = 0;
                      lowerBundles.forEach(bundle => {
                        const rate = downgradeRates[bundle] || 0;
                        const listings = bundleInfo.totalListings * (rate / 100);
                        const lowerBundleData = categoryData[bundle];
                        downgradeRev += lowerBundleData ? listings * lowerBundleData.avgCPL : 0;
                      });

                      // Calculate upgrade revenue across all bundles
                      let upgradeRev = 0;
                      higherBundles.forEach(bundle => {
                        const rate = upgradeRates[bundle] || 0;
                        const listings = bundleInfo.totalListings * (rate / 100);
                        const higherBundleData = categoryData[bundle];
                        upgradeRev += higherBundleData ? listings * higherBundleData.avgCPL : 0;
                      });

                      const change = Math.round((newBundleRev - bundleInfo.totalRevenue) + downgradeRev + upgradeRev - fixedKDLoss);

                      return (
                        <td key={price} className={`py-2 px-2 text-center font-medium text-xs ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {change >= 0 ? '+' : ''}{change.toLocaleString()}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-xs text-slate-500">
          <p>
            {activeTab === 'historical'
              ? `Data: 12-month historical analysis across ${categories.length} categories | All values in KD (Kuwaiti Dinar)`
              : `Custom scenario analysis | All values in KD (Kuwaiti Dinar)`
            }
          </p>
        </div>
        </>
      )}

      {/* No data message for custom tab */}
      {activeTab === 'custom' && Object.keys(customScenarios).length === 0 && (
        <div className="bg-slate-800 rounded-lg p-8 text-center">
          <p className="text-slate-400">Create and save a custom scenario above to start analysis</p>
        </div>
      )}
    </>
  );
}
