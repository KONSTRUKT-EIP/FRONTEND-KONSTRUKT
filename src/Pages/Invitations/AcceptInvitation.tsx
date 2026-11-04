import React, { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

type Invitation = {
  email: string;
  role: string;
  expiresAt: string;
  organization: { name: string };
  site: { name: string; city: string };
};

const roleLabels: Record<string, string> = {
  ADMIN: 'Administrateur',
  CHEF_PROJET: 'Chef de projet',
  CONDUCTEUR_TRAVAUX: 'Conducteur de travaux',
  COLLABORATEUR: 'Collaborateur',
  CLIENT: 'Client',
};

function getErrorMessage(payload: unknown, fallback: string) {
  if (typeof payload === 'object' && payload !== null && 'message' in payload) {
    const message = payload.message;
    if (Array.isArray(message)) return message.join(', ');
    if (typeof message === 'string') return message;
  }
  return fallback;
}

export default function AcceptInvitation() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(Boolean(token));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(
    token ? '' : 'Le lien d’invitation est invalide.',
  );
  const [success, setSuccess] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadInvitation = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/invitations/${encodeURIComponent(token)}`,
        );
        const payload = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(
            getErrorMessage(payload, 'Cette invitation est invalide ou expirée.'),
          );
        }
        setInvitation(payload as Invitation);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Impossible de vérifier cette invitation.',
        );
      } finally {
        setLoading(false);
      }
    };

    void loadInvitation();
  }, [token]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const response = await fetch(
        `${API_BASE}/invitations/${encodeURIComponent(token)}/accept`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstName, lastName, password }),
        },
      );
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          getErrorMessage(payload, 'Impossible de valider cette invitation.'),
        );
      }

      if (payload?.access_token) {
        localStorage.setItem('access_token', payload.access_token);
      }
      if (payload?.refresh_token) {
        localStorage.setItem('refresh_token', payload.refresh_token);
      }
      login();
      setSuccess(true);
      window.setTimeout(() => navigate('/dashboard'), 1200);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Impossible de créer votre compte.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <main className="min-h-screen bg-gray-100 p-8 text-center">Vérification de l’invitation...</main>;
  }

  if (!invitation && !success) {
    return (
      <main className="min-h-screen bg-gray-100 px-4 py-16">
        <section className="mx-auto max-w-xl rounded-xl bg-white p-8 text-center shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900">Invitation indisponible</h1>
          <p className="mt-4 text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => navigate('/signin')}
            className="mt-8 rounded-md bg-orange-700 px-5 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Aller à la connexion
          </button>
        </section>
      </main>
    );
  }

  if (success) {
    return (
      <main className="min-h-screen bg-gray-100 px-4 py-16">
        <section className="mx-auto max-w-xl rounded-xl bg-white p-8 text-center shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900">Compte activé</h1>
          <p className="mt-4 text-gray-600">Redirection vers votre espace Konstrukt...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-16">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-xl flex-col gap-5 rounded-xl bg-white p-8 shadow-lg"
      >
        <img src="/assets/konstrukt_logo.svg" alt="Konstrukt" className="mx-auto h-14 w-auto" />
        <h1 className="text-center text-2xl font-bold text-gray-900">Créer mon compte</h1>
        <p className="text-center text-gray-600">
          Vous êtes invité à rejoindre <strong>{invitation.organization.name}</strong> sur le chantier <strong>{invitation.site.name}</strong>.
        </p>
        <p className="text-center text-sm text-gray-500">
          {invitation.email} · {roleLabels[invitation.role] ?? invitation.role}
        </p>
        <div className="flex gap-4">
          <label className="flex flex-1 flex-col gap-2 text-sm font-medium text-gray-700">
            Prénom
            <input required value={firstName} onChange={(event) => setFirstName(event.target.value)} className="rounded-md border p-3" />
          </label>
          <label className="flex flex-1 flex-col gap-2 text-sm font-medium text-gray-700">
            Nom
            <input required value={lastName} onChange={(event) => setLastName(event.target.value)} className="rounded-md border p-3" />
          </label>
        </div>
        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
          Mot de passe
          <input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-md border p-3" />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
          Confirmer le mot de passe
          <input required minLength={8} type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="rounded-md border p-3" />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={submitting} type="submit" className="rounded-md bg-orange-700 p-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-60">
          {submitting ? 'Activation...' : 'Activer mon compte'}
        </button>
      </form>
    </main>
  );
}
