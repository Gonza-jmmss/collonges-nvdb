// DOCKER
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    // serverActions: true,
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },
  // images: {
  //   domains: ["localhost"],
  // },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/api/images/**",
      },
    ],
  },
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.NEXTAUTH_URL || "http://localhost:3128",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
