import React from 'react';
import type { LotDashboard, LotMetrics } from '../../mocks/lotDashboards';
import { formatEuro, formatPct, formatQuantity, formatSigned } from './format';

interface LotKpiCardsProps {
  lot: LotDashboard;
  metrics: LotMetrics;
}

const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
  <div className="h-1.5 w-full rounded-full bg-gray-200" aria-hidden="true">
    <div
      className="h-1.5 rounded-full bg-indigo-500"
      style={{ width: `${Math.min(100, Math.max(0, value))}%`, transition: 'width 0.6s ease' }}
    />
  </div>
);

const KpiCard: React.FC<{
  title: string;
  badge?: React.ReactNode;
  highlighted?: boolean;
  children: React.ReactNode;
}> = ({ title, badge, highlighted = false, children }) => (
  <div
    className={`bg-white rounded-2xl p-5 flex flex-col gap-2 min-w-0 ${
      highlighted ? 'border-2 border-orange-300 shadow-sm' : 'border border-gray-100 shadow-sm'
    }`}
  >
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm font-semibold text-gray-700">{title}</span>
      {badge}
    </div>
    {children}
  </div>
);

const Badge: React.FC<{ className: string; children: React.ReactNode }> = ({ className, children }) => (
  <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${className}`}>{children}</span>
);

const LotKpiCards: React.FC<LotKpiCardsProps> = ({ lot, metrics }) => {
  const budgetPct = metrics.plannedAmountTotal > 0
    ? Math.round((metrics.actualAmountTotal / metrics.plannedAmountTotal) * 100)
    : 0;
  const marketPct = (metrics.actualAmountTotal / lot.marketAmount) * 100;
  const deliveredPct = metrics.plannedTotal > 0
    ? Math.round((metrics.actualTotal / metrics.plannedTotal) * 100)
    : 0;
  const quantityGap = metrics.actualTotal - metrics.plannedOfDelivered;
  const amountGap = metrics.actualAmountTotal - metrics.plannedAmountOfDelivered;
  const projectionGap = metrics.projectedAmount - metrics.plannedAmountTotal;
  const drift = metrics.driftPct;
  const driftBadge =
    Math.abs(drift) <= 2
      ? { label: 'Conforme', className: 'bg-green-100 text-green-700' }
      : Math.abs(drift) <= 5
        ? { label: 'Léger écart', className: 'bg-yellow-100 text-yellow-700' }
        : { label: 'À surveiller', className: 'bg-orange-100 text-orange-700' };
  const qty = (value: number) => formatQuantity(value, lot.unit);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <KpiCard
        title={`Budget ${lot.label.toLowerCase()} consommé`}
        badge={<Badge className="bg-indigo-50 text-indigo-700">{budgetPct} %</Badge>}
      >
        <p className="text-2xl font-bold text-gray-900">
          {formatEuro(metrics.actualAmountTotal)}{' '}
          <span className="text-sm font-medium text-gray-500">/ {formatEuro(metrics.plannedAmountTotal)} prévus</span>
        </p>
        <ProgressBar value={budgetPct} />
        <p className="text-xs text-gray-600">
          Reste {formatEuro(metrics.plannedAmountTotal - metrics.actualAmountTotal)} sur les plans diffusés ·{' '}
          {marketPct.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} % du marché
        </p>
      </KpiCard>

      <KpiCard
        title={lot.deliveredLabel}
        badge={<Badge className="bg-indigo-50 text-indigo-700">{deliveredPct} %</Badge>}
      >
        <p className="text-2xl font-bold text-gray-900">
          {qty(metrics.actualTotal)}{' '}
          <span className="text-sm font-medium text-gray-500">/ {qty(metrics.plannedTotal)} prévus</span>
        </p>
        <ProgressBar value={deliveredPct} />
        <p className="text-xs text-gray-600">
          {metrics.deliveredCount} plan{metrics.deliveredCount > 1 ? 's' : ''} réceptionné
          {metrics.deliveredCount > 1 ? 's' : ''} sur {metrics.plans.length} · {qty(metrics.toOrderQuantity)} à commander
        </p>
      </KpiCard>

      <KpiCard
        title="Dérive sur plans livrés"
        highlighted={Math.abs(drift) > 5}
        badge={<Badge className={driftBadge.className}>{driftBadge.label}</Badge>}
      >
        <p className={`text-2xl font-bold ${drift > 0 ? 'text-red-600' : 'text-green-600'}`}>
          {formatPct(drift)}{' '}
          <span className="text-sm font-medium text-gray-500">
            {drift >= 0 ? 'au-dessus' : 'en dessous'} du plan
          </span>
        </p>
        <p className="text-xs text-gray-600">
          {formatSigned(quantityGap, qty)} livrés · {formatSigned(amountGap, formatEuro)} vs prévisionnel sur ces plans
        </p>
        <p className="text-xs text-gray-600">
          {metrics.overrunCount} plan{metrics.overrunCount > 1 ? 's' : ''} sur {metrics.deliveredCount} dépasse
          {metrics.overrunCount > 1 ? 'nt' : ''} le prévu
        </p>
      </KpiCard>

      <KpiCard
        title="Projection fin de lot"
        badge={<Badge className="bg-gray-100 text-gray-600">Estimation</Badge>}
      >
        <p className="text-2xl font-bold text-gray-900">
          {formatEuro(metrics.projectedAmount)}{' '}
          <span className={`text-sm font-semibold ${projectionGap > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {formatSigned(projectionGap, formatEuro)}
          </span>
        </p>
        <p className="text-xs text-gray-600">
          {qty(metrics.projectedQuantity)} projetés vs {qty(metrics.plannedTotal)} prévus
        </p>
        <p className="text-xs text-gray-600">
          Si la dérive de {formatPct(drift)} se maintient sur les plans restants
        </p>
      </KpiCard>
    </div>
  );
};

export default LotKpiCards;
