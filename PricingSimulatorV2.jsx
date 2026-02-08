import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell, ReferenceLine } from 'recharts';

// Default add-on revenue data (from actual data)
// Format: Category -> Bundle -> totalAddOnRevenue
const defaultAddOnData = {
  "AC Services": {
    "Basic": 232.0,
    "Extra": 16.0,
    "Plus": 85.0,
    "Standard": 21.0,
    "Super": 135.0
  },
  "Agricultural Products": {
    "Basic": 8.0,
    "Extra": 2.0
  },
  "Aluminum": {
    "Basic": 452.0,
    "Extra": 41.0,
    "Plus": 68.0,
    "Premium": 9.0,
    "Standard": 42.0,
    "Super": 143.0
  },
  "Bugs Exterminator": {
    "Basic": 87.0,
    "Extra": 6.0,
    "Plus": 49.0,
    "Super": 126.0
  },
  "Builders": {
    "Basic": 895.0,
    "Extra": 67.0,
    "Optimum": 17.0,
    "Plus": 65.0,
    "Premium": 13.0,
    "Standard": 49.0,
    "Super": 78.0
  },
  "Building Materials": {
    "Basic": 15.0,
    "Optimum": 2.0,
    "Plus": 4.0,
    "Standard": 3.0,
    "Super": 15.0
  },
  "Carpenter": {
    "Basic": 303.0,
    "Extra": 81.0,
    "Plus": 21.0,
    "Premium": 4.0,
    "Standard": 2.0,
    "Super": 28.0
  },
  "Ceramic": {
    "Basic": 285.0,
    "Extra": 44.0,
    "Plus": 81.0,
    "Standard": 15.0,
    "Super": 116.0
  },
  "Decoration": {
    "Basic": 852.0,
    "Extra": 66.0,
    "Optimum": 3.0,
    "Plus": 122.0,
    "Premium": 14.0,
    "Standard": 7.0,
    "Super": 120.0
  },
  "Doors": {
    "Basic": 106.0,
    "Extra": 2.0,
    "Optimum": 7.0,
    "Standard": 40.0,
    "Super": 21.0
  },
  "Duct Cleaning": {
    "Basic": 226.0,
    "Extra": 4.0,
    "Plus": 16.0,
    "Premium": 1.0,
    "Super": 66.0
  },
  "Electrician": {
    "Basic": 193.0,
    "Extra": 14.0,
    "Plus": 19.0,
    "Standard": 3.0,
    "Super": 27.0
  },
  "Elevators": {
    "Basic": 4.0,
    "Super": 5.0
  },
  "Gardener": {
    "Basic": 257.0,
    "Extra": 97.0,
    "Plus": 21.0,
    "Standard": 10.0,
    "Super": 96.0
  },
  "Glass": {
    "Basic": 97.0,
    "Extra": 40.0,
    "Plus": 10.0,
    "Standard": 35.0,
    "Super": 35.0
  },
  "Home Appliances Maintenance": {
    "Basic": 662.0,
    "Extra": 12.0,
    "Plus": 42.0,
    "Premium": 4.0,
    "Super": 63.0
  },
  "Insulated Roof": {
    "Basic": 341.0,
    "Extra": 96.0,
    "Plus": 17.0,
    "Premium": 5.0,
    "Standard": 39.0,
    "Super": 8.0
  },
  "Locksmith": {
    "Basic": 324.0,
    "Plus": 14.0,
    "Super": 8.0
  },
  "Metalwork": {
    "Basic": 210.0,
    "Extra": 49.0,
    "Plus": 48.0,
    "Standard": 16.0,
    "Super": 123.0
  },
  "Painter": {
    "Basic": 1659.0,
    "Extra": 151.0,
    "Optimum": 10.0,
    "Plus": 159.0,
    "Premium": 35.0,
    "Standard": 165.0,
    "Super": 174.0
  },
  "Plumber": {
    "Basic": 1005.0,
    "Extra": 103.0,
    "Plus": 56.0,
    "Premium": 15.0,
    "Standard": 89.0,
    "Super": 447.0
  },
  "Ventilation Works": {
    "Basic": 37.0,
    "Extra": 7.0,
    "Plus": 2.0,
    "Standard": 9.0,
    "Super": 27.0
  },
  "Water Tanks": {
    "Basic": 82.0,
    "Extra": 17.0,
    "Plus": 29.0,
    "Standard": 1.0,
    "Super": 2.0
  }
};

