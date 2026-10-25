import { UnitSystem } from '../types/weather';

export function cToF(c: number): number {
  return (c * 9) / 5 + 32;
}

export function formatTemp(
  celsius: number,
  unit: UnitSystem,
  options?: { round?: boolean; includeSymbol?: boolean }
): string {
  const { round = true, includeSymbol = true } = options || {};
  const val = unit === 'fahrenheit' ? cToF(celsius) : celsius;
  const numStr = round ? Math.round(val).toString() : val.toFixed(1);
  return includeSymbol ? `${numStr}°` : numStr;
}

export function formatSpeed(kmh: number, unit: UnitSystem): string {
  if (unit === 'fahrenheit') {
    const mph = kmh * 0.621371;
    return `${Math.round(mph)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function formatVisibility(km: number, unit: UnitSystem): string {
  if (unit === 'fahrenheit') {
    const miles = km * 0.621371;
    return `${miles >= 10 ? Math.round(miles) : miles.toFixed(1)} mi`;
  }
  return `${km >= 10 ? Math.round(km) : km.toFixed(1)} km`;
}

export function formatPressure(hPa: number): string {
  return `${Math.round(hPa)} hPa`;
}
