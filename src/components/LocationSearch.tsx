import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MapPin, X, Loader2, Globe } from 'lucide-react';
import { LocationData } from '../types/weather';
import { searchCities, POPULAR_CITIES } from '../services/weatherApi';

interface LocationSearchProps {
  currentLocation: LocationData;
  onSelectLocation: (location: LocationData) => void;
  isLoading: boolean;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  currentLocation,
  onSelectLocation,
  isLoading: isWeatherLoading,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const latestQueryRef = useRef('');

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search logic with race condition prevention
  const performSearch = useCallback(async (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    latestQueryRef.current = trimmed;

    if (trimmed.length < 2) {
      setResults([]);
      setIsSearching(false);
      setSearchError(null);
      setHasSearched(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsSearching(true);
    setSearchError(null);

    try {
      const items = await searchCities(trimmed, abortController.signal);
      // Stale check
      if (latestQueryRef.current === trimmed) {
        setResults(items);
        setHasSearched(true);
        setHighlightedIndex(items.length > 0 ? 0 : -1);
      }
    } catch (err: unknown) {
      if ((err as Error)?.name !== 'AbortError') {
        if (latestQueryRef.current === trimmed) {
          setSearchError('Unable to search locations right now. Please try again.');
          setResults([]);
          setHasSearched(true);
        }
      }
    } finally {
      if (latestQueryRef.current === trimmed) {
        setIsSearching(false);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch(query);
      } else {
        setResults([]);
        setHasSearched(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  const handleSelect = (loc: LocationData) => {
    onSelectLocation(loc);
    setQuery('');
    setIsOpen(false);
    setResults([]);
    setHasSearched(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
      return;
    }

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (results.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < results.length) {
          handleSelect(results[highlightedIndex]);
        } else if (results.length > 0) {
          handleSelect(results[0]);
        }
      }
    } else if (e.key === 'Enter' && query.trim().length >= 2) {
      e.preventDefault();
      performSearch(query);
    }
  };

  // Curated quick city shortcuts
  const popularPakistan = POPULAR_CITIES.filter((c) => c.country === 'Pakistan').slice(0, 6);
  const popularWorld = POPULAR_CITIES.filter((c) => c.country !== 'Pakistan').slice(0, 5);

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto z-30">
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-[#AAB8C9] pointer-events-none flex items-center justify-center">
          {isSearching || isWeatherLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-[#65B8F4]" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search cities across Pakistan or worldwide (e.g. Faisalabad, London, Tokyo)..."
          className="w-full pl-11 pr-10 py-3 text-sm md:text-base text-[#F5F8FC] placeholder:text-[#AAB8C9]/70 bg-[#193B5A]/40 hover:bg-[#193B5A]/55 focus:bg-[#193B5A]/80 border border-white/10 hover:border-[#65B8F4]/30 focus:border-[#65B8F4] rounded-2xl shadow-lg backdrop-blur-md outline-none transition-all duration-200"
          aria-label="Search city or location"
          aria-autocomplete="list"
          aria-expanded={isOpen}
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
              setHasSearched(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 p-1.5 text-[#AAB8C9] hover:text-white rounded-full hover:bg-white/15 hover:scale-110 hover:rotate-90 active:scale-90 transition-all duration-200"
            aria-label="Clear search query"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Autocomplete / Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 rounded-2xl glass-dropdown overflow-hidden z-50 transition-all duration-300 max-h-[460px] overflow-y-auto custom-scrollbar animate-fadeIn shadow-2xl border border-[#65B8F4]/25">
          {/* Active Search Results */}
          {query.trim().length >= 2 ? (
            <div>
              {isSearching && results.length === 0 ? (
                <div className="p-6 text-center text-sm text-[#AAB8C9] flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#65B8F4]" />
                  <span>Searching locations across the globe...</span>
                </div>
              ) : searchError ? (
                <div className="p-6 text-center text-sm text-[#FF965A]">
                  <p>{searchError}</p>
                </div>
              ) : hasSearched && results.length === 0 ? (
                <div className="p-6 text-center text-sm text-[#AAB8C9]">
                  <p className="font-medium text-[#F5F8FC]">No locations found for "{query}"</p>
                  <p className="text-xs text-[#AAB8C9] mt-1">
                    Try searching by official city name or check spelling (e.g. Islamabad, Lahore, Dubai).
                  </p>
                </div>
              ) : (
                <div className="py-2">
                  <div className="px-4 py-1.5 text-[11px] font-semibold text-[#65B8F4] uppercase tracking-wider">
                    Search Results ({results.length})
                  </div>
                  <ul role="listbox">
                    {results.map((loc, idx) => {
                      const isSelected = currentLocation.name === loc.name && currentLocation.country === loc.country;
                      const isHighlighted = idx === highlightedIndex;

                      return (
                        <li key={`${loc.id}-${idx}`}>
                          <button
                            type="button"
                            onClick={() => handleSelect(loc)}
                            onMouseEnter={() => setHighlightedIndex(idx)}
                            className={`w-full text-left px-4 py-2.5 flex items-center justify-between text-sm transition-all duration-200 group/loc ${
                              isHighlighted
                                ? 'bg-[#65B8F4]/20 text-[#F5F8FC] pl-5'
                                : 'text-[#AAB8C9] hover:bg-white/5 hover:text-[#F5F8FC] hover:pl-5'
                            }`}
                            role="option"
                            aria-selected={isHighlighted}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <MapPin className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover/loc:scale-125 ${isSelected ? 'text-[#65B8F4]' : 'text-[#AAB8C9] group-hover/loc:text-[#65B8F4]'}`} />
                              <div className="truncate">
                                <span className="font-medium text-[#F5F8FC] mr-2 group-hover/loc:text-[#65B8F4] transition-colors">{loc.name}</span>
                                {loc.admin1 && (
                                  <span className="text-xs text-[#AAB8C9] mr-2">
                                    {loc.admin1} ·
                                  </span>
                                )}
                                <span className="text-xs text-[#65B8F4] font-medium">{loc.country}</span>
                              </div>
                            </div>
                            {isSelected && (
                              <span className="text-[11px] text-[#65B8F4] shrink-0 font-medium ml-2">
                                Active
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            /* Quick City Shortcuts when input is focused or empty */
            <div className="p-4 space-y-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#65B8F4] mb-2 uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Popular in Pakistan</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {popularPakistan.map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => handleSelect(city)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 active:scale-95 hover:-translate-y-0.5 ${
                        currentLocation.name === city.name && currentLocation.country === city.country
                          ? 'bg-[#65B8F4] text-[#101B2D] border-[#65B8F4] font-semibold shadow-md shadow-[#65B8F4]/20'
                          : 'bg-white/5 border-white/10 text-[#F5F8FC] hover:border-[#65B8F4]/50 hover:bg-white/15 hover:shadow-sm'
                      }`}
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#65B8F4] mb-2 uppercase tracking-wider">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Major Global Cities</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {popularWorld.map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => handleSelect(city)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 active:scale-95 hover:-translate-y-0.5 ${
                        currentLocation.name === city.name && currentLocation.country === city.country
                          ? 'bg-[#65B8F4] text-[#101B2D] border-[#65B8F4] font-semibold shadow-md shadow-[#65B8F4]/20'
                          : 'bg-white/5 border-white/10 text-[#F5F8FC] hover:border-[#65B8F4]/50 hover:bg-white/15 hover:shadow-sm'
                      }`}
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
