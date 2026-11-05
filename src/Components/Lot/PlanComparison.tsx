import React, { useState } from 'react';
import type { LotDashboard, LotMetrics } from '../../mocks/lotDashboards';
import { formatEuro, formatPct, formatQuantity, gapColor } from './format';

interface PlanComparisonProps {
  lot: LotDashboard;
  metrics: LotMetrics;
}

type Mode = 'quantity' | 'amount';

const PlanComparison: React.FC<PlanComparisonProps> = ({ lot, metrics }) => {
  const [mode, setMode] = useState<Mode>('quantity');

  const rows = metrics.plans.map((p) => ({
    ...p,
    plannedValue: mode === 'quantity' ? p.plan.planned : p.plannedAmount,
    actualValue: mode === 'quantity' ? p.plan.actual : p.actualAmount,
  }));
  const max = Math.max(...rows.map((r) => Math.max(r.plannedValue, r.actualValue ?? 0)), 1);
  const format = (value: number) => (mode === 'quantity' ? formatQuantity(value, lot.unit) : formatEuro(value));
  const width = (value: number) => `${Math.max(2, (value / max) * 100)}%`;

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 min-w-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Prévu vs réel par plan</h2>
          <p className="text-sm text-gray-500">
            {lot.quantityLabel} en {lot.unit} par plan, ou montant en euros
          </p>
        </div>
        <div className="flex rounded-full bg-gray-100 p-1" role="group" aria-label="Unité affichée">
          {(
            [
              ['quantity', `${lot.quantityLabel} (${lot.unit})`],
              ['amount', 'Montant (€)'],
            ] as [Mode, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              aria-pressed={mode === value}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                mode === value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-violet-200" /> Prévisionnel
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-violet-600" /> Réel (livré)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm border border-dashed border-gray-400" /> Pas encore commandé
        </span>
      </div>

      <ul className="flex flex-col gap-3">
        {rows.map((row) => (
          <li key={`${row.plan.number}-${row.plan.name}`} className="grid grid-cols-[minmax(0,10rem)_1fr_3.5rem] sm:grid-cols-[minmax(0,15rem)_1fr_4rem] items-center gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate" title={row.plan.name}>
                {row.plan.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {row.plan.level} · plan {row.plan.number}
              </p>
            </div>

            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="h-2.5 rounded-full bg-violet-200" style={{ width: width(row.plannedValue) }} />
                <span className="text-xs text-gray-500 whitespace-nowrap">{format(row.plannedValue)}</span>
              </div>
              <div className="flex items-center gap-2">
                {row.actualValue === null ? (
                  <>
                    <div
                      className="h-2.5 rounded-full border border-dashed border-gray-400"
                      style={{ width: width(row.plannedValue) }}
                    />
                    <span className="text-xs text-gray-400 whitespace-nowrap">à commander</span>
                  </>
                ) : (
                  <>
                    <div className="h-2.5 rounded-full bg-violet-600" style={{ width: width(row.actualValue) }} />
                    <span className="text-xs font-semibold text-gray-900 whitespace-nowrap">
                      {format(row.actualValue)}
                    </span>
                  </>
                )}
              </div>
            </div>

            <span className={`text-sm font-semibold text-right ${gapColor(row.gapPct)}`}>
              {row.gapPct === null ? '—' : formatPct(row.gapPct)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PlanComparison;
