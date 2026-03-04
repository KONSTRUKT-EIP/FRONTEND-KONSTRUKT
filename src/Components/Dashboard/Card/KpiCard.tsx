import { ReactNode } from "react";

interface KpiCardProps {
  icon: ReactNode;
  iconBg: string;       // ex: "bg-blue-100"
  iconColor: string;    // ex: "text-blue-500"
  label: string;        // ex: "Avancement global"
  percentage: number;   // ex: 72
  spent: number;        // ex: 67200
}

export function KpiCard({
  icon,
  iconBg,
  iconColor,
  label,
  percentage,
  spent,
}: KpiCardProps) {
  const formattedSpent = new Intl.NumberFormat("fr-FR").format(spent);

  return (
    <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Icon badge */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg} ${iconColor}`}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex flex-col">
        <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">
          {label}
        </span>
        <span className="text-2xl font-bold text-gray-800 leading-tight">
          {percentage}%
        </span>
        <span className="text-xs text-gray-400 mt-0.5">
          {formattedSpent} € dépensés
        </span>
      </div>
    </div>
  );
}

// ─── Preview / Storybook-style demo ────────────────────────────────────────

import { Home, Package, Layers, Box } from "lucide-react";

const MOCK_CARDS: KpiCardProps[] = [
  {
    icon: <Home size={20} />,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
    label: "Avancement global",
    percentage: 72,
    spent: 67200,
  },
  {
    icon: <Package size={20} />,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-500",
    label: "Voiles",
    percentage: 80,
    spent: 32000,
  },
  {
    icon: <Layers size={20} />,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-400",
    label: "Planchers",
    percentage: 60,
    spent: 25000,
  },
  {
    icon: <Box size={20} />,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-400",
    label: "Poutres",
    percentage: 75,
    spent: 12750,
  },
];

export default function KpiCardPreview() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          KpiCard — preview
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_CARDS.map((card) => (
            <KpiCard key={card.label} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}
