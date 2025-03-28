import { join } from 'node:path';

const isProduction = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: join(import.meta.dirname, '../../'),
  transpilePackages: ['@workspace/ui'],
  // https://nextjs.org/docs/app/building-your-application/deploying#static-assets
  ...(isProduction && { assetPrefix: process.env.NEXT_PUBLIC_CDN_URL }),
};

export default nextConfig;
