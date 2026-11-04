import { createElement } from 'react';
import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Snowflake,
  Sun,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react';

// Codes météo WMO (Open-Meteo) → icône
export const getWeatherIconByCode = (code: number): LucideIcon => {
  if (code === 0) return Sun;
  if (code <= 2) return CloudSun;
  if (code === 3) return Cloud;
  if (code <= 48) return CloudFog;
  if (code <= 67) return CloudRain;
  if (code <= 77) return Snowflake;
  if (code <= 82) return CloudRain;
  return CloudLightning;
};

// Description en français (ex. « Pluie modérée ») → icône
export const getWeatherIconByDescription = (description?: string): LucideIcon => {
  const d = description?.toLowerCase() ?? '';
  if (d.includes('orage')) return CloudLightning;
  if (d.includes('pluie') || d.includes('averse') || d.includes('bruine')) return CloudRain;
  if (d.includes('neige')) return Snowflake;
  if (d.includes('brouillard') || d.includes('brume')) return CloudFog;
  if (d.includes('nuage') || d.includes('couvert')) return Cloud;
  if (d.includes('soleil') || d.includes('dégagé') || d.includes('clair')) return Sun;
  return CloudSun;
};

// Icône météo à partir d'un code WMO ou d'une description
export const WeatherIcon = ({
  code,
  description,
  ...props
}: LucideProps & { code?: number; description?: string }) =>
  createElement(
    code !== undefined ? getWeatherIconByCode(code) : getWeatherIconByDescription(description),
    props,
  );
