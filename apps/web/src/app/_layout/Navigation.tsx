'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { createRef, RefObject, useEffect, useRef, useState } from 'react';

const gap = 24;

const tabsData = [
  {
    label: 'home',
    href: '/',
  },
  {
    label: 'posts',
    href: '/posts',
  },
];

export function Navigation() {
  const pathname = usePathname();
  const tabRefs = useRef<RefObject<HTMLAnchorElement>[]>([]);
  const [indicators, setIndicators] = useState<number[]>(tabsData.map(() => 0));

  const segment = pathname
    .slice(1)
    .match(/^[a-z]*/g)
    ?.at(0);
  const currentTab = segment === '' ? 0 : tabsData.findIndex(({ label }) => label === segment);
  const indicatorMove =
    currentTab * gap + (currentTab !== 0 ? indicators.reduce((a, b, index) => (index >= currentTab ? a : a + b)) : 0);

  tabsData.forEach((_, index) => {
    tabRefs.current[index] = createRef<HTMLAnchorElement>() as RefObject<HTMLAnchorElement>;
  });

  useEffect(() => {
    setIndicators(tabRefs.current.map(({ current }) => current.offsetWidth));
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
        <NextLink
          key={index}
          ref={tabRefs.current[index]}
          href={href}
          className="text-sm tracking-wide leading-8 rounded-md"
        >
          {label.charAt(0).toUpperCase() + label.slice(1)}
        </NextLink>
      ))}
    </nav>
  );
}
