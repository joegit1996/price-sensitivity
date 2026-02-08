import { BUNDLE_TIER_ORDER, getHigherTierBundles, getLowerTierBundles } from '../data/bundleTiers';

// Single-bundle calculation (used by the main "results" useMemo)
export function calculateSingleBundleResults({
  categoryData, selectedCategory, selectedBundle, priceChange, churnRate,
  downgradeRates, upgradeRates, totalDowngradeRate, totalUpgradeRate,
  fixedKDLoss, categoryTotals, isTopTier, isBottomTier,
  lowerBundles, higherBundles, addOnData, addOnLossRates
}) {
  if (!categoryData || Object.keys(categoryData).length === 0) return null;
  const bundleInfo = categoryData[selectedBundle];
  if (!bundleInfo) return null;

  const currentCPL = bundleInfo.avgCPL;
  const currentListings = bundleInfo.totalListings;
  const currentRevenue = bundleInfo.totalRevenue;

  const currentAddOnRevenue = (addOnData[selectedCategory]?.[selectedBundle] || 0);
  const addOnLossRate = ((addOnLossRates[selectedCategory]?.[selectedBundle] || 0) / 100);

  const newCPL = currentCPL * (1 + priceChange / 100);

  const effectiveChurn = Math.min(churnRate, 100);
  const effectiveDowngrade = isBottomTier ? 0 : Math.min(totalDowngradeRate, 100 - effectiveChurn);
  const effectiveUpgrade = isTopTier ? 0 : Math.min(totalUpgradeRate, 100 - effectiveChurn - effectiveDowngrade);
  const stayRate = Math.max(0, 100 - effectiveChurn - effectiveDowngrade - effectiveUpgrade);

  const stayingListings = currentListings * (stayRate / 100);
  const churnedListings = currentListings * (effectiveChurn / 100);
  const totalDowngradeListings = currentListings * (effectiveDowngrade / 100);
  const totalUpgradeListings = currentListings * (effectiveUpgrade / 100);

  const avgAddOnPerListing = currentListings > 0 ? currentAddOnRevenue / currentListings : 0;
  const adjustedAddOnPerListing = avgAddOnPerListing * (1 + addOnLossRate);
  const newAddOnRevenue = adjustedAddOnPerListing * stayingListings;

  const downgradeDetails = {};
  let downgradeRevenue = 0;
  lowerBundles.forEach(bundle => {
    const rate = downgradeRates[bundle] || 0;
    const listings = currentListings * (rate / 100);
    const bd = categoryData[bundle];
    const revenue = bd ? listings * bd.avgCPL : 0;
    downgradeDetails[bundle] = { rate, listings, revenue, cpl: bd?.avgCPL || 0 };
    downgradeRevenue += revenue;
  });

  const upgradeDetails = {};
  let upgradeRevenue = 0;
  higherBundles.forEach(bundle => {
    const rate = upgradeRates[bundle] || 0;
    const listings = currentListings * (rate / 100);
    const bd = categoryData[bundle];
    const revenue = bd ? listings * bd.avgCPL : 0;
    upgradeDetails[bundle] = { rate, listings, revenue, cpl: bd?.avgCPL || 0 };
    upgradeRevenue += revenue;
  });

  const newBundleRevenue = stayingListings * newCPL;
  const lostRevenue = churnedListings * currentCPL;

  const oldCategoryRevenue = categoryTotals.totalRevenue;
  const cplRevenueChange = (newBundleRevenue - currentRevenue) + downgradeRevenue + upgradeRevenue;
  const addOnRevenueChange = newAddOnRevenue - currentAddOnRevenue;
  const netRevenueChange = cplRevenueChange + addOnRevenueChange - fixedKDLoss;
  const newCategoryRevenue = oldCategoryRevenue + netRevenueChange;
  const percentChange = (netRevenueChange / oldCategoryRevenue) * 100;

  const breakEvenChurn = (priceChange * 100) / (100 + priceChange);

  return {
    currentCPL, newCPL, currentListings, currentRevenue,
    currentAddOnRevenue, avgAddOnPerListing, adjustedAddOnPerListing, addOnLossRate,
    stayRate, stayingListings, churnedListings,
    downgradeListings: totalDowngradeListings,
    upgradeListings: totalUpgradeListings,
    newBundleRevenue, downgradeRevenue, upgradeRevenue,
    downgradeDetails, upgradeDetails,
    lostRevenue, newAddOnRevenue, addOnRevenueChange, cplRevenueChange,
    oldCategoryRevenue, newCategoryRevenue, netRevenueChange, percentChange,
    breakEvenChurn, effectiveChurn, effectiveDowngrade, effectiveUpgrade, fixedKDLoss,
  };
}

