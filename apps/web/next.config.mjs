import { join } from 'node:path';

const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: {
      exclude: ['error'],
    },
  },
  httpAgentOptions: {
    keepAlive: false,
  },
  output: 'standalone',
  outputFileTracingRoot: join(import.meta.dirname, '../../'),
  poweredByHeader: false,
  transpilePackages: ['@workspace/ui'],
  experimental: {
    // https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler
    reactCompiler: true,
  },
  // https://nextjs.org/docs/app/building-your-application/deploying#static-assets
  assetPrefix: isProd ? process.env.NEXT_PUBLIC_CDN_URL : undefined,
};

export default nextConfig;
