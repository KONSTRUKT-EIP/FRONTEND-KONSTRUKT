import React, { FormEvent, useState } from 'react';
import { accountService, CurrentUser, roleLabels } from '../../services/accountService';
import { Feedback, PrimaryButton, ReadOnlyField, SecondaryButton, SettingsCard, TextField } from './SettingsUi';

interface ProfileSectionProps {
  user: CurrentUser;
  onUpdated: (user: CurrentUser) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user, onUpdated }) => {
  const [form, setForm] = useState({ firstName: user.firstName, lastName: user.lastName, email: user.email });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const isDirty =
    form.firstName.trim() !== user.firstName ||
    form.lastName.trim() !== user.lastName ||
    form.email.trim() !== user.email;
  const initials = `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase();

  const update = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setFeedback(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const updated = await accountService.updateProfile({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
      });
      onUpdated(updated);
      setFeedback({ type: 'success', message: 'Vos informations ont été mises à jour.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Mise à jour impossible.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <SettingsCard
        title="Profil"
        description="Les informations affichées à votre équipe et utilisées pour vous connecter."
        footer={
          <>
            <SecondaryButton
              type="button"
              disabled={!isDirty || saving}
              onClick={() => {
                setForm({ firstName: user.firstName, lastName: user.lastName, email: user.email });
                setFeedback(null);
              }}
            >
              Annuler
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={!isDirty || saving}>
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </PrimaryButton>
          </>
        }
      >
        <div className="flex items-center gap-4">
          <span className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white text-lg font-bold flex items-center justify-center">
            {initials}
          </span>
          <div>
            <p className="font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-gray-500">
              Membre depuis le {new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField id="firstName" label="Prénom" value={form.firstName} onChange={update('firstName')} required maxLength={80} autoComplete="given-name" />
          <TextField id="lastName" label="Nom" value={form.lastName} onChange={update('lastName')} required maxLength={80} autoComplete="family-name" />
        </div>
        <TextField
          id="email"
          type="email"
          label="Adresse e-mail"
          hint="Elle vous sert d'identifiant de connexion."
          value={form.email}
          onChange={update('email')}
          required
          autoComplete="email"
        />
        <ReadOnlyField label="Rôle">{roleLabels[user.role] ?? user.role}</ReadOnlyField>
        <p className="text-xs text-gray-500">Votre rôle est géré par un administrateur.</p>

        {feedback && <Feedback type={feedback.type}>{feedback.message}</Feedback>}
      </SettingsCard>
    </form>
  );
};

export default ProfileSection;
