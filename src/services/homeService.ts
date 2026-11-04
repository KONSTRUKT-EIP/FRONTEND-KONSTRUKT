import type { Action } from '../Components/Planning/Action/ActionItem';

const API_BASE = 'http://localhost:3000';

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
});

const getJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, { headers: getAuthHeader() });
  if (!response.ok) throw new Error(`Failed to fetch ${path}`);
  return response.json();
};

// Données du tableau de bord d'accueil (utilisateur connecté)
export const homeService = {
  async getUsersCount(): Promise<number> {
    const result = await getJson<{ data?: unknown[]; total?: number } | unknown[]>('/users');
    if (Array.isArray(result)) return result.length;
    return result.total ?? result.data?.length ?? 0;
  },

  async getOrdersCount(): Promise<number> {
    const result = await getJson<{ orders: unknown[] }>('/dashboard/armature/orders');
    return result.orders.length;
  },

  getActions(): Promise<Action[]> {
    return getJson<Action[]>('/planning/actions');
  },
};
