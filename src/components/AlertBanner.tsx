import React, { useState, useMemo } from 'react';
import { AlertTriangle, CloudLightning, Wind, Thermometer, Droplets, Snowflake, X, ChevronRight, ShieldAlert } from 'lucide-react';
import { WeatherData, UnitSystem } from '../types/weather';
import { formatSpeed, formatTemp } from '../utils/units';

interface AlertBannerProps {
  weatherData: WeatherData;
  unit: UnitSystem;
}

export interface SevereAlert {
  id: string;
  level: 'advisory' | 'warning' | 'severe';
  title: string;
  description: string;
  safetyAdvice: string;
  type: 'thunderstorm' | 'wind' | 'rain' | 'snow' | 'heat' | 'cold' | 'uv';
}

export function detectSevereWeather(data: WeatherData, unit: UnitSystem): SevereAlert | null {
  const { current, hourly, daily } = data;

  // 1. Check for Active Thunderstorms or Severe Storms (Current & next 6 hours)
  const currentCode = current.weatherCode;
  const isSevereCurrentStorm = currentCode === 96 || currentCode === 99;
  const isThunderstorm = currentCode === 95 || isSevereCurrentStorm;

  // Check upcoming 6 hours for approaching severe storms
  const upcomingThunderstorm = hourly.slice(0, 6).find((h) => h.weatherCode === 96 || h.weatherCode === 99 || h.weatherCode === 95);

  if (isSevereCurrentStorm) {
    return {
      id: `storm-severe-${currentCode}`,
      level: 'severe',
      title: 'Severe Thunderstorm & Hail Warning',
      description: 'Dangerous storm conditions with potential hail and intense lightning detected in this area.',
      safetyAdvice: 'Seek sturdy indoor shelter immediately. Keep away from windows and avoid open elevated terrain.',
      type: 'thunderstorm',
    };
  }

  if (isThunderstorm) {
    return {
      id: `storm-${currentCode}`,
      level: 'warning',
      title: 'Thunderstorm Warning',
      description: 'Active electrical storms and localized convective activity recorded.',
      safetyAdvice: 'Remain indoors until the storm clears. Postpone outdoor travel and disconnect sensitive electronics.',
      type: 'thunderstorm',
    };
  }

  // 2. High Wind Warnings (> 45 km/h)
  if (current.windSpeed >= 55) {
    return {
      id: `wind-severe-${Math.round(current.windSpeed)}`,
      level: 'severe',
      title: `High Wind & Gale Warning (${formatSpeed(current.windSpeed, unit)})`,
      description: 'Hazardous high-velocity winds present. Structural gusts and flying debris possible.',
      safetyAdvice: 'Secure outdoor furniture, avoid traveling near large trees or powerlines, and exercise caution while driving.',
      type: 'wind',
    };
  }

  if (current.windSpeed >= 42) {
    return {
      id: `wind-advisory-${Math.round(current.windSpeed)}`,
      level: 'advisory',
      title: `Wind Advisory (${formatSpeed(current.windSpeed, unit)})`,
      description: 'Brisk, sustained gale winds are impacting local travel and exposed areas.',
      safetyAdvice: 'Hold onto doors when exiting vehicles and secure lightweight items outdoors.',
      type: 'wind',
    };
  }

  // 3. Heavy Rain or Flash Flood Alert (Codes 65, 82 or high precipitation)
  if (currentCode === 65 || currentCode === 82 || current.precipitation >= 12) {
    return {
      id: `rain-${currentCode}`,
      level: 'warning',
      title: 'Heavy Rain & Flash Flood Advisory',
      description: 'Torrential rainfall causing rapid surface water accumulation and reduced road visibility.',
      safetyAdvice: 'Drive with headlights, maintain safe braking distances, and avoid low-lying underpasses subject to flooding.',
      type: 'rain',
    };
  }

  // 4. Heavy Snowfall or Blizzard Alert (Codes 75, 86, 67)
  if (currentCode === 75 || currentCode === 86 || currentCode === 67) {
    return {
      id: `snow-${currentCode}`,
      level: 'warning',
      title: 'Heavy Snowfall & Reduced Visibility Warning',
      description: 'Dense snowfall and near-zero visibility conditions reported.',
      safetyAdvice: 'Delay non-essential travel. If driving is unavoidable, equip winter tires and carry an emergency safety kit.',
      type: 'snow',
    };
  }

  // 5. Extreme Temperature Warnings (Extreme Heat >= 40°C or Extreme Cold <= -15°C)
  if (current.temperature >= 40) {
    return {
      id: `heat-${Math.round(current.temperature)}`,
      level: 'warning',
      title: `Excessive Heat Warning (${formatTemp(current.temperature, unit)})`,
      description: `Dangerously high temperatures recorded, feels like ${formatTemp(current.apparentTemperature, unit)}.`,
      safetyAdvice: 'Stay in air-conditioned environments, drink plenty of water, and avoid strenuous outdoor exercise between 11 AM and 4 PM.',
      type: 'heat',
    };
  }

  if (current.temperature <= -15) {
    return {
      id: `cold-${Math.round(current.temperature)}`,
      level: 'warning',
      title: `Extreme Cold Advisory (${formatTemp(current.temperature, unit)})`,
      description: 'Sub-zero temperatures present high risk of hypothermia and frostbite upon brief exposure.',
      safetyAdvice: 'Dress in layered insulated clothing, cover exposed skin, and limit outdoor exposure for children and pets.',
      type: 'cold',
    };
  }

  // 6. Extreme UV Radiation Warning (UV index >= 10)
  if (current.uvIndex >= 10 || (daily[0] && daily[0].uvIndexMax >= 10)) {
    return {
      id: `uv-${current.uvIndex}`,
      level: 'advisory',
      title: `Extreme UV Advisory (Index ${current.uvIndex.toFixed(1)})`,
      description: 'Unprotected skin and eyes can burn rapidly under peak midday solar radiation.',
      safetyAdvice: 'Apply broad-spectrum SPF 50+ sunscreen, wear UV-blocking sunglasses, and seek shade during midday hours.',
      type: 'uv',
    };
  }

  // 7. Approaching Thunderstorm within 6 hours
  if (upcomingThunderstorm) {
    return {
      id: `approaching-storm-${upcomingThunderstorm.time}`,
      level: 'advisory',
      title: `Approaching Storm Alert (${upcomingThunderstorm.hourFormatted})`,
      description: `Thunderstorms with precipitation probability of ${upcomingThunderstorm.precipitationProbability}% forecast in the coming hours.`,
      safetyAdvice: 'Plan outdoor activities accordingly and monitor local radar updates.',
      type: 'thunderstorm',
    };
  }

  return null;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ weatherData, unit }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Compute active alert
  const alert = useMemo(() => {
    return detectSevereWeather(weatherData, unit);
  }, [weatherData, unit]);

  // Reset dismissed state when city changes
  React.useEffect(() => {
    setIsDismissed(false);
    setIsExpanded(false);
  }, [weatherData.location.name]);

  if (!alert || isDismissed) {
    return null;
  }

  const getAlertStyles = (level: SevereAlert['level']) => {
    switch (level) {
      case 'severe':
        return {
          wrapper: 'bg-rose-950/40 border-rose-500/40 shadow-rose-950/30 text-rose-200',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          accent: 'text-rose-400',
          pulsingGlow: 'shadow-[0_0_16px_rgba(244,63,94,0.18)]',
        };
      case 'warning':
        return {
          wrapper: 'bg-amber-950/40 border-[#FF965A]/40 shadow-amber-950/30 text-amber-100',
          badge: 'bg-[#FF965A]/20 text-[#FF965A] border-[#FF965A]/40',
          accent: 'text-[#FF965A]',
          pulsingGlow: 'shadow-[0_0_16px_rgba(255,150,90,0.18)]',
        };
      case 'advisory':
      default:
        return {
          wrapper: 'bg-yellow-950/35 border-[#FFD166]/35 shadow-yellow-950/20 text-yellow-100',
          badge: 'bg-[#FFD166]/20 text-[#FFD166] border-[#FFD166]/40',
          accent: 'text-[#FFD166]',
          pulsingGlow: 'shadow-[0_0_14px_rgba(255,209,102,0.15)]',
        };
    }
  };

  const styles = getAlertStyles(alert.level);

  const renderIcon = () => {
    switch (alert.type) {
      case 'thunderstorm':
        return <CloudLightning className="w-4 h-4 shrink-0" />;
      case 'wind':
        return <Wind className="w-4 h-4 shrink-0" />;
      case 'rain':
        return <Droplets className="w-4 h-4 shrink-0" />;
      case 'snow':
        return <Snowflake className="w-4 h-4 shrink-0" />;
      case 'heat':
      case 'cold':
      case 'uv':
        return <Thermometer className="w-4 h-4 shrink-0" />;
      default:
        return <AlertTriangle className="w-4 h-4 shrink-0" />;
    }
  };

  return (
    <div
      id="severe-alert-banner"
      role="alert"
      aria-live="polite"
      className={`w-full rounded-2xl border backdrop-blur-xl p-3.5 sm:p-4 transition-all duration-300 relative overflow-hidden ${styles.wrapper} ${styles.pulsingGlow}`}
    >
      {/* Subtle pulsing background aura */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent motion-safe:animate-[pulseGlow_4s_ease-in-out_infinite] pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Alert Icon, Title & Summary */}
        <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
          {/* Pulsing Alert Icon badge with AlertTriangle */}
          <div className={`p-2 rounded-xl border shrink-0 ${styles.badge} motion-safe:animate-pulse flex items-center gap-1`}>
            <AlertTriangle className="w-4 h-4 text-[#FFD166]" />
            {renderIcon()}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F5F8FC]">
                {alert.title}
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md border border-white/10 bg-white/5 text-[#AAB8C9]">
                {alert.level}
              </span>
            </div>
            <p className="text-xs text-[#F5F8FC]/80 mt-0.5 truncate sm:whitespace-normal">
              {alert.description}
            </p>
          </div>
        </div>

        {/* Right: Expand details & Dismiss button */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/15 text-[#F5F8FC] border border-white/10 transition-colors"
            aria-expanded={isExpanded}
          >
            <span>{isExpanded ? 'Hide Advice' : 'Safety Advice'}</span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-lg text-[#AAB8C9] hover:text-[#F5F8FC] hover:bg-white/10 transition-colors"
            title="Dismiss warning for this session"
            aria-label="Dismiss warning"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable Safety Advice Drawer */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-white/10 text-xs text-[#F5F8FC]/90 space-y-1.5 animate-fadeIn">
          <div className="flex items-center gap-2 font-semibold text-[#F5F8FC]">
            <ShieldAlert className="w-3.5 h-3.5 text-[#FFD166]" />
            <span>Recommended Safety Precautions:</span>
          </div>
          <p className="pl-5 text-xs text-[#AAB8C9] leading-relaxed">
            {alert.safetyAdvice}
          </p>
        </div>
      )}
    </div>
  );
};
