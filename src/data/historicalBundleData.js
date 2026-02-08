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

export default historicalBundleData;
