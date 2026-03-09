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

const badgeStyles: Record<ActionBadge, string> = {
  "En retard": "bg-red-100 text-red-600",
  "À décaler": "bg-yellow-100 text-yellow-700",
  "À risque":  "bg-orange-100 text-orange-600",
};

export default function ActionItem({ action }: { action: Action }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
      <div className={`w-10 h-10 rounded-xl ${action.iconBg} flex items-center justify-center shrink-0`}>
        <span className="text-lg">{action.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{action.label}</p>
        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
          <span>{action.sublabelIcon}</span> {action.sublabel}
        </p>
      </div>
      <span className={`text-xs font-medium px-2.5 py-1 rounded-lg shrink-0 ${badgeStyles[action.badge]}`}>
        {action.badge}
      </span>
    </div>
  );
}
