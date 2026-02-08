import React from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import { downloadAbTestTemplate, handleAbTestResultsUpload } from '../../utils/csvHandlers';

export default function ABTestingTab() {
  const {
    historicalData,
    abTestCategory, setAbTestCategory,
    abTestBundle, setAbTestBundle,
    abTestPriceChange, setAbTestPriceChange,
    abTestGroupSize, setAbTestGroupSize,
    abTestDuration, setAbTestDuration,
    abTestName, setAbTestName,
    abTestResults, setAbTestResults,
    savedAbTests,
    abTestCategoryData, abTestAvailableBundles, abTestBundleData,
    abTestHigherBundles, abTestLowerBundles,
    applyAbTestResults, saveAbTest, deleteAbTest,
  } = useSimulator();

  return (
    <div className="space-y-6 mb-6">
      {/* Incomplete Feature Disclaimer */}
      <div className="bg-yellow-900/40 border-2 border-yellow-500/60 rounded-lg p-5 text-center">
        <div className="text-yellow-400 text-2xl font-bold mb-2">&#9888; Work in Progress</div>
        <p className="text-yellow-200 text-base">
          This A/B Testing feature is still incomplete and under active development. Functionality may be missing, broken, or subject to change.
        </p>
      </div>

      {/* Test Designer Section */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Test Designer</h2>
        <p className="text-slate-400 text-sm mb-4">Plan your A/B test before running it</p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Test Configuration */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Category</label>
              <select
                value={abTestCategory}
                onChange={(e) => {
                  setAbTestCategory(e.target.value);
                  const bundles = Object.keys(historicalData[e.target.value] || {});
                  if (bundles.length > 0 && !bundles.includes(abTestBundle)) {
                    setAbTestBundle(bundles[0]);
                  }
                }}
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm"
              >
                {Object.keys(historicalData).sort().map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Bundle to Test</label>
              <select
                value={abTestBundle}
                onChange={(e) => setAbTestBundle(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm"
              >
                {abTestAvailableBundles.map(bundle => (
                  <option key={bundle} value={bundle}>
                    {bundle} ({abTestCategoryData[bundle]?.avgCPL.toFixed(2)} KD, {abTestCategoryData[bundle]?.totalListings} listings)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Proposed Price Change: <span className="text-emerald-400 font-bold">+{abTestPriceChange}%</span>
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={abTestPriceChange}
                onChange={(e) => setAbTestPriceChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs text-slate-500">
                New CPL: {((abTestBundleData.avgCPL || 0) * (1 + abTestPriceChange / 100)).toFixed(2)} KD
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Test Duration (days)</label>
              <input
                type="number"
                value={abTestDuration}
                onChange={(e) => setAbTestDuration(Number(e.target.value))}
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Test Recommendations */}
          <div className="space-y-3">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="text-xs text-slate-400 mb-1">Revenue at Risk (worst case 30% churn)</div>
              <div className="text-2xl font-bold text-amber-400">
                {Math.round((abTestBundleData.totalRevenue || 0) * 0.3).toLocaleString()} KD
              </div>
              <div className="text-xs text-slate-500">
                {(((abTestBundleData.totalRevenue || 0) * 0.3) / (Object.values(abTestCategoryData).reduce((sum, b) => sum + b.totalRevenue, 0) || 1) * 100).toFixed(1)}% of category revenue
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="text-xs text-slate-400 mb-1">Suggested Duration</div>
              <div className="text-lg font-bold text-purple-400">30-60 days</div>
              <div className="text-xs text-slate-500">Allows time for customer decisions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Importer Section */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Import Test Results</h2>
        <p className="text-slate-400 text-sm mb-4">Upload your A/B test results to calculate recommended percentages</p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Import Configuration */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Starting Test Group Size</label>
              <input
                type="number"
                value={abTestGroupSize}
                onChange={(e) => setAbTestGroupSize(e.target.value)}
                placeholder={`e.g., ${abTestBundleData.totalListings || 464}`}
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm"
              />
              <div className="text-xs text-slate-500 mt-1">
                How many customers were in the test group at the start
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => downloadAbTestTemplate(abTestAvailableBundles)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors"
              >
                Download Template
              </button>
              <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm cursor-pointer transition-colors">
                Upload Results CSV
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleAbTestResultsUpload(e, {
                    abTestGroupSize, abTestBundleData, abTestBundle, abTestCategory,
                    abTestPriceChange, abTestDuration, abTestLowerBundles, abTestHigherBundles,
                    setAbTestResults
                  })}
                  className="hidden"
                />
              </label>
            </div>

            <div className="bg-slate-700/30 rounded p-3 text-xs text-slate-400">
              <div className="font-semibold mb-1">CSV Format:</div>
              <pre className="text-slate-500">Bundle,Listings{'\n'}Plus,380{'\n'}Extra,23{'\n'}Super,14</pre>
            </div>
          </div>

          {/* Results Display */}
          <div>
            {abTestResults ? (
              <div className="space-y-3">
                <div className="bg-emerald-900/30 border border-emerald-700 rounded-lg p-4">
                  <div className="text-sm font-semibold text-emerald-400 mb-3">Recommended Percentages</div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-slate-400">Churn Rate:</span>
                    </div>
                    <div className="font-bold text-red-400">{abTestResults.churnRate}%</div>

                    <div className="col-span-2 border-t border-slate-700 my-1"></div>

                    <div className="text-slate-400">Downgrade Total:</div>
                    <div className="font-bold text-amber-400">{abTestResults.totalDowngradeRate}%</div>

                    {Object.entries(abTestResults.downgradeRates).map(([bundle, data]) => (
                      <React.Fragment key={bundle}>
                        <div className="text-slate-500 pl-2">&rarr; {bundle}:</div>
                        <div className="text-amber-300">{data.rate}% ({data.count})</div>
                      </React.Fragment>
                    ))}

                    <div className="col-span-2 border-t border-slate-700 my-1"></div>

                    <div className="text-slate-400">Upgrade Total:</div>
                    <div className="font-bold text-blue-400">{abTestResults.totalUpgradeRate}%</div>

                    {Object.entries(abTestResults.upgradeRates).map(([bundle, data]) => (
                      <React.Fragment key={bundle}>
                        <div className="text-slate-500 pl-2">&rarr; {bundle}:</div>
                        <div className="text-blue-300">{data.rate}% ({data.count})</div>
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400">Confidence:</span>
                      <span className={`font-bold ${
                        abTestResults.confidenceLevel === 'HIGH' ? 'text-emerald-400' :
                        abTestResults.confidenceLevel === 'MEDIUM' ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {abTestResults.confidenceLevel}
                      </span>
                      <span className="text-slate-500">(&plusmn;{abTestResults.marginOfError}%)</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => applyAbTestResults(abTestResults)}
                    className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded text-sm font-semibold transition-colors"
                  >
                    Apply to Simulator
                  </button>
                  <input
                    type="text"
                    value={abTestName}
                    onChange={(e) => setAbTestName(e.target.value)}
                    placeholder="Test name..."
                    className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm"
                  />
                  <button
                    onClick={saveAbTest}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-semibold transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-700/30 rounded-lg p-8 text-center">
                <div className="text-slate-500 text-sm">Upload test results to see recommended percentages</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Saved Tests Section */}
      {savedAbTests.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Saved Tests</h2>
          <div className="space-y-2">
            {savedAbTests.map(test => (
              <div key={test.id} className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
                <div>
                  <div className="font-semibold">{test.name}</div>
                  <div className="text-xs text-slate-400">
                    {test.category} &rarr; {test.bundle} +{test.priceChange}% | {test.date}
                  </div>
                  <div className="text-xs text-slate-500">
                    Churn: {test.churnRate}% | Down: {test.totalDowngradeRate}% | Up: {test.totalUpgradeRate}%
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => applyAbTestResults(test)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 rounded text-xs transition-colors"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => deleteAbTest(test.id)}
                    className="px-3 py-1 bg-red-600/50 hover:bg-red-600 rounded text-xs transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
