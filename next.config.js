module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5639",
        pathname: "/api/**",
      },
      {
        protocol: "https",
        hostname: "qdeb.kz",
        pathname: "/api/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
