import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types';
import { formatPKR } from '@/lib/utils';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-amber-100"
    >
      <div className="relative aspect-square bg-amber-50">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl select-none">
            🍯
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-amber-600 font-medium mb-1 uppercase tracking-wide">
          {product.origin_region}
        </p>
        <h3 className="font-semibold text-amber-900 group-hover:text-amber-700 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
        <p className="mt-3 font-bold text-amber-800">{formatPKR(product.price_pkr)}</p>
      </div>
    </Link>
  );
}
