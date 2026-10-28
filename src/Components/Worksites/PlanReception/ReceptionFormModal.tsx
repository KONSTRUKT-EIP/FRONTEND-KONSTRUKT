import React, { useEffect, useState } from 'react';
import {
  EMPTY_RECEPTION_FORM,
  PLAN_STATUSES,
  PLAN_TYPES,
  type PlanReceptionFormValues,
} from '../../../Pages/Worksites/planReception.types';

interface ReceptionFormModalProps {
  open: boolean;
  siteName: string;
  initialValues?: PlanReceptionFormValues;
  isEditing: boolean;
  saving: boolean;
  onClose: () => void;
  onSubmit: (values: PlanReceptionFormValues) => Promise<void>;
}

export default function ReceptionFormModal({
  open,
  siteName,
  initialValues,
  isEditing,
  saving,
  onClose,
  onSubmit,
}: ReceptionFormModalProps) {
  const [values, setValues] = useState<PlanReceptionFormValues>(EMPTY_RECEPTION_FORM);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setValues(initialValues ?? EMPTY_RECEPTION_FORM);
      setError(null);
    }
  }, [open, initialValues]);

  if (!open) return null;

  const update = <K extends keyof PlanReceptionFormValues>(key: K, value: PlanReceptionFormValues[K]) => {
    setValues(current => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    try {
      await onSubmit(values);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Impossible d’enregistrer la réception.');
    }
  };

  const inputClass = 'mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
      onMouseDown={event => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <section role="dialog" aria-modal="true" aria-labelledby="reception-modal-title" className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{siteName}</p>
            <h2 id="reception-modal-title" className="mt-1 text-xl font-bold text-slate-900">{isEditing ? 'Modifier le plan' : 'Déclarer une réception'}</h2>
            <p className="mt-1 text-sm text-slate-500">Les informations sont enregistrées sur le chantier.</p>
          </div>
          <button type="button" aria-label="Fermer" disabled={saving} onClick={onClose} className="rounded-lg p-2 text-xl leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">
              Élément / zone
                <input required autoFocus disabled={saving} value={values.elementName} onChange={event => update('elementName', event.target.value)} placeholder="Ex. Fondations Bât A" className={inputClass} />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Type de plan
              <select disabled={saving} value={values.planType} onChange={event => update('planType', event.target.value as PlanReceptionFormValues['planType'])} className={inputClass}>
                {PLAN_TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">
              Date de réception / échéance
              <input required type="date" disabled={saving} value={values.plannedDate} onChange={event => update('plannedDate', event.target.value)} className={inputClass} />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Statut
              <select disabled={saving} value={values.status} onChange={event => update('status', event.target.value as PlanReceptionFormValues['status'])} className={inputClass}>
                {PLAN_STATUSES.map(status => <option key={status.value} value={status.value}>{status.label}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">
              Indice de plan
              <input maxLength={5} disabled={saving} value={values.revision} onChange={event => update('revision', event.target.value.toUpperCase())} className={`${inputClass} uppercase`} />
            </label>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">
              Date de coulage <span className="font-normal text-slate-400">(facultatif)</span>
              <input type="date" disabled={saving} value={values.forDate} onChange={event => update('forDate', event.target.value)} className={inputClass} />
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button type="button" disabled={saving} onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Annuler</button>
            <button type="submit" disabled={saving} className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 disabled:cursor-wait disabled:opacity-60">
              {saving ? 'Enregistrement…' : isEditing ? 'Enregistrer les modifications' : 'Ajouter le plan'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
