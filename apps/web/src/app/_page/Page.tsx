'use client';

import dynamic from 'next/dynamic';

const ObeliskCanvas = dynamic(
  () => import('./ObeliskCanvas').then(mod => mod.ObeliskCanvas),
  { ssr: false });

export function Page() {
  return <ObeliskCanvas />
}
