import type { NextConfig } from 'next';
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
    images: {
        qualities: [10, 75],
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'utfs.io',
            port: '',
            pathname: '/f/**',
          },
          {
            protocol: 'https',
            hostname: 'images.unsplash.com',
            port: '',
            pathname: '/**',
          },
        ],
      },
    webpack: (config) => {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(process.cwd(), './'),
      };
      return config;
    },
}

export default nextConfig;