// Full dataset from Contracting bundles analysis CSV
// Updated with custom input functionality
const historicalBundleData = {
  "AC Services": {
    "Basic": { "totalRevenue": 495.42, "totalListings": 138, "avgCPL": 3.59 },
    "Extra": { "totalRevenue": 124.08, "totalListings": 12, "avgCPL": 10.34 },
    "Premium": { "totalRevenue": 22.5, "totalListings": 3, "avgCPL": 7.5 },
    "Plus": { "totalRevenue": 418, "totalListings": 22, "avgCPL": 19.0 },
    "Standard": { "totalRevenue": 17.5, "totalListings": 5, "avgCPL": 3.5 },
    "Super": { "totalRevenue": 508.82, "totalListings": 13, "avgCPL": 39.14 }
  },
  "Agricultural Products": {
    "Basic": { "totalRevenue": 69, "totalListings": 23, "avgCPL": 3.0 },
    "Extra": { "totalRevenue": 6.75, "totalListings": 1, "avgCPL": 6.75 },
    "Plus": { "totalRevenue": 12.25, "totalListings": 1, "avgCPL": 12.25 },
    "Premium": { "totalRevenue": 7, "totalListings": 1, "avgCPL": 7.0 },
    "Standard": { "totalRevenue": 18, "totalListings": 6, "avgCPL": 3.0 }
  },
  "Aluminum": {
    "Basic": { "totalRevenue": 468, "totalListings": 156, "avgCPL": 3.0 },
    "Extra": { "totalRevenue": 296.75, "totalListings": 25, "avgCPL": 11.87 },
    "Optimum": { "totalRevenue": 75, "totalListings": 2, "avgCPL": 37.5 },
    "Plus": { "totalRevenue": 761.14, "totalListings": 38, "avgCPL": 20.03 },
    "Premium": { "totalRevenue": 28, "totalListings": 4, "avgCPL": 7.0 },
    "Standard": { "totalRevenue": 24, "totalListings": 8, "avgCPL": 3.0 },
    "Super": { "totalRevenue": 2347.8, "totalListings": 65, "avgCPL": 36.12 }
  },
  "Bugs Exterminator": {
    "Basic": { "totalRevenue": 93, "totalListings": 31, "avgCPL": 3.0 },
    "Extra": { "totalRevenue": 61.28, "totalListings": 8, "avgCPL": 7.66 },
    "Optimum": { "totalRevenue": 37.5, "totalListings": 1, "avgCPL": 37.5 },
    "Plus": { "totalRevenue": 111.24, "totalListings": 9, "avgCPL": 12.36 },
    "Standard": { "totalRevenue": 3, "totalListings": 1, "avgCPL": 3.0 },
    "Super": { "totalRevenue": 678.4, "totalListings": 32, "avgCPL": 21.2 }
  },
  "Builders": {
    "Basic": { "totalRevenue": 658, "totalListings": 188, "avgCPL": 3.5 },
    "Extra": { "totalRevenue": 551.1, "totalListings": 55, "avgCPL": 10.02 },
    "Optimum": { "totalRevenue": 112.5, "totalListings": 3, "avgCPL": 37.5 },
    "Plus": { "totalRevenue": 964.07, "totalListings": 53, "avgCPL": 18.19 },
    "Premium": { "totalRevenue": 49, "totalListings": 7, "avgCPL": 7.0 },
    "Standard": { "totalRevenue": 84, "totalListings": 24, "avgCPL": 3.5 },
    "Super": { "totalRevenue": 1405.95, "totalListings": 35, "avgCPL": 40.17 }
  },
  "Building Materials": {
    "Basic": { "totalRevenue": 60, "totalListings": 20, "avgCPL": 3.0 },
    "Extra": { "totalRevenue": 21, "totalListings": 3, "avgCPL": 7.0 },
    "Optimum": { "totalRevenue": 37.5, "totalListings": 1, "avgCPL": 37.5 },
    "Plus": { "totalRevenue": 46, "totalListings": 4, "avgCPL": 11.5 },
    "Premium": { "totalRevenue": 14, "totalListings": 2, "avgCPL": 7.0 },
    "Standard": { "totalRevenue": 6, "totalListings": 2, "avgCPL": 3.0 },
    "Super": { "totalRevenue": 197.1, "totalListings": 9, "avgCPL": 21.9 }
  },
  "Carpenter": {
    "Basic": { "totalRevenue": 543, "totalListings": 181, "avgCPL": 3.0 },
    "Extra": { "totalRevenue": 311.65, "totalListings": 23, "avgCPL": 13.55 },
    "Optimum": { "totalRevenue": 37.5, "totalListings": 1, "avgCPL": 37.5 },
    "Plus": { "totalRevenue": 594.81, "totalListings": 27, "avgCPL": 22.03 },
    "Premium": { "totalRevenue": 49, "totalListings": 7, "avgCPL": 7.0 },
    "Standard": { "totalRevenue": 15, "totalListings": 5, "avgCPL": 3.0 },
    "Super": { "totalRevenue": 1220.6, "totalListings": 34, "avgCPL": 35.9 }
  },
  "Ceramic": {
    "Basic": { "totalRevenue": 468, "totalListings": 156, "avgCPL": 3.0 },
    "Extra": { "totalRevenue": 243.6, "totalListings": 29, "avgCPL": 8.4 },
    "Plus": { "totalRevenue": 580.15, "totalListings": 41, "avgCPL": 14.15 },
    "Premium": { "totalRevenue": 21, "totalListings": 3, "avgCPL": 7.0 },
    "Standard": { "totalRevenue": 33, "totalListings": 11, "avgCPL": 3.0 },
    "Super": { "totalRevenue": 1675.8, "totalListings": 76, "avgCPL": 22.05 }
  },
  "Decoration": {
    "Basic": { "totalRevenue": 558.48, "totalListings": 156, "avgCPL": 3.58 },
    "Extra": { "totalRevenue": 447.78, "totalListings": 34, "avgCPL": 13.17 },
    "Optimum": { "totalRevenue": 37.5, "totalListings": 1, "avgCPL": 37.5 },
    "Plus": { "totalRevenue": 884.4, "totalListings": 40, "avgCPL": 22.11 },
    "Premium": { "totalRevenue": 63, "totalListings": 9, "avgCPL": 7.0 },
    "Standard": { "totalRevenue": 21, "totalListings": 6, "avgCPL": 3.5 },
    "Super": { "totalRevenue": 1771.68, "totalListings": 48, "avgCPL": 36.91 }
  },
  "Doors": {
    "Basic": { "totalRevenue": 78, "totalListings": 26, "avgCPL": 3.0 },
    "Extra": { "totalRevenue": 37.5, "totalListings": 5, "avgCPL": 7.5 },
    "Optimum": { "totalRevenue": 37.5, "totalListings": 1, "avgCPL": 37.5 },
    "Plus": { "totalRevenue": 116.55, "totalListings": 9, "avgCPL": 12.95 },
    "Standard": { "totalRevenue": 24, "totalListings": 8, "avgCPL": 3.0 },
    "Super": { "totalRevenue": 247.5, "totalListings": 11, "avgCPL": 22.5 }
  },
  "Duct Cleaning": {
    "Basic": { "totalRevenue": 407.7, "totalListings": 135, "avgCPL": 3.02 },
    "Extra": { "totalRevenue": 62.5, "totalListings": 10, "avgCPL": 6.25 },
    "Optimum": { "totalRevenue": 37.5, "totalListings": 1, "avgCPL": 37.5 },
    "Plus": { "totalRevenue": 34.5, "totalListings": 3, "avgCPL": 11.5 },
    "Premium": { "totalRevenue": 7, "totalListings": 1, "avgCPL": 7.0 },
    "Super": { "totalRevenue": 560.86, "totalListings": 29, "avgCPL": 19.34 }
  },
  "Electrician": {
    "Basic": { "totalRevenue": 348, "totalListings": 116, "avgCPL": 3.0 },
    "Extra": { "totalRevenue": 164.22, "totalListings": 21, "avgCPL": 7.82 },
    "Plus": { "totalRevenue": 279.93, "totalListings": 21, "avgCPL": 13.33 },
    "Premium": { "totalRevenue": 14, "totalListings": 2, "avgCPL": 7.0 },
    "Standard": { "totalRevenue": 6, "totalListings": 2, "avgCPL": 3.0 },
    "Super": { "totalRevenue": 807.84, "totalListings": 36, "avgCPL": 22.44 }
  },
  "Elevators": {
    "Basic": { "totalRevenue": 12, "totalListings": 4, "avgCPL": 3.0 },
    "Extra": { "totalRevenue": 11.5, "totalListings": 2, "avgCPL": 5.75 },
    "Super": { "totalRevenue": 122.22, "totalListings": 6, "avgCPL": 20.37 }
  },
  "Gardener": {
    "Basic": { "totalRevenue": 459, "totalListings": 153, "avgCPL": 3.0 },
    "Extra": { "totalRevenue": 222.24, "totalListings": 24, "avgCPL": 9.26 },
    "Plus": { "totalRevenue": 259.04, "totalListings": 16, "avgCPL": 16.19 },
    "Premium": { "totalRevenue": 35, "totalListings": 5, "avgCPL": 7.0 },
    "Standard": { "totalRevenue": 18, "totalListings": 6, "avgCPL": 3.0 },
    "Super": { "totalRevenue": 1189.92, "totalListings": 48, "avgCPL": 24.79 }
  },
  "Glass": {
    "Basic": { "totalRevenue": 301.99, "totalListings": 101, "avgCPL": 2.99 },
    "Extra": { "totalRevenue": 189.5, "totalListings": 25, "avgCPL": 7.58 },
    "Plus": { "totalRevenue": 115.29, "totalListings": 9, "avgCPL": 12.81 },
    "Premium": { "totalRevenue": 7, "totalListings": 1, "avgCPL": 7.0 },
    "Standard": { "totalRevenue": 15, "totalListings": 5, "avgCPL": 3.0 },
    "Super": { "totalRevenue": 576.48, "totalListings": 24, "avgCPL": 24.02 }
  },
  "Home Appliances Maintenance": {
    "Basic": { "totalRevenue": 567, "totalListings": 189, "avgCPL": 3.0 },
    "Extra": { "totalRevenue": 65.1, "totalListings": 6, "avgCPL": 10.85 },
    "Plus": { "totalRevenue": 165.6, "totalListings": 10, "avgCPL": 16.56 },
    "Premium": { "totalRevenue": 14, "totalListings": 2, "avgCPL": 7.0 },
    "Standard": { "totalRevenue": 75, "totalListings": 25, "avgCPL": 3.0 },
    "Super": { "totalRevenue": 1610.24, "totalListings": 64, "avgCPL": 25.16 }
  },
  "Insulated Roof": {
    "Basic": { "totalRevenue": 273, "totalListings": 91, "avgCPL": 3.0 },
    "Extra": { "totalRevenue": 218.73, "totalListings": 23, "avgCPL": 9.51 },
    "Plus": { "totalRevenue": 221.04, "totalListings": 12, "avgCPL": 18.42 },
    "Premium": { "totalRevenue": 7, "totalListings": 1, "avgCPL": 7.0 },
    "Standard": { "totalRevenue": 18, "totalListings": 6, "avgCPL": 3.0 },
    "Super": { "totalRevenue": 454.65, "totalListings": 15, "avgCPL": 30.31 }
  },
  "Locksmith": {
    "Basic": { "totalRevenue": 456, "totalListings": 152, "avgCPL": 3.0 },
    "Extra": { "totalRevenue": 31.5, "totalListings": 3, "avgCPL": 10.5 },
    "Plus": { "totalRevenue": 199.29, "totalListings": 13, "avgCPL": 15.33 },
    "Standard": { "totalRevenue": 15, "totalListings": 5, "avgCPL": 3.0 },
    "Super": { "totalRevenue": 551.75, "totalListings": 25, "avgCPL": 22.07 }
  },
  "Metalwork": {
    "Basic": { "totalRevenue": 388.5, "totalListings": 111, "avgCPL": 3.5 },
    "Extra": { "totalRevenue": 319.44, "totalListings": 33, "avgCPL": 9.68 },
    "Optimum": { "totalRevenue": 37.5, "totalListings": 1, "avgCPL": 37.5 },
    "Plus": { "totalRevenue": 609.6, "totalListings": 40, "avgCPL": 15.24 },
    "Premium": { "totalRevenue": 21, "totalListings": 3, "avgCPL": 7.0 },
    "Standard": { "totalRevenue": 28, "totalListings": 8, "avgCPL": 3.5 },
    "Super": { "totalRevenue": 2188.8, "totalListings": 80, "avgCPL": 27.36 }
  },
  "Painter": {
    "Basic": { "totalRevenue": 770, "totalListings": 220, "avgCPL": 3.5 },
    "Extra": { "totalRevenue": 413.4, "totalListings": 30, "avgCPL": 13.78 },
    "Optimum": { "totalRevenue": 112.5, "totalListings": 3, "avgCPL": 37.5 },
    "Plus": { "totalRevenue": 1203.8, "totalListings": 52, "avgCPL": 23.15 },
    "Premium": { "totalRevenue": 49, "totalListings": 7, "avgCPL": 7.0 },
    "Standard": { "totalRevenue": 52.5, "totalListings": 15, "avgCPL": 3.5 },
    "Super": { "totalRevenue": 2779.84, "totalListings": 68, "avgCPL": 40.88 }
  },
  "Plumber": {
    "Basic": { "totalRevenue": 962.5, "totalListings": 275, "avgCPL": 3.5 },
    "Extra": { "totalRevenue": 422.62, "totalListings": 34, "avgCPL": 12.43 },
    "Plus": { "totalRevenue": 548.08, "totalListings": 31, "avgCPL": 17.68 },
    "Premium": { "totalRevenue": 49, "totalListings": 7, "avgCPL": 7.0 },
    "Standard": { "totalRevenue": 63, "totalListings": 18, "avgCPL": 3.5 },
    "Super": { "totalRevenue": 3070.08, "totalListings": 123, "avgCPL": 24.96 }
  },
  "Ventilation Works": {
    "Basic": { "totalRevenue": 63, "totalListings": 21, "avgCPL": 3.0 },
    "Extra": { "totalRevenue": 98.98, "totalListings": 14, "avgCPL": 7.07 },
    "Plus": { "totalRevenue": 167.7, "totalListings": 13, "avgCPL": 12.9 },
    "Standard": { "totalRevenue": 3, "totalListings": 1, "avgCPL": 3.0 },
    "Super": { "totalRevenue": 248.76, "totalListings": 12, "avgCPL": 20.73 }
  },
  "Water Tanks": {
    "Basic": { "totalRevenue": 105, "totalListings": 35, "avgCPL": 3.0 },
    "Extra": { "totalRevenue": 57.51, "totalListings": 9, "avgCPL": 6.39 },
    "Plus": { "totalRevenue": 146.77, "totalListings": 13, "avgCPL": 11.29 },
    "Super": { "totalRevenue": 75.32, "totalListings": 4, "avgCPL": 18.83 }
  }
};

