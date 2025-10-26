# TaxLens Architecture Documentation

## System Overview

TaxLens is a modern React application built with TypeScript, featuring a modular architecture that separates concerns across components, state management, data processing, and utilities.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         App.tsx (Root)                          │
│                    ┌──────────────────┐                         │
│                    │ TaxDataProvider  │ (Context)               │
│                    └────────┬─────────┘                         │
└─────────────────────────────┼──────────────────────────────────┘
                              │
                   ┌──────────▼─────────┐
                   │ GlobeVisualization │
                   └──────────┬─────────┘
                              │
           ┌──────────────────┼──────────────────┐
           │                  │                  │
    ┌──────▼──────┐    ┌──────▼──────┐   ┌─────▼─────┐
    │   Legend    │    │ CountryPopup│   │ Hover UI  │
    └─────────────┘    └──────┬──────┘   └───────────┘
                              │
                       ┌──────▼──────────┐
                       │ TaxTrendChart   │
                       └─────────────────┘
```

## Component Hierarchy

### Root Level
- **App.tsx**: Application entry point, wraps everything in TaxDataProvider

### Core Components
1. **GlobeVisualization**: Main 3D globe component
   - Manages globe interactions
   - Handles auto-rotation
   - Coordinates with context for state

2. **CountryPopup**: Country details card
   - Displays tax breakdown
   - Shows country flag
   - Provides access to trend chart

3. **Legend**: Tax rate color scale
   - Static reference component
   - Shows rate intervals

4. **TaxTrendChart**: Historical data visualization
   - D3-powered line chart
   - Modal presentation
   - SVG rendering

## State Management Flow

```
┌──────────────────────────────────────────────────────────┐
│                    TaxDataContext                        │
│                                                          │
│  State:                          Methods:               │
│  ├─ countries (GeoJSON)         ├─ setHoveredCountry   │
│  ├─ taxData (Map)               ├─ setSelectedCountry  │
│  ├─ trendData (Array)           ├─ setFlagUrl          │
│  ├─ hoveredCountry              └─ setIsZoomed         │
│  ├─ selectedCountry                                     │
│  ├─ flagUrl                                             │
│  └─ isZoomed                                            │
└──────────────────────────────────────────────────────────┘
                        │
                        │ Provided to all consumers via useContext
                        │
        ┌───────────────┼───────────────┐
        │               │               │
  [Components]    [Components]    [Components]
```

## Data Processing Pipeline

```
┌─────────────┐
│  CSV Files  │
│ (taxData,   │
│  trendData) │
└──────┬──────┘
       │
       │ PapaParse
       ▼
┌──────────────┐
│ Parsed Data  │
│  (objects)   │
└──────┬───────┘
       │
       │ normalize()
       ▼
┌──────────────┐
│ Normalized   │
│   Country    │
│    Names     │
└──────┬───────┘
       │
       │ Merge with
       │ GeoJSON
       ▼
┌──────────────┐
│  Enhanced    │
│  GeoJSON     │
│ + Tax Rates  │
└──────┬───────┘
       │
       │ Color Scale
       ▼
┌──────────────┐
│  Rendered    │
│    Globe     │
└──────────────┘
```

## Key Algorithms

### 1. Country Name Normalization
```typescript
normalize(name) =>
  - Remove Unicode accents (NFKD)
  - Strip parentheses and special chars
  - Convert to lowercase
  - Collapse whitespace
```

### 2. Centroid Calculation
```typescript
computeCentroidAndSpan(feature) =>
  - Extract polygon coordinates
  - Calculate min/max lat/lng
  - Compute average position
  - Return centroid + bounding box
```

### 3. Zoom Altitude Calculation
```typescript
calculateZoomAltitude(latSpan, lngSpan) =>
  - Find max span
  - Apply scaling formula
  - Clamp between 0.45 and 2.5
```

### 4. Color Mapping
```typescript
D3 Threshold Scale:
  [10, 15, 20, 25, 30, 35, 40] =>
  [green → yellow → orange → red]
