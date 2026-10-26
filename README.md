# SKYORA — Global Weather

> *Weather, wherever life takes you.*

SKYORA is a modern, responsive meteorological application delivering real-time weather intelligence, interactive hourly and 7-day forecasts, severe weather warning alerts, and solar cycle progression for cities throughout Pakistan and around the world. Powered by live data from Open-Meteo, SKYORA combines meteorological precision with atmospheric, condition-adaptive visual design.

---

## Key Features

### 1. Global City Search & Current Conditions
- **Comprehensive Geocoding Coverage**: Search for cities across Pakistan (*Islamabad, Lahore, Karachi, Faisalabad, Rawalpindi, Peshawar, Quetta, Multan, Gilgit, Skardu, Murree, Hyderabad, Sialkot, etc.*) and international hubs (*London, New York, Tokyo, Dubai, Istanbul, Toronto, Sydney, Paris, Riyadh, Singapore, etc.*).
- **Interactive Autocomplete**: Fast search suggestions indicating city name, state/administrative division, and country name to distinguish identically named locations.
- **Keyboard Navigation**: Full keyboard accessibility (`↑` / `↓` to cycle suggestions, `Enter` to select, `Esc` to close).
- **Timezone-Aware Clocks**: Displays live, ticking date and time in the selected city's local timezone.
- **Persistent State**: Automatically saves your last selected location to local storage.

### 2. Severe Weather Alert Banner (`AlertBanner`)
- **Automated Hazard Detection**: Analyzes live meteorological conditions and upcoming forecasts for hazardous weather events:
  - **Severe Thunderstorms & Hail**: WMO codes 95, 96, and 99.
  - **High Wind & Gale Warnings**: Sustained wind speeds $\ge 42\text{ km/h}$ or $\ge 55\text{ km/h}$.
  - **Heavy Rain & Flash Flood Advisories**: WMO codes 65, 82, or precipitation $\ge 12\text{ mm}$.
  - **Heavy Snowfall & Freezing Rain**: WMO codes 75, 86, and 67.
  - **Extreme Temperature Advisories**: Dangerous heat $\ge 40^\circ\text{C}$ or extreme sub-zero cold $\le -15^\circ\text{C}$.
  - **Solar UV Advisories**: Extreme UV index ratings $\ge 10$.
  - **Approaching Storm Warning**: Predicts convective activity detected in the upcoming 6-hour forecast window.
- **Pulsing Alert Strip**: Color-coded alert badge (*Advisory*, *Warning*, *Severe*) with an ambient pulsing glow.
- **Actionable Precautions Drawer**: Expandable safety guidance with safety tips and a dismiss button.

### 3. Hourly Forecast (Next 24 Hours)
- Real-time hourly progression with local timestamps.
- Day- and night-aware weather condition icons.
- Accurate temperature trends and precipitation probability percentages.
- Smooth horizontal scrolling with desktop chevron navigation controls and active current-hour accentuation.

### 4. 7-Day Extended Forecast
- Complete 7-day meteorological outlook.
- **Dynamic Temperature Range Bars**: Relative high/low bars scaled against the week's minimum and maximum extremes.
- **Expandable Daily Insights**: One-click accordion drawer displaying sunrise, sunset, rain probability, and maximum daily UV index.

### 5. Weather Insights & Telemetry
- **Relative Humidity**: Real-time percentage with atmospheric comfort level analysis.
- **Wind Speed & Bearing**: Wind velocity with dynamic compass needle orientation.
- **Barometric Pressure**: Atmospheric surface pressure in hPa with pressure system classification.
- **Visibility**: Horizon clarity in kilometers or miles with atmospheric haze ratings.
- **UV Index**: Real-time solar ultraviolet radiation index with safety categories (Low to Extreme).

