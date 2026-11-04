import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface CardResumProps {
  icon: LucideIcon;
  iconBg: string;
  label: string;
  value: number;
}

export default function StatCard({ icon: Icon, iconBg, label, value }: CardResumProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-4 flex-1">
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon className="w-6 h-6" aria-hidden="true" />
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600 mt-0.5">{label}</p>
      </div>
    </div>
  );
}
