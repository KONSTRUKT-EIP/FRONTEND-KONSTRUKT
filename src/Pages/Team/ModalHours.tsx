import React, { useState } from 'react'
import InputCard from '../../Components/Dashboard/Team/InputCard'
import TeamHours from '../../Components/Dashboard/Team/HoursCard'
import { teamService } from '../../services/teamService'
interface Worker {
  id: string;
  teamId: string;
  name: string;
}

interface ModalHoursTeamProps {
  worker: Worker;
  siteId: string;
  date: string;
  initialNormalHours: number;
  initialOvertimeHours: number;
  onSaved: (normalHours: number, overtimeHours: number) => void;
  onClose: () => void;
}

export default function ModalHoursTeam({ worker, siteId, date, initialNormalHours, initialOvertimeHours, onSaved, onClose }: ModalHoursTeamProps) {
  const [heuresJour, setHeuresJour] = useState<number | ''>(initialNormalHours || '');
  const [heuresSup, setHeuresSup] = useState<number | ''>(initialOvertimeHours || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalHours = Number(heuresJour || 0);
  const overtimeHours = Number(heuresSup || 0);
  const total = normalHours + overtimeHours;

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      await teamService.saveWorkforceHours(
        siteId,
        worker.teamId,
        worker.id,
        date,
        normalHours,
        overtimeHours,
      );
      onSaved(normalHours, overtimeHours);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 p-9'
        onClick={e => e.stopPropagation()}
      >
        <h1 className='text-2xl gap-2 mx-1 p-4'>Présence</h1>
        <p className='gap-2 mx-1 p-4'>
          Renseigne uniquement les heures travaillées et les heures supplémentaires<br/>
          pour cette journée.
        </p>

        <div className='flex gap-4'>
          <InputCard
            title={"Nombre d'heure jour"}
            description={"Temps travaillé sur la journée"}
            value={heuresJour}
            onChange={(val) => setHeuresJour(val)}
          />
          <InputCard
            title={"Nombre d'heure supplémentaire"}
            description={"Temps ajouté en heures sup."}
            value={heuresSup}
            onChange={(val) => setHeuresSup(val)}
          />
        </div>

        <div className='flex py-5 gap-3'>
          <TeamHours title={"Total journée"} hours={total ?? 0} description={"Aujourd'hui"}/>
          <TeamHours title={"Heures normales"} hours={normalHours} description={"temps saisi"}/>
          <TeamHours title={"Heure sup"} hours={overtimeHours} description={"Ajoutées aujourd'hui"}/>
        </div>

        {error && (
          <div className='mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600'>
            {error}
          </div>
        )}

        <div className='flex justify-end'>
          <button
            onClick={onClose}
            className='bg-gray-100 hover:bg-gray-200 rounded-full mx-4 p-5 text-xl font-bold'
            disabled={saving}
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className='bg-orange-500 hover:bg-orange-600 rounded-full mx-4 p-5 text-xl text-white font-bold disabled:opacity-60'
          >
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  )
}