### 6. Visual Sun Progression Component (`SunProgressBar`)
- **Daylight Progression Arc**: Calculates the exact percentage of daylight that has elapsed based on local sunrise and sunset times.
- **Live Sun Orb Marker**: Dynamically positions an illuminated sun indicator along the dawn-to-dusk gradient track.
- **Daylight Phases**: Recognizes pre-dawn, active daylight, golden hour, and post-sunset night cycles.
- **Solar Metrics**: Displays total day length and countdown to upcoming sunrise or sunset.

### 7. Dynamic Atmospheric Visuals
- Adaptive ambient backdrops that reflect the active weather condition:
  - **Clear Sky**: Warm solar aura (day) or midnight starfield (night).
  - **Cloudy / Partly Cloudy**: Soft drifting atmospheric cloud layers.
  - **Rain & Drizzle**: Restrained falling rain streaks.
  - **Thunderstorms**: Distant, low-frequency atmospheric illumination.
  - **Snow**: Gently floating snow particles.
  - **Fog / Mist**: Translucent horizontal mist veil.
- Respects `prefers-reduced-motion` accessibility preferences.

### 8. Celsius / Fahrenheit Unit Conversion
- Instant toggle between Metric (°C, km/h, km) and Imperial (°F, mph, mi).
- 100% client-side conversion without redundant API calls.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 with TypeScript |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS v4 |
| **Motion** | Motion (`motion/react`) |
| **Icons** | Lucide React |
| **Weather APIs** | Open-Meteo Forecast & Geocoding APIs |

---

## Project Structure

```text
├── index.html                   # Entry HTML with typography and metadata
├── package.json                 # Project dependencies and npm scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite bundler configuration
└── src/
    ├── main.tsx                 # React entry point
    ├── App.tsx                  # Dashboard layout, state, and animation orchestration
    ├── index.css                # Tailwind directives, glassmorphic utilities, and keyframes
    ├── types/
    │   └── weather.ts           # Type definitions for weather telemetry and location models
    ├── services/
    │   └── weatherApi.ts        # Open-Meteo API client and response mappers
    ├── utils/
    │   ├── dateTime.ts          # Timezone-aware date, time, and hour formatters
    │   ├── units.ts             # Temperature, speed, pressure, and visibility converters
    │   └── weatherCodes.ts      # WMO weather code dictionary and narrative generator
    └── components/
        ├── Header.tsx           # Brand header with unit toggle and refresh trigger
        ├── LocationSearch.tsx   # Geocoding search input with autocomplete and quick city chips
        ├── AlertBanner.tsx      # Severe weather warning strip with safety advice
        ├── CurrentWeather.tsx   # Hero current weather panel with local live clock
        ├── HourlyForecast.tsx   # 24-hour horizontal forecast strip with desktop controls
        ├── WeeklyForecast.tsx   # 7-day forecast with proportional temperature range bars
        ├── WeatherInsights.tsx  # Telemetry cards for humidity, wind, UV, and pressure
        ├── SunProgressBar.tsx   # Daylight arc tracker with dynamic sun orb marker
        ├── WeatherIcon.tsx      # Weather icon component with day/night awareness
        ├── AtmosphericBackground.tsx # Real-time condition-driven ambient animation canvas
        ├── LoadingSkeleton.tsx  # Layout-preserving shimmer skeletons
        └── ErrorState.tsx       # Network failure view with retry actions and city shortcuts
```

---

## Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd skyora
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

### Production Build

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

### Type Checking & Linting

```bash
npm run lint
```

### Deploying to Vercel

The repository includes a ready-to-deploy `vercel.json` configuration configured specifically for Vite SPAs:

1. Push your code to GitHub, GitLab, or Bitbucket.
2. Import the repository in [Vercel](https://vercel.com).
3. Vercel automatically detects the Vite configuration:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**. All single-page application routes are automatically rewritten to `/index.html`.

---

## Data Source & Attribution

Weather forecasts and geocoding data are provided by [Open-Meteo](https://open-meteo.com/) under the [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) license. No private API keys are required for standard operation.

---

## License

This project is licensed under the Apache 2.0 License.
