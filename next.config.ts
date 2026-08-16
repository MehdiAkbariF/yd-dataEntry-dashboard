/** @type {import('next').NextConfig} */
const nextConfig = {
  // ⚠️ ایگنور کامل ارورهای تایپ‌اسکریپت موقع next build
  typescript: {
    ignoreBuildErrors: true,
  },
  // ⚠️ ایگنور کامل هشدارهای ESLint موقع next build
  eslint: {
    ignoreDuringBuilds: true,
  },
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