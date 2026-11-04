import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { PLAN_STATUSES, type PlanReceptionRecord } from '../../../Pages/Worksites/planReception.types';

interface PlanReceptionChartProps {
  records: PlanReceptionRecord[];
}

const STATUS_COLORS: Record<string, string> = {
  RECEIVED: '#16a34a',
  REVISION_REQUIRED: '#ea580c',
  DUE_WITHIN_14_DAYS: '#2563eb',
  UPCOMING: '#64748b',
};

export default function PlanReceptionChart({ records }: PlanReceptionChartProps) {
  const data = PLAN_STATUSES.map(status => ({
    label: status.label,
    count: records.filter(record => record.status === status.value).length,
    color: STATUS_COLORS[status.value],
  }));

  return (
    <section aria-label="Graphique des réceptions par statut" className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-3">
        <h2 className="text-sm font-bold text-slate-900">Réceptions par statut</h2>
        <p className="mt-1 text-xs text-slate-500">Nombre de plans pour chaque statut.</p>
      </div>
      {records.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">Aucune réception à afficher.</p>
      ) : (
        <ResponsiveContainer width="100%" height={190}>
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 4 }}>
            <CartesianGrid horizontal={false} stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="label" width={105} tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(value) => [value, 'Plans']} cursor={{ fill: '#f1f5f9' }} />
            <Bar dataKey="count" name="Plans" radius={[0, 5, 5, 0]} maxBarSize={24}>
              {data.map(item => <Cell key={item.label} fill={item.color} />)}
              <LabelList dataKey="count" position="right" style={{ fill: '#334155', fontSize: 11, fontWeight: 600 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}