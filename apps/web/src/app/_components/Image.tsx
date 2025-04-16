import { ImgHTMLAttributes } from 'react';

import { Extendable } from '@/types';

const isProd = process.env.NODE_ENV === 'production';

export type ImageProps = Extendable<
  ImgHTMLAttributes<HTMLImageElement>,
  {
    src?: string;
  }
>;

export default function Image({ src, alt, ...props }: ImageProps) {
  const prefix = isProd ? process.env.NEXT_PUBLIC_CDN_URL : '';
  const url = src ? `${prefix}${src}` : undefined;

  return <img src={url} alt={alt} {...props} />;
}
