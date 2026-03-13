import StatCard from "../../Components/Planning/Task/TaskResum";
import WeekCalendar from "../../Components/Planning/WeekCalendar/WeekCalendar";
import ActionsPanel from "../../Components/Planning/Action/ActionPanel";
import { Task } from "../../Components/Planning/WeekCalendar/TaskCard";
import { Action } from "../../Components/Planning/Action/ActionItem";
import CreateTaskModal, { CreateTaskPayload } from "../../Components/Planning/Modal/CreateTaskModal";
import TaskDetailModal from "../../Components/Planning/Modal/TaskDetailModal";
import React, { useState } from 'react';

const today = new Date();
const getDateISO = (offset: number) => {
  const d = new Date(today);
  const day = d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  monday.setDate(monday.getDate() + offset);
  return monday.toISOString().split("T")[0];
};

// Données météo en dur (pourra être remplacé par un appel API plus tard)
const weather = [
  { date: getDateISO(0), label: "Beau",     icon: "☀️" },
  { date: getDateISO(1), label: "Variable", icon: "🌤️" },
  { date: getDateISO(2), label: "Nuageux",  icon: "☁️" },
  { date: getDateISO(3), label: "Pluie",    icon: "🌧️" },
  { date: getDateISO(4), label: "Variable", icon: "⛅" },
  { date: getDateISO(5), label: "Accalmie", icon: "🌥️" },
  { date: getDateISO(6), label: "Repos",    icon: "🌙" },
];

export default function Planning() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const [tasks, setTasks] = useState<Task[]>([
    // Lundi
    { id: "t2",  label: "Pose armatures voile A",     date: getDateISO(0), time: "08:00", status: "in-progress"  },
    { id: "t5",  label: "Inspection sécurité",         date: getDateISO(0), time: "14:00", status: "in-progress"  },
    { id: "t10", label: "Réunion chantier hebdo",      date: getDateISO(0), time: "07:00", status: "done"         },
    // Mardi
    { id: "t3",  label: "Coffrage escalier",           date: getDateISO(1), time: "09:00", status: "late"         },
    { id: "t7",  label: "Mise en place échafaudages",  date: getDateISO(1), time: "07:00", status: "in-progress"  },
    { id: "t11", label: "Contrôle ferraillage voile B",date: getDateISO(1), time: "13:00", status: "in-progress"  },
    // Mercredi
    { id: "t4",  label: "Réception livraison acier",   date: getDateISO(2), time: "06:30", status: "done"         },
    { id: "t8",  label: "Décoffrage voile sud",        date: getDateISO(2), time: "08:00", status: "in-progress"  },
    { id: "t12", label: "Nettoyage zone de stockage",  date: getDateISO(2), time: "14:00", status: "done"         },
    // Jeudi
    { id: "t1",  label: "Coulage dalle R+2",           date: getDateISO(3), time: "07:00", status: "weather-risk" },
    { id: "t9",  label: "Pose hourdis plancher R+1",   date: getDateISO(3), time: "09:00", status: "weather-risk" },
    { id: "t13", label: "Passage coordinateur OPC",    date: getDateISO(3), time: "14:00", status: "in-progress"  },
    // Vendredi
    { id: "t6",  label: "Bétonnage mur périph.",       date: getDateISO(4), time: "07:00", status: "in-progress"  },
    { id: "t14", label: "Réception livraison bois",    date: getDateISO(4), time: "10:00", status: "in-progress"  },
    { id: "t15", label: "Repli matériel zone A",       date: getDateISO(4), time: "15:00", status: "in-progress"  },
  ]);

  const [actions, setActions] = useState<Action[]>([
    {
      id: "a1",
      icon: "🌧️",
      iconBg: "bg-blue-50",
      label: "Décaler le coulage de la dalle",
      sublabel: "Pluie prévue jeudi — risque de malfaçon béton",
      sublabelIcon: "⚠️",
      badge: "À décaler",
    },
    {
      id: "a2",
      icon: "⏰",
      iconBg: "bg-red-50",
      label: "Coffrage escalier en retard",
      sublabel: "Prévu lundi, reporté deux fois",
      sublabelIcon: "🔴",
      badge: "En retard",
    },
    {
      id: "a3",
      icon: "⚡",
      iconBg: "bg-orange-50",
      label: "Vérifier livraison acier",
      sublabel: "Confirmation transporteur manquante",
      sublabelIcon: "📦",
      badge: "À risque",
    },
  ]);

  const [stats] = useState([
    { icon: "📋", iconBg: "bg-gray-100",  label: "Tâches cette semaine", value: 15 },
    { icon: "⏰", iconBg: "bg-red-50",    label: "Tâches en retard",     value: 1  },
    { icon: "⚠️", iconBg: "bg-yellow-50", label: "À risque météo",       value: 3  },
  ]);

  const handleCreateTask = async (payload: CreateTaskPayload) => {
    const newTask: Task = {
      id: `t${Date.now()}`,
      label: payload.name,
      date: payload.plannedEnd,
      time: payload.time,
      status: "in-progress",
    };
    setTasks(prev => [...prev, newTask]);
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsDetailModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Planning</h1>
      </div>

      {/* Stats & Actions */}
      <div className="flex gap-4 mb-6">
        <div className="flex flex-col gap-4 flex-1">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
        <div className="flex-1">
          <ActionsPanel actions={actions} />
        </div>
      </div>

      {/* Planning Calendar */}
      <div>
        <WeekCalendar
          tasks={tasks}
          weather={weather}
          onTaskClick={handleTaskClick}
          onCreateTask={() => setIsCreateModalOpen(true)}
        />
      </div>

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
      />
      <TaskDetailModal
        isOpen={isDetailModalOpen}
        taskId={selectedTaskId}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedTaskId(null);
        }}
        onTaskUpdate={() => {}}
      />
    </main>
  );
}