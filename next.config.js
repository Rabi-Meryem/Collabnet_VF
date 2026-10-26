import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '.prisma/client': require.resolve('@prisma/client')
    };
    return config;
  },
};

export default nextConfig;
