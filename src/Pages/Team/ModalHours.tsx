import React, { useState } from 'react'
import InputCard from '../../Components/Team/InputCard'
import TeamHours from '../../Components/Team/HoursCard'

interface ModalHoursTeamProps {
  worker: any;
  onClose: () => void;
}

export default function ModalHoursTeam({ worker, onClose }: ModalHoursTeamProps) {
  const [heuresJour, setHeuresJour] = useState();
  const [heuresSup, setHeuresSup] = useState();

  const total = (heuresJour ?? 0 )+ (heuresSup ?? 0);

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
          <TeamHours title={"Heures normales"} hours={heuresJour ?? 0} description={"temps saisi"}/>
          <TeamHours title={"Heure sup"} hours={heuresSup ?? 0} description={"Ajoutées aujourd'hui"}/>
        </div>

        <div className='flex justify-end'>
          <button
            onClick={onClose}
            className='bg-gray-100 hover:bg-gray-200 rounded-full mx-4 p-5 text-xl font-bold'
          >
            Annuler
          </button>
          <button onClick={onClose} className='bg-orange-500 hover:bg-orange-600 rounded-full mx-4 p-5 text-xl text-white font-bold'>
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  )
}