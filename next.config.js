/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow fetching from ESP8266 AP (192.168.4.1)
  // This is necessary for local network access
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