// Multi-bundle calculation
export function calculateMultiBundleResults({
  categoryData, selectedCategory, selectedBundles, bundlePriceChanges,
  bundleChurnRates, bundleDowngradeRates, bundleUpgradeRates,
  addOnData, addOnLossRates, fixedKDLoss
}) {
  if (!categoryData || Object.keys(categoryData).length === 0) return null;

  const availableBundles = Object.keys(categoryData);
  const selectedBundleNames = Object.keys(selectedBundles).filter(b => selectedBundles[b]);
  if (selectedBundleNames.length === 0) return null;

  const newCPLs = {};
  availableBundles.forEach(bundle => {
    const priceChange = bundlePriceChanges[bundle] || 0;
    newCPLs[bundle] = categoryData[bundle].avgCPL * (1 + priceChange / 100);
  });

  const bundleResults = {};
  let totalCannibalization = 0;

  availableBundles.forEach(bundle => {
    const bd = categoryData[bundle];
    const originalListings = bd.totalListings;
    const currentCPL = bd.avgCPL;
    const newCPL = newCPLs[bundle];
    const priceChange = bundlePriceChanges[bundle] || 0;

    let finalListings = originalListings;

    const churnRate = bundleChurnRates[bundle] || 0;
    const downRates = bundleDowngradeRates[bundle] || {};
    const upRates = bundleUpgradeRates[bundle] || {};

    const churned = originalListings * (churnRate / 100);
    finalListings -= churned;

    let totalDowngraded = 0;
    let totalUpgraded = 0;
    const downgradeDetails = {};
    const upgradeDetails = {};

    Object.entries(downRates).forEach(([targetBundle, rate]) => {
      const downgraded = originalListings * (rate / 100);
      finalListings -= downgraded;
      totalDowngraded += downgraded;
      downgradeDetails[targetBundle] = { rate, listings: downgraded, targetCPL: newCPLs[targetBundle] };
      if (selectedBundles[targetBundle]) {
        const lostPerCustomer = currentCPL - newCPLs[targetBundle];
        totalCannibalization += lostPerCustomer * downgraded;
      }
    });

    Object.entries(upRates).forEach(([targetBundle, rate]) => {
      const upgraded = originalListings * (rate / 100);
      finalListings -= upgraded;
      totalUpgraded += upgraded;
      upgradeDetails[targetBundle] = { rate, listings: upgraded, targetCPL: newCPLs[targetBundle] };
    });

    let totalIncomingDowngrades = 0;
    let totalIncomingUpgrades = 0;

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

    const currentAddOnRevenue = addOnData[selectedCategory]?.[bundle] || 0;
    const addOnLossRate = (addOnLossRates[selectedCategory]?.[bundle] || 0) / 100;
    const avgAddOnPerListing = originalListings > 0 ? currentAddOnRevenue / originalListings : 0;
    const adjustedAddOnPerListing = avgAddOnPerListing * (1 + addOnLossRate);
    const newAddOnRevenue = adjustedAddOnPerListing * finalListings;

    const currentRevenue = bd.totalRevenue;
    const projectedRevenue = finalListings * newCPL;
    const revenueChange = projectedRevenue - currentRevenue;
    const addOnRevenueChange = newAddOnRevenue - currentAddOnRevenue;
    const totalRevenueChange = revenueChange + addOnRevenueChange;

    bundleResults[bundle] = {
      bundle, isSelected: selectedBundles[bundle] || false,
      currentCPL, newCPL, priceChangePercent: priceChange,
      currentListings: originalListings, projectedListings: finalListings,
      listingChange: finalListings - originalListings,
      churned, downgraded: totalDowngraded, upgraded: totalUpgraded,
      incomingDowngrades: totalIncomingDowngrades, incomingUpgrades: totalIncomingUpgrades,
      downgradeDetails, upgradeDetails,
      currentRevenue, projectedRevenue, revenueChange,
      currentAddOnRevenue, newAddOnRevenue, addOnRevenueChange, totalRevenueChange,
      percentChange: currentRevenue > 0 ? (totalRevenueChange / currentRevenue) * 100 : 0
    };
  });

  let totalCurrentRevenue = 0, totalProjectedRevenue = 0;
  let totalCurrentAddOnRevenue = 0, totalNewAddOnRevenue = 0;

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
      currentRevenue: totalCurrentRevenue, projectedRevenue: totalProjectedRevenue,
      revenueChange: totalProjectedRevenue - totalCurrentRevenue,
      currentAddOnRevenue: totalCurrentAddOnRevenue, newAddOnRevenue: totalNewAddOnRevenue,
      addOnRevenueChange: totalNewAddOnRevenue - totalCurrentAddOnRevenue,
      fixedKDLoss, netChange: totalNetChange, percentChange: totalPercentChange
    },
    cannibalization: totalCannibalization
  };
}

