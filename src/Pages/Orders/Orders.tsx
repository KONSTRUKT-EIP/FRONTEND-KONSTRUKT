import React, { useState } from 'react';
import RecentOrders from './RecentOrdersPage/RecentOrders';
import { Order } from './RecentOrdersPage/OrderRow';
import OrderDetailModal from './RecentOrdersPage/OrderDetailModal';

const mockOrders: Order[] = [
  { id: "#876364", productName: "Voiles",              price: 98,   totalOrder: 325, total: 32000 },
  { id: "#876368", productName: "Planchers",           price: 471,  totalOrder: 53,  total: 25000 },
  { id: "#876412", productName: "Poutres",             price: 163,  totalOrder: 78,  total: 12750 },
  { id: "#876621", productName: "Acier",               price: 200,  totalOrder: 10,  total: 2000  },
  { id: "#876745", productName: "Hourdis",             price: 87,   totalOrder: 210, total: 18270 },
  { id: "#876890", productName: "Ciment",              price: 12,   totalOrder: 500, total: 6000  },
  { id: "#877012", productName: "Coffrage bois",       price: 55,   totalOrder: 140, total: 7700  },
  { id: "#877134", productName: "Treillis soudés",     price: 340,  totalOrder: 22,  total: 7480  },
  { id: "#877256", productName: "Buses béton",         price: 220,  totalOrder: 35,  total: 7700  },
  { id: "#877378", productName: "Poutrelles IPN",      price: 890,  totalOrder: 14,  total: 12460 },
  { id: "#877501", productName: "Géotextile",          price: 3,    totalOrder: 800, total: 2400  },
  { id: "#877623", productName: "Chevêtres préfa.",    price: 145,  totalOrder: 60,  total: 8700  },
  { id: "#877745", productName: "Linteaux béton",      price: 68,   totalOrder: 95,  total: 6460  },
  { id: "#877867", productName: "Gravier concassé",   price: 28,   totalOrder: 300, total: 8400  },
  { id: "#877989", productName: "Dalles alvéolaires", price: 520,  totalOrder: 18,  total: 9360  },
];

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const handleCreateOrder = async (payload: Omit<Order, "id">) => {
    const newOrder: Order = {
      ...payload,
      id: `#${Math.floor(Math.random() * 900000 + 100000)}`,
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Commandes</h1>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <RecentOrders
            orders={orders}
            onCreateOrder={handleCreateOrder}
            onOrderClick={(order) => setSelectedOrder(order)}
          />
        </div>
        <div className="col-span-1 bg-white rounded-2xl p-6 shadow-sm flex items-center justify-center">
          <span className="text-sm text-gray-800">Analytics (à venir)</span>
        </div>
      </div>

      {/* Modal détail */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </main>
  );
};

export default Orders;