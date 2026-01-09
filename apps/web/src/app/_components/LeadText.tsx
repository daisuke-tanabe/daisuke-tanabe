'use client';

import { type PropsWithChildren } from 'react';

export type LeadTextProps = PropsWithChildren;

export function LeadText({ children }: LeadTextProps) {
  return <p className="text-sm leading-[1.8]">{children}</p>;
}
