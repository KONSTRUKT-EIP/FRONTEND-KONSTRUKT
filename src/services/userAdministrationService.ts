const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export type UserRole =
  | 'ADMIN'
  | 'CHEF_PROJET'
  | 'CONDUCTEUR_TRAVAUX'
  | 'COLLABORATEUR'
  | 'CLIENT';

export type OrganizationUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  organizationId: string;
  createdAt: string;
  _count: { siteMemberships: number };
};

export type UserSiteAssignment = {
  id: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  site: { id: string; name: string; city: string; status: string };
};

function getHeaders() {
  const token = localStorage.getItem('access_token');
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { ...getHeaders(), ...init?.headers },
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = Array.isArray(payload?.message)
      ? payload.message.join(', ')
      : payload?.message || 'Une erreur est survenue.';
    throw new Error(message);
  }
  return payload as T;
}

export const userAdministrationService = {
  list: () => request<{ data: OrganizationUser[]; total: number }>('/users'),
  updateRole: (id: string, role: UserRole) =>
    request<OrganizationUser>(`/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),
  updateAccess: (id: string, isActive: boolean) =>
    request<OrganizationUser>(`/users/${id}/access`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    }),
  assignments: (id: string) =>
    request<UserSiteAssignment[]>(`/users/${id}/assignments`),
};