// next.config.ts
import type { NextConfig } from 'next';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },

  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.plugins.push(
        new MonacoWebpackPlugin({
          languages: ['html', 'css'],
          filename: 'static/[name].worker.js',
        })
      );
    }
    return config;
  },

  async rewrites() {
    return [
      { source: '/api/:path*', destination: 'https://api.ydkchbot.ir/api/:path*' },
      { source: '/media-proxy/:path*', destination: 'https://api.yadakchi.com/:path*' },
    ];
  },
};

export default nextConfig;