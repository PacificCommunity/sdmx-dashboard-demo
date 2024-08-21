/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'pacificdata.org',
        }]
    }
}

module.exports = nextConfig
