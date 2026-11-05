import type { PlanStatus } from '../../mocks/lotDashboards';

export const formatQuantity = (value: number, unit: string) =>
  `${value.toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: unit === 'T' ? 2 : 0 })} ${unit}`;

export const formatEuro = (value: number) =>
  value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

export const formatSigned = (value: number, formatter: (v: number) => string) =>
  `${value > 0 ? '+' : value < 0 ? '−' : ''}${formatter(Math.abs(value))}`;

export const formatPct = (value: number) =>
  `${value > 0 ? '+' : value < 0 ? '−' : ''}${Math.abs(value).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} %`;

export const formatDate = (date: Date) =>
  date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

export const formatShortDate = (date: Date) =>
  date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });

export const planStatusConfig: Record<PlanStatus, { label: string; className: string }> = {
  RECEPTIONNE: { label: 'Réceptionné', className: 'bg-green-100 text-green-700' },
  RELIQUAT: { label: 'Reliquat à programmer', className: 'bg-orange-100 text-orange-700' },
  TRANSMIS: { label: 'Transmis, à commander', className: 'bg-indigo-100 text-indigo-700' },
};

// Couleur d'un écart : rouge si on dépasse le prévu, vert si on est en dessous
export const gapColor = (value: number | null) =>
  value === null || value === 0 ? 'text-gray-400' : value > 0 ? 'text-red-600' : 'text-green-600';
