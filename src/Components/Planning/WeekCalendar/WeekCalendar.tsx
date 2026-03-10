import { useState } from "react";
import DayColumn from "./DayColum";
import { Task } from "./TaskCard";
import React from 'react';

interface WeatherDay {
    date: string;
    label: string;
    icon: string;
}

interface WeekCalendarCard {
    tasks: Task[];
    weather?: WeatherDay[];
    onTaskClick?: (taskId: string) => void;
    onCreateTask?: () => void;
}

type View = "Mois" | "Semaine" | "Jour";

function getMonday(date: Date) :  Date {
    const getDate = new Date(date);
    const day = getDate.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    getDate.setDate(getDate.getDate() + diff);
    getDate.setHours(0, 0, 0, 0);
    return getDate;
}



function getWeekDays(monday: Date) : Date[] {
    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i)
        return date
    });
}

function formatWeekRange(monday: Date) : string {
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6)
    const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    return`${monday.getDate()} - ${sunday.getDate()} ${months[sunday.getMonth()]} ${sunday.getFullYear()}`;
}

function convertDate(date: Date) : string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

const LEGEND = [
  { status: "done",         label: "Terminé",      color: "bg-green-400"  },
  { status: "weather-risk", label: "Risque météo",  color: "bg-yellow-400" },
  { status: "late",         label: "En retard",     color: "bg-red-400"    },
  { status: "in-progress",  label: "En cours",      color: "bg-blue-400"   },
];

export default function WeekCalendar({ tasks, weather = [], onTaskClick, onCreateTask } : WeekCalendarCard) {
    const [weekStart, setWeekStart] = useState<Date>(getMonday(new Date()));
    const [view, setView] = useState<View>("Semaine");
    const days = getWeekDays(weekStart);
    const todayConvert = convertDate(new Date());

    const prevWeek = () => {
        const date = new Date(weekStart);
        date.setDate(date.getDate() - 7);
        setWeekStart(date);
    };
    const nextWeek = () => {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + 7);
        setWeekStart(date);
    };

    const now = () => setWeekStart(getMonday(new Date()));
    const getWeather = (date: Date) => {
        const convert = convertDate(date);
        return weather.find((w) => w.date === convert) ?? { label: "—", icon: "🌤️" };
    };

    const getTasksForDay = (date: Date) => {
        const convert = convertDate(date);
        return tasks.filter((t) => t.date === convert);
    };
    return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Planning de la semaine</h2>
        </div>
        <div className="flex items-center gap-3">
          {/* New Task Button */}
          {onCreateTask && (
            <button
              onClick={onCreateTask}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
              aria-label="Créer une nouvelle tâche"
            >
              <span className="text-base" aria-hidden="true">+</span>
              Nouvelle tâche
            </button>
          )}
          {/* Toggle view - disabled for now */}
          <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
            {(["Mois", "Semaine", "Jour"] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => v === "Semaine" && setView(v)}
                disabled={v !== "Semaine"}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  view === v ? "bg-white shadow text-gray-900" : v === "Semaine" ? "text-gray-400 hover:text-gray-600" : "text-gray-300 cursor-not-allowed"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={prevWeek}
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-700"
            aria-label="Semaine précédente"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <span className="text-base font-semibold text-gray-900">
            {formatWeekRange(weekStart)}
          </span>
          <button
            onClick={nextWeek}
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-700"
            aria-label="Semaine suivante"
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
        <button
          onClick={now}
          className="px-4 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
          aria-label="Revenir à la semaine actuelle"
        >
          Aujourd hui
        </button>
      </div>
        {/* Grid */}
      <div 
        className="flex border border-gray-100 rounded-xl overflow-y-auto" 
        style={{ minHeight: '780px', maxHeight: '780px' }}
        role="grid"
        aria-label={`Calendrier de la semaine du ${formatWeekRange(weekStart)}`}
      >
        <div role="row" className="flex flex-1">
          {days.map((day, index) => (
            <DayColumn
              key={convertDate(day)}
              date={day}
              weather={getWeather(day).label}
              weatherIcon={getWeather(day).icon}
              tasks={getTasksForDay(day)}
              isToday={convertDate(day) === todayConvert}
              onTaskClick={onTaskClick}
              showTimeLabels={index === 0}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-4" role="list" aria-label="Légende des statuts de tâches">
        {LEGEND.map((l) => (
          <div key={l.status} className="flex items-center gap-1.5" role="listitem">
            <span className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
            <span className="text-sm text-gray-700">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


