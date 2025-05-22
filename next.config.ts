import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        hostname: "api.dicebear.com",
        protocol: "https",
        pathname: "/9.x/adventurer-neutral/svg",
      },
    ],
  },
};

export default nextConfig;
