import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [],
  },
  serverExternalPackages: ["sharp"],
};

export default nextConfig;
