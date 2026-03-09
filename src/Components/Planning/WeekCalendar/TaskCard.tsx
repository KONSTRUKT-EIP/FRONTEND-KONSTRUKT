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
  "done":         { bg: "bg-green-50",  border: "border-l-green-400",  text: "text-green-700"  },
  "weather-risk": { bg: "bg-yellow-50", border: "border-l-yellow-400", text: "text-yellow-700" },
  "late":         { bg: "bg-red-50",    border: "border-l-red-400",    text: "text-red-700"    },
  "in-progress":  { bg: "bg-blue-50",   border: "border-l-blue-400",   text: "text-blue-700"   },
};

export default function TaskCard({ task }: { task: Task }) {
  const s = statusStyles[task.status];
  return (
    <div className={`${s.bg} border-l-4 ${s.border} rounded-lg px-2.5 py-2 w-full`}>
      {task.time && (
        <p className={`text-[10px] font-semibold uppercase tracking-wide ${s.text} mb-0.5`}>
          {task.time}
        </p>
      )}
      <p className={`text-xs font-medium ${s.text} leading-tight`}>{task.label}</p>
    </div>
  );
}
