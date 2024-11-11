/** @type {import("next").NextConfig} */
export default {
    typescript: {
        ignoreBuildErrors: true,
    },
    rewrites: async () => {
        return [
            {
                source: "/api/:path*",
                destination:
                    process.env.NODE_ENV === "development"
                        ? "http://127.0.0.1:1140/api/:path*"
                        : "/api/",
            },
        ];
    },
};
