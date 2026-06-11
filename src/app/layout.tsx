import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Weekly Analytics Dashboard — DesignDashboard999',
  description:
    'A polished, dark-themed single-page weekly support and product analytics dashboard with seeded demo data.',
};

export const viewport: Viewport = {
  themeColor: '#0b1120',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
