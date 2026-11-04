import React from 'react';
import type { LotDashboard, LotMetrics, LotPlan, PlanStatus } from '../../mocks/lotDashboards';
import {
  formatDate,
  formatEuro,
  formatQuantity,
  formatSigned,
  formatShortDate,
  gapColor,
  planStatusConfig,
} from './format';

interface PlanTrackingTableProps {
  lot: LotDashboard;
  metrics: LotMetrics;
}

export const formatDelivery = (plan: LotPlan) => {
  if (plan.status === 'RELIQUAT') return 'Reliquat à planifier';
  if (!plan.deliveryTo) return formatDate(plan.deliveryFrom);
  const arrow = plan.status === 'TRANSMIS' ? '→' : '-';
  return `${formatShortDate(plan.deliveryFrom)} ${arrow} ${formatDate(plan.deliveryTo)}`;
};

const columns = [
  'Plan',
  'Niveau',
  'N° - Ind.',
  'Prévu',
  'Réel',
  'Écart',
  'Montant prévu',
  'Montant réel',
  'Envoi ST',
  'Livraison',
  'Statut',
];

const PlanTrackingTable: React.FC<PlanTrackingTableProps> = ({ lot, metrics }) => {
  const qty = (value: number) => formatQuantity(value, lot.unit);
  const totalGap = metrics.actualTotal - metrics.plannedOfDelivered;

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 min-w-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Suivi des plans</h2>
          <p className="text-sm text-gray-500">
            {metrics.plans.length} plans · prévisionnel bureau d'études vs livraisons {lot.subcontractor}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(planStatusConfig) as PlanStatus[]).map((status) => (
            <span
              key={status}
              className={`px-3 py-1 rounded-full text-xs font-semibold ${planStatusConfig[status].className}`}
            >
              {planStatusConfig[status].label} · {metrics.statusCounts[status]}
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto -mx-2">
        <table className="w-full min-w-[60rem] text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              {columns.map((column) => (
                <th key={column} scope="col" className="px-2 py-2 text-xs font-semibold text-gray-500 whitespace-nowrap">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.plans.map(({ plan, plannedAmount, actualAmount, gap }) => (
              <tr key={`${plan.number}-${plan.name}`} className="border-b border-gray-100 hover:bg-gray-50">
                <th scope="row" className="px-2 py-3 text-left font-semibold text-gray-900 whitespace-nowrap">
                  {plan.name}
                </th>
                <td className="px-2 py-3 text-gray-600 whitespace-nowrap">{plan.level}</td>
                <td className="px-2 py-3 text-gray-600 whitespace-nowrap">
                  {plan.number} - {plan.index}
                </td>
                <td className="px-2 py-3 text-gray-900 whitespace-nowrap">{qty(plan.planned)}</td>
                <td className="px-2 py-3 font-semibold text-gray-900 whitespace-nowrap">
                  {plan.actual === null ? '—' : qty(plan.actual)}
                </td>
                <td className={`px-2 py-3 font-semibold whitespace-nowrap ${gapColor(gap)}`}>
                  {gap === null ? '—' : formatSigned(gap, qty)}
                </td>
                <td className="px-2 py-3 text-gray-900 whitespace-nowrap">{formatEuro(plannedAmount)}</td>
                <td className="px-2 py-3 text-gray-900 whitespace-nowrap">
                  {actualAmount === null ? '—' : formatEuro(actualAmount)}
                </td>
                <td className="px-2 py-3 text-gray-600 whitespace-nowrap">{formatDate(plan.sentDate)}</td>
                <td className="px-2 py-3 text-gray-600 whitespace-nowrap">{formatDelivery(plan)}</td>
                <td className="px-2 py-3 whitespace-nowrap">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${planStatusConfig[plan.status].className}`}>
                    {planStatusConfig[plan.status].label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-bold text-gray-900">
              <th scope="row" className="px-2 py-3 text-left" colSpan={3}>
                Total
              </th>
              <td className="px-2 py-3 whitespace-nowrap">{qty(metrics.plannedTotal)}</td>
              <td className="px-2 py-3 whitespace-nowrap">{qty(metrics.actualTotal)}</td>
              <td className={`px-2 py-3 whitespace-nowrap ${gapColor(totalGap)}`}>{formatSigned(totalGap, qty)}</td>
              <td className="px-2 py-3 whitespace-nowrap">{formatEuro(metrics.plannedAmountTotal)}</td>
              <td className="px-2 py-3 whitespace-nowrap">{formatEuro(metrics.actualAmountTotal)}</td>
              <td colSpan={3} />
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
};

export default PlanTrackingTable;
