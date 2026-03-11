const API_BASE = 'http://localhost:3000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export interface TeamStats {
  total: number;
  complete: number;
  enCours: number;
  enAttente: number;
  annule: number;
  pctPresents: number;
  pctAbsents: number;
  pctComplete: number;
  pctEnCours: number;
}

export interface TeamMember {
  id: string;
  specialite: string;
  name: string;
  email: string;
  dateDebut: string;
  status: string;
  initials: string;
  color: string;
  starred: boolean;
}

export interface AttendanceWeek {
  days: string[];
  dates: string[];
  attendances: Record<string, string[]>;
}

export interface Team {
  id: string;
  name: string;
  siteId: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface AddMemberResponse {
  id: string;
  teamId: string;
  userId: string;
  role: string;
}

export const teamService = {
  async getTeamStats(siteId: string): Promise<TeamStats> {
    const response = await fetch(`${API_BASE}/teams/site/${siteId}/stats`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch team stats');
    return response.json();
  },

  async getTeamMembersDetails(siteId: string): Promise<TeamMember[]> {
    const response = await fetch(`${API_BASE}/teams/site/${siteId}/members-details`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch team members');
    return response.json();
  },

  async getAttendanceWeek(siteId: string, startDate?: string): Promise<AttendanceWeek> {
    const url = startDate 
      ? `${API_BASE}/teams/site/${siteId}/attendance-week?startDate=${startDate}`
      : `${API_BASE}/teams/site/${siteId}/attendance-week`;
    
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch attendance week');
    return response.json();
  },

  async getTeamsBySite(siteId: string): Promise<Team[]> {
    const response = await fetch(`${API_BASE}/teams?siteId=${siteId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch teams');
    return response.json();
  },

  async getAvailableUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE}/users`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    const result = await response.json();
    return Array.isArray(result) ? result : result.data || [];
  },

  async addMemberToTeam(teamId: string, userId: string, role?: string): Promise<AddMemberResponse> {
    const response = await fetch(`${API_BASE}/teams/${teamId}/members`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId, role: role || 'WORKER' }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add member');
    }
    return response.json();
  },

  async createTeam(siteId: string, name: string, leaderId?: string): Promise<Team> {
    const payload = { siteId, name, leaderId };
    
    const response = await fetch(`${API_BASE}/teams`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create team');
    }
    return response.json();
  },
};
