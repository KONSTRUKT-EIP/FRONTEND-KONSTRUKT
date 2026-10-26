import React from 'react';
import type { SiteDetails, SiteStatus, SiteWeather } from '../../../services/siteService';

interface SiteOverviewProps {
  site: SiteDetails;
  photoUrl: string | null;
  weather: SiteWeather | null;
  weatherError: boolean;
  // null tant que les statistiques d'équipe ne sont pas chargées
  totalEmployees: number | null;
  presents: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

const statusConfig: Record<SiteStatus, { label: string; className: string }> = {
  PLANIFIE: { label: 'Planifié', className: 'bg-sky-100 text-sky-700' },
  EN_COURS: { label: 'En cours', className: 'bg-green-100 text-green-700' },
  SUSPENDU: { label: 'Suspendu', className: 'bg-amber-100 text-amber-700' },
  TERMINE: { label: 'Terminé', className: 'bg-gray-200 text-gray-700' },
  ANNULE: { label: 'Annulé', className: 'bg-red-100 text-red-700' },
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

const formatBudget = (value: string) =>
  Number(value).toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  });

// Codes météo WMO (Open-Meteo) → icône
const weatherIcon = (code: number) => {
  if (code === 0) return '☀️';
  if (code <= 2) return '🌤️';
  if (code === 3) return '☁️';
  if (code <= 48) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦️';
  return '⛈️';
};

// Avancement du chantier dans le temps, à partir des dates de début et de fin
const getSchedule = (startDate: string, endDate: string | null) => {
  const start = new Date(startDate).getTime();
  const now = Date.now();

  if (now < start) {
    const days = Math.ceil((start - now) / DAY_MS);
    return { percentage: 0, label: `Démarre dans ${days} jour${days > 1 ? 's' : ''}` };
  }
  if (!endDate) {
    const days = Math.floor((now - start) / DAY_MS) + 1;
    return { percentage: null, label: `Jour ${days} · fin non définie` };
  }

  const end = new Date(endDate).getTime();
  const totalDays = Math.max(1, Math.round((end - start) / DAY_MS));
  if (now > end) {
    const late = Math.floor((now - end) / DAY_MS);
    return {
      percentage: 100,
      label: late > 0 ? `Date de fin dépassée de ${late} jour${late > 1 ? 's' : ''}` : 'Date de fin atteinte',
    };
  }

  const elapsed = Math.floor((now - start) / DAY_MS) + 1;
  const remaining = totalDays - elapsed;
  return {
    percentage: Math.round((elapsed / totalDays) * 100),
    label: `Jour ${elapsed} sur ${totalDays} · ${remaining} restant${remaining > 1 ? 's' : ''}`,
  };
};

const InfoCard: React.FC<{ icon: string; title: string; children: React.ReactNode }> = ({
  icon,
  title,
  children,
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-2 min-w-0">
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
      <span aria-hidden="true">{icon}</span>
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
  const status = statusConfig[site.status] ?? statusConfig.EN_COURS;
  const fullAddress = [site.address, `${site.postalCode} ${site.city}`.trim()]
    .filter(Boolean)
    .join(', ');
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  const schedule = getSchedule(site.startDate, site.endDate);
  const today = weather?.daily[0];

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
            <div className="flex items-center gap-3 min-w-0">
              <h1 className="text-2xl font-bold text-white tracking-tight truncate">{site.name}</h1>
              <span
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${status.className}`}
              >
                {status.label}
              </span>
            </div>
            <p className="text-white/90 text-sm mt-1 flex items-center gap-1.5">
              <span aria-hidden="true">📍</span>
              {fullAddress}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {site._count && (
              <>
                <span className="px-3 py-1.5 rounded-lg bg-white/15 backdrop-blur-sm text-white text-sm font-medium">
                  📦 {site._count.deliveries} livraison{site._count.deliveries > 1 ? 's' : ''}
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-white/15 backdrop-blur-sm text-white text-sm font-medium">
                  📄 {site._count.documents} document{site._count.documents > 1 ? 's' : ''}
                </span>
              </>
            )}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-white text-gray-800 text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              Itinéraire ↗
            </a>
          </div>
        </div>
      </div>

      {/* Cartes clés */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <InfoCard icon="📅" title="Planning">
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

        <InfoCard icon="💶" title="Budget">
          <p className="text-2xl font-bold text-gray-900">{formatBudget(site.budget)}</p>
          {site.organization && (
            <p className="text-sm text-gray-600 truncate">Organisation : {site.organization.name}</p>
          )}
        </InfoCard>

        <InfoCard icon="👷" title="Équipe">
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

        <InfoCard icon="🌤️" title={`Météo · ${site.city}`}>
          {weather ? (
            <>
              <p className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span aria-hidden="true">{weatherIcon(weather.current.weatherCode)}</span>
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
