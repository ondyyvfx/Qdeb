// next.config.js

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000", // важно указать порт, если ты используешь его
        pathname: "/media/**", // можешь указать '*' или конкретный путь
      },
    ],
  },
};
