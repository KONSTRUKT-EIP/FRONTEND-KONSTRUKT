import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { Link } from 'react-router-dom';
import StatCard from '../../Components/StatCard/StatCard';
import ActivityItem from '../../Components/ActivityItem/ActivityItem';

/* ─── Types météo ─── */
interface WeatherCurrent {
  temperature: number | null;
  weatherDescription: string;
  feelsLike: number | null;
  humidity: number | null;
  windSpeed: number | null;
}

/* ─── Hook météo ─── */
function useWeather(city: string) {
  const [data, setData]       = useState<WeatherCurrent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch(`http://localhost:3000/weather/forecast?city=${encodeURIComponent(city)}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { if (mounted) { setData(d.current); setLoading(false); } })
      .catch(() => { if (mounted) { setError(true); setLoading(false); } });
    return () => { mounted = false; };
  }, [city]);

  return { data, loading, error };
}

function weatherIcon(desc: string): string {
  const d = desc?.toLowerCase() ?? '';
  if (d.includes('pluie') || d.includes('averse') || d.includes('bruine')) return '🌧';
  if (d.includes('orage')) return '⛈';
  if (d.includes('neige')) return '❄';
  if (d.includes('brouillard') || d.includes('brume')) return '🌫';
  if (d.includes('nuage') || d.includes('nuageux') || d.includes('couvert')) return '☁';
  if (d.includes('soleil') || d.includes('ensoleillé') || d.includes('dégagé') || d.includes('clair')) return '☀';
  return '🌤';
}

const WeatherWidget: React.FC = () => {
  const { data, loading, error } = useWeather('Paris');

  if (loading) return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center justify-center min-h-[160px]">
      <span className="text-gray-400 text-sm">Chargement météo…</span>
    </div>
  );

  if (error || !data) return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center justify-center min-h-[160px]">
      <span className="text-gray-400 text-sm">Météo indisponible</span>
    </div>
  );

  return (
    <Link to="/weather" className="group bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:border-orange-200 transition-all duration-200 flex flex-col justify-between h-full">
      <div className="flex items-start justify-between">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em]">Météo · Paris</p>
        <span className="text-4xl">{weatherIcon(data.weatherDescription)}</span>
      </div>
      <div>
        <span className="text-5xl font-extrabold text-gray-900 leading-none">{data.temperature ?? '–'}°</span>
        <p className="text-base font-medium text-gray-500 capitalize mt-1">{data.weatherDescription}</p>
      </div>
      <div className="flex justify-between text-sm text-gray-500 border-t border-gray-100 pt-3">
        <div><p className="text-xs text-gray-400">Ressenti</p><p className="font-bold text-gray-700">{data.feelsLike ?? '–'}°</p></div>
        <div><p className="text-xs text-gray-400">Humidité</p><p className="font-bold text-gray-700">{data.humidity ?? '–'} %</p></div>
        <div><p className="text-xs text-gray-400">Vent</p><p className="font-bold text-gray-700">{data.windSpeed ?? '–'} km/h</p></div>
      </div>
    </Link>
  );
};

const features = [
  { title: 'Suivi de chantiers',           desc: 'Centralisez vos chantiers, suivez leur avancement et coordonnez vos équipes en temps réel.' },
  { title: 'Commandes & approvisionnement', desc: 'Gérez vos commandes de matériaux, suivez les livraisons et anticipez les ruptures.' },
  { title: 'Alertes météo',                desc: 'Recevez des alertes ciblées par chantier pour protéger vos équipes et anticiper les arrêts.' },
  { title: 'Planning collaboratif',         desc: 'Planifiez les interventions, affectez les ressources, visualisez les plannings en un clic.' },
  { title: 'Suivi des présences',           desc: 'Enregistrez présences, absences et congés de chaque employé depuis n\'importe où.' },
  { title: 'Tableaux de bord',             desc: 'Des statistiques claires pour piloter vos projets et prendre les bonnes décisions.' },
];

const stats = [
  { value: '2 500+',  label: 'Chantiers gérés' },
  { value: '12 000+', label: 'Utilisateurs actifs' },
  { value: '98 %',    label: 'Taux de satisfaction' },
  { value: '40 h',    label: 'Économisées / mois' },
];

const HomePage: React.FC = () => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    const today = new Date();
    const hour = today.getHours();
    const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';
    const dateStr = today.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    return (
      <main className="min-h-screen bg-gray-100">
        <section className="bg-orange-500 px-20 py-14 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-base font-bold uppercase tracking-[0.2em] mb-2">KONSTRUKT</p>
              <h1 className="text-5xl font-extrabold mb-2">{greeting}</h1>
              <p className="text-orange-100 text-lg capitalize">{dateStr}</p>
            </div>
            <Link to="/dashboard" className="hidden sm:inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-lg font-semibold px-8 py-4 rounded-xl transition">
              Voir mes chantiers →
            </Link>
          </div>
        </section>

        <section className="px-20 py-12 space-y-8">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
            <div className="lg:col-span-2">
              <WeatherWidget />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Chantiers actifs',   value: '6',  color: 'text-orange-500' },
                { label: 'Employés présents',  value: '24', color: 'text-green-500' },
                { label: 'Commandes en cours', value: '3',  color: 'text-blue-500' },
                { label: 'Alertes météo',      value: '1',  color: 'text-yellow-500' },
              ].map(({ label, value, color }) => (
                <StatCard key={label} label={label} value={value} color={color} />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-base font-bold text-gray-400 uppercase tracking-[0.15em]">Chantiers récents</p>
              <Link to="/dashboard" className="text-base text-orange-500 font-semibold hover:underline">Voir tout →</Link>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-100">
              {[
                { name: 'Tour Horizon',        location: 'Paris 15e',   progress: 72, status: 'En cours' },
                { name: 'Résidence Les Pins',  location: 'Lyon',        progress: 45, status: 'En cours' },
                { name: 'Pont Sud',            location: 'Bordeaux',    progress: 60, status: 'En cours' },
              ].map(({ name, location, progress, status }) => (
                <Link to="/dashboard" key={name} className="flex items-center gap-5 px-6 py-5 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-bold text-gray-800 truncate">{name}</p>
                    <p className="text-base text-gray-400">{location}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-40 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-400 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-base font-bold text-gray-500 w-12 text-right">{progress}%</span>
                  </div>
                  <span className="text-base font-semibold text-green-600 bg-green-50 px-4 py-2 rounded-full shrink-0">{status}</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-base font-bold text-gray-400 uppercase tracking-[0.15em] mb-4">Activité récente</p>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-100">
              {[
                { text: 'Nouvelle commande de béton — Tour Horizon',         time: 'Il y a 12 min',  dot: 'bg-blue-400' },
                { text: 'Alerte vent fort prévue demain sur Pont Sud',        time: 'Il y a 1 h',    dot: 'bg-yellow-400' },
                { text: 'Arrora Gaur marqué présent — Résidence Les Pins',   time: 'Il y a 2 h',    dot: 'bg-green-400' },
                { text: 'Avancement mis à jour : Électricité 30%',            time: 'Il y a 3 h',    dot: 'bg-orange-400' },
              ].map(({ text, time, dot }) => (
                <ActivityItem key={text} text={text} time={time} dot={dot} />
              ))}
            </div>
          </div>

        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">

      <section className="bg-gray-100 px-20 pt-24 pb-28 border-b border-gray-200">
        <div className="text-center">
          <span className="inline-block px-5 py-2 rounded-full bg-orange-100 text-orange-600 text-base font-bold uppercase tracking-[0.15em] mb-12">
            Plateforme de gestion BTP
          </span>
          <h1 className="text-7xl sm:text-8xl font-extrabold leading-[1.1] tracking-tight text-gray-900 mb-10">
            Gérez tous vos chantiers<br />
            <span className="text-orange-500">depuis un seul endroit</span>
          </h1>
          <p className="text-2xl text-gray-500 max-w-3xl mx-auto mb-14 leading-relaxed">
            KONSTRUKT simplifie la gestion de vos chantiers, commandes, équipes et plannings pour que vous puissiez vous concentrer sur l&apos;essentiel.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              to="/signup"
              className="px-12 py-5 bg-orange-500 text-white rounded-xl font-bold text-xl hover:bg-orange-600 transition-all shadow-md shadow-orange-200"
            >
              Démarrer gratuitement
            </Link>
            <Link
              to="/pricing"
              className="px-12 py-5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-xl hover:bg-gray-200 transition border border-gray-200"
            >
              Voir les tarifs
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-orange-500 px-20 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 text-center">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p className="text-5xl font-extrabold text-white mb-3">{value}</p>
              <p className="text-orange-100 text-lg">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-20 py-32 bg-gray-100">
        <div>
          <div className="text-center mb-20">
            <span className="text-orange-500 text-base font-bold uppercase tracking-[0.2em]">Fonctionnalités</span>
            <h2 className="text-5xl font-extrabold text-gray-900 mt-5 mb-5">Tout ce dont vous avez besoin</h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-xl">
              Une suite d&apos;outils pensés pour les professionnels du BTP, accessibles depuis n&apos;importe quel appareil.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(({ title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 hover:shadow-md hover:border-orange-200 transition-all duration-200"
              >
                <div className="w-12 h-2 rounded-full bg-orange-400 mb-7" />
                <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
                <p className="text-gray-400 text-lg leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;

