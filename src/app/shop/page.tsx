import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

async function getProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('products')
      .select('*, beekeeper:beekeepers(*)')
      .eq('is_active', true)
      .order('created_at');
    return (data as Product[]) ?? [];
  } catch {
    return [];
  }
}

export const metadata = {
  title: 'Shop — Shehad Pure',
  description: 'Browse our full range of raw Pakistani honey varieties.',
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-amber-900 mb-2">All Honeys</h1>
      <p className="text-gray-500 mb-10">Sourced from beekeepers across Pakistan.</p>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-gray-400">
          <p className="text-5xl mb-4">🍯</p>
          <p className="font-medium">Products will appear here once Supabase is connected.</p>
        </div>
      )}
    </div>
  );
}
