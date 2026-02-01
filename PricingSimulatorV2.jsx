import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell, ReferenceLine } from 'recharts';

// Default add-on revenue data (optional - can be uploaded via CSV)
// Format: Category -> Bundle -> totalAddOnRevenue
const defaultAddOnData = {
  "AC Services": {
    "Basic": 0,
    "Standard": 0,
    "Premium": 5,
    "Extra": 20,
    "Plus": 45,
    "Super": 130,
    "Optimum": 0
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
  
  // Add-On Loss Rates by tier (default 0% - optional input)
  const [addOnLossRates, setAddOnLossRates] = useState(() => {
    const saved = localStorage.getItem('addOnLossRates');
    return saved ? JSON.parse(saved) : {
      'Basic': 0,
      'Standard': 0,
      'Premium': 0,
      'Extra': 0,
      'Plus': 0,
      'Super': 0,
      'Optimum': 0
    };
  });

  // Combine historical and custom data
  const bundleData = useMemo(() => {
    if (activeTab === 'historical' || activeTab === 'abtest') {
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
    const avgAddOnPerCustomer = currentListings > 0 ? currentAddOnRevenue / currentListings : 0;
    const addOnLossRate = (addOnLossRates[selectedBundle] || 0) / 100;
    
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

    // Calculate add-on revenue impact
    const stayingAddOnRevenue = stayingListings * avgAddOnPerCustomer * (1 - addOnLossRate);
    const lostAddOnRevenue = (churnedListings + totalDowngradeListings + totalUpgradeListings) * avgAddOnPerCustomer * addOnLossRate;
    const newAddOnRevenue = currentAddOnRevenue - lostAddOnRevenue;

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
      avgAddOnPerCustomer,
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
      stayingAddOnRevenue,
      lostAddOnRevenue,
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
            Historical Data
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
        </div>

        {/* Bundle Position Indicator */}
        <div className="bg-slate-800 rounded-lg p-4 mb-6">
          <div className="text-sm text-slate-400 mb-3">Bundle Tier Position for {selectedCategory}</div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {BUNDLE_TIER_ORDER.filter(b => availableBundles.includes(b)).map((bundle, i) => (
              <div
                key={bundle}
                className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                  bundle === selectedBundle
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
          <div className="flex gap-4 mt-2 text-xs">
            <span className="text-emerald-400">↑ Upgrade options</span>
            <span className="text-blue-400">● Selected</span>
            <span className="text-amber-400">↓ Downgrade options</span>
          </div>
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
            <h2 className="text-lg font-semibold mb-4">Scenario Controls</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Price Change: <span className="text-emerald-400 font-bold">{priceChange > 0 ? '+' : ''}{priceChange}%</span>
                </label>
                <input
                  type="range"
                  min="-30"
                  max="50"
                  value={priceChange}
                  onChange={(e) => setPriceChange(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-slate-500">New CPL: {results.newCPL.toFixed(2)} KD</div>
              </div>
              
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Churn Rate: <span className="text-red-400 font-bold">{churnRate}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={churnRate}
                  onChange={(e) => setChurnRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
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
                        <input
                          type="range"
                          min="0"
                          max="30"
                          value={downgradeRates[bundle] || 0}
                          onChange={(e) => setDowngradeRates({
                            ...downgradeRates,
                            [bundle]: Number(e.target.value)
                          })}
                          className="w-full h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                        />
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
                        <input
                          type="range"
                          min="0"
                          max="20"
                          value={upgradeRates[bundle] || 0}
                          onChange={(e) => setUpgradeRates({
                            ...upgradeRates,
                            [bundle]: Number(e.target.value)
                          })}
                          className="w-full h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                        />
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

              {/* Add-On Loss Rate for Current Bundle */}
              {results && results.currentAddOnRevenue > 0 && (
                <div className="border-t border-slate-700 pt-3">
                  <label className="block text-sm text-slate-400 mb-2">
                    Add-On Loss Rate for {selectedBundle}: <span className="text-purple-400 font-bold">{addOnLossRates[selectedBundle] || 0}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={addOnLossRates[selectedBundle] || 0}
                    onChange={(e) => setAddOnLossRates({
                      ...addOnLossRates,
                      [selectedBundle]: Number(e.target.value)
                    })}
                    className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-xs text-slate-500 mt-1">
                    Current add-on: {results.currentAddOnRevenue.toFixed(2)} KD ({results.avgAddOnPerCustomer.toFixed(2)} KD/customer)
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-700">
                <div className="text-xs text-slate-400">
                  Total: Stay {results.stayRate.toFixed(0)}% + Churn {results.effectiveChurn}% + Down {results.effectiveDowngrade.toFixed(0)}% + Up {results.effectiveUpgrade.toFixed(0)}% = 100%
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-slate-800 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Projected Impact</h2>
            
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

          {/* Insights */}
          <div className="bg-slate-800 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Key Insights</h2>
            
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
              <div className="bg-slate-900 rounded-lg p-4">
                <h4 className="font-semibold text-blue-400 mb-2">Step 1: New Price Calculation</h4>
                <pre className="text-slate-300 overflow-x-auto">
{`newCPL = currentCPL × (1 + priceChange/100)
newCPL = ${results.currentCPL.toFixed(2)} × (1 + ${priceChange}/100)
newCPL = ${results.currentCPL.toFixed(2)} × ${(1 + priceChange/100).toFixed(2)}
newCPL = ${results.newCPL.toFixed(2)} KD`}
                </pre>
              </div>
              
              <div className="bg-slate-900 rounded-lg p-4">
                <h4 className="font-semibold text-emerald-400 mb-2">Step 2: Listing Distribution</h4>
                <pre className="text-slate-300 overflow-x-auto">
{`Total Listings: ${results.currentListings}

stayRate = 100% - churnRate - downgradeRate - upgradeRate
stayRate = 100% - ${results.effectiveChurn}% - ${results.effectiveDowngrade}% - ${results.effectiveUpgrade}%
stayRate = ${results.stayRate.toFixed(1)}%

stayingListings = ${results.currentListings} × ${results.stayRate.toFixed(1)}% = ${Math.round(results.stayingListings)}
churnedListings = ${results.currentListings} × ${results.effectiveChurn}% = ${Math.round(results.churnedListings)}
downgradeListings = ${results.currentListings} × ${results.effectiveDowngrade}% = ${Math.round(results.downgradeListings)}
upgradeListings = ${results.currentListings} × ${results.effectiveUpgrade}% = ${Math.round(results.upgradeListings)}`}
                </pre>
              </div>
              
              <div className="bg-slate-900 rounded-lg p-4">
                <h4 className="font-semibold text-amber-400 mb-2">Step 3: Revenue Calculation</h4>
                <pre className="text-slate-300 overflow-x-auto">
{`Revenue from staying customers:
newBundleRevenue = stayingListings × newCPL
newBundleRevenue = ${Math.round(results.stayingListings)} × ${results.newCPL.toFixed(2)}
newBundleRevenue = ${Math.round(results.newBundleRevenue).toLocaleString()} KD

Revenue from downgraded customers (distributed):
${lowerBundles.map(b => `  → ${b}: ${(downgradeRates[b] || 0)}% = ${Math.round(results.downgradeDetails?.[b]?.listings || 0)} listings × ${(results.downgradeDetails?.[b]?.cpl || 0).toFixed(2)} KD = ${Math.round(results.downgradeDetails?.[b]?.revenue || 0).toLocaleString()} KD`).join('\n')}
Total downgradeRevenue = ${Math.round(results.downgradeRevenue).toLocaleString()} KD

Revenue from upgraded customers (distributed):
${higherBundles.map(b => `  → ${b}: ${(upgradeRates[b] || 0)}% = ${Math.round(results.upgradeDetails?.[b]?.listings || 0)} listings × ${(results.upgradeDetails?.[b]?.cpl || 0).toFixed(2)} KD = ${Math.round(results.upgradeDetails?.[b]?.revenue || 0).toLocaleString()} KD`).join('\n')}
Total upgradeRevenue = ${Math.round(results.upgradeRevenue).toLocaleString()} KD

Lost revenue (churn):
lostRevenue = churnedListings × oldCPL
lostRevenue = ${Math.round(results.churnedListings)} × ${results.currentCPL.toFixed(2)}
lostRevenue = ${Math.round(results.lostRevenue).toLocaleString()} KD`}
                </pre>
              </div>
              
              <div className="bg-slate-900 rounded-lg p-4">
                <h4 className="font-semibold text-purple-400 mb-2">Step 4: Net Impact</h4>
                <pre className="text-slate-300 overflow-x-auto">
{`Old ${selectedBundle} Revenue: ${results.currentRevenue.toLocaleString()} KD
Fixed KD Loss: ${fixedKDLoss.toLocaleString()} KD

netRevenueChange = (newBundleRevenue - oldRevenue) + downgradeRevenue + upgradeRevenue - fixedKDLoss
netRevenueChange = (${Math.round(results.newBundleRevenue).toLocaleString()} - ${results.currentRevenue.toLocaleString()}) + ${Math.round(results.downgradeRevenue).toLocaleString()} + ${Math.round(results.upgradeRevenue).toLocaleString()} - ${fixedKDLoss.toLocaleString()}
netRevenueChange = ${Math.round(results.netRevenueChange).toLocaleString()} KD

Percentage Change: ${results.percentChange.toFixed(2)}% of category revenue`}
                </pre>
              </div>
              
              <div className="bg-slate-900 rounded-lg p-4">
                <h4 className="font-semibold text-red-400 mb-2">Break-Even Formula</h4>
                <pre className="text-slate-300 overflow-x-auto">
{`Break-even churn (assuming no migration):
breakEvenChurn = (priceChange × 100) / (100 + priceChange)
breakEvenChurn = (${priceChange} × 100) / (100 + ${priceChange})
breakEvenChurn = ${priceChange * 100} / ${100 + priceChange}
breakEvenChurn = ${results.breakEvenChurn.toFixed(1)}%

This means: at +${priceChange}% price, if more than ${results.breakEvenChurn.toFixed(1)}% 
of customers leave (with no migration), you start losing money.`}
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
