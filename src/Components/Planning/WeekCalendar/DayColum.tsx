import React from 'react';


import TaskCard, { Task } from "./TaskCard";

interface DayColumnProps {
  date: Date;
  weather: string;
  weatherIcon: string;
  tasks: Task[];
  isToday: boolean;
  onTaskClick?: (taskId: string) => void;
  showTimeLabels?: boolean;
}

const Days = ["DIM", "LUN", "MAR", "MER", "JEU", "VEN", "SAM"];
const HOURS = Array.from({ length: 13 }, (_, i) => i + 7);
const parseTimeToMinutes = (time?: string): number | null => {
  if (!time) return null;
  
  if (time.includes(':')) {
    const [hours, minutes] = time.split(':').map(Number);
    return (hours - 7) * 60 + minutes;
  }
  
  const timeMap: Record<string, number> = {
    'MATIN': 8 * 60,
    'A-M': 14 * 60,
    'JOURNÉE': 10 * 60,
  };
  
  return timeMap[time.toUpperCase()] || null;
};

export default function DayColumn({ date, weather, weatherIcon, tasks, isToday, onTaskClick, showTimeLabels = false }: DayColumnProps) {
  const dayName = Days[date.getDay()];
  const dayNum = date.getDate();
  const HOUR_HEIGHT = 60;
  const now = new Date();
  const currentMinutes = isToday ? (now.getHours() - 7) * 60 + now.getMinutes() : null;
  const showCurrentTimeLine = currentMinutes !== null && currentMinutes >= 0 && currentMinutes <= 12 * 60;
  const tasksByMinutes: Record<number, Task[]> = {};
  tasks.forEach((task, idx) => {
    const minutes = parseTimeToMinutes(task.time);
    const key = minutes !== null ? minutes : 60 + idx * 60;
    if (!tasksByMinutes[key]) tasksByMinutes[key] = [];
    tasksByMinutes[key].push(task);
  });

  return (
    <div 
      className={`flex flex-col min-w-0 flex-1 border-r border-gray-100 last:border-r-0 relative ${isToday ? 'bg-blue-100/60' : ''}`}
      role="gridcell"
      aria-label={`${dayName} ${dayNum}, ${weather}`}
    >
      {/* Header with weather - fixed at top */}
      <div className="sticky top-0 bg-white z-10 text-center py-3 pb-3 border-b border-gray-100">
        <p className="text-sm font-semibold text-gray-600 uppercase tracking-widest mb-1">
          {dayName}
        </p>
        <p className={`text-3xl font-bold mb-1 ${isToday ? "text-blue-500" : "text-gray-800"}`}> 
          {String(dayNum).padStart(2, "0")}
        </p>
        <p className="text-sm text-gray-600 flex items-center justify-center gap-1.5">
          <span className="text-lg" aria-hidden="true">{weatherIcon}</span> 
          <span aria-label={`Météo: ${weather}`}>{weather}</span>
        </p>
      </div>

      {/* Time grid container */}
      <div className="relative flex-1">
        {/* Show time labels only for first column */}
        {showTimeLabels && (
          <div className="absolute left-0 top-0 w-14 h-full pt-1">
            {HOURS.map((hour) => (
              <div 
                key={hour} 
                className="absolute left-0 text-sm text-gray-700 font-semibold"
                style={{ 
                  top: `${(hour - 7) * HOUR_HEIGHT}px`,
                  transform: hour === 7 ? 'translateY(0)' : 'translateY(-50%)'
                }}
                aria-label={`${String(hour).padStart(2, '0')} heures`}
              >
                {String(hour).padStart(2, '0')}h
              </div>
            ))}
          </div>
        )}

        {/* Grid lines */}
        <div className={`${showTimeLabels ? 'pl-14' : 'pl-3'} pr-3`}>
          {HOURS.map((hour) => (
            <div key={hour} className="relative" style={{ height: `${HOUR_HEIGHT}px` }}>
              <div className="border-t border-gray-200 absolute top-0 w-full" />
              {/* Half-hour line */}
              <div className="border-t border-gray-100 absolute top-1/2 w-full" />
            </div>
          ))}
        </div>

        {/* Tasks positionnées absolument et split avec flex */}
        <div className={`absolute top-0 ${showTimeLabels ? 'left-14' : 'left-3'} right-3 pointer-events-none`}>
          {Object.entries(tasksByMinutes).map(([minutes, tasksAtMinute]) => {
            const topPosition = Number(minutes);
            return (
              <div
                key={minutes}
                className="absolute w-full flex gap-0.5 pointer-events-auto"
                style={{
                  top: `${topPosition}px`,
                  height: `${HOUR_HEIGHT - 1}px`
                }}
              >
                {tasksAtMinute.map((task) => (
                  <div key={task.id} className="flex-1 min-w-0 overflow-hidden h-full" style={{ maxWidth: `${100 / tasksAtMinute.length}%` }}>
                    <TaskCard 
                      task={task} 
                      onClick={() => onTaskClick?.(task.id)}
                      isCompact={tasksAtMinute.length > 1}
                    />
                  </div>
                ))}
              </div>
            );
          })}

          {/* Current time indicator */}
          {showCurrentTimeLine && (
            <div 
              className="absolute w-full flex items-center"
              style={{ top: `${currentMinutes}px` }}
              role="status"
              aria-label={`Heure actuelle: ${now.getHours()}h${String(now.getMinutes()).padStart(2, '0')}`}
            >
              <div className="w-3 h-3 rounded-full bg-red-500 -ml-1.5 z-10" aria-hidden="true" />
              <div className="flex-1 h-0.5 bg-red-500" aria-hidden="true" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
