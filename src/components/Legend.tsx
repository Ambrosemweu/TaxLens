import React from 'react';
import { legendThresholds, legendColors } from '../utils/colorScale';

const Legend: React.FC = () => {
  return (
    <div className="absolute right-5 bottom-5 bg-white rounded-lg shadow-md p-3 text-sm">
      <div className="font-semibold mb-2 text-[#2D3E50]">Tax Rate Legend (%)</div>
      {legendThresholds.map((threshold, i, arr) => (
        <div key={i} className="flex items-center mb-1">
          <div
            style={{
              background: legendColors[i],
              width: 20,
              height: 12,
              borderRadius: 2,
              marginRight: 6,
            }}
          />
          <span className="text-gray-700">
            {i === 0
              ? `< ${arr[i]}`
              : i === legendColors.length - 1
              ? `> ${arr[i - 1]}`
              : `${arr[i - 1]}–${arr[i]}`}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Legend;
