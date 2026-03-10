import { useNavigate, useParams } from "react-router-dom";
import WorkerRow, { Worker } from "../../Components/Dashboard/WorkforceTable/WorkerRow";
import React, { useState } from 'react';
import AttendanceBadge, { AttendanceStatus, attendanceConfig } from "../../Components/Dashboard/Attendance/AttendanceBadge";
import AttendanceCard from "../../Components/Dashboard/Attendance/AttendanceCard";
import AttendanceDaySelector from "../../Components/Dashboard/Attendance/AttendanceDaySelector";

const attendanceDays = ['Lun 3', 'Mar 4', 'Mer 5', 'Jeu 6', 'Ven 7'];

const attendanceData: Record<number, AttendanceStatus[]> = {
  1: ['present', 'present', 'retard',  'present', 'present'],
  2: ['absent',  'present', 'present', 'absent',  'present'],
  3: ['present', 'present', 'present', 'present', 'present'],
  4: ['conge',   'conge',   'absent',  'absent',  'conge'  ],
  5: ['present', 'retard',  'present', 'present', 'present'],
  6: ['present', 'absent',  'present', 'present', 'retard' ],
  7: ['retard',  'present', 'present', 'present', 'present'],
  8: ['present', 'present', 'absent',  'retard',  'present'],
};

const defaultWorkers: Worker[] = [
  { id: 1, specialite: 'Menuisier',  name: 'Arrora Gaur',     email: 'arroragaur@gmail.com',     dateDebut: '12 Dec, 2025', status: 'En attente', starred: true,  initials: 'AG', color: '#f97316' },
  { id: 2, specialite: 'Menuisier',  name: 'James Mullican',  email: 'jamesmullican@gmail.com',  dateDebut: '10 Dec, 2025', status: 'En attente', starred: false, initials: 'JM', color: '#6366f1' },
  { id: 3, specialite: 'Architecte', name: 'Robert Bacins',   email: 'robertbacins@gmail.com',   dateDebut: '09 Dec, 2025', status: 'Complete',   starred: false, initials: 'RB', color: '#10b981' },
  { id: 4, specialite: 'Carreleur',  name: 'Bethany Jackson', email: 'bethanyjackson@gmail.com', dateDebut: '09 Dec, 2025', status: 'Annulé',     starred: false, initials: 'BJ', color: '#f43f5e' },
  { id: 5, specialite: 'Carreleur',  name: 'Anne Jacob',      email: 'annejacob@gmail.com',      dateDebut: '10 Dec, 2025', status: 'Complete',   starred: false, initials: 'AJ', color: '#8b5cf6' },
  { id: 6, specialite: 'Plombier',   name: 'Bethany Jackson', email: 'bethanyjackson@gmail.com', dateDebut: '10 Dec, 2025', status: 'En attente', starred: true,  initials: 'BJ', color: '#f43f5e' },
  { id: 7, specialite: 'Maçon',      name: 'James Mullican',  email: 'jamesmullican@gmail.com',  dateDebut: '10 Dec, 2025', status: 'En cours',   starred: false, initials: 'JM', color: '#6366f1' },
  { id: 8, specialite: 'Maçon',      name: 'Jhon Deo',        email: 'jhondeo32@gmail.com',      dateDebut: '10 Dec, 2025', status: 'En cours',   starred: true,  initials: 'JD', color: '#0ea5e9' },
];

const chantierNames: Record<string, string> = {
  "1": "Tour Horizon",
  "2": "Résidence Les Pins",
  "3": "Pont Sud",
  "4": "Centre Commercial",
  "5": "Immeuble Lumière",
  "6": "Stade Municipal",
};


export default function DashboardDetail() {
  const { id } = useParams<{ id: string}>();
  const navigate = useNavigate();
  const chantierName = chantierNames[id ?? ""] ?? "Chantier";

  const [checked, setChecked] = useState<Set<number>>(new Set([3, 4, 6]));
  const [search, setSearch] = useState('');
  const [selectedDay, setSelectedDay] = useState(attendanceDays.length - 1);

  const toggleCheck = (wid: number) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(wid)) {
        next.delete(wid);
      } else {
        next.add(wid);
      }
      return next;
    });
  };

  const filtered = defaultWorkers.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.specialite.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <div>
         <nav className="mb-2 flex items-center gap-2 text-sm" aria-label="Breadcrumb">
            <span>
              <button
                onClick={() => navigate("/dashboard")}
                className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
              >
                Tous les chantiers
              </button>
            </span>
            <span className="text-gray-400">/</span>
            <span>
              <button
                onClick={() => navigate(`/dashboard/${id}`)}
                className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
              >
                {chantierName}
              </button>
            </span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold">Équipe</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Dashboard / Équipe
          </h1>
        </div>
      </div>

      {/* Workforce Table */}
      <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Équipe / {chantierName}</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
              <input
                type="text"
                placeholder="Chercher"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent text-sm outline-none text-gray-600 w-28"
              />
            </div>
            <button className="flex items-center gap-1 px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-full hover:bg-orange-600 transition">
              + Nouveau
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-2 px-3 w-8"></th>
                <th className="py-2 px-3 text-xs text-gray-400 font-medium">Spécialité ▾</th>
                <th className="py-2 pl-12 text-xs text-gray-400 font-medium">Nom ▾</th>
                <th className="py-2 pl-8 text-xs text-gray-400 font-medium">Email ▾</th>
                <th className="py-2 px-3 text-xs text-gray-400 font-medium">Date de début ▾</th>
                <th className="py-2 pl-6 text-xs text-gray-400 font-medium">Statut ▾</th>
                <th className="py-2 px-3 w-8"></th>
                <th className="py-2 px-3 w-8 text-gray-300"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(worker => (
                <WorkerRow
                  key={worker.id}
                  worker={worker}
                  checked={checked.has(worker.id)}
                  onCheck={() => toggleCheck(worker.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Panel */}
      <div className="mt-6 bg-white rounded-2xl shadow p-6 border border-gray-100 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Présences</h2>
          <AttendanceDaySelector
            days={attendanceDays}
            selectedDay={selectedDay}
            onSelect={setSelectedDay}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {defaultWorkers.map(worker => {
            const dayStatus = attendanceData[worker.id]?.[selectedDay] ?? 'absent';
            return (
              <AttendanceCard
                key={worker.id}
                initials={worker.initials}
                color={worker.color}
                name={worker.name}
                specialite={worker.specialite}
                status={dayStatus}
              />
            );
          })}<nav className="mb-2 flex items-center gap-2 text-sm" aria-label="Breadcrumb">
  <span>
    <button
      onClick={() => navigate("/dashboard")}
      className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
    >
      Tous les chantiers
    </button>
  </span>
  <span className="text-gray-400">/</span>
  <span>
    <button
      onClick={() => navigate(`/dashboard/${id}`)}
      className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
    >
      {chantierName}
    </button>
  </span>
  <span className="text-gray-400">/</span>
  <span className="text-gray-900 font-semibold">Armature</span>
</nav>
        </div>

        {/* Day summary */}
        <div className="flex gap-4 pt-2 border-t border-gray-100">
          {(Object.keys(attendanceConfig) as AttendanceStatus[]).map(s => {
            const count = defaultWorkers.filter(w =>
              (attendanceData[w.id]?.[selectedDay] ?? 'absent') === s
            ).length;
            return (
              <div key={s} className="flex items-center gap-1.5">
                <AttendanceBadge status={s} />
                <span className="text-sm font-bold text-gray-700">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}