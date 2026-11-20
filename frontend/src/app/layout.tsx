import type { Metadata } from 'next';
import { Sora, DM_Sans } from 'next/font/google';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import './globals.css';

const sora = Sora({ subsets: ['latin', 'latin-ext'], weight: ['500', '700'], variable: '--font-heading' });
const dmSans = DM_Sans({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600'], variable: '--font-body' });

export const metadata: Metadata = {
  title: { default: 'FIX Talent | Where great people meet great work', template: '%s | FIX Talent' },
  description: 'FIX Talent connects skilled professionals with companies across Vietnam. Recruitment, staffing and HR solutions.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${dmSans.variable}`}>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
