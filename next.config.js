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
      {
        protocol: "https",
        hostname: "api.qdeb.kz",
        pathname: "/api/files/profile-picture/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
