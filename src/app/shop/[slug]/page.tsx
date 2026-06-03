import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/types';
import { formatPKR, formatUSD } from '@/lib/utils';
import AddToCartButton from './AddToCartButton';

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('products')
      .select('*, beekeeper:beekeepers(*)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
    return (data as Product) ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} — Shehad Pure`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-square bg-amber-50 rounded-2xl flex items-center justify-center text-9xl">
          {product.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover rounded-2xl" />
          ) : (
            '🍯'
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          <p className="text-xs text-amber-600 font-semibold uppercase tracking-widest mb-2">
            {product.origin_region}
          </p>
          <h1 className="text-3xl font-bold text-amber-900 mb-4">{product.name}</h1>
          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-2xl font-bold text-amber-800">{formatPKR(product.price_pkr)}</span>
            <span className="text-gray-400 text-sm">{formatUSD(product.price_usd)}</span>
          </div>

          {product.stock_qty > 0 ? (
            <AddToCartButton product={product} />
          ) : (
            <p className="text-red-500 font-medium">Out of stock</p>
          )}

          {/* Beekeeper story */}
          {product.beekeeper && (
            <div className="mt-8 p-5 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide mb-1">
                Meet the Beekeeper
              </p>
              <p className="font-semibold text-amber-900">{product.beekeeper.name}</p>
              <p className="text-sm text-gray-500">{product.beekeeper.region}</p>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{product.beekeeper.story}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
