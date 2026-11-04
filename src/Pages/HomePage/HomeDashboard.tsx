import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlarmClock,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CalendarDays,
  ChevronRight,
  CloudRain,
  Droplets,
  MapPin,
  Package,
  TriangleAlert,
  Users,
  Wind,
  type LucideIcon,
} from 'lucide-react';
import { siteService, type SiteListItem, type SiteWeather } from '../../services/siteService';
import { homeService } from '../../services/homeService';
import type { Action, ActionBadge } from '../../Components/Planning/Action/ActionItem';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import { getSiteSchedule, siteStatusBarColor, siteStatusConfig } from '../../utils/siteStatus';
import { WeatherIcon } from '../../utils/weatherIcons';

// Ordre d'affichage des chantiers : les chantiers actifs d'abord
const statusOrder = ['EN_COURS', 'PLANIFIE', 'SUSPENDU', 'TERMINE', 'ANNULE'];

const actionStyles: Record<ActionBadge, { icon: LucideIcon; iconClassName: string; badgeClassName: string }> = {
  'En retard': { icon: AlarmClock, iconClassName: 'text-red-600 bg-red-50', badgeClassName: 'bg-red-100 text-red-700' },
  'À décaler': { icon: CloudRain, iconClassName: 'text-blue-600 bg-blue-50', badgeClassName: 'bg-yellow-100 text-yellow-700' },
  'À risque': { icon: TriangleAlert, iconClassName: 'text-orange-600 bg-orange-50', badgeClassName: 'bg-orange-100 text-orange-700' },
};

/* ─── Indicateur ─── */

