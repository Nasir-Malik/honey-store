'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { FulfillmentStatus } from '@/types';

const STATUSES: FulfillmentStatus[] = ['pending', 'packed', 'shipped', 'delivered', 'cancelled'];

export default function OrderStatusSelect({
  orderId,
  current,
}: {
  orderId: string;
  current: FulfillmentStatus;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as FulfillmentStatus;
    await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fulfillment_status: newStatus }),
    });
    startTransition(() => router.refresh());
  }

  return (
    <select
      value={current}
      onChange={onChange}
      disabled={isPending}
      className="border border-amber-200 rounded-lg px-2 py-1 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 capitalize disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s} className="capitalize">{s}</option>
      ))}
    </select>
  );
}
