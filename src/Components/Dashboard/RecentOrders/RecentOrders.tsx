import OrderRow, { Order } from "./OrderRow";

const defaultOrders: Order[] = [
  { id: "#876364", productName: "Voiles",    price: 98,  totalOrder: 325, total: 32000 },
  { id: "#876368", productName: "Planchers", price: 471, totalOrder: 53,  total: 25000 },
  { id: "#876412", productName: "Poutres",   price: 163, totalOrder: 78,  total: 12750 },
  { id: "#876621", productName: "Acier",     price: 200, totalOrder: 10,  total: 2000  },
];

const columns = ["nb commande", "Nom du produit", "prix", "Total Order", "Total"];

interface RecentOrdersProps {
  orders?: Order[];
}

export default function RecentOrders({ orders = defaultOrders }: RecentOrdersProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-sm font-semibold text-gray-900 tracking-tight">
          Commande Recents
        </span>
        <button className="flex gap-1 p-1 rounded-md hover:bg-gray-100 transition-colors">
          {[0, 1, 2].map((i) => (
            <span key={i} className="block w-1 h-1 rounded-full bg-gray-400" />
          ))}
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
  );
}