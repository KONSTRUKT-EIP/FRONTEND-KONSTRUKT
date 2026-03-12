const API_BASE = 'http://localhost:3000';

export interface Site {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate?: string;
  status: string;
  progress?: number;
  organizationId?: string;
}

export interface DashboardStats {
  activeSites: number;
  totalEmployees: number;
  pendingOrders: number;
  weatherAlerts: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

class DashboardService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async getAllSites(): Promise<Site[]> {
    const response = await fetch(`${API_BASE}/sites`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch sites');
    return response.json();
  }

  async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE}/users`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    const result: PaginatedResponse<User> = await response.json();
    return result.data;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const sites = await this.getAllSites();
      console.log('Sites récupérés:', sites);
      const activeSites = sites.length;

      const users = await this.getAllUsers();
      console.log('Utilisateurs récupérés:', users.length, 'employés');
      const totalEmployees = users.length;

      return {
        activeSites,
        totalEmployees,
        pendingOrders: 0,
        weatherAlerts: 0,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error);
      return {
        activeSites: 0,
        totalEmployees: 0,
        pendingOrders: 0,
        weatherAlerts: 0,
      };
    }
  }
}

export default new DashboardService();
