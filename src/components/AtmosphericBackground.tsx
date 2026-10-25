import React, { useMemo } from 'react';
import { WeatherCategory } from '../types/weather';

interface AtmosphericBackgroundProps {
  category: WeatherCategory;
  isDay: number;
}

export const AtmosphericBackground: React.FC<AtmosphericBackgroundProps> = ({
  category,
  isDay,
}) => {
  // Pre-generate static positions for particles so there's zero re-render layout shift
  const rainDrops = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: `${(i * 4.2 + (i % 3) * 1.5) % 100}%`,
      delay: `${(i * 0.18) % 2.5}s`,
      duration: `${0.9 + ((i % 5) * 0.2)}s`,
      opacity: 0.2 + ((i % 4) * 0.15),
      length: `${14 + (i % 6) * 4}px`,
    }));
  }, []);

  const snowFlakes = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${(i * 5.1 + (i % 4) * 2) % 100}%`,
      delay: `${(i * 0.3) % 4}s`,
      duration: `${3.5 + ((i % 4) * 0.8)}s`,
      size: `${3 + (i % 3) * 2}px`,
      opacity: 0.3 + ((i % 3) * 0.25),
    }));
  }, []);

  const stars = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${(i * 13.7) % 96 + 2}%`,
      top: `${(i * 19.3) % 70 + 2}%`,
      size: `${1 + (i % 3)}px`,
      opacity: 0.25 + ((i % 5) * 0.15),
      delay: `${(i * 0.7) % 3}s`,
    }));
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-colors duration-1000"
      aria-hidden="true"
    >
      {/* Base ambient gradient according to condition */}
      {category === 'clear' && isDay === 1 && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#193B5A] via-[#101B2D] to-[#0D1524]">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#FFD166]/15 blur-3xl" />
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#65B8F4]/10 blur-3xl" />
        </div>
      )}

      {category === 'clear' && isDay === 0 && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1320] via-[#080E18] to-[#04080F]">
          <div className="absolute -top-20 right-20 w-80 h-80 rounded-full bg-[#AAB8C9]/10 blur-3xl" />
          {/* Subtle twinkling stars */}
          {stars.map((s) => (
            <div
              key={s.id}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                left: s.left,
                top: s.top,
                width: s.size,
                height: s.size,
                opacity: s.opacity,
                animationDuration: '3s',
                animationDelay: s.delay,
              }}
            />
          ))}
        </div>
      )}

      {(category === 'partly-cloudy' || category === 'cloudy') && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#182B42] via-[#101B2D] to-[#0A121E]">
          <div className="absolute top-10 left-10 w-[600px] h-72 rounded-full bg-[#65B8F4]/10 blur-3xl opacity-70" />
          <div className="absolute top-40 right-0 w-[500px] h-60 rounded-full bg-[#AAB8C9]/10 blur-3xl opacity-60" />
          {/* Subtle slow drift cloud shape */}
          <div className="absolute top-24 -left-20 w-96 h-36 bg-white/[0.03] rounded-full blur-2xl transform motion-safe:translate-x-12 transition-transform duration-1000" />
        </div>
      )}

      {category === 'rain' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#122338] via-[#0E1A2B] to-[#08101A]">
          <div className="absolute top-0 inset-x-0 h-96 bg-[#65B8F4]/10 blur-3xl" />
          {/* Rain streaks */}
          <div className="absolute inset-0">
            {rainDrops.map((drop) => (
              <div
                key={drop.id}
                className="absolute w-[1px] bg-gradient-to-b from-transparent via-[#65B8F4]/50 to-transparent motion-safe:animate-[rainFall_1.2s_linear_infinite]"
                style={{
                  left: drop.left,
                  top: '-30px',
                  height: drop.length,
                  opacity: drop.opacity,
                  animationDelay: drop.delay,
                  animationDuration: drop.duration,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {category === 'thunderstorm' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0E1724] via-[#090F18] to-[#05080E]">
          <div className="absolute inset-0 bg-[#FF965A]/5 blur-3xl motion-safe:animate-[thunderGlow_8s_ease-in-out_infinite]" />
          <div className="absolute -top-10 inset-x-0 h-64 bg-[#65B8F4]/10 blur-2xl" />
          {/* Rain streaks for storm */}
          <div className="absolute inset-0">
            {rainDrops.slice(0, 16).map((drop) => (
              <div
                key={drop.id}
                className="absolute w-[1px] bg-gradient-to-b from-transparent via-[#65B8F4]/40 to-transparent motion-safe:animate-[rainFall_0.9s_linear_infinite]"
                style={{
                  left: drop.left,
                  top: '-30px',
                  height: drop.length,
                  opacity: drop.opacity,
                  animationDelay: drop.delay,
                  animationDuration: drop.duration,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {category === 'snow' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#14263B] via-[#0F1B2C] to-[#0B1420]">
          <div className="absolute top-0 inset-x-0 h-80 bg-[#F5F8FC]/10 blur-3xl" />
          {/* Snow particles */}
          <div className="absolute inset-0">
            {snowFlakes.map((flake) => (
              <div
                key={flake.id}
                className="absolute rounded-full bg-[#F5F8FC] motion-safe:animate-[snowFall_5s_linear_infinite]"
                style={{
                  left: flake.left,
                  top: '-10px',
                  width: flake.size,
                  height: flake.size,
                  opacity: flake.opacity,
                  animationDelay: flake.delay,
                  animationDuration: flake.duration,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {category === 'fog' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#162333] via-[#101A27] to-[#0C141E]">
          <div className="absolute inset-0 bg-[#AAB8C9]/10 blur-2xl" />
          <div className="absolute top-1/3 inset-x-0 h-64 bg-white/[0.04] blur-3xl transform motion-safe:translate-x-8 transition-transform duration-1000" />
        </div>
      )}

      {/* Subtle fine vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  );
};
