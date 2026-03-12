import React, { useState, Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../../Components/Dashboard/Card/Card";
import ViewFilters, { Filter } from "../../Components/Dashboard/ViewFilters/ViewFilters";
import RecentOrders from "../../Components/Dashboard/RecentOrders/RecentOrders";
import { Order } from "../../Components/Dashboard/RecentOrders/OrderRow";
import { ChartSerie } from "../../Components/Dashboard/ReportGraph/ReportGraph";
import ReportsChart from "../../Components/Dashboard/ReportGraph/ReportGraph";

const chantierNames: Record<string, string> = {
  "1": "Tour Horizon",
  "2": "R\u00e9sidence Les Pins",
  "3": "Pont Sud",
  "4": "Centre Commercial",
  "5": "Immeuble Lumi\u00e8re",
  "6": "Stade Municipal",
};

const chartData = [
  { time: "Nov",  voiles:  6200, voiles_prev:  8000, planchers:  3800, planchers_prev:  5000, poutres:  2100, poutres_prev:  3000, superstructure:    0, superstructure_prev:  1500 },
  { time: "Déc",  voiles:  9800, voiles_prev: 11000, planchers:  6200, planchers_prev:  7500, poutres:  3500, poutres_prev:  4200, superstructure:  800, superstructure_prev:  2500 },
  { time: "Jan",  voiles: 14500, voiles_prev: 15000, planchers:  9500, planchers_prev:  9800, poutres:  5800, poutres_prev:  6000, superstructure: 1800, superstructure_prev:  3500 },
  { time: "Fév",  voiles: 19200, voiles_prev: 19500, planchers: 13200, planchers_prev: 13500, poutres:  7900, poutres_prev:  8200, superstructure: 3200, superstructure_prev:  5000 },
  { time: "Mar",  voiles: 24963, voiles_prev: 24000, planchers: 17400, planchers_prev: 17000, poutres: 10200, poutres_prev: 10500, superstructure: 5100, superstructure_prev:  6500 },
  { time: "Avr",  voiles:  null, voiles_prev: 29000, planchers:   null, planchers_prev: 21000, poutres:  null, poutres_prev: 13000, superstructure:  null, superstructure_prev:  8200 },
  { time: "Mai",  voiles:  null, voiles_prev: 35000, planchers:   null, planchers_prev: 25500, poutres:  null, poutres_prev: 16000, superstructure:  null, superstructure_prev: 10500 },
  { time: "Jun",  voiles:  null, voiles_prev: 42000, planchers:   null, planchers_prev: 31000, poutres:  null, poutres_prev: 19500, superstructure:  null, superstructure_prev: 13000 },
];
const chartSeries: ChartSerie[] = [
  { key: "voiles",              color: "#818CF8", label: "Voiles (réel)",             filterKey: "voiles"          },
  { key: "voiles_prev",         color: "#818CF8", label: "Voiles (prév.)",            filterKey: "voiles",         dashed: true },
  { key: "planchers",           color: "#C084FC", label: "Planchers (réel)",          filterKey: "planchers"       },
  { key: "planchers_prev",      color: "#C084FC", label: "Planchers (prév.)",         filterKey: "planchers",      dashed: true },
  { key: "poutres",             color: "#60A5FA", label: "Poutres (réel)",            filterKey: "poutres"         },
  { key: "poutres_prev",        color: "#60A5FA", label: "Poutres (prév.)",           filterKey: "poutres",        dashed: true },
  { key: "superstructure",      color: "#9CA3AF", label: "Superstructure (réel)",     filterKey: "superstructure"  },
  { key: "superstructure_prev", color: "#9CA3AF", label: "Superstructure (prév.)",   filterKey: "superstructure", dashed: true },
];


const filters: Filter[] = [
  { id: "voiles",         label: "Voiles",         color: "#818CF8" },
  { id: "planchers",      label: "Planchers",      color: "#C084FC" },
  { id: "poutres",        label: "Poutres",        color: "#60A5FA" },
];

// const orders: Order[] = [
//   { id: "#876364", productName: "Voiles",    price: 98,  totalOrder: 325, total: 32000 },
//   { id: "#876368", productName: "Planchers", price: 471, totalOrder: 53,  total: 25000 },
//   { id: "#876412", productName: "Poutres",   price: 163, totalOrder: 78,  total: 12750 },
//   { id: "#876621", productName: "Acier",     price: 200, totalOrder: 10,  total: 2000  },
// ];


  interface ApiCategory {
  id: number;
  name: string;
  progress: number;
  spent: number;
}

interface ApiRes {
  globalProgress: number;
  globalSpent: number;
  categories: ApiCategory[];
}

const mockSummary: Record<string, ApiRes> = {
  "1": { globalProgress: 68, globalSpent: 142000, categories: [
    { id: 1, name: "Voiles",    progress: 72, spent: 42000 },
    { id: 2, name: "Planchers", progress: 65, spent: 38000 },
    { id: 3, name: "Poutres",   progress: 58, spent: 35000 },
    { id: 4, name: "Armature",  progress: 80, spent: 27000 },
  ]},
  "2": { globalProgress: 45, globalSpent: 98000, categories: [
    { id: 1, name: "Voiles",    progress: 50, spent: 28000 },
    { id: 2, name: "Planchers", progress: 40, spent: 25000 },
    { id: 3, name: "Poutres",   progress: 42, spent: 22000 },
    { id: 4, name: "Armature",  progress: 48, spent: 23000 },
  ]},
  "3": { globalProgress: 82, globalSpent: 210000, categories: [
    { id: 1, name: "Voiles",    progress: 88, spent: 60000 },
    { id: 2, name: "Planchers", progress: 80, spent: 55000 },
    { id: 3, name: "Poutres",   progress: 78, spent: 50000 },
    { id: 4, name: "Armature",  progress: 85, spent: 45000 },
  ]},
  "4": { globalProgress: 30, globalSpent: 55000, categories: [
    { id: 1, name: "Voiles",    progress: 32, spent: 15000 },
    { id: 2, name: "Planchers", progress: 28, spent: 14000 },
    { id: 3, name: "Poutres",   progress: 30, spent: 13000 },
    { id: 4, name: "Armature",  progress: 35, spent: 13000 },
  ]},
  "5": { globalProgress: 55, globalSpent: 120000, categories: [
    { id: 1, name: "Voiles",    progress: 60, spent: 32000 },
    { id: 2, name: "Planchers", progress: 52, spent: 30000 },
    { id: 3, name: "Poutres",   progress: 50, spent: 28000 },
    { id: 4, name: "Armature",  progress: 58, spent: 30000 },
  ]},
  "6": { globalProgress: 90, globalSpent: 310000, categories: [
    { id: 1, name: "Voiles",    progress: 95, spent: 85000 },
    { id: 2, name: "Planchers", progress: 90, spent: 80000 },
    { id: 3, name: "Poutres",   progress: 88, spent: 75000 },
    { id: 4, name: "Armature",  progress: 92, spent: 70000 },
  ]},
};

const mockOrders: Record<string, Order[]> = {
  "1": [
    { id: "#876364", productName: "Acier HA20",     price: 98,  totalOrder: 325, total: 31850 },
    { id: "#876368", productName: "Planches coffrage", price: 471, totalOrder: 53,  total: 24963 },
    { id: "#876412", productName: "Étriers 8mm",    price: 163, totalOrder: 78,  total: 12714 },
    { id: "#876621", productName: "Béton B25",      price: 200, totalOrder: 10,  total: 2000  },
    { id: "#877001", productName: "Poutrelles IPE", price: 540, totalOrder: 22,  total: 11880 },
  ],
  "2": [
    { id: "#877100", productName: "Acier HA16",     price: 85,  totalOrder: 200, total: 17000 },
    { id: "#877101", productName: "Ciment CEM II",  price: 120, totalOrder: 150, total: 18000 },
    { id: "#877102", productName: "Gravier 20/40",  price: 45,  totalOrder: 400, total: 18000 },
    { id: "#877103", productName: "Treillis soudé", price: 230, totalOrder: 60,  total: 13800 },
  ],
  "3": [
    { id: "#877200", productName: "Câbles précon.", price: 850, totalOrder: 40,  total: 34000 },
    { id: "#877201", productName: "Acier HA25",     price: 115, totalOrder: 500, total: 57500 },
    { id: "#877202", productName: "Coffrages métal",price: 600, totalOrder: 30,  total: 18000 },
    { id: "#877203", productName: "Béton B30",      price: 220, totalOrder: 80,  total: 17600 },
    { id: "#877204", productName: "Boulons HV",     price: 12,  totalOrder: 1200,total: 14400 },
  ],
  "4": [
    { id: "#877300", productName: "Parpaings",      price: 2,   totalOrder: 5000,total: 10000 },
    { id: "#877301", productName: "Mortier sac",    price: 8,   totalOrder: 800, total: 6400  },
    { id: "#877302", productName: "Acier HA12",     price: 72,  totalOrder: 150, total: 10800 },
    { id: "#877303", productName: "Cornières acier",price: 95,  totalOrder: 90,  total: 8550  },
  ],
  "5": [
    { id: "#877400", productName: "Acier HA20",     price: 98,  totalOrder: 250, total: 24500 },
    { id: "#877401", productName: "Béton B25",      price: 200, totalOrder: 60,  total: 12000 },
    { id: "#877402", productName: "Planelles",      price: 35,  totalOrder: 300, total: 10500 },
    { id: "#877403", productName: "Étriers 10mm",   price: 185, totalOrder: 70,  total: 12950 },
  ],
  "6": [
    { id: "#877500", productName: "Profilés HEA",   price: 1200,totalOrder: 50,  total: 60000 },
    { id: "#877501", productName: "Acier HA32",     price: 145, totalOrder: 800, total: 116000},
    { id: "#877502", productName: "Béton B35",      price: 250, totalOrder: 120, total: 30000 },
    { id: "#877503", productName: "Boulons HV M24", price: 18,  totalOrder: 2000,total: 36000 },
    { id: "#877504", productName: "Coffrages gradin",price: 750,totalOrder: 60,  total: 45000 },
  ],
};

export default function DashboardArmature() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const chantierName = chantierNames[id ?? ""] ?? "Chantier";
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>(
    Object.fromEntries(filters.map((f) => [f.id, f.id !== "superstructure"]))
  );

  const summaryData: ApiRes = mockSummary[id ?? ""] ?? { globalProgress: 0, globalSpent: 0, categories: [] };
  const orders: Order[] = mockOrders[id ?? ""] ?? [];

  const cards = summaryData.categories.map((cat) => ({
    name: cat.name,
    percentage: cat.progress,
    spent: cat.spent,
  }));

  const handleFilterChange = (id: string, checked: boolean) => {
    setActiveFilters((prev) => ({ ...prev, [id]: checked }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8" role="main">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <nav className="mb-2 flex items-center gap-2 text-sm" aria-label="Breadcrumb">
            <span>
              <button
                onClick={() => navigate("/dashboard")}
                className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
              >
                Tous les chantiers
              </button>
            </span>
            <span className="text-gray-400">/</span>
            <span>
              <button
                onClick={() => navigate(`/dashboard/${id}`)}
                className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
              >
                {chantierName}
              </button>
            </span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold">Armature</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Dashboard / Armature
          </h1>
        </div>
      </div>

      {/* Cards */}
      <Suspense fallback={<div>Chargement...</div>}>
        <div className="flex gap-4 mb-6">
          {cards.map((card) => (
            <Card key={card.name} {...card} />
          ))}
        </div>
      </Suspense>


      {/* Middle row: Graph + Filters */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="col-span-2">
          <Suspense fallback={<div>Chargement du graphique...</div>}>
            <ReportsChart data={chartData} series={chartSeries} activeFilters={activeFilters}/>
          </Suspense>
        </div>

        <div className="col-span-1">
          <Suspense fallback={<div>Chargement des filtres...</div>}>
            <ViewFilters filters={filters} onChange={handleFilterChange} />
          </Suspense>
        </div>
      </div>

      {/* Bottom row: Orders */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Suspense fallback={<div>Chargement des commandes...</div>}>
            <RecentOrders orders={orders} onCreateOrder={async () => {}} />
          </Suspense>
        </div>
        <div className="col-span-1 bg-white rounded-2xl p-6 shadow-sm flex items-center justify-center">
          <span className="text-sm text-gray-800">Analytics (à venir)</span>
        </div>
      </div>
    </div>
  );
}