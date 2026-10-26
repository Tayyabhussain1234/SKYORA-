import React, { useState, useEffect, useMemo } from 'react';
import { Sunrise, Sunset, Sun, Moon, Clock } from 'lucide-react';
import { formatTimeFromIso } from '../utils/dateTime';

interface SunProgressBarProps {
  sunriseIso: string;
  sunsetIso: string;
  timezone: string;
  className?: string;
}

export const SunProgressBar: React.FC<SunProgressBarProps> = ({
  sunriseIso,
  sunsetIso,
  timezone,
  className = '',
}) => {
  // Tick every 30 seconds to update sun progression
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const solarData = useMemo(() => {
    if (!sunriseIso || !sunsetIso) {
      return null;
    }

    try {
      // Parse sunrise hour and minute
      const sunrisePart = sunriseIso.split('T')[1];
      if (!sunrisePart) return null;
      const [sh, sm] = sunrisePart.split(':').map(Number);
      const sunriseMinutes = sh * 60 + sm;

      // Parse sunset hour and minute
      const sunsetPart = sunsetIso.split('T')[1];
      if (!sunsetPart) return null;
      const [eh, em] = sunsetPart.split(':').map(Number);
      const sunsetMinutes = eh * 60 + em;

      // Current time in destination city's timezone
      const timeParts = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hourCycle: 'h23',
        timeZone: timezone,
      }).formatToParts(now);

      const curHour = parseInt(timeParts.find((p) => p.type === 'hour')?.value || '0', 10);
      const curMin = parseInt(timeParts.find((p) => p.type === 'minute')?.value || '0', 10);
      const currentMinutes = curHour * 60 + curMin;

      // Day length
      const totalDayMinutes = Math.max(1, sunsetMinutes - sunriseMinutes);
      const dayLengthHours = Math.floor(totalDayMinutes / 60);
      const dayLengthMins = totalDayMinutes % 60;
      const dayLengthStr = `${dayLengthHours}h ${dayLengthMins}m`;

      // Formatted local sunrise & sunset times
      const sunriseFormatted = formatTimeFromIso(sunriseIso);
      const sunsetFormatted = formatTimeFromIso(sunsetIso);

      let progress = 0;
      let statusText = '';
      let isDaylight = false;
      let isDawn = false;
      let isDusk = false;

      if (currentMinutes < sunriseMinutes) {
        // Before sunrise
        progress = 0;
        const diff = sunriseMinutes - currentMinutes;
        const diffH = Math.floor(diff / 60);
        const diffM = diff % 60;
        statusText = diffH > 0 ? `Sunrise in ${diffH}h ${diffM}m` : `Sunrise in ${diffM}m`;
        isDawn = diff <= 45;
      } else if (currentMinutes > sunsetMinutes) {
        // After sunset
        progress = 100;
        const diff = currentMinutes - sunsetMinutes;
        const diffH = Math.floor(diff / 60);
        const diffM = diff % 60;
        statusText = diffH > 0 ? `Sunset was ${diffH}h ${diffM}m ago` : `Sunset was ${diffM}m ago`;
        isDusk = diff <= 45;
      } else {
        // Active daylight
        isDaylight = true;
        const elapsed = currentMinutes - sunriseMinutes;
        progress = Math.min(100, Math.max(0, (elapsed / totalDayMinutes) * 100));

        const remaining = sunsetMinutes - currentMinutes;
        const remH = Math.floor(remaining / 60);
        const remM = remaining % 60;

        if (remaining <= 60) {
          statusText = `Golden hour · Sunset in ${remM}m`;
          isDusk = true;
        } else {
          statusText = `${remH}h ${remM}m of daylight remaining`;
        }
      }

      return {
        sunriseFormatted,
        sunsetFormatted,
        dayLengthStr,
        progress,
        statusText,
        isDaylight,
        isDawn,
        isDusk,
      };
    } catch {
      return null;
    }
  }, [sunriseIso, sunsetIso, timezone, now]);

  if (!solarData) {
    return null;
  }

  const {
    sunriseFormatted,
    sunsetFormatted,
    dayLengthStr,
    progress,
    statusText,
    isDaylight,
  } = solarData;

  return (
    <div
      className={`glass-panel rounded-2xl p-4 sm:p-5 flex flex-col justify-between card-hover-effect group/solar cursor-default relative overflow-hidden ${className}`}
      aria-label="Sun Progression Tracker"
    >
      {/* Background solar gradient aura */}
      <div
        className="absolute -top-12 -right-12 w-36 h-36 bg-[#FFD166]/10 rounded-full blur-2xl pointer-events-none transition-opacity duration-500 group-hover/solar:opacity-100 opacity-60"
        aria-hidden="true"
      />

      {/* Header: Title, Solar Icon & Day Length */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-white/5 border border-white/10 text-[#FFD166] transition-transform duration-300 group-hover/solar:rotate-45">
            {isDaylight ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-[#AAB8C9]" />}
          </div>
          <div>
            <span className="font-semibold uppercase tracking-wider text-[11px] text-[#AAB8C9] group-hover/solar:text-[#FFD166] transition-colors block">
              Solar Cycle
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#AAB8C9] font-medium bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
          <Clock className="w-3 h-3 text-[#65B8F4]" />
          <span>{dayLengthStr}</span>
        </div>
      </div>

      {/* Visual Sun Progression Bar Track */}
      <div className="my-3 space-y-2 relative z-10">
        {/* Track Container with Sun Marker */}
        <div className="relative w-full h-3 rounded-full bg-white/10 p-0.5 overflow-visible">
          {/* Active Fill Gradient */}
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FFD166] via-[#65B8F4] to-[#FF965A] transition-all duration-700 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          />

          {/* Interactive Sun Marker Positioned on the Track */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-700 ease-out pointer-events-auto"
            style={{ left: `${Math.max(2, Math.min(98, progress))}%` }}
            title={`Sun Position: ${Math.round(progress)}% of daylight elapsed`}
          >
            <div className="relative group/marker">
              {/* Pulsing Sun Aura */}
              <div className="absolute -inset-1.5 bg-[#FFD166]/40 rounded-full blur-[3px] animate-pulse" />

              {/* Glowing Sun Orb */}
              <div className="relative w-5 h-5 rounded-full bg-gradient-to-br from-[#FFF4CC] via-[#FFD166] to-[#FF965A] border-2 border-[#101B2D] shadow-md shadow-[#FFD166]/50 flex items-center justify-center transition-transform duration-300 group-hover/marker:scale-125">
                <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
              </div>

              {/* Hover percentage indicator */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 rounded-md bg-[#101B2D]/95 border border-[#FFD166]/40 text-[10px] font-bold text-[#FFD166] whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none shadow-lg">
                {Math.round(progress)}%
              </div>
            </div>
          </div>
        </div>

        {/* Sunrise and Sunset Markers below the track */}
        <div className="flex items-center justify-between text-xs pt-1">
          {/* Sunrise Details */}
          <div className="flex items-center gap-1.5 text-left">
            <div className="p-1 rounded-md bg-white/5 border border-white/10 text-[#FFD166]">
              <Sunrise className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="block text-[10px] text-[#AAB8C9]/80 uppercase font-medium">Sunrise</span>
              <span className="font-bold text-[#F5F8FC] tabular-nums font-mono text-xs sm:text-sm">
                {sunriseFormatted}
              </span>
            </div>
          </div>

          {/* Sunset Details */}
          <div className="flex items-center gap-1.5 text-right">
            <div>
              <span className="block text-[10px] text-[#AAB8C9]/80 uppercase font-medium">Sunset</span>
              <span className="font-bold text-[#F5F8FC] tabular-nums font-mono text-xs sm:text-sm">
                {sunsetFormatted}
              </span>
            </div>
            <div className="p-1 rounded-md bg-white/5 border border-white/10 text-[#FF965A]">
              <Sunset className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Solar Status Footer */}
      <div className="mt-1 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-[#AAB8C9] relative z-10">
        <span className="font-medium text-[#F5F8FC]/90 truncate">
          {statusText}
        </span>
        <span className="text-[#FFD166] font-semibold tabular-nums shrink-0 ml-2">
          {isDaylight ? `${Math.round(progress)}% passed` : progress === 100 ? 'Night cycle' : 'Pre-dawn'}
        </span>
      </div>
    </div>
  );
};
