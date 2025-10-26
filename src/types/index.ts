export interface CountryProperties {
  name: string;
  ADMIN?: string;
  NAME?: string;
  ISO_A2?: string;
  corporateTax: number | null;
  incomeTax: number | null;
  vat: number | null;
  taxRate: number | null;
}

export interface CountryFeature {
  type: string;
  properties: CountryProperties;
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

export interface GeoJSONData {
  features: CountryFeature[];
}

export interface TaxRates {
  corporateTax: number | null;
  incomeTax: number | null;
  vat: number | null;
}

export interface TaxDataMap {
  [key: string]: TaxRates;
}

export interface TrendDataPoint {
  country: string;
  year: number;
  rate: number;
}

export interface CentroidData {
  lat: number;
  lng: number;
  latSpan: number;
  lngSpan: number;
}
