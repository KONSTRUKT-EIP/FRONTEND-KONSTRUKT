import { useNavigate, useParams } from "react-router-dom";
import WorkerRow from "../../Components/Dashboard/WorkforceTable/WorkerRow";
import React, { useState, useEffect, useCallback } from 'react';
import AttendanceBadge, { AttendanceStatus, attendanceConfig } from "../../Components/Dashboard/Attendance/AttendanceBadge";
import AttendanceCard from "../../Components/Dashboard/Attendance/AttendanceCard";
import AttendanceDaySelector from "../../Components/Dashboard/Attendance/AttendanceDaySelector";
import { teamService, TeamMember, AttendanceWeek } from '../../services/teamService';
import { getSiteUUID } from '../../utils/siteMapping';
import AddMemberModal from '../../Components/Dashboard/Modal/AddMemberModal';

const chantierNames: Record<string, string> = {
  "1": "Tour Horizon",
  "2": "Résidence Les Pins",
  "3": "Pont Sud",
  "4": "Centre Commercial",
  "5": "Immeuble Lumière",
  "6": "Stade Municipal",
};

export default function TeamView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const chantierName = chantierNames[id ?? ""] ?? "Chantier";
  const siteUUID = getSiteUUID(id);
  const [workers, setWorkers] = useState<TeamMember[]>([]);
  const [attendanceWeek, setAttendanceWeek] = useState<AttendanceWeek | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [selectedDay, setSelectedDay] = useState(0);

  const fetchData = useCallback(async () => {
    if (!siteUUID) {
      setError("ID de chantier invalide");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [membersData, attendanceData] = await Promise.all([
        teamService.getTeamMembersDetails(siteUUID),
        teamService.getAttendanceWeek(siteUUID),
      ]);
      
      setWorkers(membersData);
      setAttendanceWeek(attendanceData);
      if (attendanceData.days.length > 0) {
        setSelectedDay(attendanceData.days.length - 1);
      }
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError("Impossible de charger les données de l'équipe");
    } finally {
      setLoading(false);
    }
  }, [siteUUID]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddMemberSuccess = () => {
    fetchData();
  };

  const toggleCheck = (wid: string) => {
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

  const filtered = workers.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.specialite.toLowerCase().includes(search.toLowerCase())
  );

  const attendanceDays = attendanceWeek?.days ?? [];

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

      {/* Loading & Error States */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Chargement...</div>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center py-8">
          <div className="text-red-500">{error}</div>
        </div>
      )}

      {!loading && !error && (
      <>
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
              <button 
                onClick={() => setIsAddMemberModalOpen(true)}
                className="flex items-center gap-1 px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-full hover:bg-orange-600 transition"
              >
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
                    worker={{
                      id: worker.id as unknown as number,
                      specialite: worker.specialite,
                      name: worker.name,
                      email: worker.email,
                      dateDebut: worker.dateDebut,
                      status: worker.status,
                      starred: worker.starred,
                      initials: worker.initials,
                      color: worker.color,
                    }}
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
            {workers.map(worker => {
              const dayStatus = (attendanceWeek?.attendances[worker.id]?.[selectedDay] || 'absent') as AttendanceStatus;
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
            })}
          </div>

          {/* Day summary */}
          <div className="flex gap-4 pt-2 border-t border-gray-100">
            {(Object.keys(attendanceConfig) as AttendanceStatus[]).map(s => {
              const count = workers.filter(w =>
                (attendanceWeek?.attendances[w.id]?.[selectedDay] ?? 'absent') === s
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
      </>
      )}

      {/* Add Member Modal */}
      {siteUUID && (
        <AddMemberModal
          isOpen={isAddMemberModalOpen}
          onClose={() => setIsAddMemberModalOpen(false)}
          siteId={siteUUID}
          onSuccess={handleAddMemberSuccess}
        />
      )}
    </div>
  );
}
