import { LocationData, WeatherData, HourlyItem, DailyItem, WeatherInsights } from '../types/weather';
import { getWeatherInfo, getWindCompass, getUvCategory, generateWeatherSummary } from '../utils/weatherCodes';
import { formatDayLabel, formatHourString, formatTimeFromIso } from '../utils/dateTime';

export const POPULAR_CITIES: LocationData[] = [
  // Pakistan
  { id: 1176615, name: 'Islamabad', country: 'Pakistan', admin1: 'Islamabad', country_code: 'PK', latitude: 33.72148, longitude: 73.04329, timezone: 'Asia/Karachi' },
  { id: 1172451, name: 'Lahore', country: 'Pakistan', admin1: 'Punjab', country_code: 'PK', latitude: 31.558, longitude: 74.3507, timezone: 'Asia/Karachi' },
  { id: 1174872, name: 'Karachi', country: 'Pakistan', admin1: 'Sindh', country_code: 'PK', latitude: 24.8607, longitude: 67.0011, timezone: 'Asia/Karachi' },
  { id: 1179400, name: 'Faisalabad', country: 'Pakistan', admin1: 'Punjab', country_code: 'PK', latitude: 31.4167, longitude: 73.0833, timezone: 'Asia/Karachi' },
  { id: 1166993, name: 'Rawalpindi', country: 'Pakistan', admin1: 'Punjab', country_code: 'PK', latitude: 33.5973, longitude: 73.0479, timezone: 'Asia/Karachi' },
  { id: 1168197, name: 'Peshawar', country: 'Pakistan', admin1: 'Khyber Pakhtunkhwa', country_code: 'PK', latitude: 34.0151, longitude: 71.5249, timezone: 'Asia/Karachi' },
  { id: 1167528, name: 'Quetta', country: 'Pakistan', admin1: 'Balochistan', country_code: 'PK', latitude: 30.1798, longitude: 66.975, timezone: 'Asia/Karachi' },
  { id: 1169825, name: 'Multan', country: 'Pakistan', admin1: 'Punjab', country_code: 'PK', latitude: 30.1575, longitude: 71.5249, timezone: 'Asia/Karachi' },
  { id: 1177656, name: 'Gilgit', country: 'Pakistan', admin1: 'Gilgit-Baltistan', country_code: 'PK', latitude: 35.9221, longitude: 74.3087, timezone: 'Asia/Karachi' },
  { id: 1164303, name: 'Skardu', country: 'Pakistan', admin1: 'Gilgit-Baltistan', country_code: 'PK', latitude: 35.2982, longitude: 75.6338, timezone: 'Asia/Karachi' },
  { id: 1170395, name: 'Murree', country: 'Pakistan', admin1: 'Punjab', country_code: 'PK', latitude: 33.9062, longitude: 73.3903, timezone: 'Asia/Karachi' },
  // Worldwide
  { id: 2643743, name: 'London', country: 'United Kingdom', admin1: 'England', country_code: 'GB', latitude: 51.5085, longitude: -0.1257, timezone: 'Europe/London' },
  { id: 5128581, name: 'New York', country: 'United States', admin1: 'New York', country_code: 'US', latitude: 40.7143, longitude: -74.006, timezone: 'America/New_York' },
  { id: 1850147, name: 'Tokyo', country: 'Japan', admin1: 'Tokyo', country_code: 'JP', latitude: 35.6895, longitude: 139.6917, timezone: 'Asia/Tokyo' },
  { id: 292223, name: 'Dubai', country: 'United Arab Emirates', admin1: 'Dubai', country_code: 'AE', latitude: 25.0772, longitude: 55.3093, timezone: 'Asia/Dubai' },
  { id: 745044, name: 'Istanbul', country: 'Turkey', admin1: 'Istanbul', country_code: 'TR', latitude: 41.0138, longitude: 28.9497, timezone: 'Europe/Istanbul' },
  { id: 6167865, name: 'Toronto', country: 'Canada', admin1: 'Ontario', country_code: 'CA', latitude: 43.7001, longitude: -79.4163, timezone: 'America/Toronto' },
  { id: 2147714, name: 'Sydney', country: 'Australia', admin1: 'New South Wales', country_code: 'AU', latitude: -33.8678, longitude: 151.2073, timezone: 'Australia/Sydney' },
  { id: 1880252, name: 'Singapore', country: 'Singapore', country_code: 'SG', latitude: 1.2897, longitude: 103.8501, timezone: 'Asia/Singapore' },
  { id: 2988507, name: 'Paris', country: 'France', admin1: 'Île-de-France', country_code: 'FR', latitude: 48.8534, longitude: 2.3488, timezone: 'Europe/Paris' },
  { id: 108410, name: 'Riyadh', country: 'Saudi Arabia', admin1: 'Riyadh', country_code: 'SA', latitude: 24.6877, longitude: 46.7219, timezone: 'Asia/Riyadh' },
];

export async function searchCities(query: string, signal?: AbortSignal): Promise<LocationData[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=10&language=en&format=json`;

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Geocoding search failed with status ${response.status}`);
  }

  const data = await response.json();
  if (!data.results || !Array.isArray(data.results)) {
    return [];
  }

  return data.results.map((item: Record<string, unknown>) => ({
    id: Number(item.id),
    name: String(item.name || ''),
    latitude: Number(item.latitude),
    longitude: Number(item.longitude),
    country: String(item.country || ''),
    admin1: item.admin1 ? String(item.admin1) : undefined,
    country_code: String(item.country_code || ''),
    timezone: String(item.timezone || 'auto'),
    elevation: item.elevation !== undefined ? Number(item.elevation) : undefined,
    population: item.population !== undefined ? Number(item.population) : undefined,
  }));
}

