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
        pathname: "/**",
      },
    ],
  },
async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://89.218.15.230:4232/api/:path*",
      },
    ];
  },
};
