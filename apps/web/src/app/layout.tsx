import { GoogleAnalytics } from '@next/third-parties/google';
import { ThemeProvider } from '@workspace/ui/providers';
import { Metadata } from 'next';
import { Zen_Kaku_Gothic_New, Lato } from 'next/font/google';
import { ReactNode } from 'react';

import { Layout } from '@/app/_layout/Layout';

import '@workspace/ui/globals.css';

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

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${zenKakuGothicNew.variable} ${lato.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>

      <GoogleAnalytics gaId="G-7LH0P8DBP9" />
    </html>
  );
}
