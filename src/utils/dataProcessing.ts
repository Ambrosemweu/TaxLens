import Papa from 'papaparse';
import type { TaxDataMap, TaxRates, TrendDataPoint, CountryFeature, CentroidData } from '../types';

export const normalize = (s: string = ''): string =>
  s
    .toString()
    .normalize('NFKD')
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9 ]/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

export const parseTaxData = (csvData: string): TaxDataMap => {
  try {
    const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });
    const rows = parsed.data || [];
    const map: TaxDataMap = {};

    rows.forEach((row: any) => {
      if (row.Country) {
        const key = normalize(row.Country);
        map[key] = {
          corporateTax: isNaN(parseFloat(row['Corporate Tax Rate (%)']))
            ? null
            : parseFloat(row['Corporate Tax Rate (%)']),
          incomeTax: isNaN(parseFloat(row['Personal Income Tax Rate (%)']))
            ? null
            : parseFloat(row['Personal Income Tax Rate (%)']),
          vat: isNaN(parseFloat(row['Sales Tax Rate (%)']))
            ? null
            : parseFloat(row['Sales Tax Rate (%)']),
        };
      }
    });

    return map;
  } catch (e) {
    console.error('Failed to parse CSV data', e);
    return {};
  }
};

export const parseTrendData = (csvTrendData: string): TrendDataPoint[] => {
  try {
    const parsed = Papa.parse(csvTrendData, { header: true, skipEmptyLines: true });
    const formatted: TrendDataPoint[] = [];

    parsed.data.forEach((row: any) => {
      const country = row.country || row.Country;
      Object.keys(row).forEach(key => {
        if (/^\d{4}$/.test(key)) {
          const rate = parseFloat(row[key]);
          if (!isNaN(rate)) {
            formatted.push({
              country,
              year: parseInt(key),
              rate
            });
          }
        }
      });
    });

    return formatted;
  } catch (e) {
    console.error('Failed to parse trend data', e);
    return [];
  }
};

export const computeCentroidAndSpan = (feature: CountryFeature): CentroidData => {
  const coords = feature?.geometry?.coordinates;
  if (!coords) return { lat: 0, lng: 0, latSpan: 0, lngSpan: 0 };

  let ring: number[][] | null = null;
  if (feature.geometry.type === 'Polygon') ring = coords[0];
  else if (feature.geometry.type === 'MultiPolygon') ring = (coords as any)[0][0];

  if (!ring) return { lat: 0, lng: 0, latSpan: 0, lngSpan: 0 };

  let minLat = 90,
    maxLat = -90,
    minLng = 180,
    maxLng = -180,
    sumLat = 0,
    sumLng = 0;

  ring.forEach((pt) => {
    const [lng, lat] = pt;
    sumLat += lat;
    sumLng += lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  });

  const n = ring.length || 1;
  const centroidLat = sumLat / n;
  const centroidLng = sumLng / n;

  return {
    lat: centroidLat,
    lng: centroidLng,
    latSpan: maxLat - minLat,
    lngSpan: maxLng - minLng
  };
};

export const calculateZoomAltitude = (latSpan: number, lngSpan: number): number => {
  const maxSpan = Math.max(latSpan || 0.1, lngSpan || 0.1);
  return Math.min(2.5, Math.max(0.45, 0.9 + maxSpan / 20));
};
