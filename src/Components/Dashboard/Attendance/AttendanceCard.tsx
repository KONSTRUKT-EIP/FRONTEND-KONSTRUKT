import React from 'react';
import AttendanceStatusSelector from './AttendanceStatusSelector';
import { AttendanceStatus } from './AttendanceBadge';

interface AttendanceCardProps {
  initials: string;
  color: string;
  name: string;
  specialite: string;
  status: AttendanceStatus;
  onStatusChange?: (status: AttendanceStatus) => void;
  editable?: boolean;
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({ 
  initials, 
  color, 
  name, 
  specialite, 
  status,
  onStatusChange,
  editable = true,
}) => (
  <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition">
    <div
      className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
      style={{ background: color }}
    >
      {initials}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-lg font-semibold text-gray-800 truncate">{name}</p>
      <p className="text-base font-medium text-gray-800">{specialite}</p>
    </div>
    {editable && onStatusChange ? (
      <AttendanceStatusSelector
        currentStatus={status}
        onStatusChange={onStatusChange}
      />
    ) : (
      <span className={`px-4 py-1.5 rounded-full text-base font-semibold ${
        status === 'present' ? 'bg-green-100 text-green-600' :
        status === 'absent' ? 'bg-red-100 text-red-500' :
        status === 'retard' ? 'bg-orange-100 text-orange-500' :
        status === 'conge' ? 'bg-gray-200 text-gray-600' :
        'bg-blue-100 text-blue-500'
      }`}>
        {status === 'present' ? 'Présent' :
         status === 'absent' ? 'Absent' :
         status === 'retard' ? 'Retard' :
         status === 'conge' ? 'Congé' :
         'En attente'}
      </span>
    )}
  </div>
);

export default AttendanceCard;
