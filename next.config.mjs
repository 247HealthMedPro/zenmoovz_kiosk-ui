/** @type {import('next').NextConfig} */
const backendOrigin = process.env.BACKEND_ORIGIN?.replace(/\/$/, "") || "";

const nextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  async rewrites() {
    if (!backendOrigin) return [];
    return [
      {
        source: "/api/recommendations/:path*",
        destination: `${backendOrigin}/api/recommendations/:path*`,
      },
    ];
  },
};

export default nextConfig;
