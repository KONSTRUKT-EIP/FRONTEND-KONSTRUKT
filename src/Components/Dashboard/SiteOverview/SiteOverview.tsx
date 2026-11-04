import React from 'react';
import {
  CalendarDays,
  ExternalLink,
  FileText,
  HardHat,
  MapPin,
  Package,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { getWeatherIconByCode } from '../../../utils/weatherIcons';
import type { SiteDetails, SiteWeather } from '../../../services/siteService';
import { getSiteSchedule } from '../../../utils/siteStatus';

interface SiteOverviewProps {
  site: SiteDetails;
  photoUrl: string | null;
  weather: SiteWeather | null;
  weatherError: boolean;
  // null tant que les statistiques d'équipe ne sont pas chargées
  totalEmployees: number | null;
  presents: number;
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

const formatBudget = (value: string) =>
  Number(value).toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  });

const InfoCard: React.FC<{ icon: LucideIcon; title: string; children: React.ReactNode }> = ({
  icon: Icon,
  title,
  children,
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-2 min-w-0">
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
      <Icon className="w-4 h-4" aria-hidden="true" />
      {title}
    </div>
    {children}
  </div>
);

const SiteOverview: React.FC<SiteOverviewProps> = ({
  site,
  photoUrl,
  weather,
  weatherError,
  totalEmployees,
  presents,
}) => {
  const fullAddress = [site.address, `${site.postalCode} ${site.city}`.trim()]
    .filter(Boolean)
    .join(', ');
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  const schedule = getSiteSchedule(site.startDate, site.endDate);
  const today = weather?.daily[0];
  const WeatherIcon = getWeatherIconByCode(weather?.current.weatherCode ?? 1);

  return (
    <section className="flex flex-col gap-4" aria-label="Informations du chantier">
      {/* Bannière */}
      <div className="relative min-h-28 flex items-end rounded-2xl overflow-hidden shadow-sm bg-gradient-to-r from-indigo-600 to-indigo-400">
        {photoUrl && (
          <img src={photoUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />

        <div className="relative w-full px-6 py-4 flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-white tracking-tight truncate">{site.name}</h1>
            <p className="text-white/90 text-sm mt-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
              {fullAddress}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {site._count && (
              <>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 backdrop-blur-sm text-white text-sm font-medium">
                  <Package className="w-4 h-4" aria-hidden="true" /> {site._count.deliveries} livraison{site._count.deliveries > 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 backdrop-blur-sm text-white text-sm font-medium">
                  <FileText className="w-4 h-4" aria-hidden="true" /> {site._count.documents} document{site._count.documents > 1 ? 's' : ''}
                </span>
              </>
            )}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-gray-800 text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              Itinéraire <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      {/* Cartes clés */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <InfoCard icon={CalendarDays} title="Planning">
          <p className="text-base font-bold text-gray-900">
            {formatDate(site.startDate)} → {site.endDate ? formatDate(site.endDate) : '—'}
          </p>
          {schedule.percentage !== null && (
            <div className="w-full bg-gray-200 rounded-full h-2" aria-hidden="true">
              <div
                className="h-2 rounded-full bg-indigo-500"
                style={{ width: `${schedule.percentage}%`, transition: 'width 0.6s ease' }}
              />
            </div>
          )}
          <p className="text-sm text-gray-600">{schedule.label}</p>
        </InfoCard>

        <InfoCard icon={Wallet} title="Budget">
          <p className="text-2xl font-bold text-gray-900">{formatBudget(site.budget)}</p>
          {site.organization && (
            <p className="text-sm text-gray-600 truncate">Organisation : {site.organization.name}</p>
          )}
        </InfoCard>

        <InfoCard icon={HardHat} title="Équipe">
          {totalEmployees === null ? (
            <p className="text-sm text-gray-500">Chargement…</p>
          ) : (
            <>
              <p className="text-2xl font-bold text-gray-900">
                {totalEmployees} <span className="text-base font-semibold text-gray-600">employé{totalEmployees > 1 ? 's' : ''}</span>
              </p>
              <p className="text-sm text-gray-600">
                {presents} présent{presents > 1 ? 's' : ''} sur le dernier pointage
              </p>
            </>
          )}
        </InfoCard>

        <InfoCard icon={WeatherIcon} title={`Météo · ${site.city}`}>
          {weather ? (
            <>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(weather.current.temperature)}°C
              </p>
              <p className="text-sm text-gray-600 truncate">
                {weather.current.weatherDescription}
                {today &&
                  ` · ${Math.round(today.temperatureMin)}° / ${Math.round(today.temperatureMax)}° · pluie ${today.precipitationProbability}%`}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-500">
              {weatherError ? 'Météo indisponible pour le moment' : 'Chargement…'}
            </p>
          )}
        </InfoCard>
      </div>
    </section>
  );
};

export default SiteOverview;
