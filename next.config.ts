import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/word",
        destination: "/the-word",
        permanent: true,
      },
      {
        source: "/word/:path*",
        destination: "/the-word/:path*",
        permanent: true,
      },
      {
        source: "/store",
        destination: "/",
        permanent: false,
      },
      {
        source: "/store/:path*",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
