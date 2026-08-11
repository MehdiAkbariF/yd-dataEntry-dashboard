/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.yadakchi.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;