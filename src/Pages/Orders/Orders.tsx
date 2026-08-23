import React, { useEffect, useState } from "react";
import OrderRow, {
  Order,
} from "../../Components/Dashboard/RecentOrders/OrderRow";

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const response = await fetch(
          "http://localhost:3000/dashboard/armature/orders",
          {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}`);
        }

        const data: { orders: Order[] } = await response.json();
        setOrders(data.orders);
      } catch (err) {
        const message =
        err instanceof Error ? err.message : "Erreur inconnue";

        setError(`Impossible de charger les commandes : ${message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <main className="p-8">Chargement des commandes...</main>;
  }

  if (error) {
    return <main className="p-8 text-red-600">{error}</main>;
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Toutes les commandes</h1>
        <p className="mt-2 text-gray-600">
          {orders.length} commande{orders.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
        {orders.length === 0 ? (
          <p className="text-gray-600">Aucune commande trouvée.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left">
                <th className="border-b border-gray-300 px-3 pb-3">Commande</th>
                <th className="border-b border-gray-300 px-3 pb-3">Produit</th>
                <th className="border-b border-gray-300 px-3 pb-3">Prix unit.</th>
                <th className="border-b border-gray-300 px-3 pb-3">Quantité</th>
                <th className="border-b border-gray-300 px-3 pb-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
};

export default Orders;