import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // 🟢 LA SOLUTION : On sort serverActions de "experimental" pour qu'il soit actif !
  serverActions: {
    bodySizeLimit: "10mb",
  },
};

export default nextConfig;