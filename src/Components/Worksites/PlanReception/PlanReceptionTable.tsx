import React from 'react';
import { PLAN_STATUS_LABELS, type PlanCell, type PlanRow, type PlanStatus, type PlanType } from '../../../Pages/Worksites/planReception.types';

interface PlanReceptionTableProps {
  rows: PlanRow[];
  totalRows: number;
  onEdit: (row: PlanRow, type: PlanType, cell: PlanCell | null) => void;
}

const columns: { key: PlanType; rowKey: 'formwork' | 'rebar' | 'floor' | 'print'; label: string }[] = [
  { key: 'FORMWORK', rowKey: 'formwork', label: 'Plan de coffrage' },
  { key: 'REBAR', rowKey: 'rebar', label: 'Plan d’armatures' },
  { key: 'FLOOR', rowKey: 'floor', label: 'Plan de plancher' },
  { key: 'PRINT', rowKey: 'print', label: 'Impression du plan' },
];

function statusClasses(status: PlanStatus) {
  switch (status) {
    case 'RECEIVED': return 'bg-emerald-50/80 text-slate-800 before:bg-emerald-600';
    case 'REVISION_REQUIRED': return 'bg-orange-50 text-slate-800 before:bg-orange-500';
    case 'DUE_WITHIN_14_DAYS': return 'bg-blue-50 text-slate-800 before:bg-blue-600';
    default: return 'text-slate-600 before:border before:border-slate-400 before:bg-white';
  }
}

function PlanDateCell({ cell, onClick }: { cell: PlanCell | null; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={cell ? `Modifier le plan du ${cell.date}` : 'Ajouter un plan'}
      className={`min-w-23.5 rounded-md px-2 py-1.5 text-left transition hover:ring-2 hover:ring-blue-300 ${cell ? statusClasses(cell.status) : 'text-slate-300 hover:bg-blue-50 hover:text-blue-700'}`}
    >
      {cell ? (
        <>
          <span className="block font-semibold">{cell.date}</span>
          <span className="relative mt-0.5 block pl-3 text-[10px] before:absolute before:left-0 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full">
            {PLAN_STATUS_LABELS[cell.status]}
          </span>
        </>
      ) : '—'}
    </button>
  );
}

export default function PlanReceptionTable({ rows, totalRows, onEdit }: PlanReceptionTableProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <h2 className="text-sm font-bold text-slate-900">Réception des plans</h2>
        <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-600">
          {(['RECEIVED', 'REVISION_REQUIRED', 'DUE_WITHIN_14_DAYS', 'UPCOMING'] as PlanStatus[]).map(status => (
            <span key={status} className={`relative rounded px-2 py-1 pl-4 before:absolute before:left-2 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full ${statusClasses(status)}`}>{PLAN_STATUS_LABELS[status]}</span>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-262.5 border-collapse text-left text-[10px]">
          <thead className="bg-amber-50 text-[10px] font-semibold text-slate-700">
            <tr>
              <th className="px-3 py-3">Élément</th>
              <th className="px-3 py-3">Date de coulage</th>
              {columns.map(column => <th key={column.key} className="px-3 py-3">{column.label}</th>)}
              <th className="px-3 py-3">Indice</th>
              <th className="px-3 py-3">Plans reçus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map(row => {
              const cells = columns.map(column => row[column.rowKey]).filter((cell): cell is PlanCell => cell !== null);
              const completed = cells.filter(cell => cell.status === 'RECEIVED').length;
              return (
                <tr key={row.elementName} className="transition hover:bg-slate-50/80">
                  <td className="px-3 py-2.5 font-semibold text-slate-800">{row.elementName}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 font-semibold text-slate-800">{row.forDate || '—'}</td>
                  {columns.map(column => (
                    <td key={column.key} className="px-2 py-1.5">
                      <PlanDateCell cell={row[column.rowKey]} onClick={() => onEdit(row, column.key, row[column.rowKey])} />
                    </td>
                  ))}
                  <td className="px-3 py-2.5"><span className="rounded bg-indigo-50 px-2 py-1 font-bold text-indigo-700">{row.revision}</span></td>
                  <td className="px-3 py-2.5">
                    <span className="font-semibold text-slate-700">{completed} / {cells.length}</span>
                    <span className="mt-1 block h-1 w-14 overflow-hidden rounded-full bg-slate-200">
                      <span className="block h-full rounded-full bg-emerald-600" style={{ width: `${cells.length ? (completed / cells.length) * 100 : 0}%` }} />
                    </span>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-500">Aucun plan enregistré. Déclarez une réception pour commencer le suivi.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="border-t border-slate-100 px-4 py-2 text-right text-[10px] text-slate-500">{rows.length} éléments affichés sur {totalRows}</div>
    </section>
  );
}
