import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import KpiCard from '../../Components/Planning/PlanReception/KpiCard';
import SiteSectionNav from '../../Components/Dashboard/SiteSectionNav';
import PlanReceptionTable from '../../Components/Worksites/PlanReception/PlanReceptionTable';
import PlanReceptionToolbar from '../../Components/Worksites/PlanReception/PlanReceptionToolbar';
import ReceptionFormModal from '../../Components/Worksites/PlanReception/ReceptionFormModal';
import { planReceptionService } from '../../services/planReceptionService';
import { siteService } from '../../services/siteService';
import {
  EMPTY_RECEPTION_FORM,
  type PlanCell,
  type PlanFilter,
  type PlanReceptionFormValues,
  type PlanReceptionRecord,
  type PlanRow,
  type PlanType,
} from './planReception.types';

function formatDate(value: string) {
  if (!value) return '';
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('fr-FR').format(date);
}

function groupRecords(records: PlanReceptionRecord[]): PlanRow[] {
  const grouped = new Map<string, PlanRow>();
  for (const record of records) {
    const normalizedElement = record.elementName.trim().toLocaleLowerCase('fr');
    const row = grouped.get(normalizedElement) ?? {
      elementName: record.elementName,
      forDate: record.forDate,
      formwork: null,
      rebar: null,
      floor: null,
      print: null,
      revision: record.revision,
    };
    const cell: PlanCell = { recordId: record.id, date: formatDate(record.plannedDate), status: record.status };
    const columnByType: Record<PlanType, 'formwork' | 'rebar' | 'floor' | 'print'> = {
      FORMWORK: 'formwork',
      REBAR: 'rebar',
      FLOOR: 'floor',
      PRINT: 'print',
    };
    row[columnByType[record.planType]] = cell;
    if (record.forDate) row.forDate = record.forDate;
    if (record.revision) row.revision = record.revision;
    grouped.set(normalizedElement, row);
  }
  return [...grouped.values()].sort((left, right) => left.elementName.localeCompare(right.elementName, 'fr'));
}

