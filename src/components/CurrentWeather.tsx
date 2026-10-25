import React, { useState, useEffect } from 'react';
import { MapPin, ArrowUp, ArrowDown, Clock } from 'lucide-react';
import { WeatherData, UnitSystem } from '../types/weather';
import { getWeatherInfo } from '../utils/weatherCodes';
import { formatTemp } from '../utils/units';
import { getLocalCurrentTime } from '../utils/dateTime';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherProps {
  data: WeatherData;
  unit: UnitSystem;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, unit }) => {
  const { location, current, daily, summary, lastUpdated } = data;
  const weatherInfo = getWeatherInfo(current.weatherCode, current.isDay);

  // Live ticking clock in target city's local timezone
  const [localTime, setLocalTime] = useState(() => getLocalCurrentTime(location.timezone));

  useEffect(() => {
    setLocalTime(getLocalCurrentTime(location.timezone));
    const interval = setInterval(() => {
      setLocalTime(getLocalCurrentTime(location.timezone));
    }, 10000); // tick every 10s
    return () => clearInterval(interval);
  }, [location.timezone]);

  const todayForecast = daily[0];
  const highTemp = todayForecast ? todayForecast.tempMax : current.temperature;
  const lowTemp = todayForecast ? todayForecast.tempMin : current.temperature;

  return (
    <section
      aria-label="Current Weather"
      className="relative w-full rounded-3xl glass-panel p-6 sm:p-8 md:p-10 shadow-2xl overflow-hidden card-hover-effect group/hero"
    >
      {/* Background atmospheric ambient gradient accent with gentle breathing */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#65B8F4]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 animate-glow" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#FFD166]/5 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20 animate-glow" style={{ animationDelay: '3s' }} />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        {/* Left Column: City, Time, Condition & Natural Summary */}
        <div className="flex-1 space-y-4">
          {/* Location details */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:border-[#65B8F4]/40 hover:bg-white/10 text-xs text-[#65B8F4] font-medium mb-3 transition-all duration-200 cursor-default">
              <MapPin className="w-3.5 h-3.5 shrink-0 transition-transform duration-300 group-hover/hero:translate-y-[-1px]" />
              <span>
                {location.name}
                {location.admin1 ? `, ${location.admin1}` : ''} · {location.country}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#F5F8FC] transition-colors duration-300 group-hover/hero:text-white">
              {location.name}
            </h1>

            {/* Local time and date */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#AAB8C9] mt-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#65B8F4]" />
              <span>{localTime.dayName}, {localTime.fullDate}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#F5F8FC] font-semibold tabular-nums">{localTime.timeString}</span>
              <span className="text-[11px] text-[#AAB8C9]/80 uppercase">({location.timezone.split('/')[1]?.replace('_', ' ') || 'Local'})</span>
            </div>
          </div>

          {/* Natural narrative summary */}
          <p className="text-sm sm:text-base text-[#F5F8FC]/90 max-w-xl leading-relaxed pt-1">
            {summary}
          </p>

          {/* Provider sync badge */}
          <div className="text-[11px] text-[#AAB8C9]/70 flex items-center gap-2 pt-2">
            <span>Updated {lastUpdated}</span>
            <span aria-hidden="true">·</span>
            <span>Real-time via Open-Meteo</span>
          </div>
        </div>

        {/* Right Column: Hero Temperature, High/Low, Condition Icon */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center md:flex-col md:items-end justify-between gap-6 shrink-0 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-10">
          {/* Temperature and Icon lockup */}
          <div className="flex items-center gap-5">
            <div className="flex flex-col items-start md:items-end">
              <div className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter text-[#F5F8FC] tabular-nums font-mono transition-transform duration-300 hover:scale-[1.02]">
                {formatTemp(current.temperature, unit)}
              </div>
              <div className="text-sm sm:text-base font-medium text-[#AAB8C9] mt-0.5">
                Feels like <span className="text-[#F5F8FC] font-semibold tabular-nums">{formatTemp(current.apparentTemperature, unit)}</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white/5 border border-white/10 shadow-inner group/icon hover:scale-105 hover:bg-white/10 hover:border-[#65B8F4]/40 hover:shadow-lg hover:shadow-[#65B8F4]/10 transition-all duration-300 cursor-default">
              <div className="animate-float">
                <WeatherIcon code={current.weatherCode} isDay={current.isDay} size={52} className="transition-transform duration-500 group-hover/icon:scale-110 group-hover/icon:rotate-6" />
              </div>
              <span className="text-xs font-semibold text-[#F5F8FC] mt-2 text-center max-w-[90px] leading-tight transition-colors group-hover/icon:text-[#65B8F4]">
                {weatherInfo.description}
              </span>
            </div>
          </div>

          {/* High / Low Range Badge */}
          <div className="flex items-center gap-4 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/25 hover:bg-white/10 text-xs sm:text-sm transition-all duration-200">
            <div className="flex items-center gap-1 text-[#FFD166] group/high">
              <ArrowUp className="w-3.5 h-3.5 stroke-[2.5] transition-transform duration-300 group-hover/high:-translate-y-0.5" />
              <span className="text-[#AAB8C9]">High:</span>
              <span className="font-bold tabular-nums text-[#F5F8FC]">{formatTemp(highTemp, unit)}</span>
            </div>
            <div className="w-[1px] h-3.5 bg-white/15" aria-hidden="true" />
            <div className="flex items-center gap-1 text-[#65B8F4] group/low">
              <ArrowDown className="w-3.5 h-3.5 stroke-[2.5] transition-transform duration-300 group-hover/low:translate-y-0.5" />
              <span className="text-[#AAB8C9]">Low:</span>
              <span className="font-bold tabular-nums text-[#F5F8FC]">{formatTemp(lowTemp, unit)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
