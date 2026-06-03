import { createClient } from '@/lib/supabase/server';
import type { Order } from '@/types';
import { formatPKR } from '@/lib/utils';
import OrderStatusSelect from './OrderStatusSelect';

async function getOrders(): Promise<Order[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    return (data as Order[]) ?? [];
  } catch {
    return [];
  }
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  packed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default async function AdminPage() {
  const orders = await getOrders();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-amber-900 mb-8">Admin — Orders</h1>

      <div className="overflow-x-auto rounded-xl border border-amber-100 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-amber-50 text-amber-900">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Order ID</th>
              <th className="px-4 py-3 text-left font-semibold">Date</th>
              <th className="px-4 py-3 text-left font-semibold">Customer</th>
              <th className="px-4 py-3 text-left font-semibold">Total</th>
              <th className="px-4 py-3 text-left font-semibold">Payment</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-amber-50">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                  No orders yet. Connect Supabase to load data.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const addr = order.address as { full_name?: string };
                return (
                  <tr key={order.id} className="hover:bg-amber-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">{order.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('en-PK')}
                    </td>
                    <td className="px-4 py-3">{addr?.full_name ?? '—'}</td>
                    <td className="px-4 py-3 font-semibold text-amber-800">{formatPKR(order.total_pkr)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.payment_method} / {order.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusSelect orderId={order.id} current={order.fulfillment_status} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
