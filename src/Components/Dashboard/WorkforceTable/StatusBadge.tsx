import React from 'react';

const statusConfig: Record<string, { label: string; className: string }> = {
  'En attente': { label: 'En attente', className: 'bg-orange-100 text-orange-500' },
  'En cours':   { label: 'En cours',   className: 'bg-gray-200 text-gray-600' },
  'Complete':   { label: 'Complete',   className: 'bg-green-100 text-green-600' },
  'Annulé':     { label: 'Annulé',     className: 'bg-red-100 text-red-500' },
};

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status] ?? { label: status, className: 'bg-gray-100 text-gray-500' };
  const isFixedWidth = status === 'Annulé' || status === 'Complete' || status === 'En cours';
  return (
    <span
      className={`px-4 py-1 rounded-full text-sm font-medium ${isFixedWidth ? 'w-24 inline-block text-center' : ''} ${config.className}`}
      style={isFixedWidth ? { minWidth: '6rem' } : {}}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
