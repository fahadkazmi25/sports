import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/league/:slug',
        missing: [
          {
            type: 'query',
            key: 'sort',
          },
        ],
        destination: '/league/:slug?sort=time',
        permanent: false,
      },
    ]
  },
};

export default nextConfig;
