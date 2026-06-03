import Link from 'next/link';

export const metadata = {
  title: 'Gift Boxes — Shehad Pure',
  description: 'Curated honey gift sets — perfect for Eid, weddings, and corporate gifting.',
};

const boxes = [
  {
    name: 'Taste of Pakistan',
    desc: 'One jar each of Sidr, Acacia, and Beri honey. Perfect introduction to Pakistan\'s finest.',
    price: 7500,
    jars: 3,
    emoji: '🎁',
  },
  {
    name: 'Premium Sidr Collection',
    desc: 'Two large jars of our rarest Sidr honey from the Thar desert — the gift of kings.',
    price: 8000,
    jars: 2,
    emoji: '👑',
  },
  {
    name: 'Full Highlands Set',
    desc: 'All four varieties including Wild Mountain honey from Gilgit-Baltistan. The complete experience.',
    price: 12000,
    jars: 4,
    emoji: '🏔️',
  },
];

export default function GiftBoxesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-amber-900 mb-2">Gift Boxes</h1>
      <p className="text-gray-500 mb-12">
        Beautifully packaged sets for Eid, weddings, and corporate gifting. Delivered anywhere in Pakistan.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {boxes.map((box) => (
          <div key={box.name} className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 flex flex-col">
            <div className="text-5xl mb-4">{box.emoji}</div>
            <h2 className="text-lg font-bold text-amber-900 mb-2">{box.name}</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{box.desc}</p>
            <p className="text-xs text-amber-600 font-medium mb-4">{box.jars} jar{box.jars > 1 ? 's' : ''} included</p>
            <p className="text-xl font-bold text-amber-800 mb-5">
              PKR {box.price.toLocaleString('en-PK')}
            </p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '923001234567'}?text=${encodeURIComponent(`Hi! I'd like to order the "${box.name}" gift box.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-full transition-colors text-sm"
            >
              Order via WhatsApp
            </a>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-amber-50 rounded-2xl p-8 border border-amber-100 text-center">
        <h2 className="text-xl font-bold text-amber-900 mb-2">Custom Corporate Orders</h2>
        <p className="text-gray-500 mb-6">Need branded packaging or a bulk order for your business? We can help.</p>
        <Link
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '923001234567'}?text=${encodeURIComponent("Hi! I'd like to discuss a custom corporate honey order.")}`}
          className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-full transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get in Touch
        </Link>
      </div>
    </div>
  );
}
