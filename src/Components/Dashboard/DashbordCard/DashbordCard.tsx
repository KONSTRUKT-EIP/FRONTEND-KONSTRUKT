interface DashboardCardProps {
  label: string;
  description: string;
  progress?: number; //100
  onClick: () => void;
}

export default function DashboardCard({ label, description, progress = 0, onClick }: DashboardCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-left w-full flex items-center gap-6"
    >
      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>

      {/* Progress bar */}
      <div className="w-48 shrink-0">
        <div className="flex justify-between mb-1">
          <span className="text-xs text-gray-400">Avancement</span>
          <span className="text-xs font-semibold text-indigo-600">{progress}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <span className="text-gray-300 text-lg shrink-0">›</span>
    </button>
  );
}