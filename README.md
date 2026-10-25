# SKYORA — Global Weather

> *Weather, wherever life takes you.*

SKYORA is a modern, responsive web application delivering real-time meteorological conditions, hourly forecasts, and extended 7-day outlooks for cities across Pakistan and worldwide. Powered by Open-Meteo's open APIs, SKYORA pairs live atmospheric data with dynamic visual themes tailored to current conditions.

---

## Features

### 1. Global City Search & Current Weather
- **Worldwide & Regional Geocoding**: Search for cities across Pakistan (Islamabad, Lahore, Karachi, Faisalabad, Rawalpindi, Peshawar, Quetta, Multan, Gilgit, Skardu, Murree, etc.) and major international hubs (London, New York, Tokyo, Dubai, Istanbul, Toronto, Sydney, Paris, Riyadh, etc.).
- **Smart Autocomplete**: Dropdown suggestions with administrative divisions and country codes to resolve cities sharing identical names.
- **Keyboard Navigation**: Full keyboard accessibility (`↑` / `↓` to highlight, `Enter` to select, `Esc` to close).
- **Timezone-Aware Timestamps**: Displays the current local time and date for the selected city regardless of the visitor's device timezone.
- **State Persistence**: Remembers your last searched location in local storage for instant retrieval across sessions.

### 2. 24-Hour Forecast
- Real-time 24-hour meteorological outlook with local hourly timestamps.
- Weather condition icons adapted for day and night.
- Precipitation probability indicators.
- Smooth horizontal scrolling with desktop navigation controls and active current-hour highlighting.

### 3. 7-Day Forecast
- Day-by-day temperature trends with condition summaries.
- Proportional temperature-range bars dynamically mapped to the week's high and low extremes.
- Expandable daily details providing sunrise, sunset, precipitation chance, and peak UV index metrics.

### 4. Weather Insights & Telemetry
- **Humidity**: Relative humidity with atmospheric comfort indicators.
- **Wind**: Speed and compass bearing with dynamic pointer rotation.
- **Atmospheric Pressure**: Barometric pressure measured in hPa.
- **Visibility**: Horizon clarity in kilometers or miles.
- **UV Index**: Daily solar radiation index with safety classification.
- **Solar Cycle**: Local sunrise and sunset timings.

### 5. Temperature & Measurement Unit Switching
- One-click toggle between Celsius (`°C`) and Fahrenheit (`°F`).
- Client-side unit conversion without redundant network queries.
- Synchronized metric-to-imperial conversions for wind speed (`km/h` vs `mph`) and visibility (`km` vs `mi`).

### 6. Dynamic Atmospheric Visuals
- Adaptive backdrop layers responding to current weather:
  - **Clear Sky**: Golden solar illumination (day) or midnight starfield (night).
  - **Cloudy / Partly Cloudy**: Soft drifting cloud formations.
  - **Rain & Drizzle**: Restrained falling rain streaks.
  - **Thunderstorms**: Low-contrast atmospheric illumination.
  - **Snow**: Drifting crystalline particle effects.
  - **Fog / Mist**: Diffused horizontal mist layers.
- Respects `prefers-reduced-motion` settings.

---

## Tech Stack

- **Framework**: React 19 (TypeScript)
- **Bundler & Dev Server**: Vite
- **Styling**: Tailwind CSS v4 with custom glassmorphism utilities
- **Icons**: Lucide React
- **Data Provider**: [Open-Meteo API](https://open-meteo.com) (Weather Forecast & Geocoding APIs, no private API key required)

---

## Project Structure

```text
├── index.html                   # Entry HTML with custom typography and metadata
├── package.json                 # Project dependencies and build scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite build configuration
└── src/
    ├── main.tsx                 # React application root
    ├── App.tsx                  # Core dashboard layout and state orchestration
    ├── index.css                # Base Tailwind styles and keyframe animations
    ├── types/
    │   └── weather.ts           # TypeScript interfaces for API schemas and telemetry
    ├── services/
    │   └── weatherApi.ts        # Geocoding and Open-Meteo forecast service
    ├── utils/
    │   ├── dateTime.ts          # Timezone-aware date and time formatting
    │   ├── units.ts             # Temperature, wind, and visibility conversion utilities
    │   └── weatherCodes.ts      # WMO weather code mappings, icons, and summary generator
    └── components/
        ├── Header.tsx           # Navigation bar with branding and unit toggles
        ├── LocationSearch.tsx   # Search bar with autocomplete and keyboard support
        ├── CurrentWeather.tsx   # Hero current weather panel
        ├── HourlyForecast.tsx   # 24-hour horizontal forecast strip
        ├── WeeklyForecast.tsx   # 7-day forecast with proportional range bars
        ├── WeatherInsights.tsx  # Telemetry cards for humidity, wind, UV, pressure, etc.
        ├── WeatherIcon.tsx      # Condition icon renderer
        ├── AtmosphericBackground.tsx # Dynamic atmospheric ambient visual canvas
        ├── LoadingSkeleton.tsx  # Layout-preserving skeleton loaders
        └── ErrorState.tsx       # Error view with retry and preset city options
```

---

## Getting Started

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm or yarn

### Installation

1. Clone or download the repository:
   ```bash
   git clone <repository-url>
   cd skyora
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser.

### Building for Production

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

To run type checking and linting:

```bash
npm run lint
```

---

## License

This project is licensed under the Apache 2.0 License.
