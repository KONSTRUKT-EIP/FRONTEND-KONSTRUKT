import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../../Components/Dashboard/Card/Card";
import ViewFilters, { Filter } from "../../Components/Dashboard/ViewFilters/ViewFilters";
import RecentOrders from "../../Components/Dashboard/RecentOrders/RecentOrders";
import { Order } from "../../Components/Dashboard/RecentOrders/OrderRow";
import ReportsChart, { ChartSerie } from "../../Components/Dashboard/ReportGraph/ReportGraph";
import WorkerRow, { Worker } from "../../Components/Dashboard/WorkforceTable/WorkerRow";

const defaultWorkers: Worker[] = [
  { id: 1, specialite: 'Menuisier',  name: 'Arrora Gaur',     email: 'arroragaur@gmail.com',     dateDebut: '12 Dec, 2025', status: 'En attente', starred: true,  initials: 'AG', color: '#f97316' },
  { id: 2, specialite: 'Menuisier',  name: 'James Mullican',  email: 'jamesmullican@gmail.com',  dateDebut: '10 Dec, 2025', status: 'En attente', starred: false, initials: 'JM', color: '#6366f1' },
  { id: 3, specialite: 'Architecte', name: 'Robert Bacins',   email: 'robertbacins@gmail.com',   dateDebut: '09 Dec, 2025', status: 'Complete',   starred: false, initials: 'RB', color: '#10b981' },
  { id: 4, specialite: 'Carreleur',  name: 'Bethany Jackson', email: 'bethanyjackson@gmail.com', dateDebut: '09 Dec, 2025', status: 'Annulé',     starred: false, initials: 'BJ', color: '#f43f5e' },
  { id: 5, specialite: 'Carreleur',  name: 'Anne Jacob',      email: 'annejacob@gmail.com',      dateDebut: '10 Dec, 2025', status: 'Complete',   starred: false, initials: 'AJ', color: '#8b5cf6' },
  { id: 6, specialite: 'Plombier',   name: 'Bethany Jackson', email: 'bethanyjackson@gmail.com', dateDebut: '10 Dec, 2025', status: 'En attente', starred: true,  initials: 'BJ', color: '#f43f5e' },
  { id: 7, specialite: 'Ma\u00e7on',      name: 'James Mullican',  email: 'jamesmullican@gmail.com',  dateDebut: '10 Dec, 2025', status: 'En cours',   starred: false, initials: 'JM', color: '#6366f1' },
  { id: 8, specialite: 'Ma\u00e7on',      name: 'Jhon Deo',        email: 'jhondeo32@gmail.com',      dateDebut: '10 Dec, 2025', status: 'En cours',   starred: true,  initials: 'JD', color: '#0ea5e9' },
];

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
  const [workerChecked, setWorkerChecked] = useState<Set<number>>(new Set([3, 4, 6]));
  const [workerSearch, setWorkerSearch] = useState('');

  const toggleWorkerCheck = (wid: number) => {
    setWorkerChecked(prev => {
      const next = new Set(prev);
      if (next.has(wid)) {
        next.delete(wid);
      } else {
        next.add(wid);
      }
      return next;
    });
  };

  const filteredWorkers = defaultWorkers.filter(w =>
    w.name.toLowerCase().includes(workerSearch.toLowerCase()) ||
    w.specialite.toLowerCase().includes(workerSearch.toLowerCase())
  );

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
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => navigate(`/dashboard/${id}`)}
            className="text-gray-400 hover:text-gray-600 mb-2 flex items-center gap-1 transition-colors text-sm"
          >
            \u2190 {chantierName}
          </button>
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
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          Impossible de charger les données : {error}
        </div>
      )}

      {!loading && !error && (
        <div className="flex gap-4 mb-6">
          {cards.map((card) => (
            <Card key={card.name} {...card} />
          ))}
        </div>
      )}


      {/* Middle row: Graph + Filters */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="col-span-2">
          <ReportsChart data={chartData} series={chartSeries} activeFilters={activeFilters}/>
        </div>

        <div className="col-span-1">
          <ViewFilters filters={filters} />
        </div>
      </div>

      {/* Bottom row: Orders */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">

          <RecentOrders orders={orders} />
        </div>
        <div className="col-span-1 bg-white rounded-2xl p-6 shadow-sm flex items-center justify-center">
          <span className="text-sm text-gray-400">Analytics (\u00e0 venir)</span>
        </div>
      </div>

      {/* Workforce Table */}
      <div className="mt-4 bg-white rounded-2xl shadow p-6 border border-gray-100 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">\u00c9quipe / {chantierName}</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
              <span className="text-gray-400 text-sm">\ud83d\udd0d</span>
              <input
                type="text"
                placeholder="Chercher"
                value={workerSearch}
                onChange={e => setWorkerSearch(e.target.value)}
                className="bg-transparent text-sm outline-none text-gray-600 w-28"
              />
            </div>
            <button className="flex items-center gap-1 px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-full hover:bg-orange-600 transition">
              + Nouveau
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-2 px-3 w-8"></th>
                <th className="py-2 px-3 text-xs text-gray-400 font-medium">Sp\u00e9cialit\u00e9 \u25be</th>
                <th className="py-2 px-3 text-xs text-gray-400 font-medium">Name \u25be</th>
                <th className="py-2 px-3 text-xs text-gray-400 font-medium">Email \u25be</th>
                <th className="py-2 px-3 text-xs text-gray-400 font-medium">Date de d\u00e9but \u25be</th>
                <th className="py-2 px-3 text-xs text-gray-400 font-medium">Status \u25be</th>
                <th className="py-2 px-3 w-8"></th>
                <th className="py-2 px-3 w-8 text-gray-300"></th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.map(worker => (
                <WorkerRow
                  key={worker.id}
                  worker={worker}
                  checked={workerChecked.has(worker.id)}
                  onCheck={() => toggleWorkerCheck(worker.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}