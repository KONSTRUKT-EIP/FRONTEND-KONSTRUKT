import { useNavigate, useParams } from "react-router-dom";
import DashboardCard from "../../Components/Dashboard/DashbordCard/DashbordCard";
import React, { useEffect, useState } from 'react';
import { teamService, TeamStats } from '../../services/teamService';
import { getSiteUUID } from '../../utils/siteMapping';

const dashboards = [
  { id: "armature",   label: "Armature",    description: "Voiles, planchers, poutres", progress: 72 },
  { id: "beton",      label: "Béton",       description: "Coulage, dosage, résistance", progress: 45 },
  { id: "charpente",  label: "Charpente",   description: "Structure bois et métal",    progress: 60 },
  { id: "electricite",label: "Électricité", description: "Câblage, tableaux, prises",  progress: 30 },
  { id: "plomberie",  label: "Plomberie",   description: "Réseaux eau, évacuations",   progress: 55 },
  { id: "finitions",  label: "Finitions",   description: "Peinture, revêtements",      progress: 10 },
];

const chantierNames: Record<string, string> = {
  "1": "Tour Horizon",
  "2": "Résidence Les Pins",
  "3": "Pont Sud",
  "4": "Centre Commercial",
  "5": "Immeuble Lumière",
  "6": "Stade Municipal",
};

const StatCircle: React.FC<{ percentage: number; color: string; label: string; sublabel?: string }> = ({ percentage, color, label, sublabel }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  return (
        <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg width="96" height="96" className="-rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="10" />
          <circle
            cx="48" cy="48" r={radius} fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-900">{percentage}%</span>
        </div>
      </div>
          <span className="text-sm font-semibold text-gray-900 text-center">{label}</span>
      {sublabel && <span className="text-xs text-gray-900 text-center font-semibold">{sublabel}</span>}
    </div>
  );
};

export default function JobsiteHub() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const chantierName = chantierNames[id ?? ""] ?? "Chantier";
  
  const [stats, setStats] = useState<TeamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const siteUUID = getSiteUUID(id);
      if (!siteUUID) {
        setError("ID de chantier invalide");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await teamService.getTeamStats(siteUUID);
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des statistiques:', err);
        setError("Impossible de charger les statistiques");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [id]);

  // Valeurs par défaut si pas de données
  const total = stats?.total ?? 0;
  const complete = stats?.complete ?? 0;
  const enCours = stats?.enCours ?? 0;
  const enAttente = stats?.enAttente ?? 0;
  const annule = stats?.annule ?? 0;
  const pctPresents = stats?.pctPresents ?? 0;
  const pctAbsents = stats?.pctAbsents ?? 0;
  const pctComplete = stats?.pctComplete ?? 0;
  const pctEnCours = stats?.pctEnCours ?? 0;

  return (
    <main className="min-h-screen bg-gray-100 p-8" role="main">
      {/* Header */}
      <div className="mb-8">
        <nav className="mb-3 flex items-center gap-2 text-sm" aria-label="Breadcrumb">
          <span>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
            >
              Tous les chantiers
            </button>
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-semibold">{chantierName}</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{chantierName}</h1>
        <p className="text-sm text-gray-700 mt-1">Sélectionne un dashboard</p>
      </div>

      <div className="flex gap-8 items-start">
        <div className="flex flex-col gap-3 max-w-2xl w-full flex-shrink-0">
          {dashboards.map((db) => (
            <DashboardCard
              key={db.id}
              {...db}
              onClick={() => navigate(`/dashboard/${id}/${db.id}`)}
            />
          ))}
        </div>

          <div className="flex-1 min-w-0 bg-white rounded-2xl shadow p-6 border border-gray-200 flex flex-col gap-6">
          <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Statistiques / {chantierName}</h2>
            <button
              onClick={() => navigate(`/dashboard/${id}/equipe`)}
              title="Voir le tableau des effectifs"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors shadow-sm hover:shadow"
            >
              <span>Voir l&apos;équipe</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>

          {/* Loading & Error States */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Chargement des statistiques...</div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-8">
              <div className="text-red-500">{error}</div>
            </div>
          )}

          {!loading && !error && (
          <>
          {/* Donut circles */}
          <div className="flex flex-wrap justify-around gap-6 py-2">
            <StatCircle
              percentage={pctPresents}
              color="#10b981"
              label="Présents"
              sublabel={`${complete + enCours} / ${total} travailleurs`}
            />
            <StatCircle
              percentage={pctAbsents}
              color="#f43f5e"
              label="Absents"
              sublabel={`${enAttente + annule} / ${total} travailleurs`}
            />
            <StatCircle
              percentage={pctComplete}
              color="#6366f1"
              label="Tâches complètes"
              sublabel={`${complete} / ${total}`}
            />
            <StatCircle
              percentage={pctEnCours}
              color="#f97316"
              label="En cours"
              sublabel={`${enCours} / ${total}`}
            />
          </div>

          {/* Summary bars */}
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-widest">Résumé des statuts</h3>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Complet',    count: complete,  color: 'bg-indigo-500' },
                { label: 'En cours',   count: enCours,   color: 'bg-orange-400' },
                { label: 'En attente', count: enAttente, color: 'bg-gray-700'   },
                { label: 'Annulé',     count: annule,    color: 'bg-red-400'    },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.color}`}></span>
                  <span className="text-sm text-gray-900 w-24 flex-shrink-0">{item.label}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${Math.round((item.count / total) * 100)}%`, transition: 'width 0.6s ease' }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">{item.count} / {total}</span>
                </div>
              ))}
            </div>
          </div>
          </>
          )}
        </div>
      </div>
    </main>
  );
}