import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Webpack configuration (used when not using Turbopack)
  webpack: (config, { isServer }) => {
    // Enable polling for file changes on Windows in Docker
    if (process.env.WATCHPACK_POLLING === 'true') {
      config.watchOptions = {
        poll: 1000, // Check for changes every second
        aggregateTimeout: 300, // Delay before rebuilding
      };
    }
    return config;
  },
  
  // Experimental features for better performance
  experimental: {
    // Turbopack uses native file watching which works better with CHOKIDAR_USEPOLLING
  },
};

export default nextConfig;
