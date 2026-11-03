const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export type InvitationStatus =
  | 'PENDING'
  | 'SENT'
  | 'EXPIRED'
  | 'ACCEPTED'
  | 'CANCELLED';

export type Invitation = {
  id: string;
  email: string;
  role: string;
  expiresAt: string;
  acceptedAt: string | null;
  canceledAt: string | null;
  createdAt: string;
  sentAt: string | null;
  status: InvitationStatus;
  organization: { id: string; name: string };
  site: { id: string; name: string; city: string };
};

function getHeaders() {
  const token = localStorage.getItem('access_token');
  return {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...getHeaders(),
      ...init?.headers,
    },
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof payload?.message === 'string'
        ? payload.message
        : Array.isArray(payload?.message)
          ? payload.message.join(', ')
          : 'Une erreur est survenue.';
    throw new Error(message);
  }
  return payload as T;
}

export const invitationService = {
  list: () => request<Invitation[]>('/invitations'),
  resend: (id: string) =>
    request<{ invitation: Invitation }>(`/invitations/${id}/resend`, {
      method: 'POST',
    }),
  cancel: (id: string) =>
    request<{ message: string }>(`/invitations/${id}`, {
      method: 'DELETE',
    }),
};
