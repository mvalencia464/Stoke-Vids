import React from 'react';
import { LandscapeIcon, PortraitIcon, SquareIcon } from './icons';

interface AspectRatioSelectorProps {
  selectedRatio: string;
  onRatioChange: (ratio: string) => void;
}

const ratios = [
  { value: '16:9', label: 'Landscape', icon: <LandscapeIcon /> },
  { value: '9:16', label: 'Portrait', icon: <PortraitIcon /> },
  { value: '1:1', label: 'Square', icon: <SquareIcon /> },
];

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedRatio, onRatioChange }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Aspect Ratio
      </label>
      <div className="grid grid-cols-3 gap-3">
        {ratios.map((ratio) => {
          const isSelected = selectedRatio === ratio.value;
          return (
            <button
              key={ratio.value}
              onClick={() => onRatioChange(ratio.value)}
              type="button"
              className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200
                ${isSelected 
                  ? 'bg-purple-500/20 border-purple-500 text-white' 
                  : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-500 hover:text-white'
                }`}
            >
              {ratio.icon}
              <span className="text-sm font-semibold mt-1">{ratio.label}</span>
              <span className="text-xs text-gray-500">{ratio.value}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