const StatCard: React.FC<{
  icon: LucideIcon;
  iconClassName: string;
  label: string;
  value: number | null;
  detail: string;
  to: string;
}> = ({ icon: Icon, iconClassName, label, value, detail, to }) => (
  <Link
    to={to}
    className="group relative bg-white rounded-2xl ring-1 ring-gray-200/70 shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-5 flex flex-col gap-4 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-200/60 transition-all duration-200"
  >
    <div className="flex items-center justify-between">
      <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconClassName}`}>
        <Icon className="w-5 h-5" aria-hidden="true" />
      </span>
      <ArrowUpRight
        className="w-4 h-4 text-gray-300 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-orange-500 transition-all"
        aria-hidden="true"
      />
    </div>
    <div className="min-w-0">
      {value === null ? (
        <div className="h-9 w-14 rounded-md bg-gray-100 animate-pulse" />
      ) : (
        <p className="text-4xl font-bold text-gray-900 tracking-tight leading-none">{value}</p>
      )}
      <p className="mt-2 text-sm font-semibold text-gray-700">{label}</p>
      <p className="text-xs text-gray-500 mt-0.5 truncate">{detail}</p>
    </div>
  </Link>
);

/* ─── Carte d'une section ─── */

const Panel: React.FC<{ title: string; link?: { to: string; label: string }; children: React.ReactNode }> = ({
  title,
  link,
  children,
}) => (
  <section className="bg-white rounded-2xl ring-1 ring-gray-200/70 shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-6 flex flex-col gap-4 min-w-0">
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      {link && (
        <Link to={link.to} className="flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700">
          {link.label} <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      )}
    </div>
    {children}
  </section>
);

const EmptyState: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="py-6 text-center text-sm text-gray-500">{children}</p>
);

/* ─── Page ─── */

const HomeDashboard: React.FC = () => {
  const [sites, setSites] = useState<SiteListItem[] | null>(null);
  const [usersCount, setUsersCount] = useState<number | null>(null);
  const [ordersCount, setOrdersCount] = useState<number | null>(null);
  const [actions, setActions] = useState<Action[] | null>(null);
  const [weather, setWeather] = useState<SiteWeather | null>(null);
  const [weatherError, setWeatherError] = useState(false);

  const sortedSites = (sites ?? [])
    .slice()
    .sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));
  const weatherSite = sortedSites[0];
  const { photos } = useSitePhotos(
    sortedSites.slice(0, 5).map((site) => ({
      id: site.id,
      hasPhoto: Boolean(site.photo),
      photoVersion: site.photo?.updatedAt,
    })),
  );

  // Chaque bloc se charge indépendamment : une erreur n'empêche pas d'afficher le reste
  useEffect(() => {
    let active = true;
    const settle = <T,>(promise: Promise<T>, onSuccess: (value: T) => void, fallback: () => void) =>
      promise
        .then((value) => active && onSuccess(value))
        .catch((err) => {
          console.error('Erreur de chargement du tableau de bord :', err);
          if (active) fallback();
        });

    void settle(siteService.getSites(), setSites, () => setSites([]));
    void settle(homeService.getUsersCount(), setUsersCount, () => setUsersCount(0));
    void settle(homeService.getOrdersCount(), setOrdersCount, () => setOrdersCount(0));
    void settle(homeService.getActions(), setActions, () => setActions([]));

    return () => {
      active = false;
    };
  }, []);

  const weatherSiteId = weatherSite?.id;
  useEffect(() => {
    if (!weatherSiteId) return;
    let active = true;
    siteService
      .getWeather(weatherSiteId)
      .then((data) => active && setWeather(data))
      .catch(() => active && setWeatherError(true));
    return () => {
      active = false;
    };
  }, [weatherSiteId]);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 5 || hour >= 18 ? 'Bonsoir' : hour < 12 ? 'Bonjour' : 'Bon après-midi';
  const dateLabel = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const activeSites = sites?.filter((s) => s.status === 'EN_COURS').length ?? null;
  const plannedSites = sites?.filter((s) => s.status === 'PLANIFIE').length ?? 0;
  const lateActions = actions?.filter((a) => a.badge === 'En retard').length ?? 0;
  const today = weather?.daily[0];

  return (
    <main className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-[120rem] mx-auto flex flex-col gap-6">
      {/* En-tête */}
      <header className="theme-keep relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white px-6 sm:px-8 py-7">
        <div
          className="pointer-events-none absolute -right-24 -top-24 w-80 h-80 rounded-full bg-orange-500/25 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-1/3 -bottom-32 w-72 h-72 rounded-full bg-amber-400/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div className="min-w-0">
            <p className="text-sm font-medium text-orange-300 first-letter:uppercase">{dateLabel}</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-1">{greeting}</h1>
            <p className="text-gray-300 mt-1">Voici l'essentiel de vos chantiers aujourd'hui.</p>
            <div className="flex flex-wrap gap-2 mt-5">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 text-sm font-semibold text-white hover:bg-orange-400 transition-colors"
              >
                Mes chantiers <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                to="/planning"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 ring-1 ring-white/15 text-sm font-semibold text-white hover:bg-white/15 transition-colors"
              >
                <CalendarDays className="w-4 h-4" aria-hidden="true" /> Planning
              </Link>
            </div>
          </div>

          {/* Météo du chantier principal */}
          <Link
            to="/weather"
            className="w-full lg:w-auto lg:min-w-[30rem] rounded-2xl bg-white/[0.07] ring-1 ring-white/10 backdrop-blur px-6 py-5 hover:bg-white/10 transition-colors"
          >
            <p className="text-xs font-medium text-gray-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
              {weatherSite ? `Météo · ${weatherSite.city}` : 'Météo'}
            </p>
            {weather ? (
              <div className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-4">
                <div>
                  <div className="flex items-center gap-3">
                    <WeatherIcon
                      code={weather.current.weatherCode}
                      className="w-12 h-12 text-amber-300 shrink-0"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-4xl font-bold leading-none">{Math.round(weather.current.temperature)}°</p>
                      <p className="text-sm text-gray-300 mt-1">{weather.current.weatherDescription}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-3 text-xs text-gray-300">
                    {today && (
                      <span>
                        {Math.round(today.temperatureMin)}° / {Math.round(today.temperatureMax)}°
                      </span>
                    )}
                    {today && (
                      <span className="flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5" aria-hidden="true" /> {today.precipitationProbability} %
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Wind className="w-3.5 h-3.5" aria-hidden="true" /> {Math.round(weather.current.windSpeed)} km/h
                    </span>
                  </div>
                </div>

                {/* Prévisions des prochains jours */}
                {weather.daily.length > 1 && (
                  <ul className="flex gap-2 sm:border-l sm:border-white/10 sm:pl-6">
                    {weather.daily.slice(1, 4).map((day) => (
                      <li key={day.date} className="w-16 rounded-xl bg-white/[0.06] px-2 py-2 text-center">
                        <p className="text-xs font-medium text-gray-300 capitalize">
                          {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '')}
                        </p>
                        <WeatherIcon
                          code={day.weatherCode}
                          className="w-6 h-6 mx-auto my-1.5 text-amber-300"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                        <p className="text-xs font-semibold">
                          {Math.round(day.temperatureMax)}°
                          <span className="font-normal text-gray-400"> {Math.round(day.temperatureMin)}°</span>
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-400">
                {weatherError || (sites !== null && !weatherSite) ? 'Météo indisponible' : 'Chargement…'}
              </p>
            )}
          </Link>
        </div>
      </header>

      {/* Indicateurs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Building2}
          iconClassName="bg-orange-50 text-orange-600"
          label="Chantiers en cours"
          value={activeSites}
          detail={sites ? `sur ${sites.length} chantiers · ${plannedSites} planifié${plannedSites > 1 ? 's' : ''}` : ' '}
          to="/worksites"
        />
        <StatCard
          icon={Users}
          iconClassName="bg-blue-50 text-blue-600"
          label="Équipe"
          value={usersCount}
          detail="membres de l'organisation"
          to="/dashboard"
        />
        <StatCard
          icon={Package}
          iconClassName="bg-violet-50 text-violet-600"
          label="Commandes"
          value={ordersCount}
          detail="commandes de matériaux passées"
          to="/orders"
        />
        <StatCard
          icon={TriangleAlert}
          iconClassName="bg-red-50 text-red-600"
          label="Actions requises"
          value={actions?.length ?? null}
          detail={actions ? `dont ${lateActions} tâche${lateActions > 1 ? 's' : ''} en retard` : ' '}
          to="/planning"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Chantiers */}
        <div className="xl:col-span-2">
          <Panel title="Mes chantiers" link={{ to: '/dashboard', label: 'Voir tout' }}>
            {sites === null ? (
              <div className="flex flex-col gap-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : sortedSites.length === 0 ? (
              <EmptyState>Aucun chantier pour le moment.</EmptyState>
            ) : (
              <ul className="flex flex-col divide-y divide-gray-100 -my-2">
                {sortedSites.slice(0, 5).map((site) => {
                  const status = siteStatusConfig[site.status] ?? siteStatusConfig.EN_COURS;
                  const schedule = getSiteSchedule(site.startDate, site.endDate);
                  return (
                    <li key={site.id}>
                      <Link
                        to={`/dashboard/${site.id}`}
                        className="group flex items-center gap-4 py-3 -mx-2 px-2 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-50 to-orange-50 ring-1 ring-gray-200/70 shrink-0 flex items-center justify-center">
                          {photos[site.id] ? (
                            <img src={photos[site.id]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Building2 className="w-7 h-7 text-indigo-300" strokeWidth={1.5} aria-hidden="true" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-gray-900 truncate">{site.name}</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${status.className}`}>
                              {status.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> {site.city}
                          </p>
                        </div>
                        <div className="hidden sm:block w-52 shrink-0">
                          {schedule.percentage !== null && (
                            <div className="h-1.5 rounded-full bg-gray-100" aria-hidden="true">
                              <div
                                className={`h-1.5 rounded-full ${siteStatusBarColor[site.status] ?? 'bg-orange-400'}`}
                                style={{ width: `${schedule.percentage}%` }}
                              />
                            </div>
                          )}
                          <p
                            className={`text-xs mt-1.5 truncate ${
                              schedule.overdue && site.status !== 'TERMINE' && site.status !== 'ANNULE'
                                ? 'text-red-600 font-medium'
                                : 'text-gray-500'
                            }`}
                          >
                            {schedule.label}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 transition-colors" aria-hidden="true" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          {/* Actions requises */}
          <Panel title="Actions requises" link={{ to: '/planning', label: 'Planning' }}>
            {actions === null ? (
              <div className="flex flex-col gap-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-12 rounded-xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : actions.length === 0 ? (
              <EmptyState>Aucune action en attente. Tout est à jour.</EmptyState>
            ) : (
              <ul className="flex flex-col gap-3">
                {actions.slice(0, 4).map((action) => {
                  const style = actionStyles[action.badge] ?? actionStyles['À risque'];
                  const Icon = style.icon;
                  return (
                    <li key={action.id} className="flex items-start gap-3">
                      <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${style.iconClassName}`}>
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate" title={action.label}>
                          {action.label}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{action.sublabel}</p>
                      </div>
                      <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${style.badgeClassName}`}>
                        {action.badge}
                      </span>
                    </li>
                  );
                })}
                {actions.length > 4 && (
                  <li className="text-xs text-gray-500">+ {actions.length - 4} autre{actions.length - 4 > 1 ? 's' : ''}</li>
                )}
              </ul>
            )}
          </Panel>
        </div>
      </div>
      </div>
    </main>
  );
};

export default HomeDashboard;
