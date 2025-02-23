import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "enterprise-quiz-platform.s3.ap-south-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
