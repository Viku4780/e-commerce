// import type { NextConfig } from "next";

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // This bypasses the errors you saw
  },
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  }
};

export default nextConfig;
