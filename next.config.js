/** @type {import('next').NextConfig} */
const nextConfig = {
  optimizeFonts: false,
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  swcMinify: true,
}

module.exports = nextConfig