import { GoogleAnalytics } from '@next/third-parties/google';
import { ThemeProvider } from '@workspace/ui/providers';
import localFont from 'next/font/local';
import { ReactNode } from 'react';

import { Layout } from '@/app/_layout/Layout';

import type { Metadata } from 'next';

import '@workspace/ui/globals.css';

const pixelMplus = localFont({
  src: '../fonts/PixelMplus10-Regular.ttf',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Daisuke Tanabe',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
      </head>

      <body className={`${pixelMplus.className}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>

      <GoogleAnalytics gaId="G-7LH0P8DBP9" />
    </html>
  );
}
