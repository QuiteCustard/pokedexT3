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
    }
};

export default config;
