'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

const gap = 24;

const tabsData = [
  {
    label: 'home',
    href: '/',
  },
  {
    label: 'note',
    href: '/note',
  },
];

export function Navigation() {
  const pathname = usePathname();
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicators, setIndicators] = useState<number[]>(tabsData.map(() => 0));

  const segment = pathname
    .slice(1)
    .match(/^[a-z]*/g)
    ?.at(0);
  const currentTab = segment === '' ? 0 : tabsData.findIndex(({ label }) => label === segment);
  const indicatorMove =
    currentTab * gap + (currentTab !== 0 ? indicators.reduce((a, b, index) => (index >= currentTab ? a : a + b)) : 0);

  const setTabRef = useCallback(
    (index: number) => (el: HTMLAnchorElement | null) => {
      tabRefs.current[index] = el;
    },
    [],
  );

  useEffect(() => {
    setIndicators(tabRefs.current.map((el) => el?.offsetWidth ?? 0));
  }, []);

  return (
    <nav className={`my-12 inline-flex gap-${gap / 4} relative`}>
      <div
        className="bg-primary h-[1] absolute -bottom-0 transition-all"
        style={{
          width: indicators[currentTab],
          transform: `translateX(${indicatorMove}px)`,
        }}
      />
      {tabsData.map(({ label, href }, index) => (
        <NextLink key={index} ref={setTabRef(index)} href={href} className="text-sm tracking-wide leading-8 rounded-md">
          {label.charAt(0).toUpperCase() + label.slice(1)}
        </NextLink>
      ))}
    </nav>
  );
}
