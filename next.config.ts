import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // On force Next.js à accepter jusqu'à 10Mo
    },
  },
};

export default nextConfig;