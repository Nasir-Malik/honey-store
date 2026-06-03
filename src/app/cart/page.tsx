'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cart';
import { formatPKR } from '@/lib/utils';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPKR } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-6xl mb-6">🍯</p>
        <h1 className="text-2xl font-bold text-amber-900 mb-3">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Add some honey and come back!</p>
        <Link
          href="/shop"
          className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-full transition-colors"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-amber-900 mb-8">Your Cart</h1>

      <div className="space-y-4 mb-8">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-amber-100">
            <div className="w-16 h-16 bg-amber-50 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
              {product.images[0] ? (
                <Image src={product.images[0]} alt={product.name} width={64} height={64} className="rounded-lg object-cover" />
              ) : '🍯'}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-amber-900 truncate">{product.name}</p>
              <p className="text-sm text-gray-500">{product.origin_region}</p>
              <p className="font-bold text-amber-700 mt-1">{formatPKR(product.price_pkr)}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="w-8 h-8 rounded-full border border-amber-200 flex items-center justify-center hover:bg-amber-50 transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center font-medium">{quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="w-8 h-8 rounded-full border border-amber-200 flex items-center justify-center hover:bg-amber-50 transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <button
              onClick={() => removeItem(product.id)}
              className="p-2 text-red-400 hover:text-red-600 transition-colors"
              aria-label="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-bold text-amber-900 text-xl">{formatPKR(totalPKR())}</span>
        </div>
        <p className="text-xs text-gray-400 mb-6">Shipping calculated at checkout. Standard delivery: 3-5 business days.</p>
        <Link
          href="/checkout"
          className="block w-full text-center bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-full transition-colors"
        >
          Proceed to Checkout
        </Link>
        <Link
          href="/shop"
          className="block w-full text-center text-amber-700 hover:text-amber-900 font-medium py-2 mt-3 transition-colors text-sm"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
