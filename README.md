# Bundle Pricing Decision Support Tool

A comprehensive pricing simulation tool with historical data analysis and custom scenario modeling.

## Features

### 1. Historical Data Tab
- Pre-loaded with 12 months of historical data across 21 service categories
- Analyze existing bundle performance
- Simulate price changes with upgrade/downgrade migration modeling

### 2. Custom Input Tab (NEW)
Create and analyze your own pricing scenarios with:

#### Manual Input
- Add bundles one at a time with name, CPL, and listing count
- Edit existing saved scenarios
- Real-time preview of bundle data

#### CSV Upload
- Upload custom data using CSV format
- Download CSV template button for proper format
- Template format:
  ```csv
  Bundle,CPL,Listings
  Basic,3.00,1000
  Plus,15.00,500
  Super,30.00,200
  ```

#### Save & Manage Scenarios
- Save custom scenarios to browser localStorage
- Load and edit saved scenarios
- Delete scenarios you no longer need
- Switch between multiple saved scenarios

## How to Use

### Running the App
```bash
npm install
npm run dev
```
Then open http://localhost:5173/

### Creating a Custom Scenario

1. **Click the "Custom Input" tab**
2. **Enter a scenario name** (e.g., "Q1 2026 Projections")
3. **Add bundles** using either:
   - Manual input form
   - CSV upload (download template first)
4. **Click "Save Scenario"**
5. **Select your scenario** from the category dropdown to analyze it

### Analyzing a Scenario

1. Select a category (or custom scenario)
2. Choose a bundle to analyze
3. Adjust simulation parameters:
   - Price change (%)
   - Churn rate
   - Downgrade rate & target
   - Upgrade rate & target
4. Review:
   - Net revenue impact
   - Listing flow visualization
   - Break-even analysis
   - Sensitivity charts
   - Scenario matrix

## Data Storage

- **Historical data**: Hardcoded in the application
- **Custom scenarios**: Saved in browser localStorage (persists across sessions)
- **Export**: Use browser dev tools or copy scenarios manually

## Tips

- Start with the template CSV to ensure proper format
- Create multiple scenarios to compare different projections
- Use the scenario matrix to quickly evaluate different price/churn combinations
- Break-even churn shows the maximum customer loss before revenue decline

## Technologies

- React 18
- Recharts (charts and visualizations)
- Tailwind CSS (styling)
- Vite (build tool)
- localStorage (data persistence)
