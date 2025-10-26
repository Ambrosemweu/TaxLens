import * as d3 from 'd3';

export const colorScale = d3
  .scaleThreshold<number, string>()
  .domain([10, 15, 20, 25, 30, 35, 40])
  .range(['#00A676', '#5CB85C', '#C8E650', '#FFD666', '#FFA500', '#FF7F50', '#D32F2F']);

export const getCountryColor = (taxRate: number | null): string => {
  if (taxRate == null) return '#E6E9EB';
  return colorScale(taxRate);
};

export const brightenColor = (color: string, factor: number = 0.8): string => {
  try {
    return d3.rgb(color).brighter(factor).toString();
  } catch (e) {
    return color;
  }
};

export const legendThresholds = [10, 15, 20, 25, 30, 35, 40];
export const legendColors = ['#00A676', '#5CB85C', '#C8E650', '#FFD666', '#FFA500', '#FF7F50', '#D32F2F'];
