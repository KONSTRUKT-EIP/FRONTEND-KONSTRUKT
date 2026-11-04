import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  CalendarDays,
  ChartColumn,
  CloudSun,
  Package,
  UserCheck,
  type LucideIcon,
} from 'lucide-react';

const features: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Building2,
    title: 'Suivi de chantiers',
    desc: 'Centralisez vos chantiers, suivez leur avancement et coordonnez vos équipes en temps réel.',
  },
  {
    icon: Package,
    title: 'Commandes & approvisionnement',
    desc: 'Gérez vos commandes de matériaux, suivez les livraisons et anticipez les ruptures.',
  },
  {
    icon: CloudSun,
    title: 'Alertes météo',
    desc: 'Recevez des alertes ciblées par chantier pour protéger vos équipes et anticiper les arrêts.',
  },
  {
    icon: CalendarDays,
    title: 'Planning collaboratif',
    desc: 'Planifiez les interventions, affectez les ressources, visualisez les plannings en un clic.',
  },
  {
    icon: UserCheck,
    title: 'Suivi des présences',
    desc: "Enregistrez présences, absences, congés et heures de chaque employé depuis n'importe où.",
  },
  {
    icon: ChartColumn,
    title: 'Tableaux de bord',
    desc: 'Comparez le prévisionnel et le réel de chaque lot pour piloter vos projets et décider vite.',
  },
];

const marketingStats = [
  { value: '2 500+', label: 'Chantiers gérés' },
  { value: '12 000+', label: 'Utilisateurs actifs' },
  { value: '98 %', label: 'Taux de satisfaction' },
  { value: '40 h', label: 'Économisées / mois' },
];

const LandingPage: React.FC = () => (
  <main className="min-h-screen bg-gray-100 overflow-x-hidden">
    {/* Accroche */}
    <section className="relative overflow-hidden px-4 sm:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
      <div
        className="absolute -z-10 top-0 right-0 w-[36rem] h-[36rem] rounded-full bg-orange-200/40 blur-3xl translate-x-1/3 -translate-y-1/3"
        aria-hidden="true"
      />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white ring-1 ring-orange-200 text-orange-700 text-sm font-semibold shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" aria-hidden="true" />
            Plateforme de gestion BTP
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-[1.1] tracking-tight text-gray-900">
            Gérez tous vos chantiers <span className="text-orange-500">depuis un seul endroit</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            KONSTRUKT simplifie la gestion de vos chantiers, commandes, équipes et plannings pour que vous puissiez
            vous concentrer sur l'essentiel.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/25"
            >
              Démarrer gratuitement <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white text-gray-800 font-semibold ring-1 ring-gray-200 hover:bg-gray-50 transition-colors"
            >
              Voir les tarifs
            </Link>
          </div>
        </div>

        {/* Aperçu de l'application (illustration) */}
        <div className="relative" aria-hidden="true">
          <div className="rounded-2xl bg-white ring-1 ring-gray-200 shadow-2xl shadow-gray-300/50 overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-100 bg-gray-50">
              <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-300" />
              <span className="ml-3 h-2 w-40 rounded-full bg-gray-200" />
            </div>
            <div className="p-5 grid gap-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Chantiers', value: '12', className: 'bg-orange-50 text-orange-600', icon: Building2 },
                  { label: 'Commandes', value: '48', className: 'bg-violet-50 text-violet-600', icon: Package },
                  { label: 'Présents', value: '86 %', className: 'bg-green-50 text-green-600', icon: UserCheck },
                ].map(({ label, value, className, icon: Icon }) => (
                  <div key={label} className="rounded-xl ring-1 ring-gray-100 p-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${className}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <p className="mt-2 text-xl font-bold text-gray-900">{value}</p>
                    <p className="text-[11px] text-gray-500">{label}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl ring-1 ring-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-700">Prévu vs réel</p>
                  <span className="text-[11px] font-semibold text-red-600">+4,2 %</span>
                </div>
                <div className="mt-3 flex items-end gap-2 h-24">
                  {[45, 62, 38, 70, 55, 82, 64].map((height, i) => (
                    <div key={i} className="flex-1 flex items-end gap-0.5 h-full">
                      <div className="flex-1 rounded-t bg-violet-200" style={{ height: `${height}%` }} />
                      <div className="flex-1 rounded-t bg-violet-600" style={{ height: `${Math.min(100, height + (i % 3) * 6 - 3)}%` }} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                {[
                  { name: 'Résidence Les Amandiers', status: 'En cours', className: 'bg-green-100 text-green-700', progress: 64 },
                  { name: 'Hall Logistique Nord', status: 'Planifié', className: 'bg-sky-100 text-sky-700', progress: 18 },
                ].map((site) => (
                  <div key={site.name} className="flex items-center gap-3 rounded-xl ring-1 ring-gray-100 px-3 py-2.5">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-50 to-orange-50 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-indigo-300" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">{site.name}</p>
                      <div className="mt-1.5 h-1 rounded-full bg-gray-100">
                        <div className="h-1 rounded-full bg-orange-400" style={{ width: `${site.progress}%` }} />
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${site.className}`}>{site.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Carte flottante */}
          <div className="hidden sm:flex absolute -left-8 -bottom-6 items-center gap-3 rounded-2xl bg-white ring-1 ring-gray-200 shadow-xl px-4 py-3">
            <span className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CloudSun className="w-5 h-5" />
            </span>
            <div>
              <p className="text-xs font-semibold text-gray-900">Alerte météo</p>
              <p className="text-[11px] text-gray-500">Vent fort demain · Lille</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Chiffres */}
    <section className="px-4 sm:px-8">
      <div className="max-w-7xl mx-auto theme-keep rounded-3xl bg-gray-900 px-6 py-10 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {marketingStats.map(({ value, label }) => (
          <div key={label}>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">{value}</p>
            <p className="mt-1 text-sm text-gray-400">{label}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Fonctionnalités */}
    <section className="px-4 sm:px-8 py-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-semibold text-orange-600">Fonctionnalités</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900">Tout ce dont vous avez besoin</h2>
          <p className="mt-4 text-lg text-gray-600">
            Une suite d'outils pensés pour les professionnels du BTP, accessibles depuis n'importe quel appareil.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group bg-white rounded-2xl ring-1 ring-gray-200/70 p-7 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-200/60 transition-all duration-200"
            >
              <span className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <Icon className="w-5 h-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-gray-900">{title}</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Appel à l'action */}
    <section className="px-4 sm:px-8 pb-24">
      <div className="relative overflow-hidden max-w-7xl mx-auto rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 px-6 py-14 text-center">
        <div className="pointer-events-none absolute -right-20 -top-20 w-72 h-72 rounded-full bg-white/15 blur-2xl" aria-hidden="true" />
        <h2 className="text-3xl font-extrabold text-white">Prêt à simplifier vos chantiers ?</h2>
        <p className="mt-3 text-orange-100 text-lg">Créez votre compte et ajoutez votre premier chantier en quelques minutes.</p>
        <Link
          to="/signup"
          className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-orange-600 font-semibold text-lg hover:bg-orange-50 transition-colors"
        >
          Créer mon compte <ArrowRight className="w-5 h-5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  </main>
);

export default LandingPage;
