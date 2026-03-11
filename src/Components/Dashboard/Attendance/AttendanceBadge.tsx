import React from 'react';

export type AttendanceStatus = 'present' | 'absent' | 'retard' | 'conge' | 'en-attente';

export const attendanceConfig: Record<AttendanceStatus, { label: string; className: string }> = {
  present:     { label: 'Présent',    className: 'bg-green-100 text-green-600'    },
  absent:      { label: 'Absent',     className: 'bg-red-100 text-red-500'        },
  retard:      { label: 'Retard',     className: 'bg-orange-100 text-orange-500'  },
  conge:       { label: 'Congé',      className: 'bg-gray-200 text-gray-600'      },
  'en-attente': { label: 'En attente', className: 'bg-blue-100 text-blue-500'      },
};

interface AttendanceBadgeProps {
  status: AttendanceStatus;
}

const AttendanceBadge: React.FC<AttendanceBadgeProps> = ({ status }) => {
  const { label, className } = attendanceConfig[status];
  return (
    <span className={`px-4 py-1.5 rounded-full text-base font-semibold ${className}`}>
      {label}
    </span>
  );
};

export default AttendanceBadge;
