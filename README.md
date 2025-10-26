# TaxLens - Interactive Global Tax Visualization

TaxLens is an interactive web platform that visualizes global tax data on a 3D spinning globe. Users can explore, compare, and analyze corporate, income, and VAT tax rates across different countries in an immersive and intuitive interface.

## Features

### 🌐 Interactive 3D Globe
- Displays all countries using a 3D Earth model powered by react-globe.gl
- Users can rotate, zoom, and hover over countries
- Each country's color intensity reflects its average tax rate
- Auto-rotation with intelligent pause on user interaction

### 📊 Country Tax Details Popup
When a user clicks on a country, a detailed popup card appears showing:
- Country flag and name
- Corporate Tax Rate
- Income Tax Rate
- VAT/Sales Tax Rate
- Average rate summary
- Close button to return to the globe view

### 📈 Corporate Tax Trend Chart
- Interactive line chart showing historical corporate tax rates (1980–2024)
- Accessible via chart icon button next to Corporate Tax label
- Modal presentation with smooth animations
- Responsive design that scales to different screen sizes

### 🎨 Color-Coded Legend
- Visual legend showing tax rate intervals (10-40%)
- D3-powered color scale for accurate data representation
- Color gradient from green (low rates) to red (high rates)

## Project Structure

```
src/
├── components/           # React components
│   ├── GlobeVisualization.tsx    # Main 3D globe component
│   ├── CountryPopup.tsx          # Country details popup
│   ├── Legend.tsx                # Tax rate legend
│   ├── TaxTrendChart.tsx         # Historical trend chart
│   └── index.ts                  # Component exports
│
├── context/             # State management
│   └── TaxDataContext.tsx        # Central tax data context
│
├── data/                # Data files
│   ├── taxData.ts                # Static tax rate data (CSV)
│   └── trendData.ts              # Historical trend data (CSV)
│
├── types/               # TypeScript definitions
│   └── index.ts                  # Type definitions and interfaces
│
├── utils/               # Utility functions
│   ├── dataProcessing.ts         # Data parsing and processing
│   └── colorScale.ts             # D3 color scale configuration
│
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## Technology Stack

- **React 18.3** - UI framework
- **TypeScript 5.5** - Type safety and developer experience
- **react-globe.gl** - 3D globe visualization
- **D3.js** - Data visualization and color scales
- **PapaParse** - CSV parsing
- **Three.js** - 3D rendering engine
- **Tailwind CSS** - Styling framework
- **Vite** - Build tool and dev server
- **Lucide React** - Icon library

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run TypeScript type checking
npm run typecheck

# Run linting
npm run lint
```

## Component Architecture

### GlobeVisualization
Main component that orchestrates the 3D globe display. Handles:
- Globe initialization and auto-rotation
- Country hover and click interactions
- Integration with TaxDataContext for state management
- Viewport positioning and zoom controls

### CountryPopup
Displays detailed tax information for selected countries:
- Flag fetching from REST Countries API
- Tax rate breakdown display
- Access to historical trend data
- Responsive positioning

### TaxTrendChart
Interactive D3-powered line chart:
- SVG-based rendering
- Responsive scaling
- Time-series visualization
- Modal presentation

### Legend
Color scale reference component:
- Tax rate intervals
- Color mapping visualization
- Fixed positioning

## State Management

The application uses React Context API for centralized state management:

**TaxDataContext** provides:
- `countries` - GeoJSON data with merged tax rates
- `taxData` - Parsed tax rate map
- `trendData` - Historical trend data points
- `hoveredCountry` - Currently hovered country
- `selectedCountry` - Currently selected country
- `flagUrl` - Country flag URL from REST Countries API
- `isZoomed` - Zoom state tracker

## Data Flow

1. **Data Loading**: CSV data is parsed using PapaParse on component mount
2. **Data Merging**: Tax rates are matched with GeoJSON country data using normalized country names
3. **Visualization**: Color scale is applied based on average tax rates
4. **Interaction**: User interactions update context state, triggering re-renders
5. **Flag Fetching**: Country selection triggers async flag fetch from REST Countries API

## Code Quality

- **TypeScript**: Full type coverage for improved maintainability
- **Modular Architecture**: Single responsibility principle for all components
- **Clean Code**: Descriptive naming and clear data flow
- **Performance**: Optimized rendering with React hooks
- **Responsive Design**: Works across all device sizes

## Key Features Implementation

### Auto-Rotation
The globe automatically rotates with intelligent pause behavior:
- Pauses when user interacts (drag, zoom, click)
- Resumes after 3 seconds of inactivity
- Smooth damping for natural movement

### Country Matching
Sophisticated country name normalization algorithm:
- Removes special characters and parentheses
- Normalizes Unicode characters
- Handles partial and fuzzy matches
- Matches alternative country names

### Color Scale
D3-based threshold scale:
- 7 color intervals (10%, 15%, 20%, 25%, 30%, 35%, 40%)
- Gradient from green to red
- Brighter colors on hover for visual feedback

### Centroid Calculation
Geometric centroid calculation for proper zoom positioning:
- Parses GeoJSON polygon coordinates
- Calculates center point and bounding box
- Determines optimal altitude for country size

## Future Enhancements

Potential areas for expansion:
- Additional tax types (capital gains, property tax, etc.)
- Country comparison view
- Export data functionality
- Search and filter capabilities
- Mobile touch gestures optimization
- Data persistence with Supabase
- Real-time tax rate updates
- Multi-language support

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern mobile browsers with WebGL support

## Performance Considerations

- Initial bundle size: ~1.96 MB (566 KB gzipped)
- Consider code-splitting for production deployment
- WebGL-accelerated 3D rendering
- Optimized re-renders with React hooks

## Contributing

When contributing to TaxLens:
1. Follow the existing component structure
2. Maintain TypeScript type safety
3. Keep components focused and modular
4. Document complex logic with comments
5. Test across different browsers

## License

This project is opensource
---

