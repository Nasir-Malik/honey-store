export const metadata = {
  title: 'Our Story — Shehad Pure',
};

const beekeepers = [
  { name: 'Haji Abdul Karim', region: 'Sindh', honey: 'Sidr Honey', emoji: '🏜️' },
  { name: 'Muhammad Aslam', region: 'Punjab', honey: 'Acacia Honey', emoji: '🌾' },
  { name: 'Khan Bahadur', region: 'KPK', honey: 'Beri Honey', emoji: '⛰️' },
  { name: 'Ghulam Nabi', region: 'Gilgit-Baltistan', honey: 'Wild Mountain Honey', emoji: '🏔️' },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">Our Story</h1>
      <p className="text-gray-500 text-lg mb-10 max-w-2xl">
        Shehad Pure was born from a simple belief: Pakistan's honey is world-class, and the people who make it deserve to be known.
      </p>

      <div className="prose prose-amber max-w-none mb-16 text-gray-700 leading-relaxed space-y-4">
        <p>
          Pakistan is home to extraordinary natural landscapes — the Thar desert, the Chenab riverbanks, the valleys of KPK, and the alpine meadows of Gilgit-Baltistan. Each produces a honey unlike any other, shaped by the unique flora and altitude of its region.
        </p>
        <p>
          Yet for decades, this honey has flowed through anonymous supply chains, stripped of its origin story and sold without credit to the beekeepers who harvested it. We set out to change that.
        </p>
        <p>
          We work directly with a small number of trusted beekeepers, visiting their hives, understanding their practices, and bringing their harvest to you with full transparency. Every jar tells you exactly who made it and where.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-amber-900 mb-6">Our Beekeepers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {beekeepers.map((b) => (
          <div key={b.name} className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
            <span className="text-4xl">{b.emoji}</span>
            <h3 className="font-bold text-amber-900 mt-3">{b.name}</h3>
            <p className="text-sm text-amber-600">{b.region} — {b.honey}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
