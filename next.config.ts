import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  turbopack: {
    root: './', // Or the correct path to your project root
  },

  images: {
    remotePatterns: [
        {
            protocol: 'http',
            hostname: '**',
        },
        {
            protocol: 'https',
            hostname: '**',
        },
    ],
    qualities: [25, 50, 75],
  },

  env: {
      API_URL: process.env.API_URL,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  
};

export default nextConfig;
