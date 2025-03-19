import { Button } from '@workspace/ui/components';
import { Github } from 'lucide-react';
import NextLink from 'next/link';
import { ReactNode } from 'react';

import { ModeToggle } from './ModeToggle';

type LayoutProps = Readonly<{
  children: ReactNode;
}>;

export function Layout({ children }: LayoutProps) {
  return (
    <div className="grid mx-auto p-8 max-w-lg w-auto h-full grid-rows-[auto_1fr] h-screen">
      <header className="flex gap-4 items-start">
        <div>
          <NextLink href="/" className="block text-2xl tracking-wide hover:underline">
            Daisuke&thinsp;Tanabe
          </NextLink>
          <span className="block text-xs tracking-wide">I&apos;m a Web Frontend Engineer</span>
        </div>
        <div className="flex gap-1 items-center ml-auto py-0.5">
          <Button variant="ghost" size="icon" asChild className="size-7">
            <a href="https://github.com/daisuke-tanabe" target="_blank">
              <Github />
            </a>
          </Button>
          <ModeToggle />
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
