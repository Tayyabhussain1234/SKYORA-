import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { LocationData } from '../types/weather';
import { POPULAR_CITIES } from '../services/weatherApi';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  onSelectCity: (city: LocationData) => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  onRetry,
  onSelectCity,
}) => {
  const suggestedCities = POPULAR_CITIES.slice(0, 4);

  return (
    <div className="w-full rounded-3xl glass-panel p-8 text-center max-w-xl mx-auto my-12 shadow-2xl border border-rose-500/20">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-4 text-[#FF965A]">
        <AlertCircle className="w-7 h-7" />
      </div>

      <h2 className="text-xl font-bold text-[#F5F8FC]">Unable to Retrieve Weather Data</h2>
      <p className="text-sm text-[#AAB8C9] mt-2 mb-6 max-w-md mx-auto leading-relaxed">
        {message || 'The meteorological service is temporarily unavailable or experienced a network timeout. Please check your connection and retry.'}
      </p>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#65B8F4] text-[#101B2D] font-bold rounded-xl text-sm hover:bg-[#65B8F4]/90 active:scale-95 transition-all shadow-lg shadow-[#65B8F4]/20"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-white/10">
        <span className="text-xs text-[#AAB8C9] block mb-3 font-medium">
          Or view weather in featured locations:
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {suggestedCities.map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => onSelectCity(city)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/5 border border-white/10 hover:border-[#65B8F4]/40 hover:bg-white/10 text-[#F5F8FC] transition-colors"
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
