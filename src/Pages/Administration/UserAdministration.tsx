import React, { useEffect, useState } from 'react';
import {
  userAdministrationService,
  OrganizationUser,
  UserRole,
  UserSiteAssignment,
} from '../../services/userAdministrationService';

const roleLabels: Record<UserRole, string> = {
  ADMIN: 'Administrateur',
  CHEF_PROJET: 'Chef de projet',
  CONDUCTEUR_TRAVAUX: 'Conducteur de travaux',
  COLLABORATEUR: 'Collaborateur',
  CLIENT: 'Client',
};

const managedRoles: UserRole[] = [
  'ADMIN',
  'CHEF_PROJET',
  'CONDUCTEUR_TRAVAUX',
  'COLLABORATEUR',
  'CLIENT',
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(value));
}

function UserAssignments({
  user,
  onClose,
}: {
  user: OrganizationUser;
  onClose: () => void;
}) {
  const [assignments, setAssignments] = useState<UserSiteAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    void userAdministrationService
      .assignments(user.id)
      .then(setAssignments)
      .catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : 'Impossible de charger les affectations.'))
      .finally(() => setLoading(false));
  }, [user.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4" onClick={onClose}>
      <section className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-700">Affectations chantier</p>
            <h2 className="mt-1 text-xl font-bold text-slate-950">{user.firstName} {user.lastName}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700">Fermer</button>
        </div>
        {loading && <p className="py-10 text-center text-slate-500">Chargement des affectations...</p>}
        {error && <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-red-800" role="alert">{error}</p>}
        {!loading && !error && assignments.length === 0 && <p className="py-10 text-center text-slate-500">Aucune affectation chantier.</p>}
        {!loading && !error && assignments.length > 0 && (
          <div className="mt-6 divide-y divide-slate-100">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <p className="font-semibold text-slate-900">{assignment.site.name}</p>
                  <p className="text-sm text-slate-500">{assignment.site.city} · {roleLabels[assignment.role]}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${assignment.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  {assignment.isActive ? 'Affectation active' : 'Affectation inactive'}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function UserAdministration() {
  const [users, setUsers] = useState<OrganizationUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeAction, setActiveAction] = useState('');
  const [selectedUser, setSelectedUser] = useState<OrganizationUser | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      setUsers((await userAdministrationService.list()).data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Impossible de charger les utilisateurs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void loadUsers(); }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const updateUser = async (user: OrganizationUser, action: 'role' | 'access', value: UserRole | boolean) => {
    const actionId = `${action}:${user.id}`;
    setActiveAction(actionId);
    setError('');
    setSuccess('');
    try {
      const updated = action === 'role'
        ? await userAdministrationService.updateRole(user.id, value as UserRole)
        : await userAdministrationService.updateAccess(user.id, value as boolean);
      setUsers((current) => current.map((item) => item.id === updated.id ? updated : item));
      setSuccess(`${user.firstName} ${user.lastName} a été mis à jour.`);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Action impossible.');
    } finally {
      setActiveAction('');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-700">Administration</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">Utilisateurs</h1>
            <p className="mt-2 max-w-2xl text-slate-600">Gérez les accès et les responsabilités des membres de votre organisation.</p>
          </div>
          <button type="button" onClick={() => void loadUsers()} disabled={loading} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm disabled:opacity-60">Actualiser</button>
        </header>
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800" role="alert">{error}</div>}
        {success && <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800" role="status">{success}</div>}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-label="Membres de l'organisation">
          {loading ? <p className="px-6 py-12 text-center text-slate-500">Chargement des utilisateurs...</p> : users.length === 0 ? <p className="px-6 py-12 text-center text-slate-500">Aucun utilisateur dans cette organisation.</p> : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-6 py-4">Membre</th><th className="px-6 py-4">Rôle</th><th className="px-6 py-4">Accès</th><th className="px-6 py-4">Chantiers</th><th className="px-6 py-4">Depuis</th><th className="px-6 py-4">Actions</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => {
                    const busy = activeAction.endsWith(user.id);
                    return <tr key={user.id} className="align-middle hover:bg-slate-50">
                      <td className="whitespace-nowrap px-6 py-5"><p className="font-semibold text-slate-900">{user.firstName} {user.lastName}</p><p className="mt-1 text-xs text-slate-500">{user.email}</p></td>
                      <td className="px-6 py-5"><select value={user.role} disabled={busy} onChange={(event) => void updateUser(user, 'role', event.target.value as UserRole)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500"><option value="">Sélectionner</option>{managedRoles.map((role) => <option key={role} value={role}>{roleLabels[role]}</option>)}</select></td>
                      <td className="whitespace-nowrap px-6 py-5"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{user.isActive ? 'Accès actif' : 'Accès désactivé'}</span></td>
                      <td className="px-6 py-5 text-slate-700">{user._count.siteMemberships} chantier{user._count.siteMemberships > 1 ? 's' : ''}</td>
                      <td className="whitespace-nowrap px-6 py-5 text-slate-600">{formatDate(user.createdAt)}</td>
                      <td className="whitespace-nowrap px-6 py-5"><div className="flex flex-wrap gap-2"><button type="button" onClick={() => setSelectedUser(user)} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Voir les chantiers</button><button type="button" disabled={busy} onClick={() => { if (!user.isActive && !window.confirm('Réactiver cet accès ?')) return; void updateUser(user, 'access', !user.isActive); }} className={`rounded-lg px-3 py-2 text-xs font-semibold text-white disabled:opacity-50 ${user.isActive ? 'bg-red-700 hover:bg-red-600' : 'bg-emerald-700 hover:bg-emerald-600'}`}>{user.isActive ? 'Désactiver' : 'Réactiver'}</button></div></td>
                    </tr>;
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
      {selectedUser && <UserAssignments user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </main>
  );
}