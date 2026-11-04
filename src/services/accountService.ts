import type { UserRole } from './userAdministrationService';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export type CurrentUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  organizationId: string | null;
  createdAt: string;
};

export const roleLabels: Record<UserRole, string> = {
  ADMIN: 'Administrateur',
  CHEF_PROJET: 'Chef de projet',
  CONDUCTEUR_TRAVAUX: 'Conducteur de travaux',
  COLLABORATEUR: 'Collaborateur',
  CLIENT: 'Client',
};

// Le back renvoie certains messages en anglais : on les traduit pour l'utilisateur
const translatedMessages: Record<string, string> = {
  'Old password is incorrect': 'Le mot de passe actuel est incorrect.',
  Unauthorized: 'Votre session a expiré, reconnectez-vous.',
  'User not found': 'Utilisateur introuvable.',
  'Forbidden resource': "Vous n'avez pas les droits pour effectuer cette action.",
};

const getHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { ...getHeaders(), ...init?.headers },
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const raw = Array.isArray(payload?.message) ? payload.message.join(' ') : payload?.message;
    const message = typeof raw === 'string' ? (translatedMessages[raw] ?? raw) : 'Une erreur est survenue.';
    throw new Error(message);
  }
  return payload as T;
}

export const accountService = {
  getMe: () => request<CurrentUser>('/auth'),

  updateProfile: (data: { firstName: string; lastName: string; email: string }) =>
    request<CurrentUser>('/auth/me', { method: 'PATCH', body: JSON.stringify(data) }),

  changePassword: (oldPassword: string, newPassword: string) =>
    request<{ message: string }>('/auth/change-password', {
      method: 'PATCH',
      body: JSON.stringify({ oldPassword, newPassword }),
    }),
};
