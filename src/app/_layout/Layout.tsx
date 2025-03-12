import { ModeToggle } from './ModeToggle';
import { ReactNode } from 'react';

type LayoutProps = Readonly<{
  children: ReactNode;
}>;

export function Layout({ children }: LayoutProps) {
  return (
    <div className="grid mx-auto p-8 max-w-3xl w-auto h-full grid-rows-[auto_1fr_auto] h-screen">
      <header className="flex justify-between	">
        <div>
          <h1 className="text-2xl tracking-wide">Daisuke&thinsp;Tanabe</h1>
          <p className="text-xs tracking-wide">I&apos;m a Web Frontend Engineer</p>
        </div>
        <ModeToggle />
      </header>

      <main>{children}</main>
    </div>
  );
}
