export interface LocationData {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  country_code: string;
  timezone: string;
  elevation?: number;
  population?: number;
}

export interface CurrentWeather {
  time: string;
  temperature: number; // in °C
  apparentTemperature: number; // in °C
  relativeHumidity: number; // %
  isDay: number; // 1 = day, 0 = night
  weatherCode: number;
  windSpeed: number; // km/h
  windDirection: number; // degrees
  surfacePressure: number; // hPa
  precipitation: number; // mm
  visibility: number; // km
  uvIndex: number;
}

export interface HourlyItem {
  time: string; // ISO string
  hourFormatted: string; // "Now", "4 PM", "5 AM"
  isCurrentHour: boolean;
  temperature: number; // °C
  weatherCode: number;
  precipitationProbability: number; // %
  isDay: number;
}

export interface DailyItem {
  time: string; // "YYYY-MM-DD"
  dayName: string; // "Today", "Mon", "Tue"
  fullDate: string; // "Oct 25"
  weatherCode: number;
  tempMax: number; // °C
  tempMin: number; // °C
  precipitationProbability: number; // %
  sunrise: string; // ISO string
  sunset: string; // ISO string
  uvIndexMax: number;
}

export interface WeatherInsights {
  humidity: number;
  windSpeed: number; // km/h
  windDirection: number;
  windCompass: string;
  pressure: number; // hPa
  visibility: number; // km
  uvIndex: number;
  uvCategory: string;
  sunrise: string; // formatted e.g. "6:24 AM"
  sunset: string; // formatted e.g. "5:45 PM"
}

export interface WeatherData {
  location: LocationData;
  current: CurrentWeather;
  hourly: HourlyItem[]; // 24 hours
  daily: DailyItem[]; // 7 days
  insights: WeatherInsights;
  summary: string;
  lastUpdated: string;
}

export type UnitSystem = 'celsius' | 'fahrenheit';

export type WeatherCategory =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'fog'
  | 'rain'
  | 'thunderstorm'
  | 'snow';

export interface WeatherCodeInfo {
  code: number;
  description: string;
  category: WeatherCategory;
  iconName: string;
}
