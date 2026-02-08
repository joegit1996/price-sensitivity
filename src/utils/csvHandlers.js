import defaultAddOnData from '../data/defaultAddOnData';
import historicalBundleData from '../data/historicalBundleData';

function downloadBlob(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

// CSV Template Download (custom scenarios - single category)
export const downloadTemplate = () => {
  const csv = `Bundle,CPL,Listings
Basic,3.00,1000
Plus,15.00,500
Super,30.00,200`;
  downloadBlob(csv, 'bundle_template.csv');
};

// Historical Data CSV Template Download (multi-category format)
export const downloadHistoricalTemplate = () => {
  const csv = `Category,Bundle,CPL,Listings
AC Services,Basic,3.15,2751
AC Services,Plus,17.24,464
AC Services,Super,30.82,471
Plumber,Basic,2.46,2614
Plumber,Plus,13.06,272
Plumber,Super,16.81,897`;
  downloadBlob(csv, 'historical_data_template.csv');
};

// Add-On Data - Download template CSV
export const downloadAddOnTemplate = () => {
  const csv = `Category,Bundle,AddOnRevenue
AC Services,Basic,0
AC Services,Plus,45
AC Services,Super,130
Plumber,Basic,0
Plumber,Plus,20
Plumber,Super,80`;
  downloadBlob(csv, 'addon_data_template.csv');
};

// A/B Test - Download results template CSV
export const downloadAbTestTemplate = (abTestAvailableBundles) => {
  const bundles = abTestAvailableBundles.length > 0 ? abTestAvailableBundles : ['Basic', 'Plus', 'Super'];
  let csv = 'Bundle,Listings\n';
  bundles.forEach(bundle => {
    csv += `${bundle},0\n`;
  });
  downloadBlob(csv, 'ab_test_results_template.csv');
};

// CSV Upload Handler (for custom scenarios - single category)
export const handleCSVUpload = (event, setEditingBundles) => {
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

// Historical Data CSV Upload Handler (multi-category format)
export const handleHistoricalCSVUpload = (event, { setHistoricalData, selectedCategory, setSelectedCategory, setSelectedBundle }) => {
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
  event.target.value = '';
};

// Add-On Data - CSV Upload Handler
export const handleAddOnCSVUpload = (event, setAddOnData) => {
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

// A/B Test - Upload and parse results CSV
export const handleAbTestResultsUpload = (event, { abTestGroupSize, abTestBundleData, abTestBundle, abTestCategory, abTestPriceChange, abTestDuration, abTestLowerBundles, abTestHigherBundles, setAbTestResults }) => {
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

      const stayedCount = resultsByBundle[abTestBundle] || 0;
      const churnedCount = startingSize - totalAfter;

      const stayedRate = (stayedCount / startingSize) * 100;
      const churnRate = Math.max(0, (churnedCount / startingSize) * 100);

      const downgradeRates = {};
      let totalDowngradeRate = 0;
      abTestLowerBundles.forEach(bundle => {
        const count = resultsByBundle[bundle] || 0;
        const rate = (count / startingSize) * 100;
        downgradeRates[bundle] = { count, rate: parseFloat(rate.toFixed(1)) };
        totalDowngradeRate += rate;
      });

      const upgradeRates = {};
      let totalUpgradeRate = 0;
      abTestHigherBundles.forEach(bundle => {
        const count = resultsByBundle[bundle] || 0;
        const rate = (count / startingSize) * 100;
        upgradeRates[bundle] = { count, rate: parseFloat(rate.toFixed(1)) };
        totalUpgradeRate += rate;
      });

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

// Reset historical data to default
export const resetHistoricalData = ({ setHistoricalData, setSelectedCategory, setSelectedBundle }) => {
  if (confirm('Reset to default historical data? This will remove any uploaded data.')) {
    setHistoricalData(historicalBundleData);
    setSelectedCategory('AC Services');
    setSelectedBundle('Plus');
  }
};

// Export current historical data as CSV
export const exportHistoricalData = (historicalData) => {
  let csv = 'Category,Bundle,CPL,Listings,Revenue\n';
  Object.entries(historicalData).forEach(([category, bundles]) => {
    Object.entries(bundles).forEach(([bundle, data]) => {
      csv += `${category},${bundle},${data.avgCPL},${data.totalListings},${data.totalRevenue}\n`;
    });
  });
  downloadBlob(csv, 'historical_data_export.csv');
};

// Add-On Data - Export current data as CSV
export const exportAddOnData = (addOnData) => {
  let csv = 'Category,Bundle,AddOnRevenue\n';
  Object.entries(addOnData).forEach(([category, bundles]) => {
    Object.entries(bundles).forEach(([bundle, revenue]) => {
      csv += `${category},${bundle},${revenue}\n`;
    });
  });
  downloadBlob(csv, 'addon_data_export.csv');
};

// Add-On Data - Reset to defaults
export const resetAddOnData = (setAddOnData) => {
  if (confirm('Reset add-on data to defaults? This will remove any uploaded data.')) {
    setAddOnData(defaultAddOnData);
  }
};
