import { useState, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import ChantierCard from "../../Components/Dashboard/JobsitCard/JobsitCard";
import React from 'react';

export interface Chantier {
  id: string;
  name: string;
  location: string;
  responsible: string;
  photo?: string;
}

interface SiteApi {
  id: string | number;
  name: string;
  city?: string;
  postalCode?: string;
  address?: string;
  responsible?: string;
  manager?: string;
}

export default function JobsitList() {
  const navigate = useNavigate();
  const [chantiers, setChantiers] = useState<Chantier[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:3000/sites', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.status === 200) {
          const mapped: Chantier[] = (Array.isArray(data) ? data : data.sites ?? []).map((s: SiteApi) => ({
            id: String(s.id),
            name: s.name,
            location: s.city ? `${s.city}${s.postalCode ? ', ' + s.postalCode : ''}` : (s.address ?? ''),
            responsible: s.responsible ?? s.manager ?? '',
          }));
          setChantiers(mapped);
        } else {
          setFetchError(data.message || 'Impossible de charger les chantiers.');
        }
      } catch {
        setFetchError('Erreur réseau. Veuillez réessayer.');
      } finally {
        setFetchLoading(false);
      }
    };
    fetchSites();
  }, []);

  const handlePhotoChange = (id: string, url: string) => {
    setChantiers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, photo: url } : c))
    );
  };

  return (
    <main className="min-h-screen bg-gray-100" role="main" aria-label="Liste des chantiers">
      {/* Banner */}
      <div className="w-full bg-gradient-to-r from-indigo-600 to-indigo-400 px-8 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-indigo-200 text-xs font-medium uppercase tracking-widest mb-1">
            Konstrukt
          </p>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Mes Chantiers
          </h1>
          <p className="text-indigo-200 text-sm mt-1">
            {chantiers.length} chantiers actifs
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="w-full px-20 py-8">
        {fetchLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-sm">Chargement des chantiers…</p>
          </div>
        ) : fetchError ? (
          <div className="flex flex-col items-center justify-center py-24 text-red-400">
            <span className="text-5xl mb-4">⚠️</span>
            <p className="text-lg font-semibold">{fetchError}</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-7">
            <Suspense fallback={<div>Chargement...</div>}>
              {chantiers.map((chantier) => (
                <ChantierCard
                  key={chantier.id}
                  {...chantier}
                  onPhotoChange={handlePhotoChange}
                  onClick={() => navigate(`/dashboard/${chantier.id}`)}
                />
              ))}
            </Suspense>
          </div>
        )}
      </div>
    </main>
  );
}