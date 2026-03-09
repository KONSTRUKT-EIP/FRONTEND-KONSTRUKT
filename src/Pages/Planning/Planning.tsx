import StatCard from "../../Components/Planning/Task/TaskResum";
import WeekCalendar from "../../Components/Planning/WeekCalendar/WeekCalendar";
import ActionsPanel from "../../Components/Planning/Action/ActionPanel";
import { Task } from "../../Components/Planning/WeekCalendar/TaskCard";
import { Action } from "../../Components/Planning/Action/ActionItem";

const stats = [
  { icon: "📋", iconBg: "bg-gray-100",  label: "Tâches cette semaine", value: 14 },
  { icon: "⏰", iconBg: "bg-red-50",    label: "Tâches en retard",     value: 3  },
  { icon: "⚠️", iconBg: "bg-yellow-50", label: "À risque météo",       value: 2  },
];

const today = new Date();
const getDateISO = (offset: number) => {
  const d = new Date(today);
  const day = d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  monday.setDate(monday.getDate() + offset);
  return monday.toISOString().split("T")[0];
};

const tasks: Task[] = [
  { id: "1", label: "Terrassement",       date: getDateISO(0), time: "MATIN",   status: "done"         },
  { id: "2", label: "Début fondations",   date: getDateISO(0), time: "A-M",     status: "in-progress"  },
  { id: "3", label: "Fondations validées",date: getDateISO(1), time: "MATIN",   status: "done"         },
  { id: "4", label: "Livraison acier",    date: getDateISO(1), time: "14:00",   status: "done"         },
  { id: "5", label: "Préparation dalle",  date: getDateISO(2), time: "MATIN",   status: "in-progress"  },
  { id: "6", label: "Point équipe",       date: getDateISO(2), time: "15:00",   status: "in-progress"  },
  { id: "7", label: "Livraison (à reporter)", date: getDateISO(3), time: "08:00", status: "weather-risk"},
  { id: "8", label: "Risque intempéries", date: getDateISO(3), time: "JOURNÉE", status: "weather-risk" },
  { id: "9", label: "Coulage dalle (retard)", date: getDateISO(4), time: "MATIN", status: "late"       },
  { id: "10",label: "Créneau rattrapage", date: getDateISO(4), time: "A-M",     status: "in-progress"  },
  { id: "11",label: "Équipe de réserve",  date: getDateISO(5), time: "MATIN",   status: "in-progress"  },
];

const weather = [
  { date: getDateISO(0), label: "Beau",     icon: "☀️" },
  { date: getDateISO(1), label: "Variable", icon: "🌤️" },
  { date: getDateISO(2), label: "Nuageux",  icon: "☁️" },
  { date: getDateISO(3), label: "Pluie",    icon: "🌧️" },
  { date: getDateISO(4), label: "Actuel",   icon: "📅" },
  { date: getDateISO(5), label: "Accalmie", icon: "🌥️" },
  { date: getDateISO(6), label: "Repos",    icon: "🌙" },
];

const actions: Action[] = [
  { id: "1", icon: "⏰", iconBg: "bg-red-50",    label: "Coulage dalle",    sublabel: "Secteur A",    sublabelIcon: "📍", badge: "En retard" },
  { id: "2", icon: "🌧️", iconBg: "bg-blue-50",   label: "Livraison béton",  sublabel: "Prévu jeudi",  sublabelIcon: "📅", badge: "À décaler" },
  { id: "3", icon: "💨", iconBg: "bg-orange-50", label: "Pose charpente",   sublabel: "Semaine pro.", sublabelIcon: "📅", badge: "À risque"  },
];

export default function Planning() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Planning</h1>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-6">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <WeekCalendar tasks={tasks} weather={weather} />
        </div>
        <div className="col-span-1">
          <ActionsPanel actions={actions} />
        </div>
      </div>
    </div>
  );
}