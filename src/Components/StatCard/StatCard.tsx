import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between h-full">
    <p className="text-base text-gray-400 leading-snug">{label}</p>
    <p className={`text-5xl font-extrabold mt-3 ${color}`}>{value}</p>
  </div>
);

export default StatCard;
