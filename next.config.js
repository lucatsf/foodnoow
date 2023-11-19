/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lucatsf-food-now-one.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'https://foodnoow.vercel.app/',
      },
    ]
  }
}

module.exports = nextConfig
