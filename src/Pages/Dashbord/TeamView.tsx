import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";
import WorkerRow from "../../Components/Dashboard/WorkforceTable/WorkerRow";
import AttendanceBadge, {
  AttendanceStatus,
  attendanceConfig,
} from "../../Components/Dashboard/Attendance/AttendanceBadge";
import AttendanceCard from "../../Components/Dashboard/Attendance/AttendanceCard";
import AttendanceWeekNavigator, {
  getDefaultAttendanceDate,
} from "../../Components/Dashboard/Attendance/AttendanceWeekNavigator";
import {
  teamService,
  TeamMember,
  AttendanceWeek,
  ATTENDANCE_UPDATED_EVENT,
} from "../../services/teamService";
import AddMemberModal from "../../Components/Dashboard/Modal/AddMemberModal";
import ModalHoursTeam from "../Team/ModalHours";

const getMonday = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() - ((date.getDay() + 6) % 7));

const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;

export default function TeamView() {
  const { id } = useParams<{ id: string }>();
  const siteUUID = id;
  const navigate = useNavigate();

  const [chantierName] = useState<string>("Chantier");
  const [workers, setWorkers] = useState<TeamMember[]>([]);
  const [attendanceWeek, setAttendanceWeek] = useState<AttendanceWeek | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(getDefaultAttendanceDate);
  const [loadedWeek, setLoadedWeek] = useState<string | null>(null);
  const [selectedWorkerForHours, setSelectedWorkerForHours] = useState<TeamMember | null>(null);

  const weekMonday = getMonday(selectedDate);
  const weekStart = toDateKey(weekMonday);
  const selectedDay = (selectedDate.getDay() + 6) % 7;
  const isWeekLoaded = loadedWeek === weekStart;

  // isCurrent permet d'ignorer la réponse d'une semaine qui n'est plus affichée
  const fetchData = useCallback(async (isCurrent: () => boolean = () => true) => {
    if (!siteUUID) {
      setError("ID de chantier invalide");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const [membersData, attendanceData] = await Promise.all([
        teamService.getTeamMembersDetails(siteUUID),
        teamService.getAttendanceWeek(siteUUID, weekStart),
      ]);

      if (!isCurrent()) return;

      setWorkers(membersData);
      setAttendanceWeek(attendanceData);
      setLoadedWeek(weekStart);
      setError(null);
    } catch (err) {
      console.error("Erreur lors du chargement des données:", err);
      setError("Impossible de charger les données de l'équipe");
    } finally {
      setLoading(false);
    }
  }, [siteUUID, weekStart]);

  useEffect(() => {
    let active = true;
    const timeoutId = window.setTimeout(() => {
      void fetchData(() => active);
    }, 0);

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, [fetchData]);

  useEffect(() => {
    const handleAttendanceUpdate = () => {
      void fetchData();
    };

    window.addEventListener(ATTENDANCE_UPDATED_EVENT, handleAttendanceUpdate);
    return () => {
      window.removeEventListener(
        ATTENDANCE_UPDATED_EVENT,
        handleAttendanceUpdate,
      );
    };
  }, [fetchData]);

  const handleAddMemberSuccess = () => {
    fetchData();
  };

  const handleDeleteMembers = async () => {
    if (checked.size === 0) return;

    const confirmed = window.confirm(
      `Êtes-vous sûr de vouloir supprimer ${checked.size} employé(s) du chantier ?`
    );

    if (!confirmed) return;

    try {
      const teamIds = workers
        .filter((w) => checked.has(w.id))
        .map((w) => w.teamId);

      // Remove duplicates
      const uniqueTeamIds = [...new Set(teamIds)];

      for (const teamId of uniqueTeamIds) {
        const memberIds = workers
          .filter((w) => w.teamId === teamId && checked.has(w.id))
          .map((w) => w.id);

        for (const memberId of memberIds) {
          await teamService.removeMember(teamId, memberId);
        }
      }

      setChecked(new Set());
      await fetchData();
    } catch (err) {
      console.error("Erreur lors de la suppression des employés:", err);
      alert("Impossible de supprimer les employés");
    }
  };

  const toggleCheck = (wid: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(wid)) {
        next.delete(wid);
      } else {
        next.add(wid);
      }
      return next;
    });
  };

  const filtered = workers.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.specialite.toLowerCase().includes(search.toLowerCase())
  );

  const getDisplayStatus = (workerId: string, fallbackStatus: string) => {
    const attendanceStatus = attendanceWeek?.attendances[workerId]?.[selectedDay];

    switch (attendanceStatus) {
      case 'present':
        return 'Présent';
      case 'absent':
        return 'Absent';
      case 'retard':
        return 'En retard';
      case 'conge':
        return 'En congé';
      case 'en-attente':
        return 'En attente';
      default:
        return fallbackStatus || 'En attente';
    }
  };

  const selectedDateLabel = selectedDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8" aria-label="Page équipe">
      {/* Header */}
      <div className="mb-8">
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

      {/* Loading & Error States */}
      {loading && !attendanceWeek && (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Chargement...</div>
        </div>
      )}

      {error && !loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-red-500">{error}</div>
        </div>
      )}

      {attendanceWeek && !error && (
        <>
          {/* Workforce Table */}
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Équipe / {chantierName}
              </h2>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                  <input
                    type="text"
                    placeholder="Chercher"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
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
                    <th className="py-3 px-3 text-base text-gray-700 font-semibold">
                      Spécialité ▾
                    </th>
                    <th className="py-3 pl-12 text-base text-gray-700 font-semibold">
                      Nom ▾
                    </th>
                    <th className="py-3 pl-8 text-base text-gray-700 font-semibold">
                      Email ▾
                    </th>
                    <th className="py-3 px-3 text-base text-gray-700 font-semibold">
                      Date de début ▾
                    </th>
                    <th className="py-3 pl-6 text-base text-gray-700 font-semibold">
                      Statut ▾
                    </th>
                    <th className="py-3 px-3 w-8"></th>
                    <th className="py-3 px-3 w-8 text-gray-300"></th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((worker) => (
                    <WorkerRow
                      key={worker.id}
                      worker={{
                        id: worker.id as unknown as number,
                        specialite: worker.specialite,
                        name: worker.name,
                        email: worker.email,
                        dateDebut: worker.dateDebut,
                        status: getDisplayStatus(worker.id, worker.status),
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

            {!filtered.length && (
              <div className="py-8 text-center text-gray-500">
                Aucun membre trouvé.
              </div>
            )}
          </div>

          {/* Attendance Panel */}
          <div className="mt-6 bg-white rounded-2xl shadow p-6 border border-gray-100 flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Présences</h2>

            <AttendanceWeekNavigator
              weekMonday={weekMonday}
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
            />

            <p className="text-base font-semibold text-gray-600 first-letter:uppercase">
              {selectedDateLabel}
            </p>

            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-3 transition-opacity ${
                isWeekLoaded ? "" : "opacity-50"
              }`}
            >
              {workers.map((worker) => {
                const dayStatus = (attendanceWeek?.attendances[worker.id]?.[selectedDay] ||
                  "absent") as AttendanceStatus;

                return (
                  <AttendanceCard
                    key={worker.id}
                    initials={worker.initials}
                    color={worker.color}
                    name={worker.name}
                    specialite={worker.specialite}
                    status={dayStatus}
                    editable={isWeekLoaded}
                    hours={attendanceWeek?.workforceHours?.[worker.id]?.[selectedDay]}
                    onOpenHoursModal={() => setSelectedWorkerForHours(worker)}
                    onStatusChange={async (newStatus) => {
                      try {
                        const attendanceDate = attendanceWeek?.dates[selectedDay];

                        if (!attendanceDate) {
                          alert("Date non disponible");
                          return;
                        }

                        if (!worker.id || !worker.teamId) {
                          alert(
                            "Erreur: données de l'employé invalides. Veuillez recharger la page."
                          );
                          return;
                        }

                        await teamService.updateAttendance(
                          worker.teamId,
                          worker.id,
                          attendanceDate,
                          newStatus
                        );

                        void fetchData();
                      } catch (err) {
                        console.error("Erreur lors de la mise à jour du statut:", err);
                        alert("Impossible de mettre à jour le statut");
                      }
                    }}
                  />
                );
              })}
            </div>

            {/* Day summary */}
            <div className="flex gap-4 pt-2 border-t border-gray-100">
              {(Object.keys(attendanceConfig) as AttendanceStatus[]).map((s) => {
                const count = workers.filter(
                  (w) =>
                    (attendanceWeek?.attendances[w.id]?.[selectedDay] ?? "absent") === s
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

      {siteUUID && selectedWorkerForHours && attendanceWeek?.dates[selectedDay] && (
        <ModalHoursTeam
          worker={selectedWorkerForHours}
          siteId={siteUUID}
          date={attendanceWeek.dates[selectedDay]}
          initialNormalHours={attendanceWeek.workforceHours?.[selectedWorkerForHours.id]?.[selectedDay]?.normalHours ?? 0}
          initialOvertimeHours={attendanceWeek.workforceHours?.[selectedWorkerForHours.id]?.[selectedDay]?.overtimeHours ?? 0}
          onSaved={(normalHours, overtimeHours) => {
            setAttendanceWeek((prev) => {
              if (!prev) return prev;
              const currentHours = prev.workforceHours?.[selectedWorkerForHours.id] ?? [];
              const updatedHours = [...currentHours];
              updatedHours[selectedDay] = { normalHours, overtimeHours };
              return {
                ...prev,
                workforceHours: {
                  ...prev.workforceHours,
                  [selectedWorkerForHours.id]: updatedHours,
                },
              };
            });
          }}
          onClose={() => setSelectedWorkerForHours(null)}
        />
      )}
    </div>
  );
}