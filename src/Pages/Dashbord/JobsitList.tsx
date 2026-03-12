import { useState, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import ChantierCard from "../../Components/Dashboard/JobsitCard/JobsitCard";
import React from 'react';

export interface Chantier {
  id: string;
  name: string;
  location: string;
  responsible: string;
  photo?: string;
}

const initialChantiers: Chantier[] = [
  { id: "1", name: "Tour Horizon",       location: "Paris, 75008",     responsible: "Jean Dupont",    photo: "/assets/2011-TOUR-HORIZON-BOULOGNE-BILLANCOURT-P-1-1000X667.jpg" },
  { id: "2", name: "Résidence Les Pins", location: "Lyon, 69003",      responsible: "Marie Leroy",    photo: "/assets/690031968.jpg" },
  { id: "3", name: "Pont Sud",           location: "Marseille, 13002", responsible: "Pierre Martin",  photo: "/assets/le-pont-pinede-pont-mobile-basculant-port-de-marseille-25.jpg" },
  { id: "4", name: "Centre Commercial",  location: "Bordeaux, 33000",  responsible: "Sophie Bernard", photo: "/assets/318c1bb26c90-Photo-centre-commercial-Auchan-Bordeaux-Lac-2021-03-03T14-31-27.847Z-14-31-27.jpg" },
  { id: "5", name: "Immeuble Lumière",   location: "Nantes, 44000",    responsible: "Lucas Petit",    photo: "/assets/Tour-360-View-Nantes-France-LAN-Architecture-Kaufman-Broad-Conception-lumiere-Nicolas-Houel-evenementiel-2017-Copyright-Vincent-Laganier-8.jpg" },
  { id: "6", name: "Stade Municipal",    location: "Toulouse, 31000",  responsible: "Emma Moreau",    photo: "/assets/Stadium-Lory.jpg" },
];

export default function JobsitList() {
  const navigate = useNavigate();
  const [chantiers, setChantiers] = useState<Chantier[]>(initialChantiers);

  const handlePhotoChange = (id: string, url: string) => {
    setChantiers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, photo: url } : c))
    );
  };

  return (
    <main className="min-h-screen bg-gray-100" role="main" aria-label="Liste des chantiers">
      {/* Banner */}
      <div className="w-full bg-gradient-to-r from-indigo-600 to-indigo-400 px-8 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-indigo-200 text-xs font-medium uppercase tracking-widest mb-1">
            Konstrukt
          </p>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Mes Chantiers
          </h1>
          <p className="text-indigo-200 text-sm mt-1">
            {chantiers.length} chantiers actifs
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="w-full px-20 py-8">
        <div className="grid grid-cols-4 gap-7">
          <Suspense fallback={<div>Chargement...</div>}>
            {chantiers.map((chantier) => (
              <ChantierCard
                key={chantier.id}
                {...chantier}
                onPhotoChange={handlePhotoChange}
                onClick={() => navigate(`/dashboard/${chantier.id}`)}
              />
            ))}
          </Suspense>
        </div>
      </div>
    </main>
  );
}