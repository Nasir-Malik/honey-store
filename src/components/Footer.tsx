import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-amber-950 text-amber-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-amber-50 text-lg mb-3">Shehad Pure</h3>
          <p className="text-sm leading-relaxed text-amber-300">
            Authentic, raw, and unfiltered honey sourced directly from beekeepers across Pakistan.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-amber-50 mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[
              { href: '/shop', label: 'Shop All Honey' },
              { href: '/gift-boxes', label: 'Gift Boxes' },
              { href: '/about', label: 'Our Story' },
              { href: '/blog', label: 'Blog' },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-amber-100 transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-amber-50 mb-3">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                className="hover:text-amber-100 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp Order
              </a>
            </li>
            <li>
              <a href="mailto:hello@shehadpure.pk" className="hover:text-amber-100 transition-colors">
                hello@shehadpure.pk
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-amber-900 text-center text-xs text-amber-500 py-4">
        &copy; {new Date().getFullYear()} Shehad Pure. All rights reserved.
      </div>
    </footer>
  );
}
