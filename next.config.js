module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5639",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "qdeb.kz",
        pathname: "/media/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
