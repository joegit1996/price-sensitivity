// Bundle tier order (highest to lowest CPL)
export const BUNDLE_TIER_ORDER = ['Optimum', 'Super', 'Plus', 'Extra', 'Premium', 'Standard', 'Basic'];

export const getBundleTierIndex = (bundle) => BUNDLE_TIER_ORDER.indexOf(bundle);

export const getHigherTierBundles = (bundle, availableBundles) => {
  const currentIndex = getBundleTierIndex(bundle);
  return BUNDLE_TIER_ORDER.filter((b, i) => i < currentIndex && availableBundles.includes(b));
};

export const getLowerTierBundles = (bundle, availableBundles) => {
  const currentIndex = getBundleTierIndex(bundle);
  return BUNDLE_TIER_ORDER.filter((b, i) => i > currentIndex && availableBundles.includes(b));
};
