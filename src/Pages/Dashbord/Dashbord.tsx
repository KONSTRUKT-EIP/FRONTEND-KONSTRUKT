import React, { useState, useEffect, Suspense } from "react";
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


const filters: Filter[] = [
  { id: "voiles",         label: "Voiles",         color: "#818CF8" },
  { id: "planchers",      label: "Planchers",      color: "#C084FC" },
  { id: "poutres",        label: "Poutres",        color: "#60A5FA" },
  { id: "superstructure", label: "Superstructure", color: "#D1D5DB" },
];

const categoryConfig: Record<string, { icon: string; iconBg: string; iconColor: string }> = {
  1: { icon: "🏗️", iconBg: "bg-indigo-50", iconColor: "text-indigo-500" },
  2: { icon: "🪟", iconBg: "bg-yellow-50", iconColor: "text-yellow-500" },
  3: { icon: "🧱", iconBg: "bg-red-50", iconColor: "text-red-400" },
  4: { icon: "🔩", iconBg: "bg-purple-50", iconColor: "text-purple-500" },
};
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

export default function DashboardArmature() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const chantierName = chantierNames[id ?? ""] ?? "Chantier";
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>(
    Object.fromEntries(filters.map((f) => [f.id, f.id !== "superstructure"]))
  );
  const [summaryData, setSummaryData] = useState<ApiRes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [startDate, _setStartDate] = useState("2025-12-22");
  // const [endDate, _setEndDate] = useState("2026-02-11");
  const startDate = "2025-12-22";
  const endDate = "2026-02-11";
  const [orders, setOrders] = useState<Order[]>([]);

  const handleCreateOrder = async (payload: Omit<Order, "id">) => {
    try {
      const res = await fetch("http://localhost:3000/dashboard/armature/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log("send");
      if (!res.ok)
        throw new Error(`Erreur ${res.status}`);
      const { orders: newOrders }: { orders: Order[] } = await res.json();
      setOrders((prev) => [...prev, ...newOrders]);
    } catch (err: unknown) {
      console.error("Erreur création commande :", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ startDate, endDate });
        const [summaryRes, ordersRes] = await Promise.all([
          fetch(`http://localhost:3000/dashboard/armature/summary?${params}`),
          fetch(`http://localhost:3000/dashboard/armature/orders/recent?${params}`),
        ]);
        if (!summaryRes.ok)
          throw new Error(`Erreur ${summaryRes.status}`);
        if (!ordersRes.ok)
          throw new Error(`Erreur ${ordersRes.status}`);
        const dataSummary: ApiRes = await summaryRes.json();
        const ordersData: { orders: Order[] } = await ordersRes.json();
        setSummaryData(dataSummary);
        setOrders(ordersData.orders);
      } catch (err: unknown) {
        setError((err as Error).message ?? "Unknown Error")
      } finally {
        setLoading(false);
      }
    };
    fetchData();

  }, [startDate, endDate]);

  const cards = summaryData?
      summaryData.categories.map((cat) => ({
        ...(categoryConfig[cat.id]),
        name: cat.name,
        percentage: cat.progress,
        spent: cat.spent,
      })): [];

  const _handleFilterChange = (id: string, checked: boolean) => {
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
      {loading && (
        <div className="flex gap-4 mb-6">
          {[0,1,2,3].map((i) => (
            <div key={i} className="flex-1 bg-white rounded-2xl p-6 shadow-sm animate-pulse h-24" />
          ))}
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-600 border border-red-300 text-white text-base font-semibold rounded-xl px-4 py-3">
          Impossible de charger les données : {error}
        </div>
      )}

      {!loading && !error && (
        <Suspense fallback={<div>Chargement...</div>}>
          <div className="flex gap-4 mb-6">
            {cards.map((card) => (
              <Card key={card.name} {...card} />
            ))}
          </div>
        </Suspense>
      )}


      {/* Middle row: Graph + Filters */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="col-span-2">
          <Suspense fallback={<div>Chargement du graphique...</div>}>
            <ReportsChart data={chartData} series={chartSeries} activeFilters={activeFilters}/>
          </Suspense>
        </div>

        <div className="col-span-1">
          <Suspense fallback={<div>Chargement des filtres...</div>}>
            <ViewFilters filters={filters} />
          </Suspense>
        </div>
      </div>

      {/* Bottom row: Orders */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Suspense fallback={<div>Chargement des commandes...</div>}>
            <RecentOrders orders={orders} onCreateOrder={handleCreateOrder} />
          </Suspense>
        </div>
        <div className="col-span-1 bg-white rounded-2xl p-6 shadow-sm flex items-center justify-center">
          <span className="text-sm text-gray-800">Analytics (à venir)</span>
        </div>
      </div>
    </div>
  );
}