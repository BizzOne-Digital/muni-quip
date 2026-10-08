import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
    // Admin uploads are served from MongoDB through this same-origin API route.
    localPatterns: [
      { pathname: '/api/uploads/**', search: '' },
      { pathname: '/*.{png,jpg,jpeg,webp}', search: '' },
    ],
    qualities: [75, 85],
  },
  serverExternalPackages: ['mongoose'],
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
