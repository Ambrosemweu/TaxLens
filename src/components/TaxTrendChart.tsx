import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { X } from 'lucide-react';
import type { TrendDataPoint } from '../types';

interface TaxTrendChartProps {
  countryName: string;
  trendData: TrendDataPoint[];
  onClose: () => void;
}

const TaxTrendChart: React.FC<TaxTrendChartProps> = ({ countryName, trendData, onClose }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !trendData.length) return;

    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(trendData, (d) => d.year) as [number, number])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(trendData, (d) => d.rate) || 100])
      .range([height, 0]);

    const line = d3
      .line<TrendDataPoint>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.rate));

    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format('d')))
      .selectAll('text')
      .style('font-size', '12px');

    svg
      .append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('font-size', '12px');

    svg
      .append('path')
      .datum(trendData)
      .attr('fill', 'none')
      .attr('stroke', '#4B6775')
      .attr('stroke-width', 2)
      .attr('d', line);

    svg
      .selectAll('circle')
      .data(trendData)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d.year))
      .attr('cy', (d) => yScale(d.rate))
      .attr('r', 3)
      .attr('fill', '#4B6775');

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height + 40)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .text('Year');

    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .text('Corporate Tax Rate (%)');
  }, [trendData]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#2D3E50]">
            Corporate Tax Trend: {countryName}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
            aria-label="Close chart"
          >
            <X size={20} color="#2D3E50" />
          </button>
        </div>
        <div className="flex justify-center">
          <svg ref={svgRef} />
        </div>
      </div>
    </div>
  );
};

export default TaxTrendChart;
