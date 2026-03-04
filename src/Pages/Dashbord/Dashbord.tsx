import { useState } from "react";
import { Card } from "../../Components/Dashboard/Card/Card";
import ViewFilters, { Filter } from "../../Components/Dashboard/ViewFilters/ViewFilters";
import RecentOrders from "../../Components/Dashboard/RecentOrders/RecentOrders";
import { Order } from "../../Components/Dashboard/RecentOrders/OrderRow";
import ReportsChart, { ChartSerie } from "../../Components/Dashboard/ReportGraph/ReportGraph";
// ── Chart data ───────────────────────────────────────────────
const chartData = [
  { time: "10am", voiles: 58, planchers: 30 },
  { time: "11am", voiles: 42, planchers: 45 },
  { time: "12am", voiles: 60, planchers: 58 },
  { time: "01am", voiles: 35, planchers: 38 },
  { time: "02am", voiles: 50, planchers: 20 },
  { time: "03am", voiles: 45, planchers: 15 },
  { time: "04am", voiles: 30, planchers: 35 },
  { time: "05am", voiles: 38, planchers: 38 },
  { time: "06am", voiles: 65, planchers: 62 },
  { time: "07am", voiles: 72, planchers: 68 },
];
const chartSeries: ChartSerie[] = [
  { key: "voiles",    color: "#818CF8", label: "Voiles"    },
  { key: "planchers", color: "#C084FC", label: "Planchers" },
];

const orders: Order[] = [
  { id: "#876364", productName: "Voiles",    price: 98,  totalOrder: 325, total: 32000 },
  { id: "#876368", productName: "Planchers", price: 471, totalOrder: 53,  total: 25000 },
  { id: "#876412", productName: "Poutres",   price: 163, totalOrder: 78,  total: 12750 },
  { id: "#876621", productName: "Acier",     price: 200, totalOrder: 10,  total: 2000  },
];

const filters: Filter[] = [
  { id: "voiles",         label: "Voiles",         color: "#818CF8" },
  { id: "planchers",      label: "Planchers",      color: "#C084FC" },
  { id: "poutres",        label: "Poutres",        color: "#60A5FA" },
  { id: "superstructure", label: "Superstructure", color: "#D1D5DB" },
];

const kpis = [
  { icon: "🏗️", iconBg: "bg-indigo-50",  iconColor: "text-indigo-500", label: "Avancement global", percentage: 72, spent: 67200 },
  { icon: "🪟", iconBg: "bg-yellow-50",  iconColor: "text-yellow-500", label: "Voiles",             percentage: 80, spent: 32000 },
  { icon: "🧱", iconBg: "bg-red-50",     iconColor: "text-red-400",    label: "Planchers",          percentage: 60, spent: 25000 },
  { icon: "🔩", iconBg: "bg-purple-50",  iconColor: "text-purple-500", label: "Poutres",            percentage: 75, spent: 12750 },
];

export default function DashboardArmature() {
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>(
    Object.fromEntries(filters.map((f) => [f.id, f.id !== "superstructure"]))
  );

  const handleFilterChange = (id: string, checked: boolean) => {
    setActiveFilters((prev) => ({ ...prev, [id]: checked }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Dashboard/Armature
        </h1>
        <div className="flex items-center gap-3">
          {["12-22-2025", "02-11-2026"].map((date) => (
            <button
              key={date}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 hover:border-gray-300 transition-colors shadow-sm"
            >
              {date}
              <span className="text-gray-400 text-xs">▼</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="flex gap-4 mb-6">
        {kpis.map((kpi) => (
          <Card key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Middle row: Graph + Filters */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="col-span-2">
          <ReportsChart data={chartData} series={chartSeries} activeFilters={activeFilters}/>
        </div>

        <div className="col-span-1">
          <ViewFilters filters={filters} onChange={handleFilterChange} />
        </div>
      </div>

      {/* Bottom row: Orders */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">

          <RecentOrders orders={orders} />
        </div>
        <div className="col-span-1 bg-white rounded-2xl p-6 shadow-sm flex items-center justify-center">
          <span className="text-sm text-gray-400">Analytics (à venir)</span>
        </div>
      </div>
    </div>
  );
}