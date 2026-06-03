import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import type { Order } from '@/types';
import { formatPKR } from '@/lib/utils';
import Link from 'next/link';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Order Received',
  packed: 'Packed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

async function getOrder(id: string): Promise<Order | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('orders').select('*').eq('id', id).single();
    return (data as Order) ?? null;
  } catch {
    return null;
  }
}

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-5xl mb-4">✅</div>
      <h1 className="text-2xl font-bold text-amber-900 mb-2">Order Confirmed!</h1>
      <p className="text-gray-500 mb-8">Order #{order.id.slice(0, 8).toUpperCase()}</p>

      <div className="bg-amber-50 rounded-xl border border-amber-100 p-6 text-left mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-amber-900">Status</span>
          <span className="text-sm font-bold text-amber-700">{STATUS_LABELS[order.fulfillment_status] ?? order.fulfillment_status}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-amber-900">Payment</span>
          <span className="text-sm font-bold text-green-600 capitalize">{order.payment_status}</span>
        </div>
        <div className="border-t border-amber-100 pt-4 space-y-2">
          {order.items.map(({ product, quantity }: { product: { name: string; price_pkr: number }; quantity: number }) => (
            <div key={product.name} className="flex justify-between text-sm">
              <span className="text-gray-600">{product.name} × {quantity}</span>
              <span>{formatPKR(product.price_pkr * quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-amber-900 pt-2 border-t border-amber-100">
            <span>Total</span>
            <span>{formatPKR(order.total_pkr)}</span>
          </div>
        </div>
      </div>

      <Link
        href="/shop"
        className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-full transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
