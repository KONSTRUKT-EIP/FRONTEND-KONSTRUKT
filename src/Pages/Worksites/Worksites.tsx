import React, { useState, useEffect } from 'react';
import { Building2, TriangleAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChantierCard from '../../Components/Dashboard/JobsitCard/JobsitCard';
import type { Chantier } from '../Dashbord/JobsitList';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import type { SiteStatus } from '../../services/siteService';
import SiteListToolbar, { filterAndSortSites, SiteSortKey } from '../../Components/Dashboard/SiteListToolbar/SiteListToolbar';

const ORGANIZATION_ID = '00000000-0000-0000-0000-000000000001';

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

const emptyForm = {
  name: '',
  address: '',
  city: '',
  postalCode: '',
  startDate: '',
  endDate: '',
  status: 'EN_COURS',
  budget: '',
};

const Worksites: React.FC = () => {
  const navigate = useNavigate();
  const [chantiers, setChantiers] = useState<Chantier[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SiteSortKey>('name-asc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/sites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxYzcwOTA3Mi00ODM2LTRkYzgtYjI1NS00ZGFiMjdkNjUzYmMiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzMwNjgxNTgsImV4cCI6MTc3NTY2MDE1OH0.6P-DXvMKYt0PgIanstybrysrJtZaO1LJJmm6G_vW1xk',
        },
        body: JSON.stringify({
          organizationId: ORGANIZATION_ID,
          name: form.name.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          postalCode: form.postalCode.trim(),
          startDate: form.startDate,
          endDate: form.endDate,
          status: form.status,
          budget: Number(form.budget),
        }),
      });
      const data = await response.json();
      if (response.status === 201) {
        const newChantier: Chantier = {
          id: String(data.id ?? Date.now()),
          name: data.name ?? form.name,
          location: `${form.city}, ${form.postalCode}`,
          status: data.status,
          startDate: data.startDate,
          endDate: data.endDate,
          progressPct: null,
        };
        setChantiers(prev => [...prev, newChantier]);
        setForm(emptyForm);
        setShowModal(false);
      } else {
        setError(data.message || 'Création échouée.');
      }
    } catch {
      setError('Erreur réseau. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = filterAndSortSites(chantiers, search, sortKey);

  return (
    <main className="min-h-screen bg-gray-100">

      {/* Banner */}
      <div className="w-full bg-orange-700 px-20 py-12">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-200 text-xs font-extrabold uppercase tracking-widest mb-1">Konstrukt</p>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Mes Chantiers</h1>
            <p className="text-orange-200 text-sm mt-1">{chantiers.length} chantier{chantiers.length > 1 ? 's' : ''} actif{chantiers.length > 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold text-base px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:bg-orange-50 transition-all duration-200"
          >
            <span className="text-xl">+</span> Créer un chantier
          </button>
        </div>
      </div>

      {/* Recherche et tri */}
      <div className="px-20 pt-8 pb-2">
        <SiteListToolbar
          search={search}
          onSearchChange={setSearch}
          sortKey={sortKey}
          onSortChange={setSortKey}
          resultCount={filtered.length}
        />
      </div>

      {/* Grid */}
      <div className="px-20 py-6">
        {fetchLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-sm">Chargement des chantiers…</p>
          </div>
        ) : fetchError ? (
          <div className="flex flex-col items-center justify-center py-24 text-red-400">
            <TriangleAlert className="w-12 h-12 mb-4" strokeWidth={1.5} aria-hidden="true" />
            <p className="text-lg font-semibold">{fetchError}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Building2 className="w-14 h-14 mb-4" strokeWidth={1.5} aria-hidden="true" />
            <p className="text-lg font-semibold">Aucun chantier trouvé</p>
            <p className="text-sm mt-1">Essayez un autre terme ou créez un nouveau chantier.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {filtered.map(chantier => (
              <ChantierCard
                key={chantier.id}
                {...chantier}
                photo={photos[chantier.id]}
                photoUploading={uploading[chantier.id]}
                onPhotoChange={uploadPhoto}
                onClick={() => navigate(`/dashboard/${chantier.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal création */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold text-gray-900">Nouveau chantier</h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition text-xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nom du chantier</label>
                <input
                  type="text"
                  placeholder="Ex : Tour Horizon"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Adresse</label>
                <input
                  type="text"
                  placeholder="Ex : 12 rue de la Paix"
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Ville</label>
                  <input
                    type="text"
                    placeholder="Ex : Paris"
                    value={form.city}
                    onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Code postal</label>
                  <input
                    type="text"
                    placeholder="Ex : 75012"
                    value={form.postalCode}
                    onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Date de début</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Date de fin</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Statut</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                  >
                    <option value="EN_COURS">En cours</option>
                    <option value="PLANIFIE">Planifié</option>
                    <option value="TERMINE">Terminé</option>
                    <option value="SUSPENDU">Suspendu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Budget (€)</label>
                  <input
                    type="number"
                    placeholder="Ex : 500000"
                    value={form.budget}
                    onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setError(null); }}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white text-sm font-bold transition shadow"
                >
                  {loading ? 'Création…' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Worksites;