export default function PlanReception() {
  const { id = '' } = useParams<{ id: string }>();
  const [siteName, setSiteName] = useState('Chargement du chantier…');
  const [records, setRecords] = useState<PlanReceptionRecord[]>([]);
  const [filter, setFilter] = useState<PlanFilter>('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [initialValues, setInitialValues] = useState<PlanReceptionFormValues | undefined>();
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [site, plans] = await Promise.all([siteService.getSite(id), planReceptionService.list(id)]);
      setSiteName(site.name);
      setRecords(plans);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Impossible de charger le suivi des plans.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { void loadData(); }, [loadData]);

  const rows = useMemo(() => groupRecords(records), [records]);
  const visibleRows = useMemo(() => rows.filter(row => {
    const matchesText = row.elementName.toLocaleLowerCase('fr').includes(search.toLocaleLowerCase('fr'));
    const matchesStatus = filter === 'ALL' || [row.formwork, row.rebar, row.floor, row.print]
      .some(cell => cell?.status === filter);
    return matchesText && matchesStatus;
  }), [filter, rows, search]);

  const receivedCount = records.filter(record => record.status === 'RECEIVED').length;
  const toRework = records.filter(record => record.status === 'REVISION_REQUIRED');
  const upcomingCount = records.filter(record => record.status === 'DUE_WITHIN_14_DAYS').length;
  const nextPour = records
    .filter(record => record.forDate && new Date(`${record.forDate}T00:00:00`).getTime() >= Date.now())
    .sort((left, right) => left.forDate.localeCompare(right.forDate))[0];

  const openNewModal = () => {
    setEditingRecordId(null);
    setInitialValues(EMPTY_RECEPTION_FORM);
    setModalOpen(true);
  };

  const openEditModal = (row: PlanRow, type: PlanType, cell: PlanCell | null) => {
    const record = cell ? records.find(item => item.id === cell.recordId) : undefined;
    setEditingRecordId(record?.id ?? null);
    setInitialValues({
      elementName: row.elementName,
      forDate: record?.forDate || row.forDate || '',
      planType: type,
      plannedDate: record?.plannedDate || '',
      status: record?.status || 'RECEIVED',
      revision: record?.revision || row.revision || 'A',
    });
    setModalOpen(true);
  };

  const handleSave = async (values: PlanReceptionFormValues) => {
    setSaving(true);
    try {
      const saved = editingRecordId
        ? await planReceptionService.update(editingRecordId, values)
        : await planReceptionService.create(id, values);
      setRecords(current => editingRecordId
        ? current.map(record => record.id === saved.id ? saved : record)
        : [...current, saved]);
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-375 flex-col gap-5 lg:flex-row lg:items-start">
        <SiteSectionNav siteId={id} />
        <div className="min-w-0 flex-1">
          <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <nav aria-label="Fil d’Ariane" className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                <Link to="/dashboard" className="hover:text-blue-700">Tous les chantiers</Link>
                <span>/</span><span>{siteName}</span><span>/</span>
                <span className="font-semibold text-slate-800">Réception des plans</span>
              </nav>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Réception des plans</h1>
              <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-600">Suivez les dates de réception des plans du chantier {siteName}.</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={openNewModal} className="rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-800"><span aria-hidden="true" className="mr-1">＋</span> Déclarer une réception</button>
              <button type="button" onClick={() => window.print()} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">↓ <span className="ml-1">Exporter</span></button>
            </div>
          </header>

          {error && <section role="alert" className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"><span>{error}</span><button type="button" onClick={() => void loadData()} className="font-semibold underline">Réessayer</button></section>}

          <section aria-label="Indicateurs de réception" className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard label="Plans reçus" value={String(receivedCount)} detail={`sur ${records.length} réception${records.length > 1 ? 's' : ''} enregistrée${records.length > 1 ? 's' : ''}`} accent="text-slate-900" badge={records.length ? `${Math.round(receivedCount / records.length * 100)} %` : '0 %'} />
            <KpiCard label="Plans à reprendre" value={String(toRework.length)} detail="Réceptions marquées non conformes" accent="text-orange-700" />
            <KpiCard label="Échéances sous 14 jours" value={String(upcomingCount)} detail="Réceptions à venir déclarées" accent="text-blue-700" badge={`${records.filter(record => record.status === 'UPCOMING').length} à venir`} />
            <KpiCard label="Prochain coulage" value={nextPour?.elementName ?? 'Non renseigné'} detail={nextPour ? formatDate(nextPour.forDate) : 'Renseignez une date de coulage'} accent="text-slate-900" />
          </section>

          {toRework.length > 0 && <section aria-label="Alertes de plans" className="mb-4 rounded-lg border border-orange-300 bg-orange-50 px-4 py-3 text-xs text-orange-900"><p className="font-semibold"><span className="mr-2" aria-hidden="true">⚠</span>{toRework.length} plan{toRework.length > 1 ? 's' : ''} à reprendre</p>{toRework.map(record => <p key={record.id} className="mt-1 pl-5">{record.elementName} — {record.planType} ({formatDate(record.plannedDate)})</p>)}</section>}

          <PlanReceptionToolbar filter={filter} search={search} onFilterChange={setFilter} onSearchChange={setSearch} />
          {loading ? <div className="rounded-xl border border-slate-200 bg-white py-16 text-center text-sm text-slate-500">Chargement du suivi des plans…</div> : <PlanReceptionTable rows={visibleRows} totalRows={rows.length} onEdit={openEditModal} />}

          <section className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div><h2 className="text-xs font-bold text-slate-900">Suivi enregistré</h2><p className="mt-1 text-[10px] text-slate-600">Les réceptions sont enregistrées dans le tableau générique associé au chantier.</p></div>
            <button type="button" onClick={() => void loadData()} className="rounded-md border border-slate-300 px-3 py-2 text-[10px] font-semibold text-slate-700 hover:bg-slate-50">Actualiser</button>
          </section>
        </div>
      </div>

      <ReceptionFormModal open={modalOpen} siteName={siteName} initialValues={initialValues} isEditing={Boolean(editingRecordId)} saving={saving} onClose={() => setModalOpen(false)} onSubmit={handleSave} />
    </main>
  );
}