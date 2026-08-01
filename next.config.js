/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Allow fetching from ESP8266 AP (192.168.4.1)
  // This is necessary for local network access
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
      // Prevent caching app HTML so deploys don't cause ChunkLoadError (old HTML asking for old chunk hashes)
      { source: '/', headers: [{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }] },
      { source: '/dashboard', headers: [{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }] },
      { source: '/login', headers: [{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }] },
    ];
  },
};

module.exports = nextConfig;
