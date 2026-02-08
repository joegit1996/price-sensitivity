import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { useSimulator } from '../../context/SimulatorContext';
import { BUNDLE_TIER_ORDER, getHigherTierBundles, getLowerTierBundles } from '../../data/bundleTiers';

export default function PortfolioAnalysisTab() {
  const {
    historicalData, addOnData,
    portfolioBundle, setPortfolioBundle,
    portfolioSortBy, setPortfolioSortBy,
    portfolioSortAsc, setPortfolioSortAsc,
    portfolioPriceChange, setPortfolioPriceChange,
    portfolioChurnRate, setPortfolioChurnRate,
    portfolioDowngradeRates, setPortfolioDowngradeRates,
    portfolioUpgradeRates, setPortfolioUpgradeRates,
    portfolioAddOnLossRates, setPortfolioAddOnLossRates,
    portfolioFixedKDLoss, setPortfolioFixedKDLoss,
    portfolioIsMultiBundle, setPortfolioIsMultiBundle,
    portfolioSelectedBundles, setPortfolioSelectedBundles,
    portfolioBundlePriceChanges, setPortfolioBundlePriceChanges,
    portfolioBundleChurnRates, setPortfolioBundleChurnRates,
    portfolioBundleDowngradeRates, setPortfolioBundleDowngradeRates,
    portfolioBundleUpgradeRates, setPortfolioBundleUpgradeRates,
    portfolioBundleAddOnRates, setPortfolioBundleAddOnRates,
    portfolioAddOnEdits, setPortfolioAddOnEdits,
    portfolioAddOnEditorOpen, setPortfolioAddOnEditorOpen,
    portfolioResults, portfolioSummary,
  } = useSimulator();

  return (
    <div className="space-y-6 mb-6">
      <div className="bg-amber-900/30 border border-amber-700 rounded-lg px-4 py-3 text-amber-300 text-sm">
        Not tested and validated yet
      </div>
      {/* Scenario Configuration */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 md:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Scenario Controls</h2>
            <button
              onClick={() => setPortfolioIsMultiBundle(!portfolioIsMultiBundle)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                portfolioIsMultiBundle
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {portfolioIsMultiBundle ? 'Multi-Bundle Mode' : 'Single Bundle Mode'}
            </button>
          </div>
          <div className="space-y-4">
            {!portfolioIsMultiBundle ? (
              <>
                {/* SINGLE-BUNDLE MODE CONTROLS */}
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Bundle</label>
                  <select
                    value={portfolioBundle}
                    onChange={(e) => setPortfolioBundle(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  >
                    {BUNDLE_TIER_ORDER.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Price Change: <span className="text-emerald-400 font-bold">{portfolioPriceChange > 0 ? '+' : ''}{portfolioPriceChange}%</span>
                  </label>
                  <div className="flex gap-2 items-center">
                    <input type="range" min="-100" max="500" step="0.1" value={portfolioPriceChange}
                      onChange={(e) => setPortfolioPriceChange(Number(e.target.value))}
                      className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                    <input type="number" min="-100" max="500" step="0.1" value={portfolioPriceChange}
                      onChange={(e) => setPortfolioPriceChange(Math.max(-100, Math.min(500, Number(e.target.value))))}
                      className="w-20 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Churn Rate: <span className="text-red-400 font-bold">{portfolioChurnRate}%</span>
                  </label>
                  <div className="flex gap-2 items-center">
                    <input type="range" min="0" max="100" step="0.1" value={portfolioChurnRate}
                      onChange={(e) => setPortfolioChurnRate(Number(e.target.value))}
                      className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                    <input type="number" min="0" max="100" step="0.1" value={portfolioChurnRate}
                      onChange={(e) => setPortfolioChurnRate(Math.max(0, Math.min(100, Number(e.target.value))))}
                      className="w-20 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm" />
                  </div>
                </div>
                {/* Downgrade Distribution - per bundle */}
                {(() => {
                  const lowerBundles = getLowerTierBundles(portfolioBundle, BUNDLE_TIER_ORDER);
                  const totalDowngradeRate = Object.values(portfolioDowngradeRates).reduce((s, v) => s + (v || 0), 0);
                  if (lowerBundles.length === 0) return null;
                  return (
                    <div className="border-t border-slate-700 pt-3">
                      <label className="block text-sm text-slate-400 mb-2">
                        Downgrade Distribution: <span className="text-amber-400 font-bold">{totalDowngradeRate.toFixed(1)}% total</span>
                      </label>
                      <div className="space-y-2">
                        {lowerBundles.map(bundle => (
                          <div key={bundle} className="bg-slate-700/30 rounded p-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-amber-400">{bundle}</span>
                              <span className="text-xs text-slate-400">
                                {portfolioDowngradeRates[bundle] || 0}%
                              </span>
                            </div>
                            <div className="flex gap-2 items-center">
                              <input type="range" min="0" max="100" step="0.1"
                                value={portfolioDowngradeRates[bundle] || 0}
                                onChange={(e) => setPortfolioDowngradeRates({
                                  ...portfolioDowngradeRates,
                                  [bundle]: Number(e.target.value)
                                })}
                                className="flex-1 h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer" />
                              <input type="number" min="0" max="100" step="0.1"
                                value={portfolioDowngradeRates[bundle] || 0}
                                onChange={(e) => setPortfolioDowngradeRates({
                                  ...portfolioDowngradeRates,
                                  [bundle]: Math.max(0, Math.min(100, Number(e.target.value)))
                                })}
                                className="w-16 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-xs" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Upgrade Distribution - per bundle */}
                {(() => {
                  const higherBundles = getHigherTierBundles(portfolioBundle, BUNDLE_TIER_ORDER);
                  const totalUpgradeRate = Object.values(portfolioUpgradeRates).reduce((s, v) => s + (v || 0), 0);
                  if (higherBundles.length === 0) return null;
                  return (
                    <div className="border-t border-slate-700 pt-3">
                      <label className="block text-sm text-slate-400 mb-2">
                        Upgrade Distribution: <span className="text-blue-400 font-bold">{totalUpgradeRate.toFixed(1)}% total</span>
                      </label>
                      <div className="space-y-2">
                        {higherBundles.map(bundle => (
                          <div key={bundle} className="bg-slate-700/30 rounded p-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-blue-400">{bundle}</span>
                              <span className="text-xs text-slate-400">
                                {portfolioUpgradeRates[bundle] || 0}%
                              </span>
                            </div>
                            <div className="flex gap-2 items-center">
                              <input type="range" min="0" max="100" step="0.1"
                                value={portfolioUpgradeRates[bundle] || 0}
                                onChange={(e) => setPortfolioUpgradeRates({
                                  ...portfolioUpgradeRates,
                                  [bundle]: Number(e.target.value)
                                })}
                                className="flex-1 h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer" />
                              <input type="number" min="0" max="100" step="0.1"
                                value={portfolioUpgradeRates[bundle] || 0}
                                onChange={(e) => setPortfolioUpgradeRates({
                                  ...portfolioUpgradeRates,
                                  [bundle]: Math.max(0, Math.min(100, Number(e.target.value)))
                                })}
                                className="w-16 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-xs" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Add-On Revenue Change % per bundle */}
                <div className="border-t border-slate-700 pt-3">
                  <label className="block text-sm text-slate-400 mb-2">
                    Add-On Revenue Change %
                  </label>
                  <div className="space-y-2">
                    {BUNDLE_TIER_ORDER.map(bundle => {
                      const currentRate = portfolioAddOnLossRates[bundle] || 0;
                      const isSelected = bundle === portfolioBundle;
                      return (
                        <div key={bundle} className="bg-slate-700/30 rounded p-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className={`text-xs ${isSelected ? 'text-purple-400' : 'text-purple-300'}`}>
                              {bundle} {isSelected && '(selected)'}
                            </span>
                            <span className="text-xs text-slate-400">
                              {currentRate >= 0 ? '+' : ''}{currentRate}%
                            </span>
                          </div>
                          <div className="flex gap-2 items-center">
                            <input type="range" min="-100" max="500" step="0.1"
                              value={currentRate}
                              onChange={(e) => setPortfolioAddOnLossRates({
                                ...portfolioAddOnLossRates,
                                [bundle]: Number(e.target.value)
                              })}
                              className="flex-1 h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer" />
                            <input type="number" min="-100" max="500" step="0.1"
                              value={currentRate}
                              onChange={(e) => setPortfolioAddOnLossRates({
                                ...portfolioAddOnLossRates,
                                [bundle]: Math.max(-100, Math.min(500, Number(e.target.value)))
                              })}
                              className="w-16 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-xs" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700">
                  <div className="text-xs text-slate-400">
                    {(() => {
                      const totalDown = Object.values(portfolioDowngradeRates).reduce((s, v) => s + (v || 0), 0);
                      const totalUp = Object.values(portfolioUpgradeRates).reduce((s, v) => s + (v || 0), 0);
                      return `Stay ${Math.max(0, 100 - portfolioChurnRate - totalDown - totalUp).toFixed(0)}% + Churn ${portfolioChurnRate}% + Down ${totalDown.toFixed(1)}% + Up ${totalUp.toFixed(1)}% = 100%`;
                    })()}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* MULTI-BUNDLE MODE CONTROLS */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Select Bundles to Modify</label>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {BUNDLE_TIER_ORDER.map(bundle => (
                      <label key={bundle} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={portfolioSelectedBundles[bundle] || false}
                          onChange={(e) => {
                            setPortfolioSelectedBundles({
                              ...portfolioSelectedBundles,
                              [bundle]: e.target.checked
                            });
                            if (e.target.checked) {
                              if (!portfolioBundlePriceChanges[bundle]) {
                                setPortfolioBundlePriceChanges({ ...portfolioBundlePriceChanges, [bundle]: 0 });
                              }
                              if (!portfolioBundleChurnRates[bundle]) {
                                setPortfolioBundleChurnRates({ ...portfolioBundleChurnRates, [bundle]: 10 });
                              }
                            }
                          }}
                          className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-purple-600"
                        />
                        <span className="flex-1 text-sm text-white">{bundle}</span>
                      </label>
                    ))}
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    {Object.values(portfolioSelectedBundles).filter(Boolean).length} bundle(s) selected
                  </div>
                </div>

                {/* Per-bundle accordion cards */}
                {Object.keys(portfolioSelectedBundles).filter(b => portfolioSelectedBundles[b]).length === 0 ? (
                  <div className="text-center text-slate-400 py-8">
                    Select bundles above to configure price changes
                  </div>
                ) : (
                  BUNDLE_TIER_ORDER.filter(b => portfolioSelectedBundles[b]).map(bundle => {
                    const bundleIndex = BUNDLE_TIER_ORDER.indexOf(bundle);
                    const lowerBundlesForThis = BUNDLE_TIER_ORDER.filter((b, i) => i > bundleIndex);
                    const higherBundlesForThis = BUNDLE_TIER_ORDER.filter((b, i) => i < bundleIndex);
                    const isBottomTierThis = lowerBundlesForThis.length === 0;
                    const isTopTierThis = higherBundlesForThis.length === 0;

                    return (
                      <div key={bundle} className="border border-purple-700 rounded-lg p-3 bg-purple-900/10">
                        <div className="font-semibold text-purple-400 mb-3 flex items-center justify-between">
                          <span>{bundle}</span>
                        </div>

                        {/* Price Change */}
                        <div className="mb-3">
                          <label className="block text-xs text-slate-400 mb-1">
                            Price Change: <span className="text-emerald-400 font-bold">
                              {(portfolioBundlePriceChanges[bundle] || 0) > 0 ? '+' : ''}{portfolioBundlePriceChanges[bundle] || 0}%
                            </span>
                          </label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="range"
                              min="-100"
                              max="500"
                              step="0.1"
                              value={portfolioBundlePriceChanges[bundle] || 0}
                              onChange={(e) => setPortfolioBundlePriceChanges({
                                ...portfolioBundlePriceChanges,
                                [bundle]: Number(e.target.value)
                              })}
                              className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <input
                              type="number"
                              min="-100"
                              max="500"
                              step="0.1"
                              value={portfolioBundlePriceChanges[bundle] || 0}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setPortfolioBundlePriceChanges({
                                  ...portfolioBundlePriceChanges,
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
                            Churn Rate: <span className="text-red-400 font-bold">{portfolioBundleChurnRates[bundle] || 0}%</span>
                          </label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="0.1"
                              value={portfolioBundleChurnRates[bundle] || 0}
                              onChange={(e) => setPortfolioBundleChurnRates({
                                ...portfolioBundleChurnRates,
                                [bundle]: Number(e.target.value)
                              })}
                              className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              value={portfolioBundleChurnRates[bundle] || 0}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setPortfolioBundleChurnRates({
                                  ...portfolioBundleChurnRates,
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
                                      {portfolioBundleDowngradeRates[bundle]?.[targetBundle] || 0}%
                                    </span>
                                  </div>
                                  <div className="flex gap-2 items-center">
                                    <input
                                      type="range"
                                      min="0"
                                      max="100"
                                      step="0.1"
                                      value={portfolioBundleDowngradeRates[bundle]?.[targetBundle] || 0}
                                      onChange={(e) => {
                                        const newRates = { ...portfolioBundleDowngradeRates };
                                        if (!newRates[bundle]) newRates[bundle] = {};
                                        newRates[bundle][targetBundle] = Number(e.target.value);
                                        setPortfolioBundleDowngradeRates(newRates);
                                      }}
                                      className="flex-1 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      step="0.1"
                                      value={portfolioBundleDowngradeRates[bundle]?.[targetBundle] || 0}
                                      onChange={(e) => {
                                        const val = Number(e.target.value);
                                        const newRates = { ...portfolioBundleDowngradeRates };
                                        if (!newRates[bundle]) newRates[bundle] = {};
                                        newRates[bundle][targetBundle] = Math.max(0, Math.min(100, val));
                                        setPortfolioBundleDowngradeRates(newRates);
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
                                      {portfolioBundleUpgradeRates[bundle]?.[targetBundle] || 0}%
                                    </span>
                                  </div>
                                  <div className="flex gap-2 items-center">
                                    <input
                                      type="range"
                                      min="0"
                                      max="100"
                                      step="0.1"
                                      value={portfolioBundleUpgradeRates[bundle]?.[targetBundle] || 0}
                                      onChange={(e) => {
                                        const newRates = { ...portfolioBundleUpgradeRates };
                                        if (!newRates[bundle]) newRates[bundle] = {};
                                        newRates[bundle][targetBundle] = Number(e.target.value);
                                        setPortfolioBundleUpgradeRates(newRates);
                                      }}
                                      className="flex-1 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      step="0.1"
                                      value={portfolioBundleUpgradeRates[bundle]?.[targetBundle] || 0}
                                      onChange={(e) => {
                                        const val = Number(e.target.value);
                                        const newRates = { ...portfolioBundleUpgradeRates };
                                        if (!newRates[bundle]) newRates[bundle] = {};
                                        newRates[bundle][targetBundle] = Math.max(0, Math.min(100, val));
                                        setPortfolioBundleUpgradeRates(newRates);
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

                {/* Add-On Revenue Change % for All Bundles */}
                <div className="border-t border-slate-700 pt-3">
                  <label className="block text-sm text-slate-400 mb-2">
                    Add-On Revenue Change %
                  </label>
                  <div className="space-y-2">
                    {BUNDLE_TIER_ORDER.map(bundle => {
                      const currentRate = portfolioBundleAddOnRates[bundle] || 0;
                      const isSelected = portfolioSelectedBundles[bundle];
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
                              {currentRate >= 0 ? '+' : ''}{currentRate}%
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
                                setPortfolioBundleAddOnRates({
                                  ...portfolioBundleAddOnRates,
                                  [bundle]: Number(e.target.value)
                                });
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
                                setPortfolioBundleAddOnRates({
                                  ...portfolioBundleAddOnRates,
                                  [bundle]: Math.max(-100, Math.min(500, val))
                                });
                              }}
                              className="w-16 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-xs"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Fixed KD Loss - shared across modes */}
            <div className="border-t border-slate-700 pt-3">
              <label className="block text-sm text-slate-400 mb-1">
                Fixed KD Loss per Category: <span className="text-red-400 font-bold">{portfolioFixedKDLoss.toLocaleString()} KD</span>
              </label>
              <input type="number" min="0" step="100" value={portfolioFixedKDLoss}
                onChange={(e) => setPortfolioFixedKDLoss(Number(e.target.value) || 0)}
                placeholder="0"
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-1.5 text-white text-sm" />
            </div>

            {/* Add-On Revenue Editor */}
            <div className="border-t border-slate-700 pt-3">
              <button
                onClick={() => setPortfolioAddOnEditorOpen(!portfolioAddOnEditorOpen)}
                className="flex items-center justify-between w-full text-sm text-slate-400 hover:text-white transition-colors"
              >
                <span>Edit Add-On Revenue</span>
                <span>{portfolioAddOnEditorOpen ? '▼' : '▶'}</span>
              </button>
              {portfolioAddOnEditorOpen && (
                <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                  <button
                    onClick={() => setPortfolioAddOnEdits({})}
                    className="text-xs text-red-400 hover:text-red-300 mb-1"
                  >
                    Reset All Overrides
                  </button>
                  {Object.keys(historicalData).sort().map(cat => {
                    const catAddOns = addOnData[cat];
                    if (!catAddOns || Object.keys(catAddOns).length === 0) return null;
                    return (
                      <div key={cat} className="bg-slate-700/30 rounded p-2">
                        <div className="text-xs text-slate-300 font-semibold mb-1">{cat}</div>
                        <div className="space-y-1">
                          {Object.entries(catAddOns).sort((a, b) => {
                            const iA = BUNDLE_TIER_ORDER.indexOf(a[0]);
                            const iB = BUNDLE_TIER_ORDER.indexOf(b[0]);
                            return (iA === -1 ? 999 : iA) - (iB === -1 ? 999 : iB);
                          }).map(([bundle, revenue]) => {
                            const edited = portfolioAddOnEdits[cat]?.[bundle];
                            const isEdited = edited !== undefined;
                            return (
                              <div key={bundle} className="flex items-center gap-2">
                                <span className={`text-xs w-16 ${isEdited ? 'text-yellow-400' : 'text-slate-400'}`}>{bundle}</span>
                                <input
                                  type="number"
                                  min="0"
                                  step="1"
                                  value={isEdited ? edited : revenue}
                                  onChange={(e) => {
                                    const val = Number(e.target.value) || 0;
                                    setPortfolioAddOnEdits(prev => ({
                                      ...prev,
                                      [cat]: { ...(prev[cat] || {}), [bundle]: val }
                                    }));
                                  }}
                                  className={`w-20 text-xs px-1 py-0.5 rounded border ${
                                    isEdited
                                      ? 'bg-yellow-900/30 border-yellow-600 text-yellow-300'
                                      : 'bg-slate-700 border-slate-600 text-white'
                                  }`}
                                />
                                <span className="text-xs text-slate-500">KD</span>
                                {isEdited && (
                                  <button
                                    onClick={() => {
                                      setPortfolioAddOnEdits(prev => {
                                        const newEdits = { ...prev };
                                        if (newEdits[cat]) {
                                          delete newEdits[cat][bundle];
                                          if (Object.keys(newEdits[cat]).length === 0) delete newEdits[cat];
                                        }
                                        return newEdits;
                                      });
                                    }}
                                    className="text-xs text-red-400 hover:text-red-300"
                                  >
                                    x
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {Object.keys(portfolioAddOnEdits).length > 0 && (
                <div className="text-xs text-yellow-400 mt-1">
                  {Object.values(portfolioAddOnEdits).reduce((s, o) => s + Object.keys(o).length, 0)} override(s) active
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="md:col-span-3 space-y-4">
          {/* Summary Cards */}
          {portfolioSummary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="text-xs text-slate-400 mb-1">Total Current Revenue</div>
                <div className="text-lg font-bold text-white">{portfolioSummary.totalCurrent.toLocaleString(undefined, {maximumFractionDigits: 0})} KD</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="text-xs text-slate-400 mb-1">Total Net Change</div>
                <div className={`text-lg font-bold ${portfolioSummary.totalNetChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {portfolioSummary.totalNetChange >= 0 ? '+' : ''}{portfolioSummary.totalNetChange.toLocaleString(undefined, {maximumFractionDigits: 0})} KD
                  <span className="text-sm ml-1">({portfolioSummary.totalPercentChange >= 0 ? '+' : ''}{portfolioSummary.totalPercentChange.toFixed(1)}%)</span>
                </div>
              </div>
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="text-xs text-slate-400 mb-1">Categories Analyzed</div>
                <div className="text-lg font-bold text-white">{portfolioSummary.categoriesAnalyzed} <span className="text-sm text-slate-400">/ {portfolioSummary.totalCategories}</span></div>
              </div>
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="text-xs text-slate-400 mb-1">Impact Breakdown</div>
                <div className="text-sm">
                  <span className="text-emerald-400 font-bold">{portfolioSummary.positiveCount}</span>
                  <span className="text-slate-500 mx-1">/</span>
                  <span className="text-red-400 font-bold">{portfolioSummary.negativeCount}</span>
                  <span className="text-slate-500 mx-1">/</span>
                  <span className="text-slate-400 font-bold">{portfolioSummary.neutralCount}</span>
                  <span className="text-xs text-slate-500 ml-1">+/-/=</span>
                </div>
              </div>
            </div>
          )}

          {/* Bar Chart */}
          {portfolioResults.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-3 text-slate-300">Net Revenue Change by Category</h3>
              <ResponsiveContainer width="100%" height={Math.max(300, portfolioResults.length * 28)}>
                <BarChart
                  layout="vertical"
                  data={[...portfolioResults].sort((a, b) => a.netRevenueChange - b.netRevenueChange)}
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v >= 0 ? '+' : ''}${v.toLocaleString()}`} />
                  <YAxis type="category" dataKey="category" stroke="#94a3b8" tick={{ fontSize: 11 }} width={95} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                    formatter={(value) => [`${value >= 0 ? '+' : ''}${value.toLocaleString(undefined, {maximumFractionDigits: 0})} KD`, 'Net Change']}
                  />
                  <ReferenceLine x={0} stroke="#64748b" />
                  <Bar dataKey="netRevenueChange" name="Net Change">
                    {[...portfolioResults].sort((a, b) => a.netRevenueChange - b.netRevenueChange).map((entry, index) => (
                      <Cell key={index} fill={entry.netRevenueChange >= 0 ? '#10b981' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Per-Category Results Table */}
          {portfolioResults.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-4 overflow-x-auto">
              <h3 className="text-sm font-semibold mb-3 text-slate-300">Per-Category Breakdown</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    {[
                      { key: 'category', label: 'Category', align: 'left' },
                      { key: 'currentRevenue', label: 'Current Rev', align: 'right' },
                      { key: 'newRevenue', label: 'New Rev', align: 'right' },
                      { key: 'netRevenueChange', label: 'Net Change', align: 'right' },
                      { key: 'percentChange', label: '% Change', align: 'right' },
                      { key: 'currentListings', label: 'Listings', align: 'right' },
                      { key: 'currentCPL', label: 'Current CPL', align: 'right' },
                      { key: 'newCPL', label: 'New CPL', align: 'right' },
                    ].map(col => (
                      <th
                        key={col.key}
                        className={`py-2 px-3 text-${col.align} text-slate-400 cursor-pointer hover:text-white transition-colors select-none`}
                        onClick={() => {
                          if (portfolioSortBy === col.key) {
                            setPortfolioSortAsc(!portfolioSortAsc);
                          } else {
                            setPortfolioSortBy(col.key);
                            setPortfolioSortAsc(col.key === 'category');
                          }
                        }}
                      >
                        {col.label} {portfolioSortBy === col.key ? (portfolioSortAsc ? '▲' : '▼') : ''}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...portfolioResults]
                    .sort((a, b) => {
                      const valA = a[portfolioSortBy];
                      const valB = b[portfolioSortBy];
                      if (typeof valA === 'string') {
                        return portfolioSortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
                      }
                      return portfolioSortAsc ? valA - valB : valB - valA;
                    })
                    .map(row => (
                      <tr
                        key={row.category}
                        className={`border-b border-slate-700/50 ${row.netRevenueChange > 0 ? 'bg-emerald-900/10' : row.netRevenueChange < 0 ? 'bg-red-900/10' : ''}`}
                      >
                        <td className="py-2 px-3 text-white">{row.category}</td>
                        <td className="py-2 px-3 text-right font-mono text-slate-300">{row.currentRevenue.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                        <td className="py-2 px-3 text-right font-mono text-slate-300">{row.newRevenue.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                        <td className={`py-2 px-3 text-right font-mono font-bold ${row.netRevenueChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {row.netRevenueChange >= 0 ? '+' : ''}{row.netRevenueChange.toLocaleString(undefined, {maximumFractionDigits: 0})}
                        </td>
                        <td className={`py-2 px-3 text-right font-mono ${row.percentChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {row.percentChange >= 0 ? '+' : ''}{row.percentChange.toFixed(1)}%
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-slate-300">{row.currentListings.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right font-mono text-slate-300">{portfolioIsMultiBundle ? '—' : row.currentCPL.toFixed(2)}</td>
                        <td className="py-2 px-3 text-right font-mono text-slate-300">{portfolioIsMultiBundle ? '—' : row.newCPL.toFixed(2)}</td>
                      </tr>
                    ))}
                </tbody>
                {portfolioSummary && (
                  <tfoot>
                    <tr className="border-t-2 border-slate-600 font-bold">
                      <td className="py-2 px-3 text-cyan-400">TOTAL</td>
                      <td className="py-2 px-3 text-right font-mono text-cyan-400">{portfolioSummary.totalCurrent.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                      <td className="py-2 px-3 text-right font-mono text-cyan-400">{portfolioSummary.totalNew.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                      <td className={`py-2 px-3 text-right font-mono ${portfolioSummary.totalNetChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {portfolioSummary.totalNetChange >= 0 ? '+' : ''}{portfolioSummary.totalNetChange.toLocaleString(undefined, {maximumFractionDigits: 0})}
                      </td>
                      <td className={`py-2 px-3 text-right font-mono ${portfolioSummary.totalPercentChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {portfolioSummary.totalPercentChange >= 0 ? '+' : ''}{portfolioSummary.totalPercentChange.toFixed(1)}%
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-cyan-400">{portfolioResults.reduce((s, r) => s + r.currentListings, 0).toLocaleString()}</td>
                      <td className="py-2 px-3 text-right text-slate-500">—</td>
                      <td className="py-2 px-3 text-right text-slate-500">—</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}

          {portfolioResults.length === 0 && (
            <div className="bg-slate-800 rounded-lg p-8 text-center text-slate-400">
              {portfolioIsMultiBundle
                ? 'Select bundles and configure rates to see portfolio impact.'
                : <>No categories have the <span className="text-white font-bold">{portfolioBundle}</span> bundle. Try selecting a different bundle.</>
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
