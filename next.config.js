/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
    ],
    domains: ["localhost", "cdn.sanity.io"],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
