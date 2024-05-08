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
        domains: ['raw.githubusercontent.com'],
    },
};

export default config;
