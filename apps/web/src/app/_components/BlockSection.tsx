'use client';

import { PropsWithChildren } from 'react';

export type BlockSectionProps = PropsWithChildren;

export function BlockSection({ children }: BlockSectionProps) {
  return <section>{children}</section>;
}
