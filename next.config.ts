import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.catbox.moe",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