```

## Data Sources

### Static Tax Rate Data
- **Source**: `src/data/taxData.ts`
- **Format**: CSV with Personal Income, Corporate, Sales Tax
- **Countries**: ~180 countries
- **Usage**: Initial globe coloring

### Historical Trend Data
- **Source**: `src/data/trendData.ts`
- **Format**: CSV with years 1980-2024
- **Countries**: Major economies
- **Usage**: Trend chart visualization

### Flag Images
- **Source**: REST Countries API (restcountries.com)
- **Format**: SVG/PNG
- **Fetching**: Async on country selection
- **Fallback**: Gray placeholder

## Interaction Flow

### User Hovers Over Country
```
1. Mouse over polygon
2. setHoveredCountry(country)
3. Polygon altitude increases (0.01 → 0.04)
4. Color brightens (+0.8 brightness)
5. Tooltip displays country name
```

### User Clicks Country
```
1. Click polygon
2. Compute centroid & zoom altitude
3. setSelectedCountry(country)
4. Globe animates to position (900ms)
5. CountryPopup renders
6. Flag fetched from API (async)
7. setIsZoomed(true)
```

### User Opens Trend Chart
```
1. Click chart icon in popup
2. Filter trendData by country
3. TaxTrendChart modal renders
4. D3 creates SVG line chart
5. Axes and labels rendered
6. Animation complete
```

## Performance Optimizations

### Rendering
- React hooks prevent unnecessary re-renders
- useRef for direct Globe instance access
- Memoized color scale calculations
- Efficient polygon hover detection

### Data Loading
- CSV parsed once on mount
- GeoJSON fetched once and cached
- Flag images loaded on-demand
- Trend data filtered per country

### Bundle Optimization
- Tree-shaking enabled (Vite)
- Dynamic imports possible for charts
- CSS purging via Tailwind
- Production minification

## Type Safety

### Core Types
```typescript
interface CountryProperties {
  name: string
  corporateTax: number | null
  incomeTax: number | null
  vat: number | null
  taxRate: number | null
}

interface CountryFeature {
  type: string
  properties: CountryProperties
  geometry: GeoJSON Geometry
}

interface TrendDataPoint {
  country: string
  year: number
  rate: number
}
```

## Extension Points

### Adding New Tax Types
1. Update CSV data structure
2. Add field to `TaxRates` interface
3. Update `parseTaxData` function
4. Extend `CountryPopup` display
5. Update average calculation

### Adding New Visualizations
1. Create component in `src/components/`
2. Import in GlobeVisualization
3. Access data via `useTaxData()` hook
4. Maintain modular structure

### Integrating Supabase
1. Create Supabase client in `src/utils/`
2. Replace CSV data with DB queries
3. Add real-time subscriptions
4. Implement CRUD operations
5. Add RLS policies for security

## Testing Strategy

### Unit Tests (Recommended)
- `dataProcessing.ts` utilities
- `colorScale.ts` functions
- Type definitions validation
- CSV parsing logic

### Integration Tests
- Component rendering
- Context provider behavior
- User interactions
- API mocking

### E2E Tests
- Full user journeys
- Globe interactions
- Chart rendering
- Cross-browser testing

## Deployment Considerations

### Build Optimization
```bash
npm run build
# Outputs to dist/
# ~566 KB gzipped
```

### Environment Variables
- None currently required
- Can add for API keys if needed
- Vite supports `.env` files

### Hosting Requirements
- Static hosting (Netlify, Vercel, etc.)
- WebGL support in target browsers
- HTTPS for external APIs
- CDN for globe textures

## Security Considerations

### Data Handling
- No sensitive user data collected
- Public tax rate information only
- API calls to public endpoints
- No authentication required

### XSS Prevention
- React escapes content by default
- No dangerouslySetInnerHTML used
- SVG content generated safely
- API responses validated

## Monitoring & Analytics

### Potential Metrics
- Page load time
- Globe render time
- User interactions (clicks, zooms)
- Most viewed countries
- Chart open rate
- API response times

---

**Last Updated**: 2025-10-25
**Version**: 1.0.0
**Maintainers**: Development Team
