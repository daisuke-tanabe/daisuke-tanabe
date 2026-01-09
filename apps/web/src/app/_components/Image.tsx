'use client';

import { type ImgHTMLAttributes } from 'react';

import { type Extendable } from '@/types';

export type ImageProps = Extendable<
  ImgHTMLAttributes<HTMLImageElement>,
  {
    src?: string;
  }
>;

export default function Image({ src, alt, ...props }: ImageProps) {
  const url = src ? `${process.env.NEXT_PUBLIC_CDN_URL}${src}` : undefined;

  return <img src={url} alt={alt} {...props} />;
}
