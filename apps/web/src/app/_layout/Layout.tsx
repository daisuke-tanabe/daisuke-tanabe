import NextLink from 'next/link';
import { ReactNode } from 'react';

import { ModeToggle } from './ModeToggle';
import {Container} from "@/app/_components";

type LayoutProps = Readonly<{
  children: ReactNode;
}>;

export function Layout({ children }: LayoutProps) {
  return (
    <div className="grid h-full grid-rows-[auto_1fr_auto] h-screen py-8">
      <Container>
        <header className="flex gap-4 items-start">
          <div>
            <NextLink href="/" className="block text-2xl tracking-wide hover:underline">
              Daisuke&thinsp;Tanabe
            </NextLink>
            <span className="block text-xs tracking-wide">I&apos;m a Web Frontend Engineer</span>
          </div>
        </header>
      </Container>

      <main>{children}</main>
    </div>
  );
}
