import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true, // <--- On le sort de "experimental"
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", 
    },
  },
};

export default nextConfig;