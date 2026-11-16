import React, { useEffect, useState } from 'react';
import {
  invitationService,
  Invitation,
  InvitationSite,
  InvitationStatus,
} from '../../services/invitationService';

const roleLabels: Record<string, string> = {
  CHEF_PROJET: 'Chef de projet',
  CONDUCTEUR_TRAVAUX: 'Conducteur de travaux',
  COLLABORATEUR: 'Collaborateur',
  CLIENT: 'Client',
};

const statusLabels: Record<InvitationStatus, string> = {
  PENDING: 'En préparation',
  SENT: 'Envoyée',
  EXPIRED: 'Expirée',
  ACCEPTED: 'Acceptée',
  CANCELLED: 'Annulée',
};

const statusStyles: Record<InvitationStatus, string> = {
  PENDING: 'bg-slate-100 text-slate-700',
  SENT: 'bg-blue-100 text-blue-700',
  EXPIRED: 'bg-amber-100 text-amber-800',
  ACCEPTED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

function formatDate(value: string | null) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function InvitationAdministration() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [sites, setSites] = useState<InvitationSite[]>([]);
  const [email, setEmail] = useState('');
  const [siteId, setSiteId] = useState('');
  const [role, setRole] = useState('COLLABORATEUR');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeAction, setActiveAction] = useState('');

  const loadInvitations = async () => {
    setLoading(true);
    setError('');
    try {
      setInvitations(await invitationService.list());
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Impossible de charger les invitations.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void Promise.all([invitationService.list(), invitationService.sites()])
        .then(([loadedInvitations, loadedSites]) => {
          setInvitations(loadedInvitations);
          setSites(loadedSites);
          setSiteId((currentSiteId) => currentSiteId || loadedSites[0]?.id || '');
        })
        .catch((loadError: unknown) => {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Impossible de charger les invitations.',
          );
        })
        .finally(() => setLoading(false));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!siteId) {
      setActionError('Sélectionnez un chantier avant d’envoyer l’invitation.');
      return;
    }

    setCreating(true);
    setActionError('');
    setSuccessMessage('');
    try {
      await invitationService.create(siteId, email, role);
      setEmail('');
      setSuccessMessage('Invitation envoyée avec succès.');
      await loadInvitations();
    } catch (createError) {
      setActionError(
        createError instanceof Error
          ? createError.message
          : 'Impossible d’envoyer l’invitation.',
      );
    } finally {
      setCreating(false);
    }
  };

  const runAction = async (id: string, action: 'resend' | 'cancel') => {
    if (action === 'cancel' && !window.confirm('Annuler cette invitation ?')) {
      return;
    }

    setActiveAction(`${action}:${id}`);
    setActionError('');
    try {
      if (action === 'resend') {
        await invitationService.resend(id);
      } else {
        await invitationService.cancel(id);
      }
      await loadInvitations();
    } catch (actionErrorValue) {
      setActionError(
        actionErrorValue instanceof Error
          ? actionErrorValue.message
          : 'Action impossible.',
      );
    } finally {
      setActiveAction('');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-700">
              Administration
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">Invitations</h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Suivez les invitations de votre organisation et relancez les parcours d’onboarding en attente.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadInvitations()}
            disabled={loading}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-400 hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Actualiser
          </button>
        </header>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800" role="alert">
            {error}
          </div>
        )}
        {actionError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800" role="alert">
            {actionError}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800" role="status">
            {successMessage}
          </div>
        )}

        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-950">Inviter un collaborateur</h2>
            <p className="mt-1 text-sm text-slate-500">Un email d’activation sera envoyé à cette adresse.</p>
          </div>
          <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-end">
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Adresse e-mail
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="collaborateur@entreprise.fr"
                className="rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Chantier
              <select
                required
                value={siteId}
                onChange={(event) => setSiteId(event.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              >
                <option value="">Sélectionner</option>
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>{site.name}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Rôle
              <select
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              >
                <option value="COLLABORATEUR">Collaborateur</option>
                <option value="CHEF_PROJET">Chef de projet</option>
                <option value="CONDUCTEUR_TRAVAUX">Conducteur de travaux</option>
                <option value="CLIENT">Client</option>
              </select>
            </label>
            <button
              type="submit"
              disabled={creating || loading || sites.length === 0}
              className="rounded-lg bg-orange-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating ? 'Envoi...' : 'Inviter'}
            </button>
          </form>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-label="Liste des invitations">
          {loading ? (
            <p className="px-6 py-12 text-center text-slate-500">Chargement des invitations...</p>
          ) : invitations.length === 0 ? (
            <p className="px-6 py-12 text-center text-slate-500">Aucune invitation dans cette organisation.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Invité</th>
                    <th className="px-6 py-4 font-semibold">Chantier</th>
                    <th className="px-6 py-4 font-semibold">Rôle</th>
                    <th className="px-6 py-4 font-semibold">Statut</th>
                    <th className="px-6 py-4 font-semibold">Expiration</th>
                    <th className="px-6 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invitations.map((invitation) => {
                    const canResend = !['ACCEPTED', 'CANCELLED'].includes(invitation.status);
                    const canCancel = !['ACCEPTED', 'CANCELLED'].includes(invitation.status);
                    return (
                      <tr key={invitation.id} className="align-top hover:bg-slate-50">
                        <td className="whitespace-nowrap px-6 py-5">
                          <p className="font-semibold text-slate-900">{invitation.email}</p>
                          <p className="mt-1 text-xs text-slate-500">Créée le {formatDate(invitation.createdAt)}</p>
                        </td>
                        <td className="px-6 py-5 text-slate-700">
                          <p className="font-medium">{invitation.site.name}</p>
                          <p className="mt-1 text-xs text-slate-500">{invitation.site.city}</p>
                        </td>
                        <td className="whitespace-nowrap px-6 py-5 text-slate-700">
                          {roleLabels[invitation.role] ?? invitation.role}
                        </td>
                        <td className="whitespace-nowrap px-6 py-5">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[invitation.status]}`}>
                            {statusLabels[invitation.status]}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-5 text-slate-600">
                          {formatDate(invitation.expiresAt)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-5">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              disabled={!canResend || Boolean(activeAction)}
                              onClick={() => void runAction(invitation.id, 'resend')}
                              className="rounded-md border border-orange-200 px-3 py-2 text-xs font-semibold text-orange-700 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {activeAction === `resend:${invitation.id}` ? 'Envoi...' : 'Renvoyer'}
                            </button>
                            <button
                              type="button"
                              disabled={!canCancel || Boolean(activeAction)}
                              onClick={() => void runAction(invitation.id, 'cancel')}
                              className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {activeAction === `cancel:${invitation.id}` ? 'Annulation...' : 'Annuler'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
