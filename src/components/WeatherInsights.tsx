import React from 'react';
import { Droplets, Wind, Gauge, Eye, Sun, Sunset, Sunrise, Compass } from 'lucide-react';
import { WeatherInsights as IWeatherInsights, UnitSystem } from '../types/weather';
import { formatSpeed, formatVisibility, formatPressure } from '../utils/units';

interface WeatherInsightsProps {
  insights: IWeatherInsights;
  unit: UnitSystem;
}

export const WeatherInsights: React.FC<WeatherInsightsProps> = ({ insights, unit }) => {
  const {
    humidity,
    windSpeed,
    windDirection,
    windCompass,
    pressure,
    visibility,
    uvIndex,
    uvCategory,
    sunrise,
    sunset,
  } = insights;

  // Humidity status
  const getHumidityStatus = (h: number) => {
    if (h < 30) return 'Dry environment';
    if (h <= 60) return 'Comfortable humidity';
    if (h <= 80) return 'Humid conditions';
    return 'Very humid air';
  };

  // Pressure status
  const getPressureStatus = (p: number) => {
    if (p < 1005) return 'Low pressure system';
    if (p <= 1020) return 'Normal standard pressure';
    return 'High pressure system';
  };

  // Visibility rating
  const getVisibilityStatus = (vKm: number) => {
    if (vKm >= 10) return 'Clear visibility';
    if (vKm >= 5) return 'Good visibility';
    if (vKm >= 2) return 'Moderate haze/mist';
    return 'Poor visibility / Fog';
  };

  // UV badge color
  const getUvColor = (cat: string) => {
    switch (cat) {
      case 'Low':
        return 'text-[#65B8F4]';
      case 'Moderate':
        return 'text-[#FFD166]';
      case 'High':
        return 'text-[#FF965A]';
      case 'Very High':
      case 'Extreme':
        return 'text-rose-400';
      default:
        return 'text-[#65B8F4]';
    }
  };

  return (
    <section aria-label="Weather Details and Atmospheric Insights" className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-[#F5F8FC] tracking-tight">
          Weather Insights & Details
        </h2>
        <span className="text-xs text-[#AAB8C9] font-medium">Real-time telemetry</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Card 1: Humidity */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col justify-between card-hover-effect group/humidity cursor-default">
          <div className="flex items-center justify-between text-xs text-[#AAB8C9] mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px] group-hover/humidity:text-[#65B8F4] transition-colors">Humidity</span>
            <Droplets className="w-4 h-4 text-[#65B8F4] transition-transform duration-300 group-hover/humidity:scale-125 group-hover/humidity:-translate-y-0.5" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#F5F8FC] tabular-nums font-mono transition-transform duration-200 group-hover/humidity:scale-105 origin-left">
              {humidity}%
            </div>
            <p className="text-xs text-[#AAB8C9] mt-1 truncate group-hover/humidity:text-[#F5F8FC]/90 transition-colors">
              {getHumidityStatus(humidity)}
            </p>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 mt-3 overflow-hidden group-hover/humidity:bg-white/15 transition-colors">
            <div
              className="bg-[#65B8F4] h-full rounded-full transition-all duration-500 group-hover/humidity:shadow-[0_0_8px_rgba(101,184,244,0.6)] group-hover/humidity:brightness-110"
              style={{ width: `${Math.min(100, Math.max(0, humidity))}%` }}
            />
          </div>
        </div>

        {/* Card 2: Wind Speed & Direction */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col justify-between card-hover-effect group/wind cursor-default">
          <div className="flex items-center justify-between text-xs text-[#AAB8C9] mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px] group-hover/wind:text-[#65B8F4] transition-colors">Wind</span>
            <Wind className="w-4 h-4 text-[#65B8F4] transition-transform duration-300 group-hover/wind:scale-125 group-hover/wind:translate-x-0.5" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#F5F8FC] tabular-nums font-mono transition-transform duration-200 group-hover/wind:scale-105 origin-left">
              {formatSpeed(windSpeed, unit)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#AAB8C9] mt-1 group-hover/wind:text-[#F5F8FC]/90 transition-colors">
              <Compass
                className="w-3.5 h-3.5 text-[#65B8F4] shrink-0 transition-transform duration-500 group-hover/wind:scale-125"
                style={{ transform: `rotate(${windDirection}deg)` }}
              />
              <span>
                {windCompass} ({Math.round(windDirection)}°)
              </span>
            </div>
          </div>
          <div className="text-[11px] text-[#AAB8C9]/70 mt-3 truncate group-hover/wind:text-[#AAB8C9] transition-colors">
            {windSpeed < 10 ? 'Light breeze' : windSpeed < 25 ? 'Moderate wind' : 'Strong wind gusts'}
          </div>
        </div>

        {/* Card 3: Atmospheric Pressure */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col justify-between card-hover-effect group/pressure cursor-default">
          <div className="flex items-center justify-between text-xs text-[#AAB8C9] mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px] group-hover/pressure:text-[#65B8F4] transition-colors">Pressure</span>
            <Gauge className="w-4 h-4 text-[#65B8F4] transition-transform duration-300 group-hover/pressure:scale-125 group-hover/pressure:rotate-12" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#F5F8FC] tabular-nums font-mono transition-transform duration-200 group-hover/pressure:scale-105 origin-left">
              {formatPressure(pressure)}
            </div>
            <p className="text-xs text-[#AAB8C9] mt-1 truncate group-hover/pressure:text-[#F5F8FC]/90 transition-colors">
              {getPressureStatus(pressure)}
            </p>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 mt-3 overflow-hidden group-hover/pressure:bg-white/15 transition-colors">
            <div
              className="bg-[#65B8F4] h-full rounded-full transition-all duration-500 group-hover/pressure:shadow-[0_0_8px_rgba(101,184,244,0.6)] group-hover/pressure:brightness-110"
              style={{
                width: `${Math.min(100, Math.max(0, ((pressure - 960) / 80) * 100))}%`,
              }}
            />
          </div>
        </div>

        {/* Card 4: Visibility */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col justify-between card-hover-effect group/visibility cursor-default">
          <div className="flex items-center justify-between text-xs text-[#AAB8C9] mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px] group-hover/visibility:text-[#65B8F4] transition-colors">Visibility</span>
            <Eye className="w-4 h-4 text-[#65B8F4] transition-transform duration-300 group-hover/visibility:scale-125" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#F5F8FC] tabular-nums font-mono transition-transform duration-200 group-hover/visibility:scale-105 origin-left">
              {formatVisibility(visibility, unit)}
            </div>
            <p className="text-xs text-[#AAB8C9] mt-1 truncate group-hover/visibility:text-[#F5F8FC]/90 transition-colors">
              {getVisibilityStatus(visibility)}
            </p>
          </div>
          <div className="text-[11px] text-[#AAB8C9]/70 mt-3 group-hover/visibility:text-[#AAB8C9] transition-colors">
            {visibility >= 10 ? 'Optimal horizon clarity' : 'Atmospheric particles detected'}
          </div>
        </div>

        {/* Card 5: UV Index */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col justify-between card-hover-effect group/uv cursor-default">
          <div className="flex items-center justify-between text-xs text-[#AAB8C9] mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px] group-hover/uv:text-[#FFD166] transition-colors">UV Index</span>
            <Sun className="w-4 h-4 text-[#FFD166] transition-transform duration-500 group-hover/uv:rotate-90 group-hover/uv:scale-125" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#F5F8FC] tabular-nums font-mono flex items-baseline gap-2 transition-transform duration-200 group-hover/uv:scale-105 origin-left">
              <span>{uvIndex.toFixed(1)}</span>
              <span className={`text-xs font-semibold ${getUvColor(uvCategory)}`}>
                {uvCategory}
              </span>
            </div>
            <p className="text-xs text-[#AAB8C9] mt-1 truncate group-hover/uv:text-[#F5F8FC]/90 transition-colors">
              {uvIndex <= 2 ? 'Low sun protection needed' : uvIndex <= 5 ? 'Sun protection recommended' : 'High sun protection required'}
            </p>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 mt-3 overflow-hidden group-hover/uv:bg-white/15 transition-colors">
            <div
              className="bg-gradient-to-r from-[#65B8F4] via-[#FFD166] to-[#FF965A] h-full rounded-full transition-all duration-500 group-hover/uv:shadow-[0_0_8px_rgba(255,209,102,0.6)] group-hover/uv:brightness-110"
              style={{ width: `${Math.min(100, Math.max(8, (uvIndex / 11) * 100))}%` }}
            />
          </div>
        </div>

        {/* Card 6: Sunrise & Sunset */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col justify-between card-hover-effect group/solar cursor-default col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-xs text-[#AAB8C9] mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px] group-hover/solar:text-[#FFD166] transition-colors">Solar Cycle</span>
            <Sunrise className="w-4 h-4 text-[#FFD166] transition-transform duration-300 group-hover/solar:scale-125 group-hover/solar:-translate-y-0.5" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-1 rounded-md hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-2">
                <Sunrise className="w-4 h-4 text-[#FFD166] transition-transform duration-300 group-hover/solar:rotate-12" />
                <span className="text-xs text-[#AAB8C9]">Sunrise</span>
              </div>
              <span className="text-sm font-bold text-[#F5F8FC] tabular-nums">{sunrise}</span>
            </div>
            <div className="flex items-center justify-between p-1 rounded-md hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-2">
                <Sunset className="w-4 h-4 text-[#FF965A] transition-transform duration-300 group-hover/solar:-rotate-12" />
                <span className="text-xs text-[#AAB8C9]">Sunset</span>
              </div>
              <span className="text-sm font-bold text-[#F5F8FC] tabular-nums">{sunset}</span>
            </div>
          </div>
          <div className="text-[11px] text-[#AAB8C9]/70 mt-2 truncate group-hover/solar:text-[#AAB8C9] transition-colors">
            Local daylight cycle
          </div>
        </div>
      </div>
    </section>
  );
};