// Portfolio Analysis calculation
export function calculatePortfolioResults({
  historicalData, addOnData, portfolioAddOnEdits,
  portfolioIsMultiBundle, portfolioSelectedBundles, portfolioBundlePriceChanges,
  portfolioBundleChurnRates, portfolioBundleDowngradeRates, portfolioBundleUpgradeRates,
  portfolioBundleAddOnRates,
  portfolioBundle, portfolioPriceChange, portfolioChurnRate,
  portfolioDowngradeRates, portfolioUpgradeRates, portfolioAddOnLossRates,
  portfolioFixedKDLoss
}) {
  const categories = Object.keys(historicalData);
  const results = [];

  const getAddOnRevenue = (category, bundle) => {
    if (portfolioAddOnEdits[category]?.[bundle] !== undefined) {
      return portfolioAddOnEdits[category][bundle];
    }
    return addOnData[category]?.[bundle] || 0;
  };

  if (portfolioIsMultiBundle) {
    const selectedBundleNames = Object.keys(portfolioSelectedBundles).filter(b => portfolioSelectedBundles[b]);
    if (selectedBundleNames.length === 0) return results;

    categories.forEach(category => {
      const catData = historicalData[category];
      const availBundles = Object.keys(catData);
      const bundlesInCategory = selectedBundleNames.filter(b => availBundles.includes(b));
      if (bundlesInCategory.length === 0) return;

      const newCPLs = {};
      availBundles.forEach(bundle => {
        const pc = portfolioBundlePriceChanges[bundle] || 0;
        newCPLs[bundle] = catData[bundle].avgCPL * (1 + pc / 100);
      });

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

        Object.entries(downRates).forEach(([target, rate]) => {
          if (!availBundles.includes(target)) return;
          finalListings -= originalListings * (rate / 100);
        });
        Object.entries(upRates).forEach(([target, rate]) => {
          if (!availBundles.includes(target)) return;
          finalListings -= originalListings * (rate / 100);
        });

        availBundles.forEach(srcBundle => {
          const srcIdx = BUNDLE_TIER_ORDER.indexOf(srcBundle);
          const thisIdx = BUNDLE_TIER_ORDER.indexOf(bundle);
          if (srcIdx !== -1 && thisIdx !== -1 && srcIdx < thisIdx) {
            const srcDownRates = portfolioBundleDowngradeRates[srcBundle] || {};
            finalListings += catData[srcBundle].totalListings * ((srcDownRates[bundle] || 0) / 100);
          }
        });

        availBundles.forEach(srcBundle => {
          const srcIdx = BUNDLE_TIER_ORDER.indexOf(srcBundle);
          const thisIdx = BUNDLE_TIER_ORDER.indexOf(bundle);
          if (srcIdx !== -1 && thisIdx !== -1 && srcIdx > thisIdx) {
            const srcUpRates = portfolioBundleUpgradeRates[srcBundle] || {};
            finalListings += catData[srcBundle].totalListings * ((srcUpRates[bundle] || 0) / 100);
          }
        });

        const currentAddOn = getAddOnRevenue(category, bundle);
        const addOnLossRate = (portfolioBundleAddOnRates[bundle] || 0) / 100;
        const avgAddOnPerListing = originalListings > 0 ? currentAddOn / originalListings : 0;
        const newAddOn = avgAddOnPerListing * (1 + addOnLossRate) * finalListings;

        bundleResults[bundle] = {
          currentRevenue: bData.totalRevenue, projectedRevenue: finalListings * newCPL,
          currentAddOn, newAddOn,
          currentListings: originalListings, projectedListings: finalListings,
          currentCPL, newCPL
        };
      });

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
        category, currentRevenue, newRevenue, netRevenueChange, percentChange,
        currentListings: totalCurrentListings,
        currentCPL: 0, newCPL: 0, stayRate: 0,
        effectiveChurn: 0, effectiveDowngrade: 0, effectiveUpgrade: 0,
        currentAddOnRevenue: totalCurrentAddOn, newAddOnRevenue: totalNewAddOn,
        downgradeRevenue: 0, upgradeRevenue: 0,
        cplRevenueChange, addOnRevenueChange,
        hasAddOn: totalCurrentAddOn > 0
      });
    });
  } else {
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

      const totalDowngradeRate = isBottom ? 0 : lowerBundles.reduce((s, b) => s + (portfolioDowngradeRates[b] || 0), 0);
      const totalUpgradeRate = isTop ? 0 : higherBundles.reduce((s, b) => s + (portfolioUpgradeRates[b] || 0), 0);

      const effectiveChurn = Math.min(portfolioChurnRate, 100);
      const effectiveDowngrade = Math.min(totalDowngradeRate, 100 - effectiveChurn);
      const effectiveUpgrade = Math.min(totalUpgradeRate, 100 - effectiveChurn - effectiveDowngrade);
      const stayRate = Math.max(0, 100 - effectiveChurn - effectiveDowngrade - effectiveUpgrade);

      const stayingListings = currentListings * (stayRate / 100);

      const addOnLossRate = portfolioAddOnLossRates[portfolioBundle] || 0;
      const avgAddOnPerListing = currentListings > 0 ? currentAddOnRevenue / currentListings : 0;
      const adjustedAddOnPerListing = avgAddOnPerListing * (1 + addOnLossRate / 100);
      const newAddOnRevenue = adjustedAddOnPerListing * stayingListings;

      let downgradeRevenue = 0;
      if (lowerBundles.length > 0 && effectiveDowngrade > 0) {
        lowerBundles.forEach(bundle => {
          const bundleRate = portfolioDowngradeRates[bundle] || 0;
          if (bundleRate > 0 && catData[bundle]) {
            downgradeRevenue += currentListings * (bundleRate / 100) * catData[bundle].avgCPL;
          }
        });
      }

      let upgradeRevenue = 0;
      if (higherBundles.length > 0 && effectiveUpgrade > 0) {
        higherBundles.forEach(bundle => {
          const bundleRate = portfolioUpgradeRates[bundle] || 0;
          if (bundleRate > 0 && catData[bundle]) {
            upgradeRevenue += currentListings * (bundleRate / 100) * catData[bundle].avgCPL;
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
        category, currentRevenue, newRevenue, netRevenueChange, percentChange,
        currentListings, currentCPL, newCPL, stayRate,
        effectiveChurn, effectiveDowngrade, effectiveUpgrade,
        currentAddOnRevenue, newAddOnRevenue,
        downgradeRevenue, upgradeRevenue,
        cplRevenueChange, addOnRevenueChange,
        hasAddOn: currentAddOnRevenue > 0
      });
    });
  }

  return results;
}
