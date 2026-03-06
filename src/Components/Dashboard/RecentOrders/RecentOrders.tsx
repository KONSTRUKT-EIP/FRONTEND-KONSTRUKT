import OrderRow, { Order } from "./OrderRow";
import React, { useState } from 'react';
import CreateOrderModal from "./ModalOrder";

const columns = ["nb commande", "Nom du produit", "prix", "Total Order", "Total"];

interface RecentOrdersProps {
  orders: Order[];
  onCreateOrder?: (payload: Omit<Order, "id">) => void;
}

export default function RecentOrders({ orders, onCreateOrder }: RecentOrdersProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <CreateOrderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={async (_payload) => {
            console.log("payload reçu :", _payload);
            await onCreateOrder?.(_payload);
          }}
        />

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-sm font-semibold text-gray-900 tracking-tight">
            Commande Recents
          </span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
            + Créer une commande
          </button>
        </div>

        {/* Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col} className="text-left pb-3 px-3 border-b border-gray-100">
                  <button className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors">
                    {col}
                    <span className="text-[10px]">▼</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}