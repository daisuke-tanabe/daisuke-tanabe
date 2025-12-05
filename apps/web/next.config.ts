import { join } from 'node:path';

import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  ...(isProd && {
    compiler: {
      removeConsole: {
        exclude: ['error'],
      },
    },
    // https://nextjs.org/docs/app/building-your-application/deploying#static-assets
    assetPrefix: process.env.NEXT_PUBLIC_CDN_URL,
  }),
  httpAgentOptions: {
    keepAlive: false,
  },
  output: 'standalone',
  outputFileTracingRoot: join(import.meta.dirname, '../../'),
  poweredByHeader: false,
  // https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler
  reactCompiler: true,
};

export default nextConfig;
