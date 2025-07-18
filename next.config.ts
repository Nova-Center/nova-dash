import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ],
  },
};

export default nextConfig;
