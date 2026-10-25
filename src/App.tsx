import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LocationData, WeatherData, UnitSystem } from './types/weather';
import { fetchWeatherData, POPULAR_CITIES } from './services/weatherApi';
import { getWeatherInfo } from './utils/weatherCodes';
import { Header } from './components/Header';
import { LocationSearch } from './components/LocationSearch';
import { CurrentWeather } from './components/CurrentWeather';
import { HourlyForecast } from './components/HourlyForecast';
import { WeeklyForecast } from './components/WeeklyForecast';
import { WeatherInsights } from './components/WeatherInsights';
import { AtmosphericBackground } from './components/AtmosphericBackground';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorState } from './components/ErrorState';

const STORAGE_KEY_LOCATION = 'skyora_last_location';
const STORAGE_KEY_UNIT = 'skyora_unit_system';

export default function App() {
  // Load saved location or fallback to Islamabad
  const [selectedLocation, setSelectedLocation] = useState<LocationData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOCATION);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.latitude && parsed.longitude && parsed.name) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return POPULAR_CITIES[0]; // Islamabad, Pakistan
  });

  // Load saved unit or default to Celsius
  const [unit, setUnit] = useState<UnitSystem>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_UNIT);
      if (saved === 'fahrenheit' || saved === 'celsius') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'celsius';
  });

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const loadWeather = useCallback(async (location: LocationData, isRefresh = false) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await fetchWeatherData(location, abortController.signal);
      setWeatherData(data);
      // Persist chosen location in localStorage
      try {
        localStorage.setItem(STORAGE_KEY_LOCATION, JSON.stringify(location));
      } catch {
        // ignore storage errors
      }
    } catch (err: unknown) {
      if ((err as Error)?.name !== 'AbortError') {
        setError(
          (err as Error)?.message || 'Failed to connect to weather data service. Please check your network connection.'
        );
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Fetch when location changes
  useEffect(() => {
    loadWeather(selectedLocation);
  }, [selectedLocation, loadWeather]);

  // Handle location selection
  const handleSelectLocation = (loc: LocationData) => {
    setSelectedLocation(loc);
  };

  // Handle unit toggle
  const handleToggleUnit = () => {
    setUnit((prev) => {
      const next = prev === 'celsius' ? 'fahrenheit' : 'celsius';
      try {
        localStorage.setItem(STORAGE_KEY_UNIT, next);
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Determine current atmospheric category
  const weatherCategory = weatherData
    ? getWeatherInfo(weatherData.current.weatherCode, weatherData.current.isDay).category
    : 'clear';
  const isDay = weatherData ? weatherData.current.isDay : 1;

  return (
    <div className="relative min-h-screen text-[#F5F8FC] flex flex-col font-sans">
      {/* Dynamic atmospheric background adapting to weather condition */}
      <AtmosphericBackground category={weatherCategory} isDay={isDay} />

      {/* Top Navigation Bar */}
      <Header
        unit={unit}
        onToggleUnit={handleToggleUnit}
        onRefresh={() => loadWeather(selectedLocation, true)}
        isRefreshing={isRefreshing}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Feature 1 Header / Location Search Bar */}
        <section aria-label="City Search">
          <LocationSearch
            currentLocation={selectedLocation}
            onSelectLocation={handleSelectLocation}
            isLoading={isLoading}
          />
        </section>

        {/* Content View: Loading, Error, or Dashboard with 4 Main Features */}
        <AnimatePresence mode="wait">
          {isLoading && !weatherData ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <LoadingSkeleton />
            </motion.div>
          ) : error && !weatherData ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ErrorState
                message={error}
                onRetry={() => loadWeather(selectedLocation)}
                onSelectCity={handleSelectLocation}
              />
            </motion.div>
          ) : weatherData ? (
            <motion.div
              key={weatherData.location.name}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 sm:space-y-8"
            >
              {/* FEATURE 1: Current Weather Hero Panel */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
              >
                <CurrentWeather data={weatherData} unit={unit} />
              </motion.div>

              {/* FEATURE 2: 24-Hour Forecast */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <HourlyForecast items={weatherData.hourly} unit={unit} />
              </motion.div>

              {/* FEATURE 3 & FEATURE 4: 7-Day Forecast & Weather Insights */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start"
              >
                {/* FEATURE 3: 7-Day Forecast */}
                <div className="lg:col-span-5 w-full">
                  <WeeklyForecast items={weatherData.daily} unit={unit} />
                </div>

                {/* FEATURE 4: Weather Details & Atmospheric Insights */}
                <div className="lg:col-span-7 w-full">
                  <WeatherInsights insights={weatherData.insights} unit={unit} />
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-6 text-center text-xs text-[#AAB8C9]/70 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} SKYORA. Live meteorological data provided by Open-Meteo.</p>
          <div className="flex items-center gap-4 text-[#AAB8C9]">
            <span>Pakistan & Global Coverage</span>
            <span aria-hidden="true">·</span>
            <span>Accurate Forecasts</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
