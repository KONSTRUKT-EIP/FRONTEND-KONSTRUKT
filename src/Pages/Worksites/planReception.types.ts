export type PlanStatus = 'RECEIVED' | 'REVISION_REQUIRED' | 'DUE_WITHIN_14_DAYS' | 'UPCOMING';

export const PLAN_TYPES = [
  { value: 'FORMWORK', label: 'Plan de coffrage' },
  { value: 'REBAR', label: 'Plan d’armatures' },
  { value: 'FLOOR', label: 'Plan de plancher' },
  { value: 'PRINT', label: 'Impression du plan' },
] as const;

export type PlanType = (typeof PLAN_TYPES)[number]['value'];

export interface PlanReceptionRecord {
  id: string;
  elementName: string;
  forDate: string;
  planType: PlanType;
  plannedDate: string;
  status: PlanStatus;
  revision: string;
}

export interface PlanCell {
  recordId: string;
  date: string;
  status: PlanStatus;
}

export interface PlanRow {
  elementName: string;
  forDate: string;
  formwork: PlanCell | null;
  rebar: PlanCell | null;
  floor: PlanCell | null;
  print: PlanCell | null;
  revision: string;
}

export interface PlanReceptionFormValues {
  elementName: string;
  forDate: string;
  planType: PlanType;
  plannedDate: string;
  status: PlanStatus;
  revision: string;
}

export const PLAN_STATUSES: { value: PlanStatus; label: string }[] = [
  { value: 'RECEIVED', label: 'Reçu' },
  { value: 'REVISION_REQUIRED', label: 'À reprendre' },
  { value: 'DUE_WITHIN_14_DAYS', label: 'Sous 14 j' },
  { value: 'UPCOMING', label: 'À venir' },
];
export const PLAN_FILTERS = [{ value: 'ALL', label: 'Tous les statuts' }, ...PLAN_STATUSES] as const;
export type PlanFilter = (typeof PLAN_FILTERS)[number]['value'];

export const EMPTY_RECEPTION_FORM: PlanReceptionFormValues = {
  elementName: '',
  forDate: '',
  planType: 'FORMWORK',
  plannedDate: '',
  status: 'RECEIVED',
  revision: 'A',
};

export const PLAN_TYPE_LABELS: Record<PlanType, string> = {
  FORMWORK: 'Plan de coffrage',
  REBAR: 'Plan d’armatures',
  FLOOR: 'Plan de plancher',
  PRINT: 'Impression du plan',
};

export const PLAN_STATUS_LABELS: Record<PlanStatus, string> = {
  RECEIVED: 'Reçu',
  REVISION_REQUIRED: 'À reprendre',
  DUE_WITHIN_14_DAYS: 'Sous 14 j',
  UPCOMING: 'À venir',
};
