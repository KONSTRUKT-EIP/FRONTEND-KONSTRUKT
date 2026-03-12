import { useNavigate, useParams } from "react-router-dom";
import WorkerRow from "../../Components/Dashboard/WorkforceTable/WorkerRow";
import React, { useState } from 'react';
import AttendanceBadge, { AttendanceStatus, attendanceConfig } from "../../Components/Dashboard/Attendance/AttendanceBadge";
import AttendanceCard from "../../Components/Dashboard/Attendance/AttendanceCard";
import AttendanceDaySelector from "../../Components/Dashboard/Attendance/AttendanceDaySelector";
import { teamService, TeamMember, AttendanceWeek } from '../../services/teamService';
import { getSiteUUID } from '../../utils/siteMapping';
import AddMemberModal from '../../Components/Dashboard/Modal/AddMemberModal';
import InputCard from "../../Components/Team/InputCard";
import ModalHoursTeam from "../Team/ModalHours";

const chantierNames: Record<string, string> = {
  "1": "Tour Horizon",
  "2": "Résidence Les Pins",
  "3": "Pont Sud",
  "4": "Centre Commercial",
  "5": "Immeuble Lumière",
  "6": "Stade Municipal",
};

interface MockWorker {
  id: string;
  specialite: string;
  name: string;
  email: string;
  dateDebut: string;
  status: string;
  starred: boolean;
  initials: string;
  color: string;
  teamId: string;
}

type MockAttendanceWeek = {
  days: string[];
  dates: string[];
  attendances: Record<string, AttendanceStatus[]>;
};

