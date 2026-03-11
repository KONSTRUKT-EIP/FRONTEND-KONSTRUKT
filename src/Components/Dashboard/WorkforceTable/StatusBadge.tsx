import React from 'react';

const statusConfig: Record<string, { label: string; className: string }> = {
  'En attente': { label: 'En attente', className: 'bg-blue-100 text-blue-500' },
  'Présent':    { label: 'Présent',    className: 'bg-green-100 text-green-600' },
  'Absent':     { label: 'Absent',     className: 'bg-red-100 text-red-500' },
  'En retard':  { label: 'En retard',  className: 'bg-orange-100 text-orange-500' },
  'En congé':   { label: 'En congé',   className: 'bg-gray-200 text-gray-600' },
};

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status] ?? { label: status, className: 'bg-gray-100 text-gray-500' };
  return (
    <span
      className={`px-4 py-1 rounded-full text-sm font-medium inline-block text-center ${config.className}`}
      style={{ minWidth: '6rem' }}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
