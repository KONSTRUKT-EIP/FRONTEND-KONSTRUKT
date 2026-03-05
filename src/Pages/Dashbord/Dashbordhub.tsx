import { useNavigate, useParams } from "react-router-dom";
import DashboardCard from "../../Components/Dashboard/DashbordCard/DashbordCard";
import React from 'react';

const dashboards = [
  { id: "armature",   label: "Armature",    description: "Voiles, planchers, poutres", progress: 72 },
  { id: "beton",      label: "Béton",       description: "Coulage, dosage, résistance", progress: 45 },
  { id: "charpente",  label: "Charpente",   description: "Structure bois et métal",    progress: 60 },
  { id: "electricite",label: "Électricité", description: "Câblage, tableaux, prises",  progress: 30 },
  { id: "plomberie",  label: "Plomberie",   description: "Réseaux eau, évacuations",   progress: 55 },
  { id: "finitions",  label: "Finitions",   description: "Peinture, revêtements",      progress: 10 },
];

const chantierNames: Record<string, string> = {
  "1": "Tour Horizon",
  "2": "Résidence Les Pins",
  "3": "Pont Sud",
  "4": "Centre Commercial",
  "5": "Immeuble Lumière",
  "6": "Stade Municipal",
};

// test

export default function JobsiteHub() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const chantierName = chantierNames[id ?? ""] ?? "Chantier";

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-XL text-gray-400 hover:text-gray-600 mb-3 flex items-center gap-1 transition-colors"
        >
          ← Tous les chantiers
        </button>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{chantierName}</h1>
        <p className="text-sm text-gray-400 mt-1">Sélectionne un dashboard</p>
      </div>

      {/* Dashboards grid */}
      <div className="max-w-2xl flex flex-col gap-3">
        {dashboards.map((db) => (
          <DashboardCard
            key={db.id}
            {...db}
            onClick={() => navigate(`/dashboard/${id}/${db.id}`)}
          />
        ))}
      </div>
    </div>
  );
}