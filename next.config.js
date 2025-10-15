module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4232",
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
