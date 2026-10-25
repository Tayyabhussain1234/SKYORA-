import { WeatherCategory, WeatherCodeInfo } from '../types/weather';

export const WMO_WEATHER_CODES: Record<number, WeatherCodeInfo> = {
  0: { code: 0, description: 'Clear sky', category: 'clear', iconName: 'Sun' },
  1: { code: 1, description: 'Mainly clear', category: 'clear', iconName: 'SunDim' },
  2: { code: 2, description: 'Partly cloudy', category: 'partly-cloudy', iconName: 'CloudSun' },
  3: { code: 3, description: 'Overcast', category: 'cloudy', iconName: 'Cloud' },
  45: { code: 45, description: 'Foggy', category: 'fog', iconName: 'CloudFog' },
  48: { code: 48, description: 'Depositing rime fog', category: 'fog', iconName: 'CloudFog' },
  51: { code: 51, description: 'Light drizzle', category: 'rain', iconName: 'CloudDrizzle' },
  53: { code: 53, description: 'Moderate drizzle', category: 'rain', iconName: 'CloudDrizzle' },
  55: { code: 55, description: 'Dense drizzle', category: 'rain', iconName: 'CloudDrizzle' },
  56: { code: 56, description: 'Freezing drizzle', category: 'snow', iconName: 'CloudSnow' },
  57: { code: 57, description: 'Dense freezing drizzle', category: 'snow', iconName: 'CloudSnow' },
  61: { code: 61, description: 'Slight rain', category: 'rain', iconName: 'CloudRain' },
  63: { code: 63, description: 'Moderate rain', category: 'rain', iconName: 'CloudRain' },
  65: { code: 65, description: 'Heavy rain', category: 'rain', iconName: 'CloudRain' },
  66: { code: 66, description: 'Light freezing rain', category: 'snow', iconName: 'CloudSnow' },
  67: { code: 67, description: 'Heavy freezing rain', category: 'snow', iconName: 'CloudSnow' },
  71: { code: 71, description: 'Slight snow fall', category: 'snow', iconName: 'Snowflake' },
  73: { code: 73, description: 'Moderate snow fall', category: 'snow', iconName: 'Snowflake' },
  75: { code: 75, description: 'Heavy snow fall', category: 'snow', iconName: 'Snowflake' },
  77: { code: 77, description: 'Snow grains', category: 'snow', iconName: 'Snowflake' },
  80: { code: 80, description: 'Slight rain showers', category: 'rain', iconName: 'CloudRain' },
  81: { code: 81, description: 'Moderate rain showers', category: 'rain', iconName: 'CloudRain' },
  82: { code: 82, description: 'Violent rain showers', category: 'rain', iconName: 'CloudRain' },
  85: { code: 85, description: 'Slight snow showers', category: 'snow', iconName: 'CloudSnow' },
  86: { code: 86, description: 'Heavy snow showers', category: 'snow', iconName: 'CloudSnow' },
  95: { code: 95, description: 'Thunderstorm', category: 'thunderstorm', iconName: 'CloudLightning' },
  96: { code: 96, description: 'Thunderstorm with slight hail', category: 'thunderstorm', iconName: 'CloudLightning' },
  99: { code: 99, description: 'Thunderstorm with heavy hail', category: 'thunderstorm', iconName: 'CloudLightning' },
};

export function getWeatherInfo(code: number, isDay: number = 1): WeatherCodeInfo {
  const info = WMO_WEATHER_CODES[code] || {
    code,
    description: 'Fair',
    category: 'clear' as WeatherCategory,
    iconName: 'Sun',
  };

  // Adjust for night time clear / partly cloudy
  if (!isDay) {
    if (info.category === 'clear') {
      return {
        ...info,
        iconName: 'Moon',
        description: code === 0 ? 'Clear night' : 'Mainly clear night',
      };
    }
    if (info.category === 'partly-cloudy') {
      return {
        ...info,
        iconName: 'CloudMoon',
        description: 'Partly cloudy night',
      };
    }
  }

  return info;
}

export function getWindCompass(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}

export function getUvCategory(uvIndex: number): string {
  if (uvIndex <= 2) return 'Low';
  if (uvIndex <= 5) return 'Moderate';
  if (uvIndex <= 7) return 'High';
  if (uvIndex <= 10) return 'Very High';
  return 'Extreme';
}

export function generateWeatherSummary(
  condition: string,
  temperatureC: number,
  apparentTempC: number,
  windSpeedKmh: number,
  humidity: number,
  isDay: boolean
): string {
  const feelDiff = Math.abs(apparentTempC - temperatureC);
  let feelNote = '';
  if (feelDiff >= 2) {
    if (apparentTempC > temperatureC) {
      feelNote = `feels warmer due to ${humidity}% humidity.`;
    } else {
      feelNote = `feels cooler due to wind.`;
    }
  }

  let windNote = 'calm air';
  if (windSpeedKmh > 30) {
    windNote = 'strong winds';
  } else if (windSpeedKmh > 18) {
    windNote = 'moderate breeze';
  } else if (windSpeedKmh > 8) {
    windNote = 'gentle breeze';
  }

  const period = isDay ? 'Today' : 'Tonight';

  if (feelNote) {
    return `${period} features ${condition.toLowerCase()} with a ${windNote}, and ${feelNote}`;
  }
  return `${period} brings ${condition.toLowerCase()} with ${windNote} and ${humidity}% humidity.`;
}
