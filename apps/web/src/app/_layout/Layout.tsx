import NextLink from 'next/link';
import { ReactNode } from 'react';

import { ModeToggle } from './ModeToggle';

type LayoutProps = Readonly<{
  children: ReactNode;
}>;

export function Layout({ children }: LayoutProps) {
  return (
    <div className="grid mx-auto p-8 max-w-3xl w-auto h-full grid-rows-[auto_1fr_auto] h-screen">
      <header className="flex gap-4 items-start">
        <div>
          <NextLink href="/" className="block text-2xl tracking-wide hover:underline">
            Daisuke&thinsp;Tanabe
          </NextLink>
          <span className="block text-xs tracking-wide">I&apos;m a Web Frontend Engineer</span>
        </div>
        <div className="flex gap-5 items-center ml-auto py-0.5">
          <nav className="flex gap-7">
            <NextLink href="/about" className="hover:underline">
              About
            </NextLink>
            <NextLink href="/blog" className="hover:underline">
              Blog
            </NextLink>
          </nav>
          <ModeToggle />
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
