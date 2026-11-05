import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Download, FlaskConical } from "lucide-react";
import RecentOrders from "../../Components/Dashboard/RecentOrders/RecentOrders";
import { Order } from "../../Components/Dashboard/RecentOrders/OrderRow";
import { CreateOrderPayload } from "../../Components/Dashboard/RecentOrders/ModalOrder";
import { siteService } from "../../services/siteService";
import { computeLotMetrics, getLotDashboard, LotDashboard, LotMetrics } from "../../mocks/lotDashboards";
import LotKpiCards from "../../Components/Lot/LotKpiCards";
import PlanComparison from "../../Components/Lot/PlanComparison";
import PlanTrackingTable, { formatDelivery } from "../../Components/Lot/PlanTrackingTable";
import { formatDate, planStatusConfig } from "../../Components/Lot/format";

// Export du suivi des plans au format CSV (s'ouvre directement dans Excel)
const exportPlansCsv = (lot: LotDashboard, metrics: LotMetrics) => {
  const number = (value: number | null) =>
    value === null ? "" : value.toLocaleString("fr-FR", { maximumFractionDigits: 2, useGrouping: false });
  const header = [
    "Plan", "Niveau", "N°", "Indice",
    `Prévu (${lot.unit})`, `Réel (${lot.unit})`, `Écart (${lot.unit})`,
    "Montant prévu (€)", "Montant réel (€)", "Envoi ST", "Livraison", "Statut",
  ];
  const rows = metrics.plans.map(({ plan, plannedAmount, actualAmount, gap }) => [
    plan.name, plan.level, plan.number, plan.index,
    number(plan.planned), number(plan.actual), number(gap),
    number(plannedAmount), number(actualAmount),
    formatDate(plan.sentDate), formatDelivery(plan), planStatusConfig[plan.status].label,
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(";"))
    .join("\r\n");

  // Le BOM permet à Excel de lire correctement les accents
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `suivi-plans-${lot.id}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export default function DashboardLot() {
  const { id, dbId } = useParams<{ id: string; dbId: string }>();
  const navigate = useNavigate();
  const lot = getLotDashboard(dbId);
  const metrics = useMemo(() => (lot ? computeLotMetrics(lot) : null), [lot]);

  const [chantierName, setChantierName] = useState("Chantier");
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;

    siteService
      .getSite(id)
      .then((site) => {
        if (active) setChantierName(site.name);
      })
      .catch((err) => console.error("Erreur lors du chargement du chantier:", err));

    const token = localStorage.getItem("access_token");
    fetch(`http://localhost:3000/dashboard/armature/orders/site/${encodeURIComponent(id)}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const data: { orders: Order[] } = await res.json();
        if (active) setOrders(data.orders);
      })
      .catch((err: Error) => {
        if (active) setOrdersError(err.message);
      });

    return () => {
      active = false;
    };
  }, [id]);

  // Les erreurs sont remontées à la modale pour être affichées à l'utilisateur
  const handleCreateOrder = async (payload: CreateOrderPayload) => {
    const token = localStorage.getItem("access_token");
    const res = await fetch("http://localhost:3000/dashboard/armature/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || `Erreur ${res.status}`);
    }
    const { orders: newOrders }: { orders: Order[] } = await res.json();
    setOrders((prev) => [...newOrders, ...prev]);
  };

  const breadcrumb = (
    <nav className="mb-2 flex items-center gap-2 text-sm" aria-label="Breadcrumb">
      <button
        onClick={() => navigate("/dashboard")}
        className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
      >
        Tous les chantiers
      </button>
      <span className="text-gray-400">/</span>
      <button
        onClick={() => navigate(`/dashboard/${id}`)}
        className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
      >
        {chantierName}
      </button>
      <span className="text-gray-400">/</span>
      <span className="text-gray-900 font-semibold">{lot?.label ?? "Lot"}</span>
    </nav>
  );

  if (!lot || !metrics) {
    return (
      <div className="min-h-screen bg-gray-100 p-8" role="main">
        {breadcrumb}
        <div className="mt-8 bg-white rounded-2xl shadow-sm p-8 text-center">
          <p className="text-lg font-semibold text-gray-900">Ce lot n'existe pas.</p>
          <button
            onClick={() => navigate(`/dashboard/${id}`)}
            className="mt-4 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors"
          >
            Retour au chantier
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col gap-6" role="main">
      {/* En-tête */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          {breadcrumb}
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {lot.title} — Prévisionnel vs Réel
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Sous-traitant {lot.subcontractor} · {lot.marketLabel}{" "}
            {lot.marketAmount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })} ·{" "}
            {lot.marketQuantity.toLocaleString("fr-FR")} {lot.unit} ·{" "}
            {lot.unitPrice.toLocaleString("fr-FR")} €/{lot.unit}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 text-amber-700 text-xs font-semibold"
            title="Ces indicateurs utilisent des données fictives en attendant le branchement au back"
          >
            <FlaskConical className="w-4 h-4" aria-hidden="true" /> Données de démo
          </span>
          <button
            onClick={() => exportPlansCsv(lot, metrics)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 text-sm font-semibold transition-colors"
          >
            <Download className="w-4 h-4" aria-hidden="true" /> Exporter Excel
          </button>
          <button
            onClick={() => navigate(`/dashboard/${id}/equipe`)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors"
          >
            Voir l'équipe <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <LotKpiCards lot={lot} metrics={metrics} />

      <PlanComparison lot={lot} metrics={metrics} />

      <PlanTrackingTable lot={lot} metrics={metrics} />

      {/* Commandes réelles du chantier (branchées sur le back) */}
      <div>
        {ordersError && (
          <p className="mb-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            Impossible de charger les commandes : {ordersError}
          </p>
        )}
        <RecentOrders siteId={id ?? ""} orders={orders} onCreateOrder={handleCreateOrder} />
      </div>
    </div>
  );
}
