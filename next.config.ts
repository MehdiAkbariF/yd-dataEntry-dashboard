/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      // ۱. پروکسی APIها
      {
        source: '/api/:path*',
        destination: 'https://api.yadakchi.com/api/:path*',
      },
      // ۲. پروکسی تصاویر و فایل‌های چندرسانه‌ای
      {
        source: '/media-proxy/:path*',
        destination: 'https://api.yadakchi.com/:path*',
      },
    ];
  },
};

export default nextConfig;