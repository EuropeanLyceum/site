/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: true,
    images: {
        unoptimized: true,
        domains: ["images.unsplash.com", "via.placeholder.com"],
    },
    eslint: {
        ignoreDuringBuilds: true, // ігнорує всі ESLint помилки під час production build
    },
};

export default nextConfig;
