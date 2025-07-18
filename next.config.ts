import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        hostname: "api.dicebear.com",
        protocol: "https",
        pathname: "/9.x/adventurer-neutral/svg",
      },
      {
        hostname: "localhost",
        protocol: "http",
        port: "9000",
      },
      {
        hostname: "picsum.photos",
        protocol: "https",
      },
      {
        hostname: "images.unsplash.com",
        protocol: "https",
      },
      {
        hostname: "bucket-production-3fe3.up.railway.app",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
