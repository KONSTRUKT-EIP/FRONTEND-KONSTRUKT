import React from 'react';
import StatusBadge from './StatusBadge';

export interface Worker {
  id: number;
  specialite: string;
  name: string;
  email: string;
  dateDebut: string;
  status: string;
  starred?: boolean;
  initials: string;
  color: string;
}

interface WorkerRowProps {
  worker: Worker;
  checked: boolean;
  onCheck: () => void;
}

const WorkerRow: React.FC<WorkerRowProps> = ({ worker, checked, onCheck }) => (
  <tr className="border-b border-gray-100 hover:bg-orange-50/30 transition">
    <td className="py-3 px-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={onCheck}
        className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
      />
    </td>
    <td className="py-3 px-3 text-sm text-gray-500">{worker.specialite}</td>
    <td className="py-3 px-3">
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ background: worker.color }}
        >
          {worker.initials}
        </div>
        <span className="text-sm font-medium text-gray-800">{worker.name}</span>
      </div>
    </td>
    <td className="py-3 px-3">
      <div className="flex items-center gap-1 text-sm text-gray-500">
        {worker.email}
      </div>
    </td>
    <td className="py-3 px-3">
      <div className="flex items-center gap-1 text-sm text-gray-500">
        <span className="text-blue-400"></span>
        {worker.dateDebut}
      </div>
    </td>
    <td className="py-3 px-3">
      <StatusBadge status={worker.status} />
    </td>
    <td className="py-3 px-3 text-center">
      <span className={`text-lg cursor-pointer ${worker.starred ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'} transition`}>★</span>
    </td>
    <td className="py-3 px-3 text-center text-gray-400 cursor-pointer hover:text-gray-600">···</td>
  </tr>
);

export default WorkerRow;
