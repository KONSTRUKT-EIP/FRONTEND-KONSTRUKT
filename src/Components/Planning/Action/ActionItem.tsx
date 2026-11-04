import React from 'react';
import { AlarmClock, CloudRain, MapPin, TriangleAlert, type LucideIcon } from 'lucide-react';


export type ActionBadge = "En retard" | "À décaler" | "À risque";

export interface Action {
  id: string;
  icon: string;
  iconBg: string;
  label: string;
  sublabel: string;
  sublabelIcon: string;
  badge: ActionBadge;
}

// L'icône est déduite du badge plutôt que du champ `icon` (emoji) envoyé par le back
const badgeIcons: Record<ActionBadge, { icon: LucideIcon; className: string }> = {
  "En retard": { icon: AlarmClock, className: "text-red-600" },
  "À décaler": { icon: CloudRain, className: "text-blue-600" },
  "À risque":  { icon: TriangleAlert, className: "text-orange-600" },
};

const badgeStyles: Record<ActionBadge, string> = {
  "En retard": "bg-red-100 text-red-600",
  "À décaler": "bg-yellow-100 text-yellow-700",
  "À risque":  "bg-orange-100 text-orange-600",
};

export default function ActionItem({ action }: { action: Action }) {
  const { icon: Icon, className: iconClassName } = badgeIcons[action.badge] ?? badgeIcons["À risque"];
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
    }
  };
  
  return (
    <div 
      className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100 cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`Action requise: ${action.label}, ${action.sublabel}, Statut: ${action.badge}`}
    >
      <div className={`w-14 h-14 rounded-xl ${action.iconBg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-6 h-6 ${iconClassName}`} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-base font-semibold text-gray-900 mb-1">{action.label}</p>
        <p className="text-sm text-gray-600 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" /> {action.sublabel}
        </p>
      </div>
      <span className={`text-sm font-semibold px-4 py-2 rounded-lg shrink-0 ${badgeStyles[action.badge]}`}>
        {action.badge}
      </span>
    </div>
  );
}
