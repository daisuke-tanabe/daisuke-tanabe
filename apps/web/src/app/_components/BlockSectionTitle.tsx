'use client';

import { type PropsWithChildren } from 'react';

export type BlockSectionTitleProps = PropsWithChildren;

export function BlockSectionTitle({ children }: BlockSectionTitleProps) {
  return <h2 className="text-sm leading-[1.6] mb-6">{children}</h2>;
}