// Bundle tier order (highest to lowest CPL)
const BUNDLE_TIER_ORDER = ['Optimum', 'Super', 'Plus', 'Extra', 'Premium', 'Standard', 'Basic'];

const getBundleTierIndex = (bundle) => BUNDLE_TIER_ORDER.indexOf(bundle);

const getHigherTierBundles = (bundle, availableBundles) => {
  const currentIndex = getBundleTierIndex(bundle);
  return BUNDLE_TIER_ORDER.filter((b, i) => i < currentIndex && availableBundles.includes(b));
};

const getLowerTierBundles = (bundle, availableBundles) => {
  const currentIndex = getBundleTierIndex(bundle);
  return BUNDLE_TIER_ORDER.filter((b, i) => i > currentIndex && availableBundles.includes(b));
};

export default function PricingSimulator() {
  // Tab and data mode state
  const [activeTab, setActiveTab] = useState('historical');
  
  // Historical data state (can be updated via CSV upload)
  const [historicalData, setHistoricalData] = useState(() => {
    const saved = localStorage.getItem('historicalData');
    return saved ? JSON.parse(saved) : historicalBundleData;
  });
  
  const [customScenarios, setCustomScenarios] = useState(() => {
    const saved = localStorage.getItem('customScenarios');
    return saved ? JSON.parse(saved) : {};
  });
  const [currentScenarioName, setCurrentScenarioName] = useState('');
  const [editingBundles, setEditingBundles] = useState([]);
  const [newBundleName, setNewBundleName] = useState('');
  const [newBundleCPL, setNewBundleCPL] = useState('');
  const [newBundleListings, setNewBundleListings] = useState('');

  // Calculation state
  const [selectedCategory, setSelectedCategory] = useState('AC Services');
  const [selectedBundle, setSelectedBundle] = useState('Plus');
  const [priceChange, setPriceChange] = useState(20);
  const [churnRate, setChurnRate] = useState(10);
  const [downgradeRates, setDowngradeRates] = useState({}); // { bundleName: rate }
  const [upgradeRates, setUpgradeRates] = useState({}); // { bundleName: rate }
  const [fixedKDLoss, setFixedKDLoss] = useState(0);
  const [showCalculations, setShowCalculations] = useState(false);

  // Multi-Bundle Mode state
  const [isMultiBundleMode, setIsMultiBundleMode] = useState(() => {
    const saved = localStorage.getItem('isMultiBundleMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [selectedBundles, setSelectedBundles] = useState(() => {
    const saved = localStorage.getItem('selectedBundles');
    return saved ? JSON.parse(saved) : {};
  });
  const [bundlePriceChanges, setBundlePriceChanges] = useState(() => {
    const saved = localStorage.getItem('bundlePriceChanges');
    return saved ? JSON.parse(saved) : {};
  });
  const [bundleChurnRates, setBundleChurnRates] = useState(() => {
    const saved = localStorage.getItem('bundleChurnRates');
    return saved ? JSON.parse(saved) : {};
  });
  const [bundleDowngradeRates, setBundleDowngradeRates] = useState(() => {
    const saved = localStorage.getItem('bundleDowngradeRates');
    return saved ? JSON.parse(saved) : {};
  });
  const [bundleUpgradeRates, setBundleUpgradeRates] = useState(() => {
    const saved = localStorage.getItem('bundleUpgradeRates');
    return saved ? JSON.parse(saved) : {};
  });

  // A/B Testing state
  const [abTestCategory, setAbTestCategory] = useState('AC Services');
  const [abTestBundle, setAbTestBundle] = useState('Plus');
  const [abTestPriceChange, setAbTestPriceChange] = useState(20);
  const [abTestGroupSize, setAbTestGroupSize] = useState('');
  const [abTestDuration, setAbTestDuration] = useState(60);
  const [abTestName, setAbTestName] = useState('');
  const [abTestResults, setAbTestResults] = useState(null);
  const [savedAbTests, setSavedAbTests] = useState(() => {
    const saved = localStorage.getItem('savedAbTests');
    return saved ? JSON.parse(saved) : [];
  });

  // Add-On Revenue state
  const [addOnData, setAddOnData] = useState(() => {
    const saved = localStorage.getItem('addOnData');
    return saved ? JSON.parse(saved) : defaultAddOnData;
  });
  
  // Add-On Revenue Change % per bundle in category (Category -> Bundle -> rate)
  // Negative = reduction (e.g. -50 means 50% less), Positive = increase (e.g. +20 means 20% more)
  const [addOnLossRates, setAddOnLossRates] = useState(() => {
    const saved = localStorage.getItem('addOnLossRates');
    return saved ? JSON.parse(saved) : {};
  });

  // Portfolio Analysis state
  const [portfolioBundle, setPortfolioBundle] = useState('Plus');
  const [portfolioSortBy, setPortfolioSortBy] = useState('netChange');
  const [portfolioSortAsc, setPortfolioSortAsc] = useState(false);
  const [portfolioPriceChange, setPortfolioPriceChange] = useState(20);
  const [portfolioChurnRate, setPortfolioChurnRate] = useState(10);
  const [portfolioDowngradeRates, setPortfolioDowngradeRates] = useState({}); // { bundleName: rate }
  const [portfolioUpgradeRates, setPortfolioUpgradeRates] = useState({}); // { bundleName: rate }
  const [portfolioAddOnLossRates, setPortfolioAddOnLossRates] = useState({}); // { bundleName: rate }
  const [portfolioFixedKDLoss, setPortfolioFixedKDLoss] = useState(0);

  // Portfolio multi-bundle mode state (isolated from historical tab)
  const [portfolioIsMultiBundle, setPortfolioIsMultiBundle] = useState(false);
  const [portfolioSelectedBundles, setPortfolioSelectedBundles] = useState({});
  const [portfolioBundlePriceChanges, setPortfolioBundlePriceChanges] = useState({});
  const [portfolioBundleChurnRates, setPortfolioBundleChurnRates] = useState({});
  const [portfolioBundleDowngradeRates, setPortfolioBundleDowngradeRates] = useState({});
  const [portfolioBundleUpgradeRates, setPortfolioBundleUpgradeRates] = useState({});
  const [portfolioBundleAddOnRates, setPortfolioBundleAddOnRates] = useState({});
  const [portfolioAddOnEdits, setPortfolioAddOnEdits] = useState({});
  const [portfolioAddOnEditorOpen, setPortfolioAddOnEditorOpen] = useState(false);

  // Combine historical and custom data
  const bundleData = useMemo(() => {
    if (activeTab === 'historical' || activeTab === 'abtest' || activeTab === 'portfolio') {
      return historicalData;
    } else {
      return customScenarios;
    }
  }, [activeTab, historicalData, customScenarios]);

  // Save custom scenarios to localStorage
  useEffect(() => {
    localStorage.setItem('customScenarios', JSON.stringify(customScenarios));
  }, [customScenarios]);

  // Save historical data to localStorage
  useEffect(() => {
    localStorage.setItem('historicalData', JSON.stringify(historicalData));
  }, [historicalData]);

  // Save A/B tests to localStorage
  useEffect(() => {
    localStorage.setItem('savedAbTests', JSON.stringify(savedAbTests));
  }, [savedAbTests]);

  // Save add-on data to localStorage
  useEffect(() => {
    localStorage.setItem('addOnData', JSON.stringify(addOnData));
  }, [addOnData]);

  // Save add-on loss rates to localStorage
  useEffect(() => {
    localStorage.setItem('addOnLossRates', JSON.stringify(addOnLossRates));
  }, [addOnLossRates]);

  // Save multi-bundle mode state to localStorage
  useEffect(() => {
    localStorage.setItem('isMultiBundleMode', JSON.stringify(isMultiBundleMode));
  }, [isMultiBundleMode]);

  useEffect(() => {
    localStorage.setItem('selectedBundles', JSON.stringify(selectedBundles));
  }, [selectedBundles]);

  useEffect(() => {
    localStorage.setItem('bundlePriceChanges', JSON.stringify(bundlePriceChanges));
  }, [bundlePriceChanges]);

  useEffect(() => {
    localStorage.setItem('bundleChurnRates', JSON.stringify(bundleChurnRates));
  }, [bundleChurnRates]);

  useEffect(() => {
    localStorage.setItem('bundleDowngradeRates', JSON.stringify(bundleDowngradeRates));
  }, [bundleDowngradeRates]);

  useEffect(() => {
    localStorage.setItem('bundleUpgradeRates', JSON.stringify(bundleUpgradeRates));
  }, [bundleUpgradeRates]);

  const categories = Object.keys(bundleData).sort();
  const hasData = categories.length > 0;
  
  const categoryData = hasData ? (bundleData[selectedCategory] || {}) : {};
  const availableBundles = Object.keys(categoryData).filter(b => categoryData[b]?.totalListings > 0);
  
  const higherBundles = hasData ? getHigherTierBundles(selectedBundle, availableBundles) : [];
  const lowerBundles = hasData ? getLowerTierBundles(selectedBundle, availableBundles) : [];
  
  const isTopTier = higherBundles.length === 0;
  const isBottomTier = lowerBundles.length === 0;

  // CSV Template Download
  const downloadTemplate = () => {
    const csv = `Bundle,CPL,Listings
Basic,3.00,1000
Plus,15.00,500
Super,30.00,200`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bundle_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // CSV Upload Handler (for custom scenarios - single category)
  const handleCSVUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim());
        
        if (!headers.includes('Bundle') || !headers.includes('CPL') || !headers.includes('Listings')) {
          alert('Invalid CSV format. Please use the template.');
          return;
        }

        const bundles = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          if (values.length >= 3) {
            bundles.push({
              name: values[0],
              cpl: parseFloat(values[1]),
              listings: parseInt(values[2])
            });
          }
        }

        setEditingBundles(bundles);
      } catch (error) {
        alert('Error parsing CSV: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  // Historical Data CSV Template Download (multi-category format)
  const downloadHistoricalTemplate = () => {
    const csv = `Category,Bundle,CPL,Listings
AC Services,Basic,3.15,2751
AC Services,Plus,17.24,464
AC Services,Super,30.82,471
Plumber,Basic,2.46,2614
Plumber,Plus,13.06,272
Plumber,Super,16.81,897`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historical_data_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Historical Data CSV Upload Handler (multi-category format)
  const handleHistoricalCSVUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        // Check for required columns
        const categoryIdx = headers.findIndex(h => h === 'category');
        const bundleIdx = headers.findIndex(h => h === 'bundle');
        const cplIdx = headers.findIndex(h => h === 'cpl' || h === 'avgcpl' || h === 'avg_cpl');
        const listingsIdx = headers.findIndex(h => h === 'listings' || h === 'totallistings' || h === 'total_listings');
        
        if (categoryIdx === -1 || bundleIdx === -1 || cplIdx === -1 || listingsIdx === -1) {
          alert('Invalid CSV format. Required columns: Category, Bundle, CPL, Listings');
          return;
        }

        const newData = {};
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          if (values.length > Math.max(categoryIdx, bundleIdx, cplIdx, listingsIdx)) {
            const category = values[categoryIdx];
            const bundle = values[bundleIdx];
            const cpl = parseFloat(values[cplIdx]);
            const listings = parseInt(values[listingsIdx]);

            if (category && bundle && !isNaN(cpl) && !isNaN(listings)) {
              if (!newData[category]) {
                newData[category] = {};
              }
              newData[category][bundle] = {
                totalRevenue: Math.round(cpl * listings),
                totalListings: listings,
                avgCPL: cpl
              };
            }
          }
        }

        const categoryCount = Object.keys(newData).length;
        const bundleCount = Object.values(newData).reduce((sum, cat) => sum + Object.keys(cat).length, 0);

        if (categoryCount === 0) {
          alert('No valid data found in CSV.');
          return;
        }

        setHistoricalData(newData);
        
        // Select first category if current selection doesn't exist
        const newCategories = Object.keys(newData);
        if (!newCategories.includes(selectedCategory)) {
          setSelectedCategory(newCategories[0]);
          const firstCatBundles = Object.keys(newData[newCategories[0]]);
          if (firstCatBundles.length > 0) {
            setSelectedBundle(firstCatBundles[0]);
          }
        }

        alert(`Successfully loaded ${categoryCount} categories with ${bundleCount} bundles.`);
      } catch (error) {
        alert('Error parsing CSV: ' + error.message);
      }
    };
    reader.readAsText(file);
    // Reset file input
    event.target.value = '';
  };

  // Reset historical data to default
  const resetHistoricalData = () => {
    if (confirm('Reset to default historical data? This will remove any uploaded data.')) {
      setHistoricalData(historicalBundleData);
      setSelectedCategory('AC Services');
      setSelectedBundle('Plus');
    }
  };

  // Export current historical data as CSV
  const exportHistoricalData = () => {
    let csv = 'Category,Bundle,CPL,Listings,Revenue\n';
    Object.entries(historicalData).forEach(([category, bundles]) => {
      Object.entries(bundles).forEach(([bundle, data]) => {
        csv += `${category},${bundle},${data.avgCPL},${data.totalListings},${data.totalRevenue}\n`;
      });
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historical_data_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Add-On Data - Download template CSV
  const downloadAddOnTemplate = () => {
    const csv = `Category,Bundle,AddOnRevenue
AC Services,Basic,0
AC Services,Plus,45
AC Services,Super,130
Plumber,Basic,0
Plumber,Plus,20
Plumber,Super,80`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'addon_data_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Add-On Data - CSV Upload Handler
  const handleAddOnCSVUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        const categoryIdx = headers.findIndex(h => h === 'category');
        const bundleIdx = headers.findIndex(h => h === 'bundle');
        const addOnIdx = headers.findIndex(h => h === 'addonrevenue' || h === 'addon_revenue' || h === 'addon');
        
        if (categoryIdx === -1 || bundleIdx === -1 || addOnIdx === -1) {
          alert('Invalid CSV format. Required columns: Category, Bundle, AddOnRevenue');
          return;
        }

        const newAddOnData = {};
        let recordCount = 0;

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          if (values.length > Math.max(categoryIdx, bundleIdx, addOnIdx)) {
            const category = values[categoryIdx];
            const bundle = values[bundleIdx];
            const addOnRevenue = parseFloat(values[addOnIdx]);

            if (category && bundle && !isNaN(addOnRevenue)) {
              if (!newAddOnData[category]) {
                newAddOnData[category] = {};
              }
              newAddOnData[category][bundle] = addOnRevenue;
              recordCount++;
            }
          }
        }

        if (recordCount === 0) {
          alert('No valid add-on data found in CSV.');
          return;
        }

        setAddOnData(newAddOnData);
        alert(`Successfully loaded ${recordCount} add-on records across ${Object.keys(newAddOnData).length} categories.`);
      } catch (error) {
        alert('Error parsing CSV: ' + error.message);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // Add-On Data - Export current data as CSV
  const exportAddOnData = () => {
    let csv = 'Category,Bundle,AddOnRevenue\n';
    Object.entries(addOnData).forEach(([category, bundles]) => {
      Object.entries(bundles).forEach(([bundle, revenue]) => {
        csv += `${category},${bundle},${revenue}\n`;
      });
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'addon_data_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Add-On Data - Reset to defaults
  const resetAddOnData = () => {
    if (confirm('Reset add-on data to defaults? This will remove any uploaded data.')) {
      setAddOnData(defaultAddOnData);
    }
  };

  // A/B Test - Get category data for test design
  const abTestCategoryData = historicalData[abTestCategory] || {};
  const abTestAvailableBundles = Object.keys(abTestCategoryData).filter(b => abTestCategoryData[b]?.totalListings > 0);
  const abTestBundleData = abTestCategoryData[abTestBundle] || {};
  const abTestHigherBundles = getHigherTierBundles(abTestBundle, abTestAvailableBundles);
  const abTestLowerBundles = getLowerTierBundles(abTestBundle, abTestAvailableBundles);

  // A/B Test - Download results template CSV
  const downloadAbTestTemplate = () => {
    const bundles = abTestAvailableBundles.length > 0 ? abTestAvailableBundles : ['Basic', 'Plus', 'Super'];
    let csv = 'Bundle,Listings\n';
    bundles.forEach(bundle => {
      csv += `${bundle},0\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ab_test_results_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // A/B Test - Upload and parse results CSV
  const handleAbTestResultsUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const startingSize = parseInt(abTestGroupSize) || abTestBundleData.totalListings || 0;
    if (startingSize === 0) {
      alert('Please enter the starting test group size first.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        const bundleIdx = headers.findIndex(h => h === 'bundle');
        const listingsIdx = headers.findIndex(h => h === 'listings' || h === 'count');
        
        if (bundleIdx === -1 || listingsIdx === -1) {
          alert('Invalid CSV format. Required columns: Bundle, Listings');
          return;
        }

        const resultsByBundle = {};
        let totalAfter = 0;

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          if (values.length > Math.max(bundleIdx, listingsIdx)) {
            const bundle = values[bundleIdx];
            const listings = parseInt(values[listingsIdx]) || 0;
            if (bundle) {
              resultsByBundle[bundle] = listings;
              totalAfter += listings;
            }
          }
        }

        // Calculate percentages
        const stayedCount = resultsByBundle[abTestBundle] || 0;
        const churnedCount = startingSize - totalAfter;
        
        const stayedRate = (stayedCount / startingSize) * 100;
        const churnRate = Math.max(0, (churnedCount / startingSize) * 100);
        
        // Calculate downgrade rates
        const downgradeRates = {};
        let totalDowngradeRate = 0;
        abTestLowerBundles.forEach(bundle => {
          const count = resultsByBundle[bundle] || 0;
          const rate = (count / startingSize) * 100;
          downgradeRates[bundle] = { count, rate: parseFloat(rate.toFixed(1)) };
          totalDowngradeRate += rate;
        });

        // Calculate upgrade rates
        const upgradeRates = {};
        let totalUpgradeRate = 0;
        abTestHigherBundles.forEach(bundle => {
          const count = resultsByBundle[bundle] || 0;
          const rate = (count / startingSize) * 100;
          upgradeRates[bundle] = { count, rate: parseFloat(rate.toFixed(1)) };
          totalUpgradeRate += rate;
        });

        // Calculate confidence based on sample size
        const marginOfError = 1.96 * Math.sqrt((0.5 * 0.5) / startingSize) * 100;
        let confidenceLevel = 'LOW';
        if (startingSize >= 385) confidenceLevel = 'HIGH';
        else if (startingSize >= 100) confidenceLevel = 'MEDIUM';

        setAbTestResults({
          startingSize,
          totalAfter,
          stayedCount,
          churnedCount,
          stayedRate: parseFloat(stayedRate.toFixed(1)),
          churnRate: parseFloat(churnRate.toFixed(1)),
          downgradeRates,
          upgradeRates,
          totalDowngradeRate: parseFloat(totalDowngradeRate.toFixed(1)),
          totalUpgradeRate: parseFloat(totalUpgradeRate.toFixed(1)),
          marginOfError: parseFloat(marginOfError.toFixed(1)),
          confidenceLevel,
          bundle: abTestBundle,
          category: abTestCategory,
          priceChange: abTestPriceChange,
          duration: abTestDuration
        });

      } catch (error) {
        alert('Error parsing CSV: ' + error.message);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // A/B Test - Apply results to simulator
  const applyAbTestResults = (testResults) => {
    setActiveTab('historical');
    setSelectedCategory(testResults.category);
    setSelectedBundle(testResults.bundle);
    setPriceChange(testResults.priceChange);
    setChurnRate(testResults.churnRate);
    
    // Set downgrade rates
    const newDowngradeRates = {};
    Object.entries(testResults.downgradeRates).forEach(([bundle, data]) => {
      newDowngradeRates[bundle] = data.rate;
    });
    setDowngradeRates(newDowngradeRates);
    
    // Set upgrade rates
    const newUpgradeRates = {};
    Object.entries(testResults.upgradeRates).forEach(([bundle, data]) => {
      newUpgradeRates[bundle] = data.rate;
    });
    setUpgradeRates(newUpgradeRates);
  };

  // A/B Test - Save test results
  const saveAbTest = () => {
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
  };

  // A/B Test - Delete saved test
  const deleteAbTest = (testId) => {
    if (confirm('Delete this saved test?')) {
      setSavedAbTests(savedAbTests.filter(t => t.id !== testId));
    }
  };

  // Add bundle to editing list
  const addBundle = () => {
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
  };

  // Remove bundle from editing list
  const removeBundle = (index) => {
    setEditingBundles(editingBundles.filter((_, i) => i !== index));
  };

  // Save custom scenario
  const saveCustomScenario = () => {
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
  };

  // Load existing scenario for editing
  const loadScenarioForEdit = (scenarioName) => {
    const scenario = customScenarios[scenarioName];
    if (!scenario) return;

    const bundles = Object.entries(scenario).map(([name, data]) => ({
      name,
      cpl: data.avgCPL,
      listings: data.totalListings
    }));

    setEditingBundles(bundles);
    setCurrentScenarioName(scenarioName);
  };

  // Delete custom scenario
  const deleteScenario = (scenarioName) => {
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
  };

  // Initialize downgrade/upgrade rates when bundle or category changes
  React.useEffect(() => {
    // Initialize downgrade rates for all lower bundles
    const newDowngradeRates = {};
    lowerBundles.forEach((bundle, index) => {
      // Keep existing rate if bundle is still valid, otherwise default to 0
      newDowngradeRates[bundle] = downgradeRates[bundle] !== undefined ? downgradeRates[bundle] : (index === 0 ? 5 : 0);
    });
    setDowngradeRates(newDowngradeRates);
    
    // Initialize upgrade rates for all higher bundles
    const newUpgradeRates = {};
    higherBundles.forEach((bundle, index) => {
      // Keep existing rate if bundle is still valid, otherwise default to 0
      newUpgradeRates[bundle] = upgradeRates[bundle] !== undefined ? upgradeRates[bundle] : (index === higherBundles.length - 1 ? 3 : 0);
    });
    setUpgradeRates(newUpgradeRates);
  }, [selectedBundle, selectedCategory, lowerBundles.length, higherBundles.length]);

  // Calculate total downgrade and upgrade rates
  const totalDowngradeRate = Object.values(downgradeRates).reduce((sum, rate) => sum + (rate || 0), 0);
  const totalUpgradeRate = Object.values(upgradeRates).reduce((sum, rate) => sum + (rate || 0), 0);

  // Calculate category totals
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
    if (!hasData || !categoryData || Object.keys(categoryData).length === 0) return null;
    const bundleInfo = categoryData[selectedBundle];
    if (!bundleInfo) return null;

    const currentCPL = bundleInfo.avgCPL;
    const currentListings = bundleInfo.totalListings;
    const currentRevenue = bundleInfo.totalRevenue;
    
    // Get add-on revenue for current bundle
    const currentAddOnRevenue = (addOnData[selectedCategory]?.[selectedBundle] || 0);
    const addOnLossRate = ((addOnLossRates[selectedCategory]?.[selectedBundle] || 0) / 100);
    
    const newCPL = currentCPL * (1 + priceChange / 100);
    
    // Validate rates don't exceed 100%
    const effectiveChurn = Math.min(churnRate, 100);
    const effectiveDowngrade = isBottomTier ? 0 : Math.min(totalDowngradeRate, 100 - effectiveChurn);
    const effectiveUpgrade = isTopTier ? 0 : Math.min(totalUpgradeRate, 100 - effectiveChurn - effectiveDowngrade);
    const stayRate = Math.max(0, 100 - effectiveChurn - effectiveDowngrade - effectiveUpgrade);

    // Calculate listing movements
    const stayingListings = currentListings * (stayRate / 100);
    const churnedListings = currentListings * (effectiveChurn / 100);
    const totalDowngradeListings = currentListings * (effectiveDowngrade / 100);
    const totalUpgradeListings = currentListings * (effectiveUpgrade / 100);

    // Calculate add-on revenue impact (% change applies to per-listing add-on rate, then multiplied by final listings)
    const avgAddOnPerListing = currentListings > 0 ? currentAddOnRevenue / currentListings : 0;
    const adjustedAddOnPerListing = avgAddOnPerListing * (1 + addOnLossRate);
    const newAddOnRevenue = adjustedAddOnPerListing * stayingListings;

    // Calculate downgrade revenue per bundle and total
    const downgradeDetails = {};
    let downgradeRevenue = 0;
    lowerBundles.forEach(bundle => {
      const rate = downgradeRates[bundle] || 0;
      const listings = currentListings * (rate / 100);
      const bundleData = categoryData[bundle];
      const revenue = bundleData ? listings * bundleData.avgCPL : 0;
      downgradeDetails[bundle] = { rate, listings, revenue, cpl: bundleData?.avgCPL || 0 };
      downgradeRevenue += revenue;
    });

    // Calculate upgrade revenue per bundle and total
    const upgradeDetails = {};
    let upgradeRevenue = 0;
    higherBundles.forEach(bundle => {
      const rate = upgradeRates[bundle] || 0;
      const listings = currentListings * (rate / 100);
      const bundleData = categoryData[bundle];
      const revenue = bundleData ? listings * bundleData.avgCPL : 0;
      upgradeDetails[bundle] = { rate, listings, revenue, cpl: bundleData?.avgCPL || 0 };
      upgradeRevenue += revenue;
    });

    // Calculate revenues
    const newBundleRevenue = stayingListings * newCPL;
    const lostRevenue = churnedListings * currentCPL;

    // Calculate net impact on category (includes add-on and fixedKDLoss)
    const oldCategoryRevenue = categoryTotals.totalRevenue;
    
    // Net change = (new bundle revenue - old bundle revenue) + (new add-on - old add-on) + migrations - fixed loss
    const cplRevenueChange = (newBundleRevenue - currentRevenue) + downgradeRevenue + upgradeRevenue;
    const addOnRevenueChange = newAddOnRevenue - currentAddOnRevenue;
    const netRevenueChange = cplRevenueChange + addOnRevenueChange - fixedKDLoss;
    const newCategoryRevenue = oldCategoryRevenue + netRevenueChange;
    const percentChange = (netRevenueChange / oldCategoryRevenue) * 100;

    // Break-even analysis (simplified - assuming no upgrades/downgrades)
    const breakEvenChurn = (priceChange * 100) / (100 + priceChange);

    return {
      currentCPL,
      newCPL,
      currentListings,
      currentRevenue,
      currentAddOnRevenue,
      avgAddOnPerListing,
      adjustedAddOnPerListing,
      addOnLossRate,
      stayRate,
      stayingListings,
      churnedListings,
      downgradeListings: totalDowngradeListings,
      upgradeListings: totalUpgradeListings,
      newBundleRevenue,
      downgradeRevenue,
      upgradeRevenue,
      downgradeDetails,
      upgradeDetails,
      lostRevenue,
      newAddOnRevenue,
      addOnRevenueChange,
      cplRevenueChange,
      oldCategoryRevenue,
      newCategoryRevenue,
      netRevenueChange,
      percentChange,
      breakEvenChurn,
      effectiveChurn,
      effectiveDowngrade,
      effectiveUpgrade,
      fixedKDLoss,
    };
  }, [hasData, categoryData, selectedCategory, selectedBundle, priceChange, churnRate, downgradeRates, upgradeRates, totalDowngradeRate, totalUpgradeRate, fixedKDLoss, categoryTotals, isTopTier, isBottomTier, lowerBundles, higherBundles, addOnData, addOnLossRates]);

  // Multi-Bundle calculation
  const multiBundleResults = useMemo(() => {
    if (!isMultiBundleMode || !hasData || !categoryData || Object.keys(categoryData).length === 0) return null;

    const availableBundles = Object.keys(categoryData);
    const selectedBundleNames = Object.keys(selectedBundles).filter(b => selectedBundles[b]);

    if (selectedBundleNames.length === 0) return null;

    // STEP 1: Calculate new CPLs for ALL bundles
    const newCPLs = {};
    availableBundles.forEach(bundle => {
      const priceChange = bundlePriceChanges[bundle] || 0;
      newCPLs[bundle] = categoryData[bundle].avgCPL * (1 + priceChange / 100);
    });

    // STEP 2: For EACH bundle, calculate net listing changes
    const bundleResults = {};
    let totalCannibalization = 0;

    availableBundles.forEach(bundle => {
      const bundleData = categoryData[bundle];
      const originalListings = bundleData.totalListings;
      const currentCPL = bundleData.avgCPL;
      const newCPL = newCPLs[bundle];
      const priceChange = bundlePriceChanges[bundle] || 0;

      // Start with original listings
      let finalListings = originalListings;

      // Get migration rates for this bundle
      const churnRate = bundleChurnRates[bundle] || 0;
      const downgradeRates = bundleDowngradeRates[bundle] || {};
      const upgradeRates = bundleUpgradeRates[bundle] || {};

      // SUBTRACT: Customers leaving this bundle
      const churned = originalListings * (churnRate / 100);
      finalListings -= churned;

      let totalDowngraded = 0;
      let totalUpgraded = 0;
      const downgradeDetails = {};
      const upgradeDetails = {};

      // SUBTRACT: Customers downgrading from this bundle
      Object.entries(downgradeRates).forEach(([targetBundle, rate]) => {
        const downgraded = originalListings * (rate / 100);
        finalListings -= downgraded;
        totalDowngraded += downgraded;
        downgradeDetails[targetBundle] = {
          rate,
          listings: downgraded,
          targetCPL: newCPLs[targetBundle]
        };

        // Track cannibalization if target bundle is also changing price
        if (selectedBundles[targetBundle]) {
          const lostPerCustomer = currentCPL - newCPLs[targetBundle];
          totalCannibalization += lostPerCustomer * downgraded;
        }
      });

      // SUBTRACT: Customers upgrading from this bundle
      Object.entries(upgradeRates).forEach(([targetBundle, rate]) => {
        const upgraded = originalListings * (rate / 100);
        finalListings -= upgraded;
        totalUpgraded += upgraded;
        upgradeDetails[targetBundle] = {
          rate,
          listings: upgraded,
          targetCPL: newCPLs[targetBundle]
        };
      });

      let totalIncomingDowngrades = 0;
      let totalIncomingUpgrades = 0;

      // ADD: Customers downgrading TO this bundle from higher tiers
      availableBundles.forEach(sourceBundle => {
        const sourceBundleIndex = BUNDLE_TIER_ORDER.indexOf(sourceBundle);
        const thisBundleIndex = BUNDLE_TIER_ORDER.indexOf(bundle);

        if (sourceBundleIndex !== -1 && thisBundleIndex !== -1 && sourceBundleIndex < thisBundleIndex) {
          const sourceDowngradeRates = bundleDowngradeRates[sourceBundle] || {};
          const downgradeRateToThis = sourceDowngradeRates[bundle] || 0;
          const incomingDowngrades = categoryData[sourceBundle].totalListings * (downgradeRateToThis / 100);
          finalListings += incomingDowngrades;
          totalIncomingDowngrades += incomingDowngrades;
        }
      });

      // ADD: Customers upgrading TO this bundle from lower tiers
      availableBundles.forEach(sourceBundle => {
        const sourceBundleIndex = BUNDLE_TIER_ORDER.indexOf(sourceBundle);
        const thisBundleIndex = BUNDLE_TIER_ORDER.indexOf(bundle);

        if (sourceBundleIndex !== -1 && thisBundleIndex !== -1 && sourceBundleIndex > thisBundleIndex) {
          const sourceUpgradeRates = bundleUpgradeRates[sourceBundle] || {};
          const upgradeRateToThis = sourceUpgradeRates[bundle] || 0;
          const incomingUpgrades = categoryData[sourceBundle].totalListings * (upgradeRateToThis / 100);
          finalListings += incomingUpgrades;
          totalIncomingUpgrades += incomingUpgrades;
        }
      });

      // Calculate add-on revenue impact (% change applies to per-listing add-on rate, then multiplied by final listings)
      const currentAddOnRevenue = addOnData[selectedCategory]?.[bundle] || 0;
      const addOnLossRate = (addOnLossRates[selectedCategory]?.[bundle] || 0) / 100;
      const avgAddOnPerListing = originalListings > 0 ? currentAddOnRevenue / originalListings : 0;
      const adjustedAddOnPerListing = avgAddOnPerListing * (1 + addOnLossRate);
      const newAddOnRevenue = adjustedAddOnPerListing * finalListings;

      // Calculate revenues
      const currentRevenue = bundleData.totalRevenue;
      const projectedRevenue = finalListings * newCPL;
      const revenueChange = projectedRevenue - currentRevenue;
      const addOnRevenueChange = newAddOnRevenue - currentAddOnRevenue;
      const totalRevenueChange = revenueChange + addOnRevenueChange;

      bundleResults[bundle] = {
        bundle,
        isSelected: selectedBundles[bundle] || false,
        currentCPL,
        newCPL,
        priceChangePercent: priceChange,
        currentListings: originalListings,
        projectedListings: finalListings,
        listingChange: finalListings - originalListings,
        churned,
        downgraded: totalDowngraded,
        upgraded: totalUpgraded,
        incomingDowngrades: totalIncomingDowngrades,
        incomingUpgrades: totalIncomingUpgrades,
        downgradeDetails,
        upgradeDetails,
        currentRevenue,
        projectedRevenue,
        revenueChange,
        currentAddOnRevenue,
        newAddOnRevenue,
        addOnRevenueChange,
        totalRevenueChange,
        percentChange: currentRevenue > 0 ? (totalRevenueChange / currentRevenue) * 100 : 0
      };
    });

    // STEP 3: Calculate category-level totals
    let totalCurrentRevenue = 0;
    let totalProjectedRevenue = 0;
    let totalCurrentAddOnRevenue = 0;
    let totalNewAddOnRevenue = 0;

    Object.values(bundleResults).forEach(result => {
      totalCurrentRevenue += result.currentRevenue;
      totalProjectedRevenue += result.projectedRevenue;
      totalCurrentAddOnRevenue += result.currentAddOnRevenue;
      totalNewAddOnRevenue += result.newAddOnRevenue;
    });

    const totalNetChange = (totalProjectedRevenue - totalCurrentRevenue) +
                          (totalNewAddOnRevenue - totalCurrentAddOnRevenue) -
                          fixedKDLoss;
    const totalPercentChange = totalCurrentRevenue > 0 ? (totalNetChange / totalCurrentRevenue) * 100 : 0;

    return {
      byBundle: bundleResults,
      categoryTotals: {
        currentRevenue: totalCurrentRevenue,
        projectedRevenue: totalProjectedRevenue,
        revenueChange: totalProjectedRevenue - totalCurrentRevenue,
        currentAddOnRevenue: totalCurrentAddOnRevenue,
        newAddOnRevenue: totalNewAddOnRevenue,
        addOnRevenueChange: totalNewAddOnRevenue - totalCurrentAddOnRevenue,
        fixedKDLoss,
        netChange: totalNetChange,
        percentChange: totalPercentChange
      },
      cannibalization: totalCannibalization
    };
  }, [isMultiBundleMode, hasData, categoryData, selectedBundles, bundlePriceChanges, bundleChurnRates, bundleDowngradeRates, bundleUpgradeRates, selectedCategory, addOnData, addOnLossRates, fixedKDLoss]);

  // Portfolio Analysis - Calculate impact across all categories
  const portfolioResults = useMemo(() => {
    const categories = Object.keys(historicalData);
    const results = [];

    // Helper to get effective add-on revenue (with overrides)
    const getAddOnRevenue = (category, bundle) => {
      if (portfolioAddOnEdits[category]?.[bundle] !== undefined) {
        return portfolioAddOnEdits[category][bundle];
      }
      return addOnData[category]?.[bundle] || 0;
    };

    if (portfolioIsMultiBundle) {
      // MULTI-BUNDLE MODE: per-bundle rates applied across all categories
      const selectedBundleNames = Object.keys(portfolioSelectedBundles).filter(b => portfolioSelectedBundles[b]);
      if (selectedBundleNames.length === 0) return results;

      categories.forEach(category => {
        const catData = historicalData[category];
        const availBundles = Object.keys(catData);

        // Check if any selected bundle exists in this category
        const bundlesInCategory = selectedBundleNames.filter(b => availBundles.includes(b));
        if (bundlesInCategory.length === 0) return;

        // Calculate new CPLs for ALL bundles in category
        const newCPLs = {};
        availBundles.forEach(bundle => {
          const pc = portfolioBundlePriceChanges[bundle] || 0;
          newCPLs[bundle] = catData[bundle].avgCPL * (1 + pc / 100);
        });

        // Per-bundle calculation
        const bundleResults = {};
        availBundles.forEach(bundle => {
          const bData = catData[bundle];
          const originalListings = bData.totalListings;
          const currentCPL = bData.avgCPL;
          const newCPL = newCPLs[bundle];

          let finalListings = originalListings;
          const churnRate = portfolioBundleChurnRates[bundle] || 0;
          const downRates = portfolioBundleDowngradeRates[bundle] || {};
          const upRates = portfolioBundleUpgradeRates[bundle] || {};

          const churned = originalListings * (churnRate / 100);
          finalListings -= churned;

          let totalDowngraded = 0;
          let totalUpgraded = 0;
          Object.entries(downRates).forEach(([target, rate]) => {
            if (!availBundles.includes(target)) return;
            const down = originalListings * (rate / 100);
            finalListings -= down;
            totalDowngraded += down;
          });
          Object.entries(upRates).forEach(([target, rate]) => {
            if (!availBundles.includes(target)) return;
            const up = originalListings * (rate / 100);
            finalListings -= up;
            totalUpgraded += up;
          });

          // Incoming downgrades from higher tiers
          availBundles.forEach(srcBundle => {
            const srcIdx = BUNDLE_TIER_ORDER.indexOf(srcBundle);
            const thisIdx = BUNDLE_TIER_ORDER.indexOf(bundle);
            if (srcIdx !== -1 && thisIdx !== -1 && srcIdx < thisIdx) {
              const srcDownRates = portfolioBundleDowngradeRates[srcBundle] || {};
              const rateToThis = srcDownRates[bundle] || 0;
              finalListings += catData[srcBundle].totalListings * (rateToThis / 100);
            }
          });

          // Incoming upgrades from lower tiers
          availBundles.forEach(srcBundle => {
            const srcIdx = BUNDLE_TIER_ORDER.indexOf(srcBundle);
            const thisIdx = BUNDLE_TIER_ORDER.indexOf(bundle);
            if (srcIdx !== -1 && thisIdx !== -1 && srcIdx > thisIdx) {
              const srcUpRates = portfolioBundleUpgradeRates[srcBundle] || {};
              const rateToThis = srcUpRates[bundle] || 0;
              finalListings += catData[srcBundle].totalListings * (rateToThis / 100);
            }
          });

          // Add-on impact
          const currentAddOn = getAddOnRevenue(category, bundle);
          const addOnLossRate = (portfolioBundleAddOnRates[bundle] || 0) / 100;
          const avgAddOnPerListing = originalListings > 0 ? currentAddOn / originalListings : 0;
          const newAddOn = avgAddOnPerListing * (1 + addOnLossRate) * finalListings;

          const currentRevenue = bData.totalRevenue;
          const projectedRevenue = finalListings * newCPL;

          bundleResults[bundle] = {
            currentRevenue,
            projectedRevenue,
            currentAddOn,
            newAddOn,
            currentListings: originalListings,
            projectedListings: finalListings,
            currentCPL,
            newCPL
          };
        });

        // Sum category totals
        let totalCurrentRev = 0, totalProjectedRev = 0;
        let totalCurrentAddOn = 0, totalNewAddOn = 0;
        let totalCurrentListings = 0;
        Object.values(bundleResults).forEach(r => {
          totalCurrentRev += r.currentRevenue;
          totalProjectedRev += r.projectedRevenue;
          totalCurrentAddOn += r.currentAddOn;
          totalNewAddOn += r.newAddOn;
          totalCurrentListings += r.currentListings;
        });

        const cplRevenueChange = totalProjectedRev - totalCurrentRev;
        const addOnRevenueChange = totalNewAddOn - totalCurrentAddOn;
        const netRevenueChange = cplRevenueChange + addOnRevenueChange - portfolioFixedKDLoss;
        const currentRevenue = totalCurrentRev;
        const newRevenue = currentRevenue + netRevenueChange;
        const percentChange = currentRevenue > 0 ? (netRevenueChange / currentRevenue) * 100 : 0;

        results.push({
          category,
          currentRevenue,
          newRevenue,
          netRevenueChange,
          percentChange,
          currentListings: totalCurrentListings,
          currentCPL: 0,
          newCPL: 0,
          stayRate: 0,
          effectiveChurn: 0,
          effectiveDowngrade: 0,
          effectiveUpgrade: 0,
          currentAddOnRevenue: totalCurrentAddOn,
          newAddOnRevenue: totalNewAddOn,
          downgradeRevenue: 0,
          upgradeRevenue: 0,
          cplRevenueChange,
          addOnRevenueChange,
          hasAddOn: totalCurrentAddOn > 0
        });
      });
    } else {
      // SINGLE-BUNDLE MODE (with per-bundle downgrade/upgrade/add-on rates)
      categories.forEach(category => {
        const catData = historicalData[category];
        if (!catData[portfolioBundle]) return;

        const bundleInfo = catData[portfolioBundle];
        const currentCPL = bundleInfo.avgCPL;
        const currentListings = bundleInfo.totalListings;
        const currentRevenue = bundleInfo.totalRevenue;

        const currentAddOnRevenue = getAddOnRevenue(category, portfolioBundle);
        const newCPL = currentCPL * (1 + portfolioPriceChange / 100);

        const availBundles = Object.keys(catData);
        const lowerBundles = getLowerTierBundles(portfolioBundle, availBundles);
        const higherBundles = getHigherTierBundles(portfolioBundle, availBundles);
        const isBottom = lowerBundles.length === 0;
        const isTop = higherBundles.length === 0;

        // Sum per-bundle downgrade/upgrade rates (only for bundles available in this category)
        const totalDowngradeRate = isBottom ? 0 : lowerBundles.reduce((s, b) => s + (portfolioDowngradeRates[b] || 0), 0);
        const totalUpgradeRate = isTop ? 0 : higherBundles.reduce((s, b) => s + (portfolioUpgradeRates[b] || 0), 0);

        const effectiveChurn = Math.min(portfolioChurnRate, 100);
        const effectiveDowngrade = Math.min(totalDowngradeRate, 100 - effectiveChurn);
        const effectiveUpgrade = Math.min(totalUpgradeRate, 100 - effectiveChurn - effectiveDowngrade);
        const stayRate = Math.max(0, 100 - effectiveChurn - effectiveDowngrade - effectiveUpgrade);

        const stayingListings = currentListings * (stayRate / 100);

        // Per-bundle add-on loss rate for the selected bundle
        const addOnLossRate = portfolioAddOnLossRates[portfolioBundle] || 0;
        const avgAddOnPerListing = currentListings > 0 ? currentAddOnRevenue / currentListings : 0;
        const adjustedAddOnPerListing = avgAddOnPerListing * (1 + addOnLossRate / 100);
        const newAddOnRevenue = adjustedAddOnPerListing * stayingListings;

        let downgradeRevenue = 0;
        if (lowerBundles.length > 0 && effectiveDowngrade > 0) {
          lowerBundles.forEach(bundle => {
            const bundleRate = portfolioDowngradeRates[bundle] || 0;
            if (bundleRate > 0 && catData[bundle]) {
              const listings = currentListings * (bundleRate / 100);
              downgradeRevenue += listings * catData[bundle].avgCPL;
            }
          });
        }

        let upgradeRevenue = 0;
        if (higherBundles.length > 0 && effectiveUpgrade > 0) {
          higherBundles.forEach(bundle => {
            const bundleRate = portfolioUpgradeRates[bundle] || 0;
            if (bundleRate > 0 && catData[bundle]) {
              const listings = currentListings * (bundleRate / 100);
              upgradeRevenue += listings * catData[bundle].avgCPL;
            }
          });
        }

        const newBundleRevenue = stayingListings * newCPL;
        const cplRevenueChange = (newBundleRevenue - currentRevenue) + downgradeRevenue + upgradeRevenue;
        const addOnRevenueChange = newAddOnRevenue - currentAddOnRevenue;
        const netRevenueChange = cplRevenueChange + addOnRevenueChange - portfolioFixedKDLoss;
        const newRevenue = currentRevenue + netRevenueChange;
        const percentChange = currentRevenue > 0 ? (netRevenueChange / currentRevenue) * 100 : 0;

        results.push({
          category,
          currentRevenue,
          newRevenue,
          netRevenueChange,
          percentChange,
          currentListings,
          currentCPL,
          newCPL,
          stayRate,
          effectiveChurn,
          effectiveDowngrade,
          effectiveUpgrade,
          currentAddOnRevenue,
          newAddOnRevenue,
          downgradeRevenue,
          upgradeRevenue,
          cplRevenueChange,
          addOnRevenueChange,
          hasAddOn: currentAddOnRevenue > 0
        });
      });
    }

    return results;
  }, [historicalData, portfolioBundle, portfolioPriceChange, portfolioChurnRate, portfolioDowngradeRates, portfolioUpgradeRates, portfolioAddOnLossRates, portfolioFixedKDLoss, addOnData, portfolioIsMultiBundle, portfolioSelectedBundles, portfolioBundlePriceChanges, portfolioBundleChurnRates, portfolioBundleDowngradeRates, portfolioBundleUpgradeRates, portfolioBundleAddOnRates, portfolioAddOnEdits]);

  // Portfolio aggregate summary
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
      totalCurrent,
      totalNew,
      totalNetChange,
      totalPercentChange,
      categoriesAnalyzed: portfolioResults.length,
      totalCategories: Object.keys(historicalData).length,
      positiveCount,
      negativeCount,
      neutralCount,
      totalCurrentAddOn,
      totalNewAddOn,
      totalAddOnChange,
      totalCplChange,
      totalDowngradeRevenue,
      totalUpgradeRevenue
    };
  }, [portfolioResults, historicalData]);

  // Build waterfall data for visualization
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

  // Sensitivity analysis data
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
      
      // Calculate downgrade revenue across all bundles
      let downgradeRev = 0;
      lowerBundles.forEach(bundle => {
        const rate = downgradeRates[bundle] || 0;
        const listings = bundleInfo.totalListings * (rate / 100);
        const bundleData = categoryData[bundle];
        downgradeRev += bundleData ? listings * bundleData.avgCPL : 0;
      });
      
      // Calculate upgrade revenue across all bundles
      let upgradeRev = 0;
      higherBundles.forEach(bundle => {
        const rate = upgradeRates[bundle] || 0;
        const listings = bundleInfo.totalListings * (rate / 100);
        const bundleData = categoryData[bundle];
        upgradeRev += bundleData ? listings * bundleData.avgCPL : 0;
      });
      
      const netChange = (newBundleRev - bundleInfo.totalRevenue) + downgradeRev + upgradeRev - fixedKDLoss;
      
      data.push({
        churnRate: churn,
        netChange: Math.round(netChange),
      });
    }
    return data;
  }, [hasData, results, categoryData, selectedBundle, priceChange, downgradeRates, upgradeRates, totalDowngradeRate, totalUpgradeRate, fixedKDLoss, isTopTier, isBottomTier, lowerBundles, higherBundles]);

  const bundleRevenueShare = results ? (results.currentRevenue / categoryTotals.totalRevenue * 100).toFixed(1) : '0';
  const bundleListingsShare = results ? (results.currentListings / categoryTotals.totalListings * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Bundle Pricing Decision Support Tool</h1>
        <p className="text-slate-400 mb-6">Simulate price changes with upgrade & downgrade migration modeling</p>
        
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('historical')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'historical'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Single Category Analysis
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'custom'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Custom Input
          </button>
          <button
            onClick={() => setActiveTab('abtest')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'abtest'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            A/B Testing
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'portfolio'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Portfolio Analysis
          </button>
        </div>

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
                  onClick={exportHistoricalData}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs transition-colors"
                >
                  Export Current Data
                </button>
                <label className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-xs cursor-pointer transition-colors">
                  Upload CSV
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleHistoricalCSVUpload}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={resetHistoricalData}
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
                  onClick={exportAddOnData}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs transition-colors"
                >
                  Export Current Data
                </button>
                <label className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded text-xs cursor-pointer transition-colors">
                  Upload Add-On CSV
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleAddOnCSVUpload}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={resetAddOnData}
                  className="px-3 py-1.5 bg-red-600/50 hover:bg-red-600 rounded text-xs transition-colors"
                >
                  Reset to Default
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Input Tab Content */}
        {activeTab === 'custom' && (
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
                  onChange={handleCSVUpload}
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
        )}

        {/* A/B Testing Tab Content */}
        {activeTab === 'abtest' && (
          <div className="space-y-6 mb-6">
            {/* Incomplete Feature Disclaimer */}
            <div className="bg-yellow-900/40 border-2 border-yellow-500/60 rounded-lg p-5 text-center">
              <div className="text-yellow-400 text-2xl font-bold mb-2">⚠ Work in Progress</div>
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
                      onClick={downloadAbTestTemplate}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors"
                    >
                      Download Template
                    </button>
                    <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm cursor-pointer transition-colors">
                      Upload Results CSV
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleAbTestResultsUpload}
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
                              <div className="text-slate-500 pl-2">→ {bundle}:</div>
                              <div className="text-amber-300">{data.rate}% ({data.count})</div>
                            </React.Fragment>
                          ))}
                          
                          <div className="col-span-2 border-t border-slate-700 my-1"></div>
                          
                          <div className="text-slate-400">Upgrade Total:</div>
                          <div className="font-bold text-blue-400">{abTestResults.totalUpgradeRate}%</div>
                          
                          {Object.entries(abTestResults.upgradeRates).map(([bundle, data]) => (
                            <React.Fragment key={bundle}>
                              <div className="text-slate-500 pl-2">→ {bundle}:</div>
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
                            <span className="text-slate-500">(±{abTestResults.marginOfError}%)</span>
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
                          {test.category} → {test.bundle} +{test.priceChange}% | {test.date}
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
        )}

        {/* Portfolio Analysis Tab Content */}
        {activeTab === 'portfolio' && (
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
                                    <input type="range" min="-100" max="500" step="0.1"
                                      value={portfolioDowngradeRates[bundle] || 0}
                                      onChange={(e) => setPortfolioDowngradeRates({
                                        ...portfolioDowngradeRates,
                                        [bundle]: Number(e.target.value)
                                      })}
                                      className="flex-1 h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer" />
                                    <input type="number" min="-100" max="500" step="0.1"
                                      value={portfolioDowngradeRates[bundle] || 0}
                                      onChange={(e) => setPortfolioDowngradeRates({
                                        ...portfolioDowngradeRates,
                                        [bundle]: Math.max(-100, Math.min(500, Number(e.target.value)))
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
                                    <input type="range" min="-100" max="500" step="0.1"
                                      value={portfolioUpgradeRates[bundle] || 0}
                                      onChange={(e) => setPortfolioUpgradeRates({
                                        ...portfolioUpgradeRates,
                                        [bundle]: Number(e.target.value)
                                      })}
                                      className="flex-1 h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer" />
                                    <input type="number" min="-100" max="500" step="0.1"
                                      value={portfolioUpgradeRates[bundle] || 0}
                                      onChange={(e) => setPortfolioUpgradeRates({
                                        ...portfolioUpgradeRates,
                                        [bundle]: Math.max(-100, Math.min(500, Number(e.target.value)))
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
                                    min="-100"
                                    max="500"
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
                                    min="-100"
                                    max="500"
                                    step="0.1"
                                    value={portfolioBundleChurnRates[bundle] || 0}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      setPortfolioBundleChurnRates({
                                        ...portfolioBundleChurnRates,
                                        [bundle]: Math.max(-100, Math.min(500, val))
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
                                            min="-100"
                                            max="500"
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
                                            min="-100"
                                            max="500"
                                            step="0.1"
                                            value={portfolioBundleDowngradeRates[bundle]?.[targetBundle] || 0}
                                            onChange={(e) => {
                                              const val = Number(e.target.value);
                                              const newRates = { ...portfolioBundleDowngradeRates };
                                              if (!newRates[bundle]) newRates[bundle] = {};
                                              newRates[bundle][targetBundle] = Math.max(-100, Math.min(500, val));
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
                                            min="-100"
                                            max="500"
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
                                            min="-100"
                                            max="500"
                                            step="0.1"
                                            value={portfolioBundleUpgradeRates[bundle]?.[targetBundle] || 0}
                                            onChange={(e) => {
                                              const val = Number(e.target.value);
                                              const newRates = { ...portfolioBundleUpgradeRates };
                                              if (!newRates[bundle]) newRates[bundle] = {};
                                              newRates[bundle][targetBundle] = Math.max(-100, Math.min(500, val));
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
                    min="-100"
                    max="500"
                    step="0.1"
                    value={churnRate}
                    onChange={(e) => setChurnRate(Number(e.target.value))}
                    className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="number"
                    min="-100"
                    max="500"
                    step="0.1"
                    value={churnRate}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setChurnRate(Math.max(-100, Math.min(500, val)));
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
                            min="-100"
                            max="500"
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
                            min="-100"
                            max="500"
                            step="0.1"
                            value={downgradeRates[bundle] || 0}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setDowngradeRates({
                                ...downgradeRates,
                                [bundle]: Math.max(-100, Math.min(500, val))
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
                            min="-100"
                            max="500"
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
                            min="-100"
                            max="500"
                            step="0.1"
                            value={upgradeRates[bundle] || 0}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setUpgradeRates({
                                ...upgradeRates,
                                [bundle]: Math.max(-100, Math.min(500, val))
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
                  const bundleData = categoryData[bundle];
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
                          {bundleData?.avgCPL.toFixed(2)} KD, {bundleData?.totalListings} listings
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
                            min="-100"
                            max="500"
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
                            min="-100"
                            max="500"
                            step="0.1"
                            value={bundleChurnRates[bundle] || 0}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setBundleChurnRates({
                                ...bundleChurnRates,
                                [bundle]: Math.max(-100, Math.min(500, val))
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
                                    min="-100"
                                    max="500"
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
                                    min="-100"
                                    max="500"
                                    step="0.1"
                                    value={bundleDowngradeRates[bundle]?.[targetBundle] || 0}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      const newRates = { ...bundleDowngradeRates };
                                      if (!newRates[bundle]) newRates[bundle] = {};
                                      newRates[bundle][targetBundle] = Math.max(-100, Math.min(500, val));
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
                                    min="-100"
                                    max="500"
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
                                    min="-100"
                                    max="500"
                                    step="0.1"
                                    value={bundleUpgradeRates[bundle]?.[targetBundle] || 0}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      const newRates = { ...bundleUpgradeRates };
                                      if (!newRates[bundle]) newRates[bundle] = {};
                                      newRates[bundle][targetBundle] = Math.max(-100, Math.min(500, val));
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

              {/* Cannibalization Warning */}
              {multiBundleResults.cannibalization > 0 && (
                <div className="bg-amber-900/30 border border-amber-700 rounded-lg p-3 mb-4">
                  <div className="text-xs text-amber-400 font-semibold mb-1">⚠️ Cannibalization Alert</div>
                  <div className="text-sm text-amber-300">
                    {Math.round(multiBundleResults.cannibalization).toLocaleString()} KD lost to cross-bundle migration
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Revenue lost when customers migrate between price-changed bundles
                  </div>
                </div>
              )}

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

              {multiBundleResults.cannibalization > 50000 && (
                <div className="rounded-lg p-3 bg-amber-900/30">
                  <div className="text-xs text-slate-400">Cannibalization Warning</div>
                  <div className="text-sm text-amber-300">
                    High cross-bundle migration reducing gains
                  </div>
                </div>
              )}
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
                        const bundleData = categoryData[bundle];
                        downgradeRev += bundleData ? listings * bundleData.avgCPL : 0;
                      });
                      
                      // Calculate upgrade revenue across all bundles
                      let upgradeRev = 0;
                      higherBundles.forEach(bundle => {
                        const rate = upgradeRates[bundle] || 0;
                        const listings = bundleInfo.totalListings * (rate / 100);
                        const bundleData = categoryData[bundle];
                        upgradeRev += bundleData ? listings * bundleData.avgCPL : 0;
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
      </div>
    </div>
  );
}
