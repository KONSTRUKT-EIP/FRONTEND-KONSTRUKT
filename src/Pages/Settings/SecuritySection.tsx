import React, { FormEvent, useState } from 'react';
import { Check, Eye, EyeOff, X } from 'lucide-react';
import { accountService } from '../../services/accountService';
import { Feedback, PrimaryButton, SettingsCard, TextField } from './SettingsUi';

// Même règle que le back (ChangePasswordDto)
const passwordRules: { label: string; test: (value: string) => boolean }[] = [
  { label: 'Au moins 8 caractères', test: (v) => v.length >= 8 },
  { label: 'Une lettre minuscule', test: (v) => /[a-z]/.test(v) },
  { label: 'Une lettre majuscule', test: (v) => /[A-Z]/.test(v) },
  { label: 'Un chiffre', test: (v) => /\d/.test(v) },
  { label: 'Un caractère spécial (@ $ ! % * ? & #)', test: (v) => /[@$!%*?&#]/.test(v) },
];

const emptyForm = { oldPassword: '', newPassword: '', confirmPassword: '' };

const SecuritySection: React.FC = () => {
  const [form, setForm] = useState(emptyForm);
  const [showPasswords, setShowPasswords] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const rulesOk = passwordRules.every((rule) => rule.test(form.newPassword));
  const confirmOk = form.confirmPassword.length > 0 && form.confirmPassword === form.newPassword;
  const canSubmit = form.oldPassword.length > 0 && rulesOk && confirmOk && !saving;

  const update = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setFeedback(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    setFeedback(null);
    try {
      await accountService.changePassword(form.oldPassword, form.newPassword);
      setForm(emptyForm);
      setFeedback({
        type: 'success',
        message: 'Mot de passe modifié. Vos autres appareils devront se reconnecter.',
      });
    } catch (err) {
      setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Modification impossible.' });
    } finally {
      setSaving(false);
    }
  };

  const toggle = (
    <button
      type="button"
      onClick={() => setShowPasswords((v) => !v)}
      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600"
      aria-label={showPasswords ? 'Masquer les mots de passe' : 'Afficher les mots de passe'}
    >
      {showPasswords ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
    </button>
  );
  const type = showPasswords ? 'text' : 'password';

  return (
    <form onSubmit={handleSubmit}>
      <SettingsCard
        title="Mot de passe"
        description="Choisissez un mot de passe que vous n'utilisez pas ailleurs."
        footer={
          <PrimaryButton type="submit" disabled={!canSubmit}>
            {saving ? 'Modification…' : 'Modifier le mot de passe'}
          </PrimaryButton>
        }
      >
        <TextField
          id="oldPassword"
          type={type}
          label="Mot de passe actuel"
          value={form.oldPassword}
          onChange={update('oldPassword')}
          autoComplete="current-password"
          trailing={toggle}
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            id="newPassword"
            type={type}
            label="Nouveau mot de passe"
            value={form.newPassword}
            onChange={update('newPassword')}
            autoComplete="new-password"
            required
          />
          <TextField
            id="confirmPassword"
            type={type}
            label="Confirmer le nouveau mot de passe"
            value={form.confirmPassword}
            onChange={update('confirmPassword')}
            autoComplete="new-password"
            required
          />
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-sm" aria-label="Règles du mot de passe">
          {[...passwordRules, { label: 'Les deux mots de passe correspondent', test: () => confirmOk }].map((rule) => {
            const ok = rule.test(form.newPassword);
            return (
              <li key={rule.label} className={`flex items-center gap-2 ${ok ? 'text-green-700' : 'text-gray-500'}`}>
                {ok ? (
                  <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                ) : (
                  <X className="w-4 h-4 shrink-0 text-gray-300" aria-hidden="true" />
                )}
                {rule.label}
              </li>
            );
          })}
        </ul>

        {feedback && <Feedback type={feedback.type}>{feedback.message}</Feedback>}
      </SettingsCard>
    </form>
  );
};

export default SecuritySection;
