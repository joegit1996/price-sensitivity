import React, { createContext, useContext, useReducer, useMemo, useEffect, useCallback } from 'react';
import usePersistedState from '../hooks/usePersistedState';
import historicalBundleData from '../data/historicalBundleData';
import defaultAddOnData from '../data/defaultAddOnData';
import { BUNDLE_TIER_ORDER, getHigherTierBundles, getLowerTierBundles } from '../data/bundleTiers';
import { calculateSingleBundleResults, calculateMultiBundleResults, calculatePortfolioResults } from '../utils/calculations';

const SimulatorContext = createContext(null);

export function useSimulator() {
  const ctx = useContext(SimulatorContext);
  if (!ctx) throw new Error('useSimulator must be used within SimulatorProvider');
  return ctx;
}

export function SimulatorProvider({ children }) {
  // Tab state
  const [activeTab, setActiveTab] = React.useState('historical');

  // Persisted state (localStorage-backed)
  const [historicalData, setHistoricalData] = usePersistedState('historicalData', historicalBundleData);
  const [customScenarios, setCustomScenarios] = usePersistedState('customScenarios', {});
  const [savedAbTests, setSavedAbTests] = usePersistedState('savedAbTests', []);
  const [addOnData, setAddOnData] = usePersistedState('addOnData', defaultAddOnData);
  const [addOnLossRates, setAddOnLossRates] = usePersistedState('addOnLossRates', {});
  const [isMultiBundleMode, setIsMultiBundleMode] = usePersistedState('isMultiBundleMode', false);
  const [selectedBundles, setSelectedBundles] = usePersistedState('selectedBundles', {});
  const [bundlePriceChanges, setBundlePriceChanges] = usePersistedState('bundlePriceChanges', {});
  const [bundleChurnRates, setBundleChurnRates] = usePersistedState('bundleChurnRates', {});
  const [bundleDowngradeRates, setBundleDowngradeRates] = usePersistedState('bundleDowngradeRates', {});
  const [bundleUpgradeRates, setBundleUpgradeRates] = usePersistedState('bundleUpgradeRates', {});

  // Custom scenario editing state
  const [currentScenarioName, setCurrentScenarioName] = React.useState('');
  const [editingBundles, setEditingBundles] = React.useState([]);
  const [newBundleName, setNewBundleName] = React.useState('');
  const [newBundleCPL, setNewBundleCPL] = React.useState('');
  const [newBundleListings, setNewBundleListings] = React.useState('');

  // Calculation state
  const [selectedCategory, setSelectedCategory] = React.useState('AC Services');
  const [selectedBundle, setSelectedBundle] = React.useState('Plus');
  const [priceChange, setPriceChange] = React.useState(20);
  const [churnRate, setChurnRate] = React.useState(10);
  const [downgradeRates, setDowngradeRates] = React.useState({});
  const [upgradeRates, setUpgradeRates] = React.useState({});
  const [fixedKDLoss, setFixedKDLoss] = React.useState(0);
  const [showCalculations, setShowCalculations] = React.useState(false);

  // A/B Testing state
  const [abTestCategory, setAbTestCategory] = React.useState('AC Services');
  const [abTestBundle, setAbTestBundle] = React.useState('Plus');
  const [abTestPriceChange, setAbTestPriceChange] = React.useState(20);
  const [abTestGroupSize, setAbTestGroupSize] = React.useState('');
  const [abTestDuration, setAbTestDuration] = React.useState(60);
  const [abTestName, setAbTestName] = React.useState('');
  const [abTestResults, setAbTestResults] = React.useState(null);

  // Portfolio Analysis state
  const [portfolioBundle, setPortfolioBundle] = React.useState('Plus');
  const [portfolioSortBy, setPortfolioSortBy] = React.useState('netChange');
  const [portfolioSortAsc, setPortfolioSortAsc] = React.useState(false);
  const [portfolioPriceChange, setPortfolioPriceChange] = React.useState(20);
  const [portfolioChurnRate, setPortfolioChurnRate] = React.useState(10);
  const [portfolioDowngradeRates, setPortfolioDowngradeRates] = React.useState({});
  const [portfolioUpgradeRates, setPortfolioUpgradeRates] = React.useState({});
  const [portfolioAddOnLossRates, setPortfolioAddOnLossRates] = React.useState({});
  const [portfolioFixedKDLoss, setPortfolioFixedKDLoss] = React.useState(0);

  // Portfolio multi-bundle mode state
  const [portfolioIsMultiBundle, setPortfolioIsMultiBundle] = React.useState(false);
  const [portfolioSelectedBundles, setPortfolioSelectedBundles] = React.useState({});
  const [portfolioBundlePriceChanges, setPortfolioBundlePriceChanges] = React.useState({});
  const [portfolioBundleChurnRates, setPortfolioBundleChurnRates] = React.useState({});
  const [portfolioBundleDowngradeRates, setPortfolioBundleDowngradeRates] = React.useState({});
  const [portfolioBundleUpgradeRates, setPortfolioBundleUpgradeRates] = React.useState({});
  const [portfolioBundleAddOnRates, setPortfolioBundleAddOnRates] = React.useState({});
  const [portfolioAddOnEdits, setPortfolioAddOnEdits] = React.useState({});
  const [portfolioAddOnEditorOpen, setPortfolioAddOnEditorOpen] = React.useState(false);

  // Derived data
  const bundleData = useMemo(() => {
    if (activeTab === 'historical' || activeTab === 'abtest' || activeTab === 'portfolio') {
      return historicalData;
    } else {
      return customScenarios;
    }
  }, [activeTab, historicalData, customScenarios]);

  const categories = Object.keys(bundleData).sort();
  const hasData = categories.length > 0;

  const categoryData = hasData ? (bundleData[selectedCategory] || {}) : {};
  const availableBundles = Object.keys(categoryData).filter(b => categoryData[b]?.totalListings > 0);

  const higherBundles = hasData ? getHigherTierBundles(selectedBundle, availableBundles) : [];
  const lowerBundles = hasData ? getLowerTierBundles(selectedBundle, availableBundles) : [];

  const isTopTier = higherBundles.length === 0;
  const isBottomTier = lowerBundles.length === 0;

  // A/B test derived data
  const abTestCategoryData = historicalData[abTestCategory] || {};
  const abTestAvailableBundles = Object.keys(abTestCategoryData).filter(b => abTestCategoryData[b]?.totalListings > 0);
  const abTestBundleData = abTestCategoryData[abTestBundle] || {};
  const abTestHigherBundles = getHigherTierBundles(abTestBundle, abTestAvailableBundles);
  const abTestLowerBundles = getLowerTierBundles(abTestBundle, abTestAvailableBundles);

  // Initialize downgrade/upgrade rates when bundle or category changes
  useEffect(() => {
    const newDowngradeRates = {};
    lowerBundles.forEach((bundle, index) => {
      newDowngradeRates[bundle] = downgradeRates[bundle] !== undefined ? downgradeRates[bundle] : (index === 0 ? 5 : 0);
    });
    setDowngradeRates(newDowngradeRates);

    const newUpgradeRates = {};
    higherBundles.forEach((bundle, index) => {
      newUpgradeRates[bundle] = upgradeRates[bundle] !== undefined ? upgradeRates[bundle] : (index === higherBundles.length - 1 ? 3 : 0);
    });
    setUpgradeRates(newUpgradeRates);
  }, [selectedBundle, selectedCategory, lowerBundles.length, higherBundles.length]);

  const totalDowngradeRate = Object.values(downgradeRates).reduce((sum, rate) => sum + (rate || 0), 0);
  const totalUpgradeRate = Object.values(upgradeRates).reduce((sum, rate) => sum + (rate || 0), 0);

  const categoryTotals = useMemo(() => {
    let totalRev = 0, totalListings = 0;
    Object.values(categoryData).forEach(b => {
      totalRev += b.totalRevenue;
      totalListings += b.totalListings;
    });
    return { totalRevenue: totalRev, totalListings };
  }, [categoryData]);

  // Main calculation
  const results = useMemo(() => {
    if (!hasData) return null;
    return calculateSingleBundleResults({
      categoryData, selectedCategory, selectedBundle, priceChange, churnRate,
      downgradeRates, upgradeRates, totalDowngradeRate, totalUpgradeRate,
      fixedKDLoss, categoryTotals, isTopTier, isBottomTier,
      lowerBundles, higherBundles, addOnData, addOnLossRates
    });
  }, [hasData, categoryData, selectedCategory, selectedBundle, priceChange, churnRate, downgradeRates, upgradeRates, totalDowngradeRate, totalUpgradeRate, fixedKDLoss, categoryTotals, isTopTier, isBottomTier, lowerBundles, higherBundles, addOnData, addOnLossRates]);

  // Multi-Bundle calculation
  const multiBundleResults = useMemo(() => {
    if (!isMultiBundleMode || !hasData) return null;
    return calculateMultiBundleResults({
      categoryData, selectedCategory, selectedBundles, bundlePriceChanges,
      bundleChurnRates, bundleDowngradeRates, bundleUpgradeRates,
      addOnData, addOnLossRates, fixedKDLoss
    });
  }, [isMultiBundleMode, hasData, categoryData, selectedBundles, bundlePriceChanges, bundleChurnRates, bundleDowngradeRates, bundleUpgradeRates, selectedCategory, addOnData, addOnLossRates, fixedKDLoss]);

  // Portfolio Analysis
  const portfolioResults = useMemo(() => {
    return calculatePortfolioResults({
      historicalData, addOnData, portfolioAddOnEdits,
      portfolioIsMultiBundle, portfolioSelectedBundles, portfolioBundlePriceChanges,
      portfolioBundleChurnRates, portfolioBundleDowngradeRates, portfolioBundleUpgradeRates,
      portfolioBundleAddOnRates,
      portfolioBundle, portfolioPriceChange, portfolioChurnRate,
      portfolioDowngradeRates, portfolioUpgradeRates, portfolioAddOnLossRates,
      portfolioFixedKDLoss
    });
  }, [historicalData, portfolioBundle, portfolioPriceChange, portfolioChurnRate, portfolioDowngradeRates, portfolioUpgradeRates, portfolioAddOnLossRates, portfolioFixedKDLoss, addOnData, portfolioIsMultiBundle, portfolioSelectedBundles, portfolioBundlePriceChanges, portfolioBundleChurnRates, portfolioBundleDowngradeRates, portfolioBundleUpgradeRates, portfolioBundleAddOnRates, portfolioAddOnEdits]);

  // Portfolio summary
  const portfolioSummary = useMemo(() => {
    if (!portfolioResults || portfolioResults.length === 0) return null;

    const totalCurrent = portfolioResults.reduce((sum, r) => sum + r.currentRevenue, 0);
    const totalNew = portfolioResults.reduce((sum, r) => sum + r.newRevenue, 0);
    const totalNetChange = portfolioResults.reduce((sum, r) => sum + r.netRevenueChange, 0);
    const totalPercentChange = totalCurrent > 0 ? (totalNetChange / totalCurrent) * 100 : 0;
    const positiveCount = portfolioResults.filter(r => r.netRevenueChange > 0).length;
    const negativeCount = portfolioResults.filter(r => r.netRevenueChange < 0).length;
    const neutralCount = portfolioResults.filter(r => r.netRevenueChange === 0).length;
    const totalCurrentAddOn = portfolioResults.reduce((sum, r) => sum + r.currentAddOnRevenue, 0);
    const totalNewAddOn = portfolioResults.reduce((sum, r) => sum + r.newAddOnRevenue, 0);
    const totalAddOnChange = portfolioResults.reduce((sum, r) => sum + r.addOnRevenueChange, 0);
    const totalCplChange = portfolioResults.reduce((sum, r) => sum + r.cplRevenueChange, 0);
    const totalDowngradeRevenue = portfolioResults.reduce((sum, r) => sum + r.downgradeRevenue, 0);
    const totalUpgradeRevenue = portfolioResults.reduce((sum, r) => sum + r.upgradeRevenue, 0);

    return {
      totalCurrent, totalNew, totalNetChange, totalPercentChange,
      categoriesAnalyzed: portfolioResults.length,
      totalCategories: Object.keys(historicalData).length,
      positiveCount, negativeCount, neutralCount,
      totalCurrentAddOn, totalNewAddOn, totalAddOnChange, totalCplChange,
      totalDowngradeRevenue, totalUpgradeRevenue
    };
  }, [portfolioResults, historicalData]);

  // Visualization data
  const waterfallData = useMemo(() => {
    if (!results || !hasData) return [];
    return [
      { name: 'Current Revenue', value: results.currentRevenue, fill: '#64748b', type: 'start' },
      { name: 'Price Increase Effect', value: results.newBundleRevenue - results.currentRevenue + results.lostRevenue, fill: results.newBundleRevenue > results.currentRevenue ? '#10b981' : '#ef4444', type: 'change' },
      { name: 'Lost to Churn', value: -results.lostRevenue, fill: '#ef4444', type: 'change' },
      { name: 'From Downgrades', value: results.downgradeRevenue, fill: '#f59e0b', type: 'change' },
      { name: 'From Upgrades', value: results.upgradeRevenue, fill: '#3b82f6', type: 'change' },
      { name: 'New Revenue', value: results.newBundleRevenue + results.downgradeRevenue + results.upgradeRevenue, fill: results.netRevenueChange >= 0 ? '#10b981' : '#ef4444', type: 'end' },
    ];
  }, [results]);

  const sensitivityData = useMemo(() => {
    if (!results || !hasData) return [];
    const data = [];
    for (let churn = 0; churn <= 50; churn += 5) {
      const bundleInfo = categoryData[selectedBundle];

      const effectiveDowngrade = isBottomTier ? 0 : totalDowngradeRate;
      const effectiveUpgrade = isTopTier ? 0 : totalUpgradeRate;
      const stayRate = Math.max(0, 100 - churn - effectiveDowngrade - effectiveUpgrade);

      const newCPL = bundleInfo.avgCPL * (1 + priceChange / 100);
      const stayingListings = bundleInfo.totalListings * (stayRate / 100);

      const newBundleRev = stayingListings * newCPL;

      let downgradeRev = 0;
      lowerBundles.forEach(bundle => {
        const rate = downgradeRates[bundle] || 0;
        const listings = bundleInfo.totalListings * (rate / 100);
        const bd = categoryData[bundle];
        downgradeRev += bd ? listings * bd.avgCPL : 0;
      });

      let upgradeRev = 0;
      higherBundles.forEach(bundle => {
        const rate = upgradeRates[bundle] || 0;
        const listings = bundleInfo.totalListings * (rate / 100);
        const bd = categoryData[bundle];
        upgradeRev += bd ? listings * bd.avgCPL : 0;
      });

      const netChange = (newBundleRev - bundleInfo.totalRevenue) + downgradeRev + upgradeRev - fixedKDLoss;

      data.push({ churnRate: churn, netChange: Math.round(netChange) });
    }
    return data;
  }, [hasData, results, categoryData, selectedBundle, priceChange, downgradeRates, upgradeRates, totalDowngradeRate, totalUpgradeRate, fixedKDLoss, isTopTier, isBottomTier, lowerBundles, higherBundles]);

  const bundleRevenueShare = results ? (results.currentRevenue / categoryTotals.totalRevenue * 100).toFixed(1) : '0';
  const bundleListingsShare = results ? (results.currentListings / categoryTotals.totalListings * 100).toFixed(1) : '0';

  // Action handlers
  const applyAbTestResults = useCallback((testResults) => {
    setActiveTab('historical');
    setSelectedCategory(testResults.category);
    setSelectedBundle(testResults.bundle);
    setPriceChange(testResults.priceChange);
    setChurnRate(testResults.churnRate);

    const newDowngradeRates = {};
    Object.entries(testResults.downgradeRates).forEach(([bundle, data]) => {
      newDowngradeRates[bundle] = data.rate;
    });
    setDowngradeRates(newDowngradeRates);

    const newUpgradeRates = {};
    Object.entries(testResults.upgradeRates).forEach(([bundle, data]) => {
      newUpgradeRates[bundle] = data.rate;
    });
    setUpgradeRates(newUpgradeRates);
  }, []);

  const saveAbTest = useCallback(() => {
    if (!abTestResults) {
      alert('No test results to save. Please upload results first.');
      return;
    }
    if (!abTestName.trim()) {
      alert('Please enter a name for this test.');
      return;
    }

    const newTest = {
      id: Date.now(),
      name: abTestName,
      date: new Date().toISOString().split('T')[0],
      ...abTestResults
    };

    setSavedAbTests([newTest, ...savedAbTests]);
    setAbTestName('');
    alert('Test saved successfully!');
  }, [abTestResults, abTestName, savedAbTests]);

  const deleteAbTest = useCallback((testId) => {
    if (confirm('Delete this saved test?')) {
      setSavedAbTests(savedAbTests.filter(t => t.id !== testId));
    }
  }, [savedAbTests]);

  const addBundle = useCallback(() => {
    if (!newBundleName || !newBundleCPL || !newBundleListings) {
      alert('Please fill all fields');
      return;
    }

    setEditingBundles([...editingBundles, {
      name: newBundleName,
      cpl: parseFloat(newBundleCPL),
      listings: parseInt(newBundleListings)
    }]);

    setNewBundleName('');
    setNewBundleCPL('');
    setNewBundleListings('');
  }, [newBundleName, newBundleCPL, newBundleListings, editingBundles]);

  const removeBundle = useCallback((index) => {
    setEditingBundles(editingBundles.filter((_, i) => i !== index));
  }, [editingBundles]);

  const saveCustomScenario = useCallback(() => {
    if (!currentScenarioName) {
      alert('Please enter a scenario name');
      return;
    }
    if (editingBundles.length === 0) {
      alert('Please add at least one bundle');
      return;
    }

    const scenarioData = {};
    editingBundles.forEach(bundle => {
      const totalRevenue = bundle.cpl * bundle.listings;
      scenarioData[bundle.name] = {
        totalRevenue,
        totalListings: bundle.listings,
        avgCPL: bundle.cpl
      };
    });

    setCustomScenarios({
      ...customScenarios,
      [currentScenarioName]: scenarioData
    });

    alert(`Scenario "${currentScenarioName}" saved successfully!`);
  }, [currentScenarioName, editingBundles, customScenarios]);

  const loadScenarioForEdit = useCallback((scenarioName) => {
    const scenario = customScenarios[scenarioName];
    if (!scenario) return;

    const bundles = Object.entries(scenario).map(([name, data]) => ({
      name,
      cpl: data.avgCPL,
      listings: data.totalListings
    }));

    setEditingBundles(bundles);
    setCurrentScenarioName(scenarioName);
  }, [customScenarios]);

  const deleteScenario = useCallback((scenarioName) => {
    if (!confirm(`Delete scenario "${scenarioName}"?`)) return;

    const updated = { ...customScenarios };
    delete updated[scenarioName];
    setCustomScenarios(updated);

    if (selectedCategory === scenarioName) {
      const remaining = Object.keys(updated);
      if (remaining.length > 0) {
        setSelectedCategory(remaining[0]);
      }
    }
  }, [customScenarios, selectedCategory]);

  const value = {
    // Tab
    activeTab, setActiveTab,
    // Data
    historicalData, setHistoricalData, bundleData,
    customScenarios, setCustomScenarios,
    addOnData, setAddOnData,
    addOnLossRates, setAddOnLossRates,
    // Category / bundle selection
    categories, hasData, categoryData, availableBundles,
    selectedCategory, setSelectedCategory,
    selectedBundle, setSelectedBundle,
    higherBundles, lowerBundles, isTopTier, isBottomTier,
    // Single bundle controls
    priceChange, setPriceChange,
    churnRate, setChurnRate,
    downgradeRates, setDowngradeRates,
    upgradeRates, setUpgradeRates,
    fixedKDLoss, setFixedKDLoss,
    showCalculations, setShowCalculations,
    totalDowngradeRate, totalUpgradeRate,
    categoryTotals,
    // Multi-bundle mode
    isMultiBundleMode, setIsMultiBundleMode,
    selectedBundles, setSelectedBundles,
    bundlePriceChanges, setBundlePriceChanges,
    bundleChurnRates, setBundleChurnRates,
    bundleDowngradeRates, setBundleDowngradeRates,
    bundleUpgradeRates, setBundleUpgradeRates,
    // A/B Testing
    abTestCategory, setAbTestCategory,
    abTestBundle, setAbTestBundle,
    abTestPriceChange, setAbTestPriceChange,
    abTestGroupSize, setAbTestGroupSize,
    abTestDuration, setAbTestDuration,
    abTestName, setAbTestName,
    abTestResults, setAbTestResults,
    savedAbTests, setSavedAbTests,
    abTestCategoryData, abTestAvailableBundles, abTestBundleData,
    abTestHigherBundles, abTestLowerBundles,
    // Portfolio
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
    // Computed results
    results, multiBundleResults,
    portfolioResults, portfolioSummary,
    waterfallData, sensitivityData,
    bundleRevenueShare, bundleListingsShare,
    // Custom scenario editing
    currentScenarioName, setCurrentScenarioName,
    editingBundles, setEditingBundles,
    newBundleName, setNewBundleName,
    newBundleCPL, setNewBundleCPL,
    newBundleListings, setNewBundleListings,
    // Actions
    applyAbTestResults, saveAbTest, deleteAbTest,
    addBundle, removeBundle, saveCustomScenario,
    loadScenarioForEdit, deleteScenario,
  };

  return (
    <SimulatorContext.Provider value={value}>
      {children}
    </SimulatorContext.Provider>
  );
}
