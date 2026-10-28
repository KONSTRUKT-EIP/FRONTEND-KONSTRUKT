import React from 'react';
import { PLAN_FILTERS, type PlanFilter } from '../../../Pages/Worksites/planReception.types';

interface PlanReceptionToolbarProps {
  filter: PlanFilter;
  search: string;
  onFilterChange: (filter: PlanFilter) => void;
  onSearchChange: (search: string) => void;
}

export default function PlanReceptionToolbar({ filter, search, onFilterChange, onSearchChange }: PlanReceptionToolbarProps) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
      <div className="flex rounded-full bg-slate-200 p-1 text-[11px]">
        <button type="button" className="rounded-full px-4 py-1.5 text-slate-600">Vue planning</button>
        <button type="button" className="rounded-full bg-white px-4 py-1.5 font-semibold text-slate-900 shadow-sm">Vue tableau</button>
      </div>
      <div className="flex flex-wrap items-center gap-1 rounded-full bg-slate-200 p-1 text-[10px]">
        {PLAN_FILTERS.map(item => (
          <button key={item.value} type="button" onClick={() => onFilterChange(item.value)} className={`rounded-full px-3 py-1.5 transition ${filter === item.value ? 'bg-white font-semibold text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-white/60'}`}>
            {item.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="plan-search" className="sr-only">Rechercher un élément</label>
        <input id="plan-search" value={search} onChange={event => onSearchChange(event.target.value)} placeholder="Rechercher un élément…" className="w-44 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
        <span className="rounded-full bg-slate-200 px-3 py-2 text-[10px] font-medium text-slate-700">Tous les bâtiments</span>
      </div>
    </div>
  );
}
