import { useNavigate, useParams } from "react-router-dom";
import WorkerRow from "../../Components/Dashboard/WorkforceTable/WorkerRow";
import React, { useState, useEffect, useCallback } from 'react';
import AttendanceBadge, { AttendanceStatus, attendanceConfig } from "../../Components/Dashboard/Attendance/AttendanceBadge";
import AttendanceCard from "../../Components/Dashboard/Attendance/AttendanceCard";
import AttendanceDaySelector from "../../Components/Dashboard/Attendance/AttendanceDaySelector";
import { teamService, TeamMember, AttendanceWeek } from '../../services/teamService';
import AddMemberModal from '../../Components/Dashboard/Modal/AddMemberModal';

export default function TeamView() {
  const { id } = useParams<{ id: string }>();
  const siteUUID = id;
  const navigate = useNavigate();
  const [chantierName] = useState<string>("Chantier");
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
      
      console.log('Members data:', membersData);
      console.log('Attendance data:', attendanceData);
      
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
    <div className="min-h-screen bg-gray-100 p-8" aria-label="Page équipe">
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
            <h2 className="text-2xl font-bold text-gray-800">Équipe / {chantierName}</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                <input
                  type="text"
                  placeholder="Chercher"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="bg-transparent text-base outline-none text-gray-700 w-32"
                />
              </div>
              <button 
                onClick={() => setIsAddMemberModalOpen(true)}
                className="flex items-center gap-1 px-5 py-2.5 bg-orange-500 text-white text-base font-semibold rounded-full hover:bg-orange-600 transition"
              >
                + Nouveau
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3 px-3 w-8"></th>
                  <th className="py-3 px-3 text-base text-gray-700 font-semibold">Spécialité ▾</th>
                  <th className="py-3 pl-12 text-base text-gray-700 font-semibold">Nom ▾</th>
                  <th className="py-3 pl-8 text-base text-gray-700 font-semibold">Email ▾</th>
                  <th className="py-3 px-3 text-base text-gray-700 font-semibold">Date de début ▾</th>
                  <th className="py-3 pl-6 text-base text-gray-700 font-semibold">Statut ▾</th>
                  <th className="py-3 px-3 w-8"></th>
                  <th className="py-3 px-3 w-8 text-gray-300"></th>
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
            <h2 className="text-2xl font-bold text-gray-800">Présences</h2>
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
                  editable={true}
                  onStatusChange={async (newStatus) => {
                    try {
                      const selectedDate = attendanceWeek?.dates[selectedDay];
                      if (!selectedDate) {
                        console.error('Date non disponible');
                        alert('Date non disponible');
                        return;
                      }
                      
                      if (!worker.id || !worker.teamId) {
                        console.error('Données worker invalides:', worker);
                        alert('Erreur: données de l\'employé invalides. Veuillez recharger la page.');
                        return;
                      }
                      
                      console.log('Updating attendance:', {
                        teamId: worker.teamId,
                        userId: worker.id,
                        date: selectedDate,
                        status: newStatus,
                        worker: worker
                      });
                      
                      await teamService.updateAttendance(
                        worker.teamId,
                        worker.id,
                        selectedDate,
                        newStatus
                      );
                      
                      // Mettre à jour l'état local
                      setAttendanceWeek(prev => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          attendances: {
                            ...prev.attendances,
                            [worker.id]: prev.attendances[worker.id].map((s, i) => 
                              i === selectedDay ? newStatus : s
                            )
                          }
                        };
                      });
                    } catch (err) {
                      console.error('Erreur lors de la mise à jour du statut:', err);
                      alert('Impossible de mettre à jour le statut');
                    }
                  }}
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
                  <span className="text-base font-bold text-gray-800">{count}</span>
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
