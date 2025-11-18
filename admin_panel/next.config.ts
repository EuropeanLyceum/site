import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  experimental: {
    // Видалив serverActions: true - воно включене за замовчуванням в Next.js 14+
    // Або можеш використовувати новий формат:
    // serverActions: {
    //   allowedOrigins: ['localhost:3000', '*.vercel.app']
    // }
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // domains: ["uploadthing.com"], // Тимчасово вимкнено
  },
  // Налаштування для продакшену
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Налаштування для статичного експорту (якщо потрібно)
  trailingSlash: false,
  // Налаштування для API routes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
}

export default nextConfig;