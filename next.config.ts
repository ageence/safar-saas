import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", 
    },
    cacheComponents: true, // <--- LE CORRECTIF EST ICI !
  },
};

export default nextConfig;