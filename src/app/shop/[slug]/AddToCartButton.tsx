'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cart';
import type { Product } from '@/types';
import { ShoppingCart, Check } from 'lucide-react';

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      onClick={handleAdd}
      className="flex items-center justify-center gap-2 w-full bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-semibold py-3 px-6 rounded-full transition-colors"
    >
      {added ? (
        <>
          <Check className="w-5 h-5" />
          Added to cart
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </>
      )}
    </button>
  );
}
