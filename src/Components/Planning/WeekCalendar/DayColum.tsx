import React from 'react';


import TaskCard, { Task } from "./TaskCard";

interface DayColumnProps {
  date: Date;
  weather: string;
  weatherIcon: string;
  tasks: Task[];
  isToday: boolean;
}

const Days = ["DIM", "LUN", "MAR", "MER", "JEU", "VEN", "SAM"];

export default function DayColumn({ date, weather, weatherIcon, tasks, isToday }: DayColumnProps) {
  const dayName = Days[date.getDay()];
  const dayNum = date.getDate();

  return (
    <div className="flex flex-col min-w-0 flex-1 border-r border-gray-100 last:border-r-0 px-2">
      {/* Header */}
      <div className="text-center mb-3 pb-3 border-b border-gray-100">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
          {dayName}
        </p>
        <p className={`text-2xl font-bold mb-1 ${isToday ? "text-blue-500" : "text-gray-800"}`}>
          {String(dayNum).padStart(2, "0")}
        </p>
        <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
          <span>{weatherIcon}</span> {weather}
        </p>
      </div>

      {/* Tasks */}
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}