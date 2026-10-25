import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Droplets, Clock } from 'lucide-react';
import { HourlyItem, UnitSystem } from '../types/weather';
import { formatTemp } from '../utils/units';
import { WeatherIcon } from './WeatherIcon';
import { getWeatherInfo } from '../utils/weatherCodes';

interface HourlyForecastProps {
  items: HourlyItem[];
  unit: UnitSystem;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ items, unit }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section
      aria-label="Hourly Forecast"
      className="w-full rounded-3xl glass-panel p-6 shadow-xl relative overflow-hidden"
    >
      {/* Header bar with title and horizontal scroll chevrons */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#65B8F4]" />
          <h2 className="text-base sm:text-lg font-bold text-[#F5F8FC] tracking-tight">
            Hourly Forecast
          </h2>
          <span className="text-xs text-[#AAB8C9] font-medium hidden sm:inline">
            · Next 24 Hours
          </span>
        </div>

        {/* Scroll action buttons for desktop */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="p-1.5 rounded-lg border border-white/10 text-[#AAB8C9] hover:text-[#65B8F4] hover:bg-white/15 hover:border-[#65B8F4]/40 hover:scale-105 active:scale-90 transition-all duration-200"
            aria-label="Scroll hourly forecast left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="p-1.5 rounded-lg border border-white/10 text-[#AAB8C9] hover:text-[#65B8F4] hover:bg-white/15 hover:border-[#65B8F4]/40 hover:scale-105 active:scale-90 transition-all duration-200"
            aria-label="Scroll hourly forecast right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontally scrollable row */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-3 overflow-x-auto pb-3 pt-2 no-scrollbar sm:custom-scrollbar scroll-smooth focus:outline-none"
        tabIndex={0}
        role="region"
        aria-label="Hourly forecast list"
      >
        {items.map((hour, index) => {
          const condition = getWeatherInfo(hour.weatherCode, hour.isDay);

          return (
            <div
              key={`${hour.time}-${index}`}
              className={`flex flex-col items-center justify-between min-w-[78px] sm:min-w-[86px] p-3 rounded-2xl border transition-all duration-300 select-none group/hourly cursor-pointer ${
                hour.isCurrentHour
                  ? 'bg-[#193B5A]/90 border-[#65B8F4] shadow-lg shadow-[#65B8F4]/20 ring-1 ring-[#65B8F4]/60 hover:-translate-y-2'
                  : 'bg-white/5 border-white/10 hover:border-[#65B8F4]/40 hover:bg-[#193B5A]/60 hover:shadow-xl hover:shadow-[#65B8F4]/10 hover:-translate-y-1.5'
              }`}
              title={`${hour.hourFormatted}: ${formatTemp(hour.temperature, unit)}, ${condition.description}`}
            >
              {/* Hour label */}
              <span
                className={`text-xs font-semibold transition-colors duration-200 ${
                  hour.isCurrentHour ? 'text-[#65B8F4]' : 'text-[#AAB8C9] group-hover/hourly:text-[#F5F8FC]'
                }`}
              >
                {hour.hourFormatted}
              </span>

              {/* Weather Icon */}
              <div className="my-2.5 flex items-center justify-center transition-transform duration-300 group-hover/hourly:scale-120 group-hover/hourly:rotate-6">
                <WeatherIcon code={hour.weatherCode} isDay={hour.isDay} size={26} />
              </div>

              {/* Temperature */}
              <span className="text-base font-bold text-[#F5F8FC] tabular-nums font-mono transition-transform duration-200 group-hover/hourly:scale-105">
                {formatTemp(hour.temperature, unit)}
              </span>

              {/* Precipitation Probability */}
              <div className="mt-2 min-h-[18px] flex items-center justify-center">
                {hour.precipitationProbability > 0 ? (
                  <div className="flex items-center gap-0.5 text-[11px] font-semibold text-[#65B8F4] tabular-nums transition-transform duration-200 group-hover/hourly:scale-110">
                    <Droplets className="w-2.5 h-2.5" />
                    <span>{hour.precipitationProbability}%</span>
                  </div>
                ) : (
                  <span className="text-[11px] text-transparent select-none">-</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
