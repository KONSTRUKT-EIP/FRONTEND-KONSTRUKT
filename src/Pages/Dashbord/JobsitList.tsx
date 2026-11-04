import { useState, useEffect, Suspense } from "react";
import { TriangleAlert } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import ChantierCard from "../../Components/Dashboard/JobsitCard/JobsitCard";
import React from 'react';
import { useSitePhotos } from "../../hooks/useSitePhotos";
import type { SiteStatus } from "../../services/siteService";
import SiteListToolbar, { filterAndSortSites, SiteSortKey } from "../../Components/Dashboard/SiteListToolbar/SiteListToolbar";

export interface Chantier {
  id: string;
  name: string;
  location: string;
  status?: SiteStatus;
  startDate?: string;
  endDate?: string | null;
  progressPct?: number | null;
  hasPhoto?: boolean;
  photoVersion?: string;
}

interface SiteApi {
  id: string | number;
  name: string;
  city?: string;
  postalCode?: string;
  address?: string;
  status?: SiteStatus;
  startDate?: string;
  endDate?: string | null;
  progressPct?: number | null;
  photo?: { updatedAt: string } | null;
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
            status: s.status,
            startDate: s.startDate,
            endDate: s.endDate,
            progressPct: s.progressPct ?? null,
            hasPhoto: Boolean(s.photo),
            photoVersion: s.photo?.updatedAt,
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

  const { photos, uploading, uploadPhoto } = useSitePhotos(chantiers);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SiteSortKey>("name-asc");
  const visibleChantiers = filterAndSortSites(chantiers, search, sortKey);

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
      <div className="w-full px-20 py-8 flex flex-col gap-6">
        {!fetchLoading && !fetchError && (
          <SiteListToolbar
            search={search}
            onSearchChange={setSearch}
            sortKey={sortKey}
            onSortChange={setSortKey}
            resultCount={visibleChantiers.length}
          />
        )}
        {fetchLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-sm">Chargement des chantiers…</p>
          </div>
        ) : fetchError ? (
          <div className="flex flex-col items-center justify-center py-24 text-red-400">
            <TriangleAlert className="w-12 h-12 mb-4" strokeWidth={1.5} aria-hidden="true" />
            <p className="text-lg font-semibold">{fetchError}</p>
          </div>
        ) : visibleChantiers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <p className="text-lg font-semibold">Aucun chantier trouvé</p>
            <p className="text-sm mt-1">Essayez un autre nom ou une autre ville.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            <Suspense fallback={<div>Chargement...</div>}>
              {visibleChantiers.map((chantier) => (
                <ChantierCard
                  key={chantier.id}
                  {...chantier}
                  photo={photos[chantier.id]}
                  photoUploading={uploading[chantier.id]}
                  onPhotoChange={uploadPhoto}
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