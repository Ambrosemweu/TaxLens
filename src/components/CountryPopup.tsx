import React, { useState } from 'react';
import { LineChart } from 'lucide-react';
import type { CountryProperties, TrendDataPoint } from '../types';
import TaxTrendChart from './TaxTrendChart';

interface CountryPopupProps {
  country: CountryProperties;
  flagUrl: string | null;
  trendData: TrendDataPoint[];
  onClose: () => void;
}

const CountryPopup: React.FC<CountryPopupProps> = ({
  country,
  flagUrl,
  trendData,
  onClose,
}) => {
  const [showTrend, setShowTrend] = useState(false);

  const countryTrendData = trendData.filter(
    (d) =>
      d.country.toLowerCase().includes(country.name.toLowerCase()) ||
      country.name.toLowerCase().includes(d.country.toLowerCase())
  );

  return (
    <>
      <div className="absolute bottom-5 left-5 bg-white rounded-xl shadow-lg p-4 text-[#2D3E50] w-80 z-10">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          {flagUrl ? (
            <img
              src={flagUrl}
              alt={`${country.name} flag`}
              style={{
                width: 48,
                height: 32,
                objectFit: 'cover',
                borderRadius: 4,
                border: '1px solid #E5E7EB',
              }}
            />
          ) : (
            <div style={{ width: 48, height: 32, background: '#E6E9EB', borderRadius: 4 }} />
          )}
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{country.name}</div>
            <div style={{ fontSize: 12, color: '#6B7280' }}>{country.ISO_A2 || ''}</div>
          </div>
        </div>

        <div style={{ fontSize: 13 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span>
              Corporate Tax: {country.corporateTax != null ? `${country.corporateTax}%` : 'N/A'}
            </span>

            {countryTrendData.length > 0 && (
              <button
                onClick={() => setShowTrend(true)}
                title="View corporate tax trend"
                className="border-none bg-transparent cursor-pointer p-1 rounded hover:bg-gray-100 transition"
              >
                <LineChart size={16} color="#4B6775" />
              </button>
            )}
          </div>

          <div style={{ marginBottom: 4 }}>
            Income Tax: {country.incomeTax != null ? `${country.incomeTax}%` : 'N/A'}
          </div>
          <div style={{ marginBottom: 8 }}>
            Sales/VAT: {country.vat != null ? `${country.vat}%` : 'N/A'}
          </div>
          <div style={{ marginTop: 8, fontWeight: 600 }}>
            Average: {country.taxRate != null ? `${country.taxRate.toFixed(2)}%` : 'N/A'}
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <button
            onClick={onClose}
            className="px-3 py-2 bg-[#4B6775] text-white rounded-md border-none cursor-pointer hover:bg-[#3a5260] transition"
          >
            Close
          </button>
        </div>
      </div>

      {showTrend && countryTrendData.length > 0 && (
        <TaxTrendChart
          countryName={country.name}
          trendData={countryTrendData}
          onClose={() => setShowTrend(false)}
        />
      )}
    </>
  );
};

export default CountryPopup;
