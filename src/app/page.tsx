import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

const trustBadges = [
  { icon: '🌿', label: 'Raw & Unfiltered', desc: 'No heat treatment, no additives.' },
  { icon: '📍', label: 'Source-Traced', desc: 'Every jar linked to a named beekeeper and region.' },
  { icon: '🚚', label: 'Nationwide Delivery', desc: 'Delivered across Pakistan within 3-5 days.' },
  { icon: '💳', label: 'Flexible Payments', desc: 'JazzCash, Easypaisa, card, or Cash on Delivery.' },
];

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('products')
      .select('*, beekeeper:beekeepers(*)')
      .eq('is_active', true)
      .limit(4);
    return (data as Product[]) ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 text-amber-50 py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-amber-300 text-sm font-semibold uppercase tracking-widest mb-4">
            Straight from Pakistan's beekeepers
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Pure Honey,<br />
            <span className="text-amber-300">Honestly Sourced.</span>
          </h1>
          <p className="text-amber-200 text-lg md:text-xl mb-10 max-w-xl mx-auto">
            Sidr, Acacia, Beri, and Wild Mountain honey — harvested by hand, delivered to your door.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-amber-400 hover:bg-amber-300 text-amber-900 font-bold px-8 py-3 rounded-full transition-colors text-lg"
            >
              Shop Now
            </Link>
            <Link
              href="/gift-boxes"
              className="border-2 border-amber-300 hover:bg-amber-800 text-amber-100 font-semibold px-8 py-3 rounded-full transition-colors text-lg"
            >
              Gift Boxes
            </Link>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-amber-50 border-y border-amber-100 py-10 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustBadges.map((b) => (
            <div key={b.label} className="flex flex-col items-center text-center gap-2">
              <span className="text-3xl">{b.icon}</span>
              <p className="font-semibold text-amber-900 text-sm">{b.label}</p>
              <p className="text-xs text-gray-500">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-amber-900">Our Honeys</h2>
          <Link href="/shop" className="text-sm font-semibold text-amber-700 hover:text-amber-900 transition-colors">
            View all →
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Sidr Honey', 'Acacia Honey', 'Beri Honey', 'Wild Mountain Honey'].map((name) => (
              <div key={name} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-amber-100">
                <div className="aspect-square bg-amber-50 flex items-center justify-center text-6xl">🍯</div>
                <div className="p-4">
                  <p className="font-semibold text-amber-900">{name}</p>
                  <p className="text-xs text-amber-600 mt-1">Connect Supabase to load live data</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Origin story strip */}
      <section className="bg-amber-900 text-amber-50 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">From Hive to Home</h2>
          <p className="text-amber-200 leading-relaxed mb-8">
            Pakistan is home to some of the world's most prized honey varieties — yet most go unrecognised.
            We work directly with beekeepers in Sindh, Punjab, KPK, and Gilgit-Baltistan to bring their harvest
            to your table, without compromise.
          </p>
          <Link
            href="/about"
            className="inline-block border-2 border-amber-300 hover:bg-amber-800 text-amber-100 font-semibold px-8 py-3 rounded-full transition-colors"
          >
            Read Our Story
          </Link>
        </div>
      </section>
    </>
  );
}
