/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'pacificdata.org',
        }]
    }
}

module.exports = nextConfig
