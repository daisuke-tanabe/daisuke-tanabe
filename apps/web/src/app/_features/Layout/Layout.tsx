import { Github } from 'lucide-react';
import NextLink from 'next/link';
import { ReactNode } from 'react';

import Image from '@/app/_components/Image';
import { Button } from '@/components/primitives';

import { ModeToggle } from './ModeToggle.client';
import { Navigation } from './Navigation.client';

type LayoutProps = Readonly<{
  children: ReactNode;
}>;

export function Layout({ children }: LayoutProps) {
  return (
    <div className="grid mx-auto w-auto grid-rows-[auto_auto_1fr_auto] min-h-screen p-4 sm:p-8 sm:max-w-xl">
      <header className="flex gap-4 items-start">
        <div className="flex gap-4 items-center">
          <div className="h-[48] w-[48] rounded-[24] overflow-hidden">
            <Image src="/images/avatar.avif" alt="Daisuke Tanabe" width="48" height="48" />
          </div>
          <div>
            <NextLink href="/" className="text-lg leading-[1.4] tracking-wide hover:underline">
              Daisuke&thinsp;Tanabe
            </NextLink>
            <span className="block text-xs leading-[1.4] tracking-wide px-0.5 text-muted-foreground">
              Tokyo、Web Frontend Engineer
            </span>
          </div>
        </div>
        <div className="flex gap-1 items-center ml-auto">
          <ModeToggle />
        </div>
      </header>

      <Navigation />

      <main className="h-full">{children}</main>

      <footer className="flex items-center mt-20">
        <small className="font-light text-sm text-muted-foreground">&copy; Daisuke Tanabe.</small>
        <div className="flex gap-2 ml-auto">
          <Button variant="ghost" size="icon" className="size-7" asChild>
            <a
              href="https://github.com/daisuke-tanabe"
              target="_blank"
              aria-label="GitHub で Daisuke Tanabe のプロフィールを見る"
            >
              <Github className=" h-[1em] w-[1em]" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" className="size-7" asChild>
            <a
              href="https://x.com/DaisukeTanabe"
              target="_blank"
              aria-label="X（旧Twitter）で Daisuke Tanabe のプロフィールを見る"
            >
              <svg
                width="16"
                height="16.36"
                viewBox="0 0 1200 1227"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-current"
              >
                <path
                  d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
                  className="fill-current"
                />
              </svg>
            </a>
          </Button>
        </div>
      </footer>
    </div>
  );
}
