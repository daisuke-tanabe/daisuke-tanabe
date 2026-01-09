'use client';

import { type PropsWithChildren } from 'react';

export type EntryGroupProps = PropsWithChildren;

export function EntryList({ children }: EntryGroupProps) {
  return <ul className="grid gap-6">{children}</ul>;
}
