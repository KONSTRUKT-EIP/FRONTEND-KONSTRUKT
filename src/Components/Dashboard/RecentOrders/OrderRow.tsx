export interface Order {
  id: string;
  productName: string;
  productIcon?: string;
  price: number;
  totalOrder: number;
  total: number;
}

interface OrderRowProps {
  order: Order;
}

export default function OrderRow({ order }: OrderRowProps) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-3 py-3.5 text-sm font-medium text-gray-900 border-b border-gray-100">
        {order.id}
      </td>
      <td className="px-3 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          {order.productIcon && (
            <img
              src={order.productIcon}
              alt={order.productName}
              className="w-8 h-8 object-contain rounded-md"
            />
          )}
          <span className="text-sm text-gray-600">{order.productName}</span>
        </div>
      </td>
      <td className="px-3 py-3.5 text-sm text-gray-500 border-b border-gray-100">
        {order.price} €
      </td>
      <td className="px-3 py-3.5 border-b border-gray-100">
        <span className="inline-block bg-blue-50 text-blue-500 text-xs font-semibold px-3 py-1 rounded-full">
          {order.totalOrder}
        </span>
      </td>
      <td className="px-3 py-3.5 text-sm font-medium text-gray-900 border-b border-gray-100">
        {order.total.toLocaleString("fr-FR")} €
      </td>
    </tr>
  );
}