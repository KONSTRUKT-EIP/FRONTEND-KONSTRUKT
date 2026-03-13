import React from 'react';
import { Order } from './OrderRow';

const mockDetails: Record<string, { dateLivraison: string; fournisseur: string; statut: string; chantier: string; notes: string }> = {
  "#876364": { dateLivraison: "15 Mar 2026", fournisseur: "Acier Pro SAS",   statut: "En transit", chantier: "Tour Horizon",       notes: "Livraison matin uniquement" },
  "#876368": { dateLivraison: "20 Mar 2026", fournisseur: "BétonSud",        statut: "Confirmée",  chantier: "Résidence Les Pins", notes: "Appeler avant livraison" },
  "#876412": { dateLivraison: "18 Mar 2026", fournisseur: "Matériaux Nord",  statut: "En attente", chantier: "Pont Sud",           notes: "" },
  "#876621": { dateLivraison: "25 Mar 2026", fournisseur: "Ferro Industrie", statut: "Confirmée",  chantier: "Centre Commercial",  notes: "Palette EUR uniquement" },
};

interface Props {
  order: Order;
  onClose: () => void;
}

export default function OrderDetailModal({ order, onClose }: Props) {
  const details = mockDetails[order.id];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8" onClick={e => e.stopPropagation()}>

        <h2 className="text-xl font-bold mb-4">Détail commande {order.id}</h2>

        <div className="grid gap-3 text-sm text-gray-700">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-400">Produit</span>
            <span className="font-semibold">{order.productName}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-400">Prix unitaire</span>
            <span className="font-semibold">{order.price} €</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-400">Quantité</span>
            <span className="font-semibold">{order.totalOrder}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-400">Total</span>
            <span className="font-semibold">{order.total.toLocaleString()} €</span>
          </div>
          {details && (
            <>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-400">Date de livraison</span>
                <span className="font-semibold">{details.dateLivraison}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-400">Fournisseur</span>
                <span className="font-semibold">{details.fournisseur}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-400">Statut</span>
                <span className="font-semibold">{details.statut}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-400">Chantier</span>
                <span className="font-semibold">{details.chantier}</span>
              </div>
              {details.notes && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Notes</span>
                  <span className="font-semibold">{details.notes}</span>
                </div>
              )}
            </>
          )}
        </div>

        <button onClick={onClose} className="mt-6 w-full bg-gray-100 hover:bg-gray-200 rounded-full py-3 font-bold">
          Fermer
        </button>
      </div>
    </div>
  );
}