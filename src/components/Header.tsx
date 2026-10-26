import React, { useState, useRef, useEffect } from 'react';
import { CloudSun, RotateCw, AlertTriangle, ShieldCheck, X, ChevronRight } from 'lucide-react';
import { UnitSystem } from '../types/weather';
import { SevereAlert } from './AlertBanner';

interface HeaderProps {
  unit: UnitSystem;
  onToggleUnit: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  activeAlert?: SevereAlert | null;
  cityName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  unit,
  onToggleUnit,
  onRefresh,
  isRefreshing,
  activeAlert,
  cityName,
}) => {
  const [showAlertPopover, setShowAlertPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowAlertPopover(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAlertClick = () => {
    if (activeAlert) {
      const el = document.getElementById('severe-alert-banner');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setShowAlertPopover((prev) => !prev);
      }
    } else {
      setShowAlertPopover((prev) => !prev);
    }
  };

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
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 relative" ref={popoverRef}>
          {/* Weather Alert Icon Button */}
          <div className="relative">
            <button
              type="button"
              onClick={handleAlertClick}
              className={`p-2 rounded-lg border transition-all duration-200 shrink-0 relative group/alert active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65B8F4] ${
                activeAlert
                  ? 'bg-amber-500/20 border-amber-500/50 text-[#FFD166] hover:bg-amber-500/30 shadow-lg shadow-amber-500/20'
                  : 'border-white/10 text-[#AAB8C9] hover:text-[#65B8F4] hover:bg-white/10 hover:border-[#65B8F4]/30'
              }`}
              title={activeAlert ? `Alert: ${activeAlert.title}` : 'Weather Alert Status'}
              aria-label="Weather alert status"
            >
              {activeAlert ? (
                <AlertTriangle className="w-4 h-4 text-[#FFD166] animate-pulse" />
              ) : (
                <AlertTriangle className="w-4 h-4 transition-transform duration-300 group-hover/alert:scale-110" />
              )}

              {/* Pulsing indicator dot when active alert exists */}
              {activeAlert && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF965A] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF965A] border-2 border-[#101B2D]" />
                </span>
              )}
            </button>

            {/* Alert Status Popover */}
            {showAlertPopover && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-dropdown p-4 z-50 animate-fadeIn shadow-2xl border border-white/15">
                <div className="flex items-start justify-between gap-2 pb-2 mb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    {activeAlert ? (
                      <AlertTriangle className="w-4 h-4 text-[#FF965A] shrink-0" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    <span className="text-xs font-bold text-[#F5F8FC]">
                      {activeAlert ? 'Severe Weather Alert' : 'Advisory Status'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAlertPopover(false)}
                    className="p-1 text-[#AAB8C9] hover:text-white rounded-md hover:bg-white/10 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {activeAlert ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#FFD166]">
                        {activeAlert.title}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-white/10 text-white">
                        {activeAlert.level}
                      </span>
                    </div>
                    <p className="text-xs text-[#AAB8C9] leading-relaxed">
                      {activeAlert.description}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAlertPopover(false);
                        document.getElementById('severe-alert-banner')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      className="w-full mt-2 py-1.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-xs font-semibold text-[#FFD166] flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>View Safety Advice</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-[#F5F8FC]">
                      All Clear in {cityName || 'Current Location'}
                    </p>
                    <p className="text-xs text-[#AAB8C9] leading-relaxed">
                      No severe weather advisories or warnings active. Meteorological sensors report normal conditions.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

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