const mockWorkers: Record<string, MockWorker[]> = {
  "1": [
    { id: "w1-1", specialite: "Maçonnerie",  name: "Jean Dupont",     email: "j.dupont@konstrukt.fr",    dateDebut: "2025-09-01", status: "Actif", starred: true,  initials: "JD", color: "#f97316", teamId: "t1" },
    { id: "w1-2", specialite: "Électricité", name: "Sophie Martin",   email: "s.martin@konstrukt.fr",    dateDebut: "2025-10-15", status: "Actif", starred: false, initials: "SM", color: "#6366f1", teamId: "t1" },
    { id: "w1-3", specialite: "Plomberie",   name: "Luc Bernard",     email: "l.bernard@konstrukt.fr",   dateDebut: "2025-11-01", status: "Actif", starred: false, initials: "LB", color: "#10b981", teamId: "t1" },
    { id: "w1-4", specialite: "Charpente",   name: "Emma Leroy",      email: "e.leroy@konstrukt.fr",     dateDebut: "2026-01-10", status: "Actif", starred: true,  initials: "EL", color: "#f43f5e", teamId: "t1" },
    { id: "w1-5", specialite: "Finitions",   name: "Karim Bensaid",   email: "k.bensaid@konstrukt.fr",   dateDebut: "2026-02-20", status: "Actif", starred: false, initials: "KB", color: "#8b5cf6", teamId: "t1" },
  ],
  "2": [
    { id: "w2-1", specialite: "Maçonnerie",  name: "Marie Leroy",     email: "m.leroy@konstrukt.fr",     dateDebut: "2025-08-01", status: "Actif", starred: true,  initials: "ML", color: "#0ea5e9", teamId: "t2" },
    { id: "w2-2", specialite: "Béton",       name: "Thomas Garnier",  email: "t.garnier@konstrukt.fr",   dateDebut: "2025-09-15", status: "Actif", starred: false, initials: "TG", color: "#84cc16", teamId: "t2" },
    { id: "w2-3", specialite: "Électricité", name: "Clara Rousseau",  email: "c.rousseau@konstrukt.fr",  dateDebut: "2025-12-01", status: "Actif", starred: false, initials: "CR", color: "#f97316", teamId: "t2" },
    { id: "w2-4", specialite: "Plomberie",   name: "Romain Dupuis",   email: "r.dupuis@konstrukt.fr",    dateDebut: "2026-01-20", status: "Actif", starred: false, initials: "RD", color: "#6366f1", teamId: "t2" },
  ],
  "3": [
    { id: "w3-1", specialite: "Génie civil", name: "Pierre Martin",   email: "p.martin@konstrukt.fr",    dateDebut: "2025-06-01", status: "Actif", starred: true,  initials: "PM", color: "#10b981", teamId: "t3" },
    { id: "w3-2", specialite: "Béton",       name: "Alice Moreau",    email: "a.moreau@konstrukt.fr",    dateDebut: "2025-07-15", status: "Actif", starred: false, initials: "AM", color: "#f43f5e", teamId: "t3" },
    { id: "w3-3", specialite: "Armature",    name: "Nabil Kader",     email: "n.kader@konstrukt.fr",     dateDebut: "2025-09-01", status: "Actif", starred: false, initials: "NK", color: "#8b5cf6", teamId: "t3" },
    { id: "w3-4", specialite: "Charpente",   name: "Léa Fontaine",    email: "l.fontaine@konstrukt.fr",  dateDebut: "2025-11-10", status: "Actif", starred: true,  initials: "LF", color: "#0ea5e9", teamId: "t3" },
    { id: "w3-5", specialite: "Sécurité",    name: "Marc Vidal",      email: "m.vidal@konstrukt.fr",     dateDebut: "2026-01-05", status: "Actif", starred: false, initials: "MV", color: "#84cc16", teamId: "t3" },
    { id: "w3-6", specialite: "Électricité", name: "Chloé Renard",    email: "c.renard@konstrukt.fr",    dateDebut: "2026-02-01", status: "Actif", starred: false, initials: "CR", color: "#f97316", teamId: "t3" },
  ],
  "4": [
    { id: "w4-1", specialite: "Maçonnerie",  name: "Sophie Bernard",  email: "s.bernard@konstrukt.fr",   dateDebut: "2025-05-01", status: "Actif", starred: true,  initials: "SB", color: "#6366f1", teamId: "t4" },
    { id: "w4-2", specialite: "Béton",       name: "Antoine Blanc",   email: "a.blanc@konstrukt.fr",     dateDebut: "2025-06-15", status: "Actif", starred: false, initials: "AB", color: "#10b981", teamId: "t4" },
    { id: "w4-3", specialite: "Charpente",   name: "Julie Chevalier", email: "j.chevalier@konstrukt.fr", dateDebut: "2025-08-01", status: "Actif", starred: true,  initials: "JC", color: "#f43f5e", teamId: "t4" },
    { id: "w4-4", specialite: "Électricité", name: "Hugo Laurent",    email: "h.laurent@konstrukt.fr",   dateDebut: "2025-10-01", status: "Actif", starred: false, initials: "HL", color: "#8b5cf6", teamId: "t4" },
    { id: "w4-5", specialite: "Plomberie",   name: "Yasmine Okafor",  email: "y.okafor@konstrukt.fr",    dateDebut: "2025-12-15", status: "Actif", starred: false, initials: "YO", color: "#0ea5e9", teamId: "t4" },
    { id: "w4-6", specialite: "Finitions",   name: "Maxime Perrin",   email: "m.perrin@konstrukt.fr",    dateDebut: "2026-01-15", status: "Actif", starred: false, initials: "MP", color: "#84cc16", teamId: "t4" },
    { id: "w4-7", specialite: "Sécurité",    name: "Laura Simon",     email: "l.simon@konstrukt.fr",     dateDebut: "2026-02-10", status: "Actif", starred: false, initials: "LS", color: "#f97316", teamId: "t4" },
  ],
  "5": [
    { id: "w5-1", specialite: "Maçonnerie",  name: "Lucas Petit",     email: "l.petit@konstrukt.fr",     dateDebut: "2025-07-01", status: "Actif", starred: true,  initials: "LP", color: "#6366f1", teamId: "t5" },
    { id: "w5-2", specialite: "Armature",    name: "Sarah Marchand",  email: "s.marchand@konstrukt.fr",  dateDebut: "2025-08-15", status: "Actif", starred: false, initials: "SM", color: "#10b981", teamId: "t5" },
    { id: "w5-3", specialite: "Béton",       name: "Alexis Durand",   email: "a.durand@konstrukt.fr",    dateDebut: "2025-10-01", status: "Actif", starred: false, initials: "AD", color: "#f43f5e", teamId: "t5" },
    { id: "w5-4", specialite: "Finitions",   name: "Nina Girard",     email: "n.girard@konstrukt.fr",    dateDebut: "2026-01-05", status: "Actif", starred: true,  initials: "NG", color: "#8b5cf6", teamId: "t5" },
    { id: "w5-5", specialite: "Électricité", name: "Samuel Morel",    email: "s.morel@konstrukt.fr",     dateDebut: "2026-02-15", status: "Actif", starred: false, initials: "SM", color: "#0ea5e9", teamId: "t5" },
  ],
  "6": [
    { id: "w6-1", specialite: "Génie civil", name: "Emma Moreau",     email: "e.moreau@konstrukt.fr",    dateDebut: "2025-04-01", status: "Actif", starred: true,  initials: "EM", color: "#84cc16", teamId: "t6" },
    { id: "w6-2", specialite: "Béton",       name: "Julien Faure",    email: "j.faure@konstrukt.fr",     dateDebut: "2025-05-15", status: "Actif", starred: false, initials: "JF", color: "#f97316", teamId: "t6" },
    { id: "w6-3", specialite: "Charpente",   name: "Camille Arnaud",  email: "c.arnaud@konstrukt.fr",    dateDebut: "2025-07-01", status: "Actif", starred: false, initials: "CA", color: "#6366f1", teamId: "t6" },
    { id: "w6-4", specialite: "Armature",    name: "Dylan Hubert",    email: "d.hubert@konstrukt.fr",    dateDebut: "2025-09-01", status: "Actif", starred: true,  initials: "DH", color: "#10b981", teamId: "t6" },
    { id: "w6-5", specialite: "Électricité", name: "Inès Collet",     email: "i.collet@konstrukt.fr",    dateDebut: "2025-11-15", status: "Actif", starred: false, initials: "IC", color: "#f43f5e", teamId: "t6" },
    { id: "w6-6", specialite: "Plomberie",   name: "Baptiste Roy",    email: "b.roy@konstrukt.fr",       dateDebut: "2026-01-20", status: "Actif", starred: false, initials: "BR", color: "#8b5cf6", teamId: "t6" },
    { id: "w6-7", specialite: "Finitions",   name: "Manon Schmitt",   email: "m.schmitt@konstrukt.fr",   dateDebut: "2026-02-05", status: "Actif", starred: false, initials: "MS", color: "#0ea5e9", teamId: "t6" },
    { id: "w6-8", specialite: "Sécurité",    name: "Théo Vincent",    email: "t.vincent@konstrukt.fr",   dateDebut: "2026-03-01", status: "Actif", starred: false, initials: "TV", color: "#84cc16", teamId: "t6" },
  ],
};

