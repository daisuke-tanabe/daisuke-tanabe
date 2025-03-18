import { join } from 'node:path';

const isProduction = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: join(import.meta.dirname, '../../'),
  transpilePackages: ['@workspace/ui'],
  // https://nextjs.org/docs/app/building-your-application/deploying#static-assets
  ...(isProduction && { assetPrefix: 'https://daisuke-tanabe.dev' })
};

export default nextConfig;
