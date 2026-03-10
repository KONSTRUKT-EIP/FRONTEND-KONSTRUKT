import React from 'react';


export type TaskStatus = "done" | "weather-risk" | "late" | "in-progress";

export interface Task {
  id: string;
  label: string;
  date: string;
  time?: string;
  status: TaskStatus;
}


const statusStyles: Record<TaskStatus, { bg: string; border: string; text: string }> = {
  "done":         { bg: "bg-green-50",  border: "border-green-400",  text: "text-green-700"  },
  "weather-risk": { bg: "bg-yellow-50", border: "border-yellow-400", text: "text-yellow-700" },
  "late":         { bg: "bg-red-50",    border: "border-red-400",    text: "text-red-700"    },
  "in-progress":  { bg: "bg-blue-50",   border: "border-blue-400",   text: "text-blue-700"   },
};

export default function TaskCard({ task, onClick, isCompact = false }: { task: Task; onClick?: () => void; isCompact?: boolean }) {
  const s = statusStyles[task.status];
  
  const statusLabels: Record<TaskStatus, string> = {
    "done": "Terminé",
    "weather-risk": "Risque météo",
    "late": "En retard",
    "in-progress": "En cours"
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };
  
  return (
    <div 
      role="button"
      tabIndex={0}
      className={`${s.bg} border-l-4 ${s.border} rounded-md ${isCompact ? 'px-2 py-1.5' : 'px-3 py-2'} w-full h-full cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all shadow-sm flex flex-col justify-center`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`Tâche ${task.label}, statut ${statusLabels[task.status]}${task.time ? `, heure ${task.time}` : ''}`}
    >
      {task.time && (
        <p className={`${isCompact ? 'text-[10px]' : 'text-xs'} font-bold uppercase tracking-wider ${s.text} mb-0.5 truncate`}>
          {task.time}
        </p>
      )}
      <p className={`${isCompact ? 'text-sm' : 'text-base'} font-semibold ${s.text} leading-tight truncate`}>{task.label}</p>
    </div>
  );
}
