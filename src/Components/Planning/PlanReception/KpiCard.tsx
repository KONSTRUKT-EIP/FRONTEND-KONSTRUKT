import React from 'react';

interface KpiCardProps {
  label: string;
  value: string;
  detail: string;
  accent: string;
  badge?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, detail, accent, badge }) => (
  <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex items-start justify-between gap-2">
      <p className="text-xs font-semibold text-slate-600">{label}</p>
      {badge && <span className="shrink-0 rounded-full bg-violet-50 px-2 py-1 text-[10px] font-bold text-violet-700">{badge}</span>}
    </div>
    <p className={`mt-2 text-3xl font-bold tracking-tight ${accent}`}>{value}</p>
    <p className="mt-1 text-[11px] leading-4 text-slate-500">{detail}</p>
  </article>
);

export default KpiCard;