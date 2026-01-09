'use client';

import { type PropsWithChildren } from 'react';

export type BlockSectionProps = PropsWithChildren;

export function BlockSection({ children }: BlockSectionProps) {
  return <section>{children}</section>;
}
