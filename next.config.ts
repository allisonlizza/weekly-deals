import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "f.wishabi.net" },
      { protocol: "http", hostname: "f.wishabi.net" },
      { protocol: "https", hostname: "flipp-image-retrieval.flipp.com" },
      { protocol: "https", hostname: "images.wishabi.net" },
      { protocol: "http", hostname: "images.wishabi.net" },
    ],
  },
};

export default nextConfig;
