import type { PlanReceptionFormValues, PlanReceptionRecord, PlanStatus, PlanType } from '../Pages/Worksites/planReception.types';

const API_BASE = 'http://localhost:3000';
const TABLE_NAME = 'Plan reception';
const LEGACY_TABLE_NAMES = [TABLE_NAME, 'Réception des plans'];

interface GenericTable {
  id: string;
  name: string;
  rows?: GenericTableRow[];
}

interface GenericTableRow {
  id: string;
  data: Record<string, unknown>;
}

interface PersistedPlanReception {
  elementName: string;
  forDate?: string;
  planType: PlanType;
  plannedDate: string;
  status: PlanStatus;
  revision?: string;
}

const LEGACY_PLAN_TYPES: Record<string, PlanType> = {
  coffrage: 'FORMWORK',
  armatures: 'REBAR',
  plancher: 'FLOOR',
  impression: 'PRINT',
};

const LEGACY_PLAN_STATUSES: Record<string, PlanStatus> = {
  'Reçu': 'RECEIVED',
  'À reprendre': 'REVISION_REQUIRED',
  'Sous 14 j': 'DUE_WITHIN_14_DAYS',
  'À venir': 'UPCOMING',
};

function parsePlanType(value: unknown): PlanType | null {
  if (value === 'FORMWORK' || value === 'REBAR' || value === 'FLOOR' || value === 'PRINT') return value;
  return typeof value === 'string' ? LEGACY_PLAN_TYPES[value] ?? null : null;
}

function parsePlanStatus(value: unknown): PlanStatus | null {
  if (value === 'RECEIVED' || value === 'REVISION_REQUIRED' || value === 'DUE_WITHIN_14_DAYS' || value === 'UPCOMING') return value;
  return typeof value === 'string' ? LEGACY_PLAN_STATUSES[value] ?? null : null;
}

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    ...init,
    headers: { ...getHeaders(), ...init?.headers },
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(payload?.message || `Erreur API (${response.status})`);
  }
  return response.json() as Promise<T>;
}

function parseRecord(row: GenericTableRow): PlanReceptionRecord | null {
  const data = row.data;
  const planType = parsePlanType(data.planType ?? data.type);
  const status = parsePlanStatus(data.status);
  const elementName = data.elementName ?? data.element;
  const plannedDate = data.plannedDate ?? data.date;
  if (
    typeof elementName !== 'string' ||
    typeof plannedDate !== 'string' ||
    !planType ||
    !status
  ) return null;

  return {
    id: row.id,
    elementName,
    forDate: typeof data.forDate === 'string' ? data.forDate : typeof data.pourDate === 'string' ? data.pourDate : typeof data.pour === 'string' ? data.pour : '',
    planType,
    plannedDate,
    status,
    revision: typeof data.revision === 'string' ? data.revision : typeof data.index === 'string' ? data.index : 'A',
  };
}

function toDto(values: PlanReceptionFormValues): PersistedPlanReception {
  return {
    elementName: values.elementName.trim(),
    forDate: values.forDate,
    planType: values.planType,
    plannedDate: values.plannedDate,
    status: values.status,
    revision: values.revision.trim().toUpperCase() || 'A',
  };
}

async function getOrCreateTable(siteId: string): Promise<GenericTable> {
  const tables = await request<GenericTable[]>(`/dashboard/tables?siteId=${encodeURIComponent(siteId)}`);
  const existing = tables.find(table => LEGACY_TABLE_NAMES.includes(table.name));
  if (existing) return existing;

  // DTO CreateGenericTableDto: { name, columns, siteId }
  return request<GenericTable>('/dashboard/tables', {
    method: 'POST',
    body: JSON.stringify({
      name: TABLE_NAME,
      siteId,
      columns: {
        elementName: 'string',
        forDate: 'date',
        planType: 'string',
        plannedDate: 'date',
        status: 'string',
        revision: 'string',
      },
    }),
  });
}

export const planReceptionService = {
  async list(siteId: string): Promise<PlanReceptionRecord[]> {
    const table = await getOrCreateTable(siteId);
    // GET /dashboard/tables/:tableId/rows returns GenericTableRow[] (data is JSON).
    const rows = await request<GenericTableRow[]>(`/dashboard/tables/${table.id}/rows`);
    return rows.map(parseRecord).filter((record): record is PlanReceptionRecord => record !== null);
  },

  async create(siteId: string, values: PlanReceptionFormValues): Promise<PlanReceptionRecord> {
    const table = await getOrCreateTable(siteId);
    // DTO AddGenericTableRowDto: { data: Record<string, any> }
    const row = await request<GenericTableRow>(`/dashboard/tables/${table.id}/rows`, {
      method: 'POST',
      body: JSON.stringify({ data: toDto(values) }),
    });
    const record = parseRecord(row);
    if (!record) throw new Error('Le backend a renvoyé une réception de plan invalide.');
    return record;
  },

  async update(recordId: string, values: PlanReceptionFormValues): Promise<PlanReceptionRecord> {
    // DTO UpdateGenericTableRowDto: { data?: Record<string, any> }
    const row = await request<GenericTableRow>(`/dashboard/tables/rows/${recordId}`, {
      method: 'PUT',
      body: JSON.stringify({ data: toDto(values) }),
    });
    const record = parseRecord(row);
    if (!record) throw new Error('Le backend a renvoyé une réception de plan invalide.');
    return record;
  },
};
