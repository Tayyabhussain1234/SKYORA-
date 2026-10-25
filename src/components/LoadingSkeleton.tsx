import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-6 animate-pulse" aria-label="Loading weather data">
      {/* Hero Current Weather Skeleton */}
      <div className="w-full h-72 sm:h-80 rounded-3xl glass-panel p-6 sm:p-8 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="w-32 h-6 bg-white/10 rounded-full" />
          <div className="w-64 h-10 bg-white/10 rounded-xl" />
          <div className="w-48 h-4 bg-white/5 rounded-lg" />
        </div>
        <div className="flex justify-between items-end">
          <div className="w-full max-w-sm h-12 bg-white/5 rounded-lg" />
          <div className="w-32 h-20 bg-white/10 rounded-2xl" />
        </div>
      </div>

      {/* Hourly Forecast Skeleton */}
      <div className="w-full h-44 rounded-3xl glass-panel p-6 flex flex-col justify-between">
        <div className="w-40 h-5 bg-white/10 rounded-lg" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="min-w-[76px] h-24 bg-white/5 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Grid: 7-Day & Insights Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 h-96 rounded-3xl glass-panel p-6 space-y-4">
          <div className="w-36 h-5 bg-white/10 rounded-lg" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-full h-9 bg-white/5 rounded-xl" />
          ))}
        </div>
        <div className="lg:col-span-7 h-96 rounded-3xl glass-panel p-6 space-y-4">
          <div className="w-48 h-5 bg-white/10 rounded-lg" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 bg-white/5 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
