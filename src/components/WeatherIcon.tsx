import React from 'react';
import {
  Sun,
  SunDim,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  Snowflake,
  CloudLightning,
  Moon,
  CloudMoon,
} from 'lucide-react';
import { getWeatherInfo } from '../utils/weatherCodes';

interface WeatherIconProps {
  code: number;
  isDay?: number;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  code,
  isDay = 1,
  className = '',
  size = 28,
}) => {
  const info = getWeatherInfo(code, isDay);

  const iconProps = {
    size,
    className,
    'aria-hidden': true,
  };

  switch (info.iconName) {
    case 'Sun':
      return <Sun {...iconProps} className={`text-[#FFD166] ${className}`} />;
    case 'SunDim':
      return <SunDim {...iconProps} className={`text-[#FFD166] ${className}`} />;
    case 'CloudSun':
      return <CloudSun {...iconProps} className={`text-[#FFD166] ${className}`} />;
    case 'Cloud':
      return <Cloud {...iconProps} className={`text-[#AAB8C9] ${className}`} />;
    case 'CloudFog':
      return <CloudFog {...iconProps} className={`text-[#AAB8C9] ${className}`} />;
    case 'CloudDrizzle':
      return <CloudDrizzle {...iconProps} className={`text-[#65B8F4] ${className}`} />;
    case 'CloudRain':
      return <CloudRain {...iconProps} className={`text-[#65B8F4] ${className}`} />;
    case 'Snowflake':
      return <Snowflake {...iconProps} className={`text-[#F5F8FC] ${className}`} />;
    case 'CloudLightning':
      return <CloudLightning {...iconProps} className={`text-[#FF965A] ${className}`} />;
    case 'Moon':
      return <Moon {...iconProps} className={`text-[#AAB8C9] ${className}`} />;
    case 'CloudMoon':
      return <CloudMoon {...iconProps} className={`text-[#AAB8C9] ${className}`} />;
    default:
      return <Sun {...iconProps} className={`text-[#FFD166] ${className}`} />;
  }
};
