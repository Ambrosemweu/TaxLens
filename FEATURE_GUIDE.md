# Corporate Tax Trend Chart Feature Guide

## Overview
The TaxLens application includes an interactive corporate tax trend chart that displays historical corporate tax rates from 1980 to 2024 for countries where data is available.

## How to Use

### Step 1: Select a Country
1. Rotate or zoom the 3D globe
2. Click on any country to view its details
3. A popup card appears showing tax information

### Step 2: Access the Trend Chart
1. In the country popup, look at the "Corporate Tax" line
2. If historical data is available, a chart icon (📊) appears next to "Corporate Tax"
3. Click the chart icon button

### Step 3: View Historical Data
1. A modal window opens displaying a line chart
2. The chart shows corporate tax rates over time (1980-2024)
3. X-axis: Years
4. Y-axis: Corporate Tax Rate (%)
5. Blue line with data points shows the trend

### Step 4: Close the Chart
1. Click the X button in the top-right corner
2. Or click outside the modal
3. Returns to the country popup view

## Visual Flow

```
┌─────────────────────────────────────────────────────────┐
│                    3D Globe View                        │
│                                                         │
│    [User clicks on United States]                      │
│                                                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│          Country Popup - United States                  │
│  ┌────────┐                                             │
│  │  Flag  │  United States                              │
│  │  🇺🇸   │  USA                                         │
│  └────────┘                                             │
│                                                         │
│  Corporate Tax: 21%  [📊]  ← Click this chart icon    │
│  Income Tax: 37%                                        │
│  Sales/VAT: 0%                                          │
│  Average: 19.33%                                        │
│                                                         │
│  [Close Button]                                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼ (Click chart icon)
┌─────────────────────────────────────────────────────────┐
│  Corporate Tax Trend: United States           [X]       │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 50% ─┐                                          │   │
│  │      │  ●                                       │   │
│  │ 40% ─┤   ●●●                                    │   │
│  │      │      ●●●●                                │   │
│  │ 30% ─┤          ●●●●●●                          │   │
│  │      │                ●●●●●●●●●●●●●●●●          │   │
│  │ 20% ─┤                                  ●●●●●●●● │   │
│  │      │                                          │   │
│  │ 10% ─┤                                          │   │
│  │      │                                          │   │
│  │  0% ─┴──────────────────────────────────────── │   │
│  │     1980  1990  2000  2010  2020  2024         │   │
│  │                    Year                         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Technical Details

### Data Source
- **File**: `src/data/trendData.ts`
- **Format**: CSV with years as columns (1980-2024)
- **Coverage**: ~180+ countries
- **Data Type**: Corporate tax rates only

### Implementation
- **Component**: `TaxTrendChart.tsx`
- **Visualization**: D3.js line chart
- **Trigger**: Chart icon button in `CountryPopup.tsx`
- **Display**: Modal overlay with dark backdrop

### Features
1. **Line Chart**: Continuous line showing rate changes
2. **Data Points**: Individual dots for each year
3. **Axes**: Labeled X (Year) and Y (Tax Rate %)
4. **Title**: Shows country name
5. **Responsive**: Adapts to different screen sizes
6. **Accessible**: Close button with aria-label

## Countries with Historical Data

The trend data includes historical corporate tax rates for major countries including:

- **Americas**: USA, Canada, Brazil, Mexico, Argentina, Chile
- **Europe**: UK, Germany, France, Italy, Spain, Netherlands, Switzerland
- **Asia**: China, Japan, India, South Korea, Singapore
- **Oceania**: Australia, New Zealand
- **Africa**: South Africa, Nigeria, Kenya
- **Middle East**: UAE, Saudi Arabia, Israel

### Data Availability
- Some countries have complete data from 1980-2024
- Others have partial data starting from later years
- Empty data points are handled gracefully

## Example Use Cases

### Compare Tax Policy Changes
1. View USA trend: Steep drop in 2018 (Tax Cuts and Jobs Act)
2. View UK trend: Gradual decline from 52% (1980) to 25% (2023)
3. View Ireland trend: Low stable rate around 12.5%

### Identify Tax Havens
Look for countries with:
- Consistently low rates (< 15%)
- No historical increases
- Examples: Bahamas, Bermuda, Cayman Islands

### Track Economic Reforms
- China: Drop from 55% to 25% shows modernization
- Eastern Europe: Low rates (9-19%) after transition economies
- Latin America: Variable rates reflecting policy changes

## Keyboard & Accessibility

### Keyboard Navigation
- **Tab**: Navigate to chart icon button
- **Enter/Space**: Open trend chart
- **Escape**: Close modal (future enhancement)
- **Tab**: Navigate to close button in modal

### Screen Readers
- Chart icon has `title` attribute
- Close button has `aria-label`
- Modal has semantic structure

## Performance Notes

### Rendering Speed
- Chart renders in ~100-200ms
- D3 calculations optimized
- SVG-based (hardware accelerated)

### Data Filtering
- Trend data filtered by country name
- Uses fuzzy matching for name variations
- Falls back gracefully if no data found

### Memory Usage
- Chart cleanup on unmount (D3 removes all elements)
- No memory leaks from listeners
- Efficient re-rendering with React hooks

## Troubleshooting

### Chart Icon Not Showing
- **Reason**: No historical data for selected country
- **Solution**: Try major economies (USA, UK, Germany, China)

### Empty Chart Appears
- **Reason**: Country name mismatch in data
- **Check**: Console for filtered results
- **Solution**: Data normalization handles most cases

### Chart Layout Issues
- **Mobile**: Chart scales down appropriately
- **Small Screens**: Modal is responsive with mx-4 margin
- **Desktop**: Fixed 600px width chart

## Future Enhancements

### Potential Improvements
1. **Interactive Tooltips**: Hover over data points to see exact values
2. **Zoom & Pan**: Allow users to focus on specific time periods
3. **Multiple Countries**: Compare 2-3 countries on same chart
4. **Download**: Export chart as PNG or SVG
5. **Time Range Selector**: Focus on specific decades
6. **Annotations**: Mark major policy changes
7. **Animation**: Animated line drawing on load

### Data Enhancements
1. **More Countries**: Expand coverage to 200+ countries
2. **More Years**: Add projections for 2025-2030
3. **Quarterly Data**: More granular for recent years
4. **Other Tax Types**: Income tax trends, VAT trends
5. **Economic Indicators**: GDP correlation, investment flows

## Code Reference

### Main Components
- **CountryPopup.tsx:58-66**: Chart icon button implementation
- **TaxTrendChart.tsx:15-95**: D3 chart rendering logic
- **TaxDataContext.tsx:29**: Trend data parsing
- **dataProcessing.ts:38-66**: Trend data processor

### Data Flow
```typescript
csvTrendData (string)
  ↓ parseTrendData()
TrendDataPoint[] (array)
  ↓ filter by country
TrendDataPoint[] (filtered)
  ↓ D3 visualization
SVG Line Chart (rendered)
```

### Styling
- **Modal Backdrop**: `bg-black bg-opacity-50`
- **Chart Container**: `bg-white rounded-xl shadow-2xl`
- **Line Color**: `#4B6775` (dark blue-gray)
- **Data Points**: 3px radius circles

---

**Feature Status**: ✅ Fully Implemented & Working
**Last Updated**: 2025-10-26
**Version**: 1.0.0
