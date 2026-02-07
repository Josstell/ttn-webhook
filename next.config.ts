import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,

  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