const mockAttendanceData: Record<string, MockAttendanceWeek> = {
  "1": {
    days:  ["Lun 9", "Mar 10", "Mer 11", "Jeu 12", "Ven 13"],
    dates: ["2026-03-09", "2026-03-10", "2026-03-11", "2026-03-12", "2026-03-13"],
    attendances: {
      "w1-1": ["present", "present", "present",    "present",    "present"],
      "w1-2": ["present", "retard",  "present",    "present",    "present"],
      "w1-3": ["present", "present", "absent",     "present",    "present"],
      "w1-4": ["conge",   "conge",   "conge",      "conge",      "conge"],
      "w1-5": ["present", "present", "retard",     "en-attente", "present"],
    },
  },
  "2": {
    days:  ["Lun 9", "Mar 10", "Mer 11", "Jeu 12", "Ven 13"],
    dates: ["2026-03-09", "2026-03-10", "2026-03-11", "2026-03-12", "2026-03-13"],
    attendances: {
      "w2-1": ["present", "present", "present", "present", "present"],
      "w2-2": ["present", "present", "retard",  "present", "present"],
      "w2-3": ["absent",  "absent",  "absent",  "present", "present"],
      "w2-4": ["present", "present", "present", "present", "retard"],
    },
  },
  "3": {
    days:  ["Lun 9", "Mar 10", "Mer 11", "Jeu 12", "Ven 13"],
    dates: ["2026-03-09", "2026-03-10", "2026-03-11", "2026-03-12", "2026-03-13"],
    attendances: {
      "w3-1": ["present", "present", "present", "present", "present"],
      "w3-2": ["retard",  "present", "present", "present", "present"],
      "w3-3": ["present", "present", "present", "absent",  "absent"],
      "w3-4": ["present", "retard",  "present", "present", "present"],
      "w3-5": ["conge",   "conge",   "present", "present", "present"],
      "w3-6": ["present", "present", "present", "retard",  "present"],
    },
  },
  "4": {
    days:  ["Lun 9", "Mar 10", "Mer 11", "Jeu 12", "Ven 13"],
    dates: ["2026-03-09", "2026-03-10", "2026-03-11", "2026-03-12", "2026-03-13"],
    attendances: {
      "w4-1": ["present",    "present", "present", "present", "present"],
      "w4-2": ["present",    "retard",  "retard",  "present", "present"],
      "w4-3": ["present",    "present", "present", "present", "retard"],
      "w4-4": ["absent",     "absent",  "present", "present", "present"],
      "w4-5": ["present",    "present", "present", "conge",   "conge"],
      "w4-6": ["retard",     "present", "present", "present", "present"],
      "w4-7": ["en-attente", "present", "present", "present", "present"],
    },
  },
  "5": {
    days:  ["Lun 9", "Mar 10", "Mer 11", "Jeu 12", "Ven 13"],
    dates: ["2026-03-09", "2026-03-10", "2026-03-11", "2026-03-12", "2026-03-13"],
    attendances: {
      "w5-1": ["present", "present", "present",    "present",    "present"],
      "w5-2": ["present", "present", "absent",     "absent",     "present"],
      "w5-3": ["retard",  "present", "present",    "present",    "present"],
      "w5-4": ["conge",   "conge",   "conge",      "present",    "present"],
      "w5-5": ["present", "present", "present",    "retard",     "en-attente"],
    },
  },
  "6": {
    days:  ["Lun 9", "Mar 10", "Mer 11", "Jeu 12", "Ven 13"],
    dates: ["2026-03-09", "2026-03-10", "2026-03-11", "2026-03-12", "2026-03-13"],
    attendances: {
      "w6-1": ["present",    "present", "present", "present", "present"],
      "w6-2": ["present",    "retard",  "present", "present", "present"],
      "w6-3": ["absent",     "present", "present", "present", "present"],
      "w6-4": ["present",    "present", "retard",  "retard",  "present"],
      "w6-5": ["present",    "present", "present", "present", "conge"],
      "w6-6": ["en-attente", "present", "present", "present", "present"],
      "w6-7": ["present",    "present", "absent",  "present", "present"],
      "w6-8": ["present",    "present", "present", "present", "present"],
    },
  },
};

