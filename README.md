# Bundle Pricing Decision Support Tool

A comprehensive pricing simulation tool for analyzing bundle pricing strategies across service categories. Built for evaluating the revenue impact of price changes, customer migration, churn, and add-on revenue effects.

All monetary values are in **KD (Kuwaiti Dinar)**.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Tab 1: Single Category Analysis](#tab-1-single-category-analysis)
3. [Tab 2: Custom Input](#tab-2-custom-input)
4. [Tab 3: A/B Testing](#tab-3-ab-testing)
5. [Tab 4: Portfolio Analysis](#tab-4-portfolio-analysis)
6. [Calculation Logic & Examples](#calculation-logic--examples)
7. [Technologies](#technologies)

---

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173/

---

## Tab 1: Single Category Analysis

Analyze pricing scenarios for a single service category (e.g., "AC Services", "Builders") using pre-loaded historical data across 21 categories.

### Data Management

- **Upload/Download Historical CSV** — Format: `Category,Bundle,CPL,Listings`
- **Upload/Download Add-On Revenue CSV** — Format: `Category,Bundle,AddOnRevenue`
- **Export Current Data** — Downloads all loaded data as CSV
- **Reset to Defaults** — Reverts to the built-in historical dataset

### Category & Bundle Selection

- Select a service category from the dropdown
- Select a specific bundle tier to analyze (Optimum, Super, Plus, Extra, Premium, Standard, Basic — ordered highest to lowest)
- View the **Bundle Distribution Table** showing all bundles in the category with their CPL, listings, revenue, add-on revenue, combined total, and revenue share %

### Single-Bundle Mode

Simulates what happens when you change the price of one bundle. Controls:

| Control | Description | Range |
|---------|-------------|-------|
| **Price Change %** | How much to increase/decrease the bundle's CPL | -100% to +500% |
| **Churn Rate %** | Percentage of customers who leave entirely | -100% to +500% |
| **Downgrade Distribution** | Per-bundle rates — what % of customers move to each lower tier | -100% to +500% per bundle |
| **Upgrade Distribution** | Per-bundle rates — what % of customers move to each higher tier | -100% to +500% per bundle |
| **Fixed KD Loss** | Additional fixed costs (implementation, marketing, etc.) | 0+ |
| **Add-On Revenue Change %** | Per-bundle percentage change in add-on revenue | -100% to +500% per bundle |

### Multi-Bundle Mode

Simulates changing prices on multiple bundles simultaneously within a category. Each selected bundle gets its own:

- Price Change %
- Churn Rate %
- Per-target downgrade rates
- Per-target upgrade rates
- Add-on loss rates

Tracks cross-bundle migrations (e.g., downgraders from Standard become incoming listings for Basic) and reports **cannibalization** — revenue lost when customers migrate between bundles that are both changing price.

### Results & Visualizations

- **Projected Impact** — Net revenue change card with breakdown (new bundle revenue, lost to churn, from downgrades, from upgrades, fixed loss)
- **Listing Flow** — Visual showing how current listings split into Stay / Churn / Downgrade / Upgrade
- **Sensitivity Analysis Chart** — Line chart showing net revenue change across churn rates (0–50%) at the configured price/migration settings
- **Scenario Matrix** — Table of net revenue change for combinations of churn (5–30%) and price change (+10% to +30%), holding migration rates constant
- **Break-Even Churn** — The maximum churn rate where revenue stays flat (no migrations)
- **Calculation Details** — Collapsible section showing the step-by-step math with worked examples

---

## Tab 2: Custom Input

Create and analyze your own pricing scenarios.

### Manual Input
- Enter a scenario name
- Add bundles one at a time: bundle name, CPL, listing count

### CSV Upload
- Download a CSV template, fill it in, upload it back
- Format: `Bundle,CPL,Listings`

### Scenario Management
- **Save** scenarios to browser localStorage
- **Load** saved scenarios from the dropdown
- **Edit** existing scenarios
- **Delete** scenarios no longer needed

Once saved, custom scenarios appear alongside historical categories in the analysis dropdown and use the same calculation engine.

---

## Tab 3: A/B Testing

Plan and import results from real-world A/B price tests. *(Work in progress)*

### Test Designer
- Select category and bundle
- Set proposed price change (5–50%)
- Set test duration (days)
- View **Revenue at Risk** (worst case 30% churn scenario)
- Suggested duration: 30–60 days

### Results Importer
- Enter starting test group size
- Download a CSV template: `Bundle,Listings`
- Upload results CSV with final listing counts per bundle after the test
- The tool calculates:
  - **Churn rate**: `(startingSize - totalAfterListings) / startingSize * 100`
  - **Downgrade rates**: per lower bundle `count / startingSize * 100`
  - **Upgrade rates**: per higher bundle `count / startingSize * 100`
  - **Confidence level**: HIGH (n >= 385), MEDIUM (n >= 100), LOW (n < 100)
  - **Margin of error**: `1.96 * sqrt(0.25 / startingSize) * 100`

### Apply & Save
- **Apply to Simulator** — Transfers the calculated rates directly to the Single Category Analysis tab
- **Save Test** — Stores the test with name, date, and all calculated metrics
- **Saved Tests** — List of all saved tests with Apply/Delete buttons

---

## Tab 4: Portfolio Analysis

Analyze the impact of a pricing change across **all categories at once**. Shows how a uniform strategy affects every category that has the selected bundle.

### Single-Bundle Mode

Applies the same pricing scenario to every category that contains the selected bundle. Controls match the Single Category Analysis tab:

- Bundle selector
- Price Change %
- Churn Rate %
- Per-bundle Downgrade Distribution
- Per-bundle Upgrade Distribution
- Per-bundle Add-On Revenue Change %
- Fixed KD Loss (per category)
- Add-On Revenue Editor (override specific category/bundle add-on values)

### Multi-Bundle Mode

Select multiple bundles and configure per-bundle rates (price change, churn, downgrade targets, upgrade targets, add-on loss). Applied across all categories.

### Results

- **Summary Cards** — Total current revenue, total net change (KD and %), categories analyzed, impact breakdown (positive/negative/neutral count)
- **Bar Chart** — Horizontal bar chart of net revenue change per category, sorted smallest to largest
- **Breakdown Table** — Sortable table with columns: Category, Current Revenue, New Revenue, Net Change, % Change, Listings, Current CPL, New CPL. Includes footer totals.

---

## Calculation Logic & Examples

### Core Formulas

#### 1. New Price

```
newCPL = currentCPL * (1 + priceChange / 100)
```

Example: 10 KD with +20% change → `10 * 1.20 = 12 KD`

#### 2. Rate Validation (rates must sum to 100%)

```
effectiveChurn     = min(churnRate, 100)
effectiveDowngrade = min(totalDowngradeRate, 100 - effectiveChurn)
effectiveUpgrade   = min(totalUpgradeRate, 100 - effectiveChurn - effectiveDowngrade)
stayRate           = max(0, 100 - effectiveChurn - effectiveDowngrade - effectiveUpgrade)
```

This ensures the percentages never exceed 100% total.

#### 3. Listing Distribution

```
stayingListings   = currentListings * (stayRate / 100)
churnedListings   = currentListings * (effectiveChurn / 100)
downgradeListings = currentListings * (effectiveDowngrade / 100)
upgradeListings   = currentListings * (effectiveUpgrade / 100)
```

#### 4. Revenue from Each Group

```
newBundleRevenue = stayingListings * newCPL
downgradeRevenue = SUM(listings_to_each_lower_bundle * that_bundle_CPL)
upgradeRevenue   = SUM(listings_to_each_higher_bundle * that_bundle_CPL)
lostRevenue      = churnedListings * currentCPL   (these customers pay nothing)
```

#### 5. Add-On Revenue (Per-Listing Approach)

```
avgAddOnPerListing      = currentAddOnRevenue / currentListings
adjustedAddOnPerListing = avgAddOnPerListing * (1 + addOnLossRate / 100)
newAddOnRevenue         = adjustedAddOnPerListing * stayingListings
addOnRevenueChange      = newAddOnRevenue - currentAddOnRevenue
```

Only staying customers retain add-on revenue. Churned, downgraded, and upgraded customers lose their add-on association with this bundle.

#### 6. Net Impact

```
cplRevenueChange = (newBundleRevenue - currentRevenue) + downgradeRevenue + upgradeRevenue
netRevenueChange = cplRevenueChange + addOnRevenueChange - fixedKDLoss
percentChange    = (netRevenueChange / oldCategoryRevenue) * 100
```

#### 7. Break-Even Churn

```
breakEvenChurn = (priceChange * 100) / (100 + priceChange)
```

Example: +20% price → `(20 * 100) / 120 = 16.67%` — you can lose up to 16.67% of customers before revenue drops (assumes zero migrations and no add-on effects).

---

### Worked Example: Single Bundle

```
Setup:
  Standard bundle: 100 listings * 10 KD = 1,000 KD revenue
  Add-on revenue: 200 KD
  Price change: +20% → 12 KD
  Add-on change: -50%
  Rates: 5% churn, 10% downgrade to Basic (8 KD), 5% upgrade to Premium (15 KD)

Listing Distribution:
  Stay:      80% → 80 listings
  Churn:      5% →  5 listings (lost)
  Downgrade: 10% → 10 listings → Basic
  Upgrade:    5% →  5 listings → Premium

CPL Revenue:
  Staying:    80 * 12 KD = 960 KD
  Downgraded: 10 *  8 KD =  80 KD
  Upgraded:    5 * 15 KD =  75 KD
  Churned:     5 *  0    =   0 KD
  CPL total: 960 + 80 + 75 = 1,115 KD (was 1,000 KD)
  CPL change: +115 KD

Add-On Revenue:
  Per-listing: 200 / 100 = 2 KD/listing
  Adjusted:    2 * (1 + (-50%)) = 1 KD/listing
  New add-on:  1 * 80 = 80 KD (was 200 KD)
  Add-on change: -120 KD

Net Impact:
  115 + (-120) = -5 KD (-0.5% of category revenue)
```

---

### Worked Example: Multi-Bundle (Same Category)

```
Setup:
  Basic:    200 listings * 5 KD  = 1,000 KD
  Standard: 100 listings * 10 KD = 1,000 KD
  Premium:   50 listings * 20 KD = 1,000 KD
  Category total: 3,000 KD

Changes:
  Basic    → +20% → 6 KD  (5% churn, 3% upgrade to Standard)
  Standard → +10% → 11 KD (5% churn, 8% downgrade to Basic, 3% upgrade to Premium)
  Premium  → unchanged (no rates applied)

Basic:
  Outgoing: 10 churn + 6 upgrade to Standard = 16 out
  Incoming: 8 downgrades from Standard
  Final: (200 - 10 - 6 + 8) = 192 listings * 6 KD = 1,152 KD (was 1,000)

Standard:
  Outgoing: 5 churn + 8 downgrade to Basic + 3 upgrade to Premium = 16 out
  Incoming: 6 upgrades from Basic
  Final: (100 - 5 - 8 - 3 + 6) = 90 listings * 11 KD = 990 KD (was 1,000)

Premium:
  Outgoing: none (unchanged, no rates applied)
  Incoming: 3 upgrades from Standard
  Final: (50 + 3) = 53 listings * 20 KD = 1,060 KD (was 1,000)

Category total: 1,152 + 990 + 1,060 = 3,202 KD
Net change: +202 KD (+6.7%)

Key: Migrations are tracked both ways — Standard's 8 downgrades
become Basic's 8 incoming, and Basic's 6 upgrades become
Standard's 6 incoming.
```

---

### Worked Example: Portfolio Analysis (Single Bundle)

```
Setup:
  Analyzing "Plus" bundle across all categories at +15% price, 8% churn,
  5% downgrade to Extra, 3% upgrade to Super

Category A (has Plus at 12 KD, 200 listings):
  New CPL: 12 * 1.15 = 13.80 KD
  Stay: 84% → 168 listings * 13.80 = 2,318 KD (was 2,400)
  Downgrade: 5% → 10 listings * 8 KD (Extra) = 80 KD
  Upgrade: 3% → 6 listings * 25 KD (Super) = 150 KD
  Churn: 8% → 16 listings lost
  CPL change: (2,318 + 80 + 150) - 2,400 = +148 KD

Category B (has Plus at 15 KD, 100 listings, no Extra available):
  Downgrade rate goes to 0 (no lower bundle available)
  Stay: 89% → 89 listings * 17.25 = 1,535 KD (was 1,500)
  Upgrade: 3% → 3 listings * 30 KD (Super) = 90 KD
  Churn: 8% → 8 listings lost
  CPL change: (1,535 + 90) - 1,500 = +125 KD

Category C (does not have Plus bundle):
  Skipped entirely

Portfolio total: +148 + 125 = +273 KD across 2 categories
```

---

### Worked Example: A/B Test Results Import

```
Setup:
  Testing Plus bundle in AC Services
  Starting group: 500 listings
  Price change: +20%

After test, upload CSV:
  Plus,380
  Extra,23
  Super,14

Calculations:
  Total after: 380 + 23 + 14 = 417
  Churned: 500 - 417 = 83
  Churn rate: 83 / 500 * 100 = 16.6%

  Extra is lower tier → Downgrade to Extra: 23 / 500 * 100 = 4.6%
  Super is higher tier → Upgrade to Super:  14 / 500 * 100 = 2.8%

  Confidence: n=500 >= 385 → HIGH
  Margin of error: 1.96 * sqrt(0.25 / 500) * 100 = ±4.4%

Result: Apply churn=16.6%, downgrade to Extra=4.6%, upgrade to Super=2.8%
to the Single Category Analysis tab for full revenue simulation.
```

---

## Data Storage

| Data | Storage |
|------|---------|
| Historical bundle data | Loaded from defaults, editable via CSV upload |
| Add-on revenue data | Loaded from defaults, editable via CSV upload |
| Custom scenarios | Browser localStorage |
| Saved A/B tests | Browser localStorage |
| All simulation settings | Browser localStorage (persists across sessions) |

---

## Technologies

- React 18
- Recharts (charts and visualizations)
- Tailwind CSS (styling)
- Vite (build tool)
- localStorage (data persistence)
