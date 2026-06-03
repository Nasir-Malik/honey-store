'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cart';
import { formatPKR } from '@/lib/utils';
import type { Address, PaymentMethod } from '@/types';
import { useRouter } from 'next/navigation';

const PROVINCES = ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Gilgit-Baltistan', 'AJK', 'Islamabad'];

const PAYMENT_METHODS: { value: PaymentMethod; label: string; desc: string }[] = [
  { value: 'jazzcash', label: 'JazzCash', desc: 'Pay via JazzCash mobile wallet' },
  { value: 'easypaisa', label: 'Easypaisa', desc: 'Pay via Easypaisa mobile wallet' },
  { value: 'stripe', label: 'Credit / Debit Card', desc: 'Visa, Mastercard — international cards accepted' },
  { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
];

export default function CheckoutPage() {
  const { items, totalPKR, clearCart } = useCartStore();
  const router = useRouter();
  const [address, setAddress] = useState<Address>({
    full_name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    province: '',
    postal_code: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) {
    router.replace('/cart');
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, address, paymentMethod, totalPKR: totalPKR() }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? 'Order failed');

      if (paymentMethod === 'stripe' && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      clearCart();
      router.push(`/orders/${data.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-amber-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: address + payment */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-amber-900 mb-4">Delivery Address</h2>
            <div className="space-y-3">
              <input
                required
                placeholder="Full Name"
                value={address.full_name}
                onChange={(e) => setAddress((a) => ({ ...a, full_name: e.target.value }))}
                className="w-full border border-amber-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <input
                required
                placeholder="Phone Number"
                type="tel"
                value={address.phone}
                onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))}
                className="w-full border border-amber-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <input
                required
                placeholder="Address Line 1"
                value={address.line1}
                onChange={(e) => setAddress((a) => ({ ...a, line1: e.target.value }))}
                className="w-full border border-amber-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <input
                placeholder="Address Line 2 (optional)"
                value={address.line2}
                onChange={(e) => setAddress((a) => ({ ...a, line2: e.target.value }))}
                className="w-full border border-amber-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                  className="w-full border border-amber-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <select
                  required
                  value={address.province}
                  onChange={(e) => setAddress((a) => ({ ...a, province: e.target.value }))}
                  className="w-full border border-amber-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                >
                  <option value="">Province</option>
                  {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-amber-900 mb-4">Payment Method</h2>
            <div className="space-y-2">
              {PAYMENT_METHODS.map((pm) => (
                <label
                  key={pm.value}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                    paymentMethod === pm.value
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-amber-100 bg-white hover:border-amber-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={pm.value}
                    checked={paymentMethod === pm.value}
                    onChange={() => setPaymentMethod(pm.value)}
                    className="mt-0.5 accent-amber-600"
                  />
                  <div>
                    <p className="font-semibold text-amber-900">{pm.label}</p>
                    <p className="text-xs text-gray-500">{pm.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right: order summary */}
        <div>
          <h2 className="text-lg font-semibold text-amber-900 mb-4">Order Summary</h2>
          <div className="bg-amber-50 rounded-xl border border-amber-100 p-5 space-y-3">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-sm">
                <span className="text-gray-700">{product.name} × {quantity}</span>
                <span className="font-medium">{formatPKR(product.price_pkr * quantity)}</span>
              </div>
            ))}
            <div className="border-t border-amber-200 pt-3 flex justify-between font-bold text-amber-900">
              <span>Total</span>
              <span>{formatPKR(totalPKR())}</span>
            </div>
          </div>

          {error && (
            <p className="mt-4 text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-bold py-3 rounded-full transition-colors"
          >
            {loading ? 'Placing order…' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
