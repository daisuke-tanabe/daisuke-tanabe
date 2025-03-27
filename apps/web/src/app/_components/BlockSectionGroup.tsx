import { PropsWithChildren } from 'react';

export type BlockSectionGroupProps = PropsWithChildren;

export function BlockSectionGroup({ children }: BlockSectionGroupProps) {
  return <div className="flex flex-col gap-15">{children}</div>;
}
