/** @type {import('next').NextConfig} */
const nextConfig = {
  /** This is needed for ffmpeg */
  webpack:  (config) => {
      config.experiments = { asyncWebAssembly: true, layers: true };
      config.resolve.alias['/node_modules/@ffmpeg/core/dist/ffmpeg-core.js'] =
        '/node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.js';
      config.resolve.alias['fs'] = false;
      return config;
  },

  experimental: {
    typedRoutes: true,
    serverActions: true,
    proxyTimeout: 60_000 * 5,
  },
  /** This is needed to initialize docker correctly */
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  /** This is an attempt to fix openai "socket hang up" error */
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
            { key: "Access-Control-Allow-Credentials", value: "true" },
            { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
            { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
            { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  }
}

module.exports = nextConfig