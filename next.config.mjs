/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['@react-three/fiber', '@react-three/drei', 'three', 'gsap'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(glb|gltf|hdr|exr)$/,
      type: 'asset/resource',
    });
    return config;
  },
};

export default nextConfig;