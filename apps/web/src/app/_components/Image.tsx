import React, { ImgHTMLAttributes } from 'react';

export default function Image({ src, alt, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const fullPath = src ? `${process.env.NEXT_PUBLIC_CDN_URL}${src}` : undefined;

  return <img src={fullPath} alt={alt} {...props} />;
}
