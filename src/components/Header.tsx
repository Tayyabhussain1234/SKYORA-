import React from 'react';
import { CloudSun, RotateCw } from 'lucide-react';
import { UnitSystem } from '../types/weather';

interface HeaderProps {
  unit: UnitSystem;
  onToggleUnit: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  unit,
  onToggleUnit,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <header className="w-full border-b border-white/10 bg-[#101B2D]/70 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0 group cursor-default">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#65B8F4] to-[#193B5A] flex items-center justify-center shadow-lg shadow-[#193B5A]/50 border border-white/20 transition-all duration-300 group-hover:shadow-[#65B8F4]/30 group-hover:scale-105 group-hover:border-[#65B8F4]/40">
            <CloudSun className="w-5 h-5 text-[#FFD166] transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-[#F5F8FC] leading-none transition-colors group-hover:text-[#65B8F4]">
              SKYORA
            </span>
            <span className="hidden sm:inline-block text-[11px] text-[#AAB8C9] mt-0.5 tracking-normal">
              Weather, wherever life takes you
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Unit Toggle */}
          <div
            className="flex items-center p-1 bg-[#193B5A]/50 border border-white/10 rounded-lg shadow-inner transition-colors hover:border-[#65B8F4]/30"
            role="group"
            aria-label="Temperature unit selection"
          >
            <button
              type="button"
              onClick={() => unit !== 'celsius' && onToggleUnit()}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all duration-200 whitespace-nowrap shrink-0 active:scale-95 ${
                unit === 'celsius'
                  ? 'bg-[#65B8F4] text-[#101B2D] shadow-sm font-bold scale-100'
                  : 'text-[#AAB8C9] hover:text-[#F5F8FC] hover:bg-white/5'
              }`}
              aria-pressed={unit === 'celsius'}
            >
              °C
            </button>
            <button
              type="button"
              onClick={() => unit !== 'fahrenheit' && onToggleUnit()}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all duration-200 whitespace-nowrap shrink-0 active:scale-95 ${
                unit === 'fahrenheit'
                  ? 'bg-[#65B8F4] text-[#101B2D] shadow-sm font-bold scale-100'
                  : 'text-[#AAB8C9] hover:text-[#F5F8FC] hover:bg-white/5'
              }`}
              aria-pressed={unit === 'fahrenheit'}
            >
              °F
            </button>
          </div>

          {/* Refresh Action */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 text-[#AAB8C9] hover:text-[#65B8F4] hover:bg-white/10 active:scale-90 rounded-lg border border-white/10 hover:border-[#65B8F4]/30 transition-all duration-200 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65B8F4] group/refresh"
            title="Refresh weather data"
            aria-label="Refresh weather data"
          >
            <RotateCw className={`w-4 h-4 transition-transform duration-500 group-hover/refresh:rotate-180 ${isRefreshing ? 'animate-spin text-[#65B8F4]' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
