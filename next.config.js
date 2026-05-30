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
        protocol: "http",
        hostname: "89.218.15.230",
        pathname: "/api/**",
      },
      {
        protocol: "http",
        hostname: "89.218.15.230",
        pathname: "/api/files/profile-picture/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
