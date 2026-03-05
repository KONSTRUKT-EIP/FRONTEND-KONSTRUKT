import { useState } from "react";
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
  { id: "1", name: "Tour Horizon",       location: "Paris, 75008",     responsible: "Jean Dupont"    },
  { id: "2", name: "Résidence Les Pins", location: "Lyon, 69003",      responsible: "Marie Leroy"    },
  { id: "3", name: "Pont Sud",           location: "Marseille, 13002", responsible: "Pierre Martin"  },
  { id: "4", name: "Centre Commercial",  location: "Bordeaux, 33000",  responsible: "Sophie Bernard" },
  { id: "5", name: "Immeuble Lumière",   location: "Nantes, 44000",    responsible: "Lucas Petit"    },
  { id: "6", name: "Stade Municipal",    location: "Toulouse, 31000",  responsible: "Emma Moreau"    },
];

export default function JobsitList() {
  const navigate = useNavigate();
  const [chantiers, _setChantiers] = useState<Chantier[]>(initialChantiers);

  // const handlePhotoChange = (id: string, url: string) => {
  //   setChantiers((prev) =>
  //     prev.map((c) => (c.id === id ? { ...c, photo: url } : c))
  //   );
  // };

  return (
    <div className="min-h-screen bg-gray-100">
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
          {chantiers.map((chantier) => (
            <ChantierCard
              key={chantier.id}
              {...chantier}
              onPhotoChange={handlePhotoChange}
              onClick={() => navigate(`/dashboard/${chantier.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}