import NextLink from 'next/link';
import { type ReactNode } from 'react';

import { ModeToggle } from './ModeToggle.client';
import { Navigation } from './Navigation.client';

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="grid mx-auto w-auto grid-rows-[auto_auto_1fr_auto] min-h-screen p-4 sm:p-8 sm:max-w-xl">
      <header className="flex gap-4 items-start">
        <div className="flex flex-col gap-1">
          <NextLink href="/" className="text-lg leading-[1.4] tracking-wide hover:underline">
            Daisuke&thinsp;Tanabe
          </NextLink>
          <span className="block text-xs leading-[1.4] tracking-wide px-0.5 text-muted-foreground">
            Tokyo、Web Frontend Engineer
          </span>
        </div>
        <div className="flex gap-1 items-center ml-auto">
          <ModeToggle />
        </div>
      </header>

      <Navigation />

      <main className="h-full">{children}</main>

      <footer className="flex items-center mt-20">
        <small className="font-light text-sm text-muted-foreground">&copy; Daisuke Tanabe.</small>
        <div className="flex gap-4 ml-auto">
          <NextLink
            href="https://github.com/daisuke-tanabe"
            target="_blank"
            className="font-light text-sm"
            aria-label="GitHub で Daisuke Tanabe のプロフィールを見る"
          >
            Github
          </NextLink>
          <NextLink
            href="https://x.com/DaisukeTanabe"
            target="_blank"
            className="font-light text-sm"
            aria-label="X（旧Twitter）で Daisuke Tanabe のプロフィールを見る"
          >
            X
          </NextLink>
        </div>
      </footer>
    </div>
  );
}