export async function fetchWeatherData(location: LocationData, signal?: AbortSignal): Promise<WeatherData> {
  const timezoneParam = location.timezone && location.timezone !== 'auto'
    ? encodeURIComponent(location.timezone)
    : 'auto';

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,precipitation_probability,weather_code,is_day,visibility,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,uv_index_max&timezone=${timezoneParam}&forecast_days=8`;

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Weather service responded with status ${response.status}`);
  }

  const data = await response.json();

  if (!data.current || !data.hourly || !data.daily) {
    throw new Error('Incomplete weather data received from service');
  }

  const currentRaw = data.current;
  const hourlyRaw = data.hourly;
  const dailyRaw = data.daily;

  // Find index of current hour in hourly array
  const currentHourPrefix = currentRaw.time ? currentRaw.time.slice(0, 13) : '';
  let currentHourIndex = 0;

  if (Array.isArray(hourlyRaw.time)) {
    const foundIdx = hourlyRaw.time.findIndex((t: string) => t.startsWith(currentHourPrefix));
    if (foundIdx !== -1) {
      currentHourIndex = foundIdx;
    }
  }

  // Extract visibility in km (Open-Meteo returns meters)
  const rawVisibility = hourlyRaw.visibility?.[currentHourIndex];
  const visibilityKm = typeof rawVisibility === 'number'
    ? Math.round((rawVisibility / 1000) * 10) / 10
    : 10;

  // Extract UV index
  const uvIndexVal = typeof hourlyRaw.uv_index?.[currentHourIndex] === 'number'
    ? Math.round(hourlyRaw.uv_index[currentHourIndex] * 10) / 10
    : (dailyRaw.uv_index_max?.[0] ? Math.round(dailyRaw.uv_index_max[0] * 10) / 10 : 0);

  // Build current weather
  const current = {
    time: currentRaw.time || new Date().toISOString(),
    temperature: currentRaw.temperature_2m ?? 0,
    apparentTemperature: currentRaw.apparent_temperature ?? currentRaw.temperature_2m ?? 0,
    relativeHumidity: currentRaw.relative_humidity_2m ?? 0,
    isDay: currentRaw.is_day ?? 1,
    weatherCode: currentRaw.weather_code ?? 0,
    windSpeed: currentRaw.wind_speed_10m ?? 0,
    windDirection: currentRaw.wind_direction_10m ?? 0,
    surfacePressure: currentRaw.surface_pressure ?? 1013,
    precipitation: currentRaw.precipitation ?? 0,
    visibility: visibilityKm,
    uvIndex: uvIndexVal,
  };

  // Build next 24 hours
  const hourly: HourlyItem[] = [];
  const hoursCount = Math.min(24, (hourlyRaw.time?.length || 0) - currentHourIndex);

  for (let i = 0; i < hoursCount; i++) {
    const idx = currentHourIndex + i;
    const timeIso = hourlyRaw.time[idx];
    const isCurrent = i === 0;
    const hourLabel = isCurrent ? 'Now' : formatHourString(timeIso);

    hourly.push({
      time: timeIso,
      hourFormatted: hourLabel,
      isCurrentHour: isCurrent,
      temperature: hourlyRaw.temperature_2m[idx] ?? 0,
      weatherCode: hourlyRaw.weather_code[idx] ?? 0,
      precipitationProbability: hourlyRaw.precipitation_probability[idx] ?? 0,
      isDay: hourlyRaw.is_day?.[idx] ?? 1,
    });
  }

  // Build 7 days forecast
  const daily: DailyItem[] = [];
  const daysCount = Math.min(7, dailyRaw.time?.length || 0);

  for (let i = 0; i < daysCount; i++) {
    const timeIso = dailyRaw.time[i];
    const { dayName, fullDate } = formatDayLabel(timeIso, i);

    daily.push({
      time: timeIso,
      dayName,
      fullDate,
      weatherCode: dailyRaw.weather_code[i] ?? 0,
      tempMax: dailyRaw.temperature_2m_max[i] ?? 0,
      tempMin: dailyRaw.temperature_2m_min[i] ?? 0,
      precipitationProbability: dailyRaw.precipitation_probability_max?.[i] ?? 0,
      sunrise: dailyRaw.sunrise?.[i] || '',
      sunset: dailyRaw.sunset?.[i] || '',
      uvIndexMax: dailyRaw.uv_index_max?.[i] ?? 0,
    });
  }

  // Build weather insights
  const weatherInfo = getWeatherInfo(current.weatherCode, current.isDay);
  const insights: WeatherInsights = {
    humidity: current.relativeHumidity,
    windSpeed: current.windSpeed,
    windDirection: current.windDirection,
    windCompass: getWindCompass(current.windDirection),
    pressure: current.surfacePressure,
    visibility: visibilityKm,
    uvIndex: uvIndexVal,
    uvCategory: getUvCategory(uvIndexVal),
    sunrise: dailyRaw.sunrise?.[0] ? formatTimeFromIso(dailyRaw.sunrise[0]) : '—',
    sunset: dailyRaw.sunset?.[0] ? formatTimeFromIso(dailyRaw.sunset[0]) : '—',
  };

  const summary = generateWeatherSummary(
    weatherInfo.description,
    current.temperature,
    current.apparentTemperature,
    current.windSpeed,
    current.relativeHumidity,
    Boolean(current.isDay)
  );

  return {
    location,
    current,
    hourly,
    daily,
    insights,
    summary,
    lastUpdated: currentRaw.time ? formatTimeFromIso(currentRaw.time) : 'Just now',
  };
}
