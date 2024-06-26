// next.config.js

module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/:path*', // Matches any path after /api/
          destination: 'https://next-cloud-host-ewq0r9dx5-ali98nadhums-projects.vercel.app/api/:path*', // Proxy to backend
        },
      ]
    },
  }
  