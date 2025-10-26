import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { GeoJSONData, TaxDataMap, CountryProperties, TrendDataPoint } from '../types';
import { parseTaxData, parseTrendData, normalize } from '../utils/dataProcessing';
import { csvData } from '../data/taxData';
import { csvTrendData } from '../data/trendData';

interface TaxDataContextType {
  countries: GeoJSONData;
  taxData: TaxDataMap;
  trendData: TrendDataPoint[];
  hoveredCountry: any;
  setHoveredCountry: (country: any) => void;
  selectedCountry: CountryProperties | null;
  setSelectedCountry: (country: CountryProperties | null) => void;
  flagUrl: string | null;
  setFlagUrl: (url: string | null) => void;
  isZoomed: boolean;
  setIsZoomed: (zoomed: boolean) => void;
}

const TaxDataContext = createContext<TaxDataContextType | undefined>(undefined);

export const useTaxData = () => {
  const context = useContext(TaxDataContext);
  if (!context) {
    throw new Error('useTaxData must be used within a TaxDataProvider');
  }
  return context;
};

export const TaxDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [countries, setCountries] = useState<GeoJSONData>({ features: [] });
  const [taxData, setTaxData] = useState<TaxDataMap>({});
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [hoveredCountry, setHoveredCountry] = useState<any>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryProperties | null>(null);
  const [flagUrl, setFlagUrl] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const data = parseTaxData(csvData);
    setTaxData(data);

    const trends = parseTrendData(csvTrendData);
    setTrendData(trends);
  }, []);

  useEffect(() => {
    if (!taxData || Object.keys(taxData).length === 0) return;

    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then((res) => res.json())
      .then((geo) => {
        const updated = geo.features.map((f: any) => {
          const name = normalize(f.properties.name || f.properties.ADMIN || f.properties.NAME || '');
          const matchKey =
            Object.keys(taxData).find((k) => k === name) ||
            Object.keys(taxData).find((k) => name.includes(k)) ||
            Object.keys(taxData).find((k) => k.includes(name));

          const rates = (matchKey && taxData[matchKey]) || {
            corporateTax: null,
            incomeTax: null,
            vat: null,
          };

          const vals = [rates.corporateTax, rates.incomeTax, rates.vat].filter(
            (v) => v != null
          );
          const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;

          return {
            ...f,
            properties: {
              ...f.properties,
              corporateTax: rates.corporateTax,
              incomeTax: rates.incomeTax,
              vat: rates.vat,
              taxRate: avg,
            },
          };
        });
        setCountries({ features: updated });
      })
      .catch((err) => console.error('Failed to load world.geojson:', err));
  }, [taxData]);

  useEffect(() => {
    if (!selectedCountry) {
      setFlagUrl(null);
      return;
    }

    const tryFetchFlag = async () => {
      const name = selectedCountry.name || selectedCountry.ADMIN || selectedCountry.NAME || '';
      if (!name) return setFlagUrl(null);

      const endpoints = [
        `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true`,
        `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}`,
      ];

      for (const url of endpoints) {
        try {
          const res = await fetch(url);
          if (!res.ok) continue;
          const data = await res.json();
          if (Array.isArray(data) && data[0]) {
            const flag = data[0].flags?.svg || data[0].flags?.png || null;
            if (flag) return setFlagUrl(flag);
          }
        } catch (e) {}
      }
      setFlagUrl(null);
    };

    tryFetchFlag();
  }, [selectedCountry]);

  return (
    <TaxDataContext.Provider
      value={{
        countries,
        taxData,
        trendData,
        hoveredCountry,
        setHoveredCountry,
        selectedCountry,
        setSelectedCountry,
        flagUrl,
        setFlagUrl,
        isZoomed,
        setIsZoomed,
      }}
    >
      {children}
    </TaxDataContext.Provider>
  );
};
