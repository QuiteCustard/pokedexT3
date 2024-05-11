/** @type {import("next").NextConfig} */
const config = {
    async redirects() {
        return [
            {
                source: '/pokemon',
                destination: '/',
                permanent: true,
            }
        ]
    },
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'raw.githubusercontent.com',     
          }
        ],
    },
};

export default config;
