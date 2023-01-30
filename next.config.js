/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    VITE_BACKEND: process.env.VITE_BACKEND,
  }
}

module.exports = nextConfig
