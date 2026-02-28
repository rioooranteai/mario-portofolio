import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: "/mario-portofolio",
  assetPrefix: "/mario-portofolio",
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
