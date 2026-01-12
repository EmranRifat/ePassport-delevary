/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "epassport1.bpodms.gov.bd",
      "brta2.bpodms.gov.bd",
      "bpodms.ekdak.com",
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://brta2.bpodms.gov.bd/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
