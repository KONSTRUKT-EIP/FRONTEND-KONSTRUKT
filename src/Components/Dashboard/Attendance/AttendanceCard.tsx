import React from 'react';
import AttendanceBadge, { AttendanceStatus } from './AttendanceBadge';

interface AttendanceCardProps {
  initials: string;
  color: string;
  name: string;
  specialite: string;
  status: AttendanceStatus;
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({ initials, color, name, specialite, status }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition">
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
      style={{ background: color }}
    >
      {initials}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-800 truncate">{name}</p>
      <p className="text-xs text-gray-400">{specialite}</p>
    </div>
    <AttendanceBadge status={status} />
  </div>
);

export default AttendanceCard;
