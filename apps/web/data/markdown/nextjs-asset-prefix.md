---
title: 'Next.jsの静的アセットをCDNで配信するには'
slug: 'nextjs-asset-prefix'
tags: ['Next.js']
created_at: '2025-03-31T15:00:00Z'
updated_at: 'null'
deleted_at: 'null'
published_at: '2025-03-31T15:00:00Z'
---

VercelにデプロイするとCDNが自動的に構成されますが、それ以外にデプロイする場合はアセットにプレフィックスを設定する追加作業が発生します。

Next.jsがビルド時に生成する静的アセット（`/_next/static/*`）をCDNで配信するには、`next.config.mjs` の `assetPrefix` オプションで配信先のURLを指定します。

```javascript:next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.NODE_ENV === 'production' && {
    assetPrefix: process.env.NEXT_PUBLIC_CDN_URL,
  }),
};

export default nextConfig;
```

この`assetPrefix` オプションは `public` フォルダ内のアセットパスには影響を与えません。  
`public` フォルダのアセットもCDNを経由して配信する場合は、以下のようなコンポーネントを作成し、プレフィックスを付与する必要があります。

```typescript:Image.tsx
import { ImgHTMLAttributes } from 'react';

const isProd = process.env.NODE_ENV === 'production';

export default function Image({ src, alt, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const prefix = isProd ? process.env.NEXT_PUBLIC_CDN_URL : '';
  const url = src ? `${prefix}${src}` : undefined;

  return <img src={url} alt={alt} {...props} />;
}
```
