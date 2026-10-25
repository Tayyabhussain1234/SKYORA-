import React, { useState } from 'react';
import { Calendar, Droplets, Sun, ChevronDown, ChevronUp } from 'lucide-react';
import { DailyItem, UnitSystem } from '../types/weather';
import { formatTemp } from '../utils/units';
import { getWeatherInfo } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';
import { formatTimeFromIso } from '../utils/dateTime';

interface WeeklyForecastProps {
  items: DailyItem[];
  unit: UnitSystem;
}

export const WeeklyForecast: React.FC<WeeklyForecastProps> = ({ items, unit }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Calculate absolute min & max temperatures across the entire 7 days for the proportional range bar
  const weekMin = items.length > 0 ? Math.min(...items.map((i) => i.tempMin)) : 0;
  const weekMax = items.length > 0 ? Math.max(...items.map((i) => i.tempMax)) : 30;
  const totalRange = weekMax - weekMin > 0 ? weekMax - weekMin : 1;

  const toggleExpand = (idx: number) => {
    setExpandedIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section
      aria-label="7-Day Weather Forecast"
      className="w-full rounded-3xl glass-panel p-6 shadow-xl relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#65B8F4]" />
          <h2 className="text-base sm:text-lg font-bold text-[#F5F8FC] tracking-tight">
            7-Day Forecast
          </h2>
        </div>
        <span className="text-xs text-[#AAB8C9] font-medium">Daily temperature ranges</span>
      </div>

      <div className="divide-y divide-white/5">
        {items.map((day, idx) => {
          const isToday = idx === 0;
          const condition = getWeatherInfo(day.weatherCode, 1);
          const isExpanded = expandedIndex === idx;

          // Bar math: relative offset & width
          const leftPercent = Math.max(0, Math.min(100, ((day.tempMin - weekMin) / totalRange) * 100));
          const widthPercent = Math.max(
            10,
            Math.min(100 - leftPercent, ((day.tempMax - day.tempMin) / totalRange) * 100)
          );

          return (
            <div
              key={`${day.time}-${idx}`}
              className={`py-3.5 transition-all duration-300 rounded-xl group/day ${
                isToday
                  ? 'bg-[#193B5A]/40 px-3 -mx-3 border border-[#65B8F4]/30 shadow-md shadow-[#65B8F4]/5'
                  : 'hover:bg-[#193B5A]/50 hover:shadow-lg hover:shadow-black/20 hover:border-white/10 px-2.5 -mx-2.5 border border-transparent'
              }`}
            >
              <div
                onClick={() => toggleExpand(idx)}
                className="grid grid-cols-12 items-center gap-2 sm:gap-4 cursor-pointer select-none"
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleExpand(idx);
                  }
                }}
              >
                {/* Day name & date */}
                <div className="col-span-4 sm:col-span-3 flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <span className={`text-sm font-semibold truncate transition-colors duration-200 ${isToday ? 'text-[#65B8F4] font-bold' : 'text-[#F5F8FC] group-hover/day:text-[#65B8F4]'}`}>
                    {day.dayName}
                  </span>
                  <span className="text-[11px] text-[#AAB8C9] truncate">
                    {day.fullDate}
                  </span>
                </div>

                {/* Weather icon & condition */}
                <div className="col-span-3 sm:col-span-3 flex items-center gap-2">
                  <div className="shrink-0 transition-transform duration-300 group-hover/day:scale-125 group-hover/day:rotate-6">
                    <WeatherIcon code={day.weatherCode} size={20} />
                  </div>
                  <span className="text-xs text-[#AAB8C9] truncate hidden sm:inline transition-colors group-hover/day:text-[#F5F8FC]" title={condition.description}>
                    {condition.description}
                  </span>
                  {day.precipitationProbability > 0 && (
                    <span className="inline-flex items-center gap-0.5 text-[11px] text-[#65B8F4] font-medium tabular-nums ml-auto sm:ml-0 transition-transform duration-200 group-hover/day:scale-105">
                      <Droplets className="w-2.5 h-2.5" />
                      {day.precipitationProbability}%
                    </span>
                  )}
                </div>

                {/* Low Temp */}
                <div className="col-span-1 text-right text-xs font-semibold text-[#AAB8C9] tabular-nums font-mono group-hover/day:text-[#F5F8FC] transition-colors">
                  {formatTemp(day.tempMin, unit)}
                </div>

                {/* Visual Temperature Bar */}
                <div className="col-span-3 sm:col-span-4 px-1 flex items-center">
                  <div className="relative w-full h-2 rounded-full bg-white/10 overflow-hidden transition-all duration-300 group-hover/day:h-2.5 group-hover/day:bg-white/15">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-[#65B8F4] via-[#FFD166] to-[#FF965A] shadow-sm transition-all duration-300 group-hover/day:brightness-125 group-hover/day:shadow-[0_0_10px_rgba(101,184,244,0.5)]"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    />
                  </div>
                </div>

                {/* High Temp & Expand Toggle */}
                <div className="col-span-1 flex items-center justify-end gap-1">
                  <span className="text-xs font-bold text-[#F5F8FC] tabular-nums font-mono transition-transform duration-200 group-hover/day:scale-105">
                    {formatTemp(day.tempMax, unit)}
                  </span>
                  <span className="text-[#AAB8C9]/60 group-hover/day:text-[#65B8F4] transition-colors">
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </span>
                </div>
              </div>

              {/* Expandable Daily Details Panel */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#AAB8C9] animate-fadeIn transition-all duration-300">
                  <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg hover:bg-white/10 hover:border-[#FFD166]/30 border border-transparent transition-all duration-200 group/item">
                    <Sun className="w-3.5 h-3.5 text-[#FFD166] transition-transform duration-300 group-hover/item:rotate-45" />
                    <div>
                      <span className="block text-[10px] text-[#AAB8C9]/70 uppercase">Sunrise</span>
                      <span className="font-semibold text-[#F5F8FC]">{formatTimeFromIso(day.sunrise)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg hover:bg-white/10 hover:border-[#FF965A]/30 border border-transparent transition-all duration-200 group/item">
                    <Sun className="w-3.5 h-3.5 text-[#FF965A] transition-transform duration-300 group-hover/item:rotate-45" />
                    <div>
                      <span className="block text-[10px] text-[#AAB8C9]/70 uppercase">Sunset</span>
                      <span className="font-semibold text-[#F5F8FC]">{formatTimeFromIso(day.sunset)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg hover:bg-white/10 hover:border-[#65B8F4]/30 border border-transparent transition-all duration-200 group/item">
                    <Droplets className="w-3.5 h-3.5 text-[#65B8F4] transition-transform duration-300 group-hover/item:scale-110" />
                    <div>
                      <span className="block text-[10px] text-[#AAB8C9]/70 uppercase">Rain Chance</span>
                      <span className="font-semibold text-[#F5F8FC]">{day.precipitationProbability}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg hover:bg-white/10 hover:border-[#FFD166]/30 border border-transparent transition-all duration-200 group/item">
                    <Sun className="w-3.5 h-3.5 text-[#FFD166] transition-transform duration-300 group-hover/item:scale-110" />
                    <div>
                      <span className="block text-[10px] text-[#AAB8C9]/70 uppercase">UV Max</span>
                      <span className="font-semibold text-[#F5F8FC]">{day.uvIndexMax.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