export default function DashboardDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const chantierName = chantierNames[id ?? ""] ?? "Chantier";

  const [workers, setWorkers] = useState<TeamMember[]>([]);
  const [attendanceWeek, setAttendanceWeek] = useState<AttendanceWeek | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [openModal, setOpenModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [search, setSearch] = useState('');
  const [selectedDay, setSelectedDay] = useState(0);

  const fetchData = useCallback(async () => {
    const siteUUID = getSiteUUID(id);
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
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddMemberSuccess = () => {
    fetchData();
  };
  const handleWorkerClick = (worker: Worker) => {
    setSelectedWorker(worker);
    setOpenModal(true);
  };
  const toggleCheck = (wid: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(wid)) next.delete(wid);
      else next.add(wid);
      return next;
    });
  };

  const filtered = workers.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.specialite.toLowerCase().includes(search.toLowerCase())
  );

  const attendanceDays = attendanceWeek.days;

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
                  initials={worker.initials}
                  color={worker.color}
                  name={worker.name}
                  specialite={worker.specialite}
                  status={dayStatus}
                  editable={true}
                  // worker={worker}
                  // checked={checked.has(worker.id)}
                  // onCheck={() => toggleCheck(worker.id)}
                  // onClick={() => handleWorkerClick(worker)}
                  onStatusChange={async (newStatus) => {
                    try {
                      const selectedDate = attendanceWeek?.dates[selectedDay];
                      if (!selectedDate) {
                        console.error('Date non disponible');
                        return;
                      }

                      await teamService.updateAttendance(
                        worker.teamId,
                        worker.id,
                        selectedDate,
                        newStatus
                      );
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

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        siteId={getSiteUUID(id) || ''}
        onSuccess={handleAddMemberSuccess}
      />
      {openModal && (
      <ModalHoursTeam
        worker={selectedWorker}
        onClose={() => setOpenModal(false)}
      />
    )}
    </div>
  );
}
