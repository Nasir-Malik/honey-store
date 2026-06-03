import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: 'Shehad Pure — Authentic Pakistani Honey',
  description:
    'Raw, unfiltered honey sourced directly from beekeepers across Pakistan. Sidr, Acacia, Beri, and Wild Mountain varieties.',
  openGraph: {
    title: 'Shehad Pure — Authentic Pakistani Honey',
    description: 'Raw honey from Pakistan\'s finest beekeepers.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[--background] text-[--foreground]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
