import './globals.css';

import { GoogleAnalytics } from '@next/third-parties/google';
import { Metadata } from 'next';
import { Lato, Zen_Kaku_Gothic_New } from 'next/font/google';
import { ReactNode } from 'react';

import { AppShell } from '@/app/_features/AppShell';
import { ThemeProvider } from '@/app/_providers';

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  subsets: ['latin'],
  weight: ['400', '700'],
  preload: true,
  variable: '--font-zen-kaku-gothic-new',
  display: 'swap',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  preload: true,
  variable: '--font-lato',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s - Daisuke Tanabe',
    default: 'Daisuke Tanabe',
  },
  description: 'Daisuke Tanabe のポートフォリオサイトのホームページです。',
};

export const dynamic = 'force-dynamic';

type RootLayoutProps = {
  children: ReactNode;
  modal: ReactNode;
};

export default function Layout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${zenKakuGothicNew.variable} ${lato.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AppShell>{children}</AppShell>
          {modal}
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-7LH0P8DBP9" />
    </html>
  );
}
