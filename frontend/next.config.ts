import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  async rewrites() {
    const backendUrl = (
      process.env.BACKEND_PROXY_URL ??
      (process.env.NODE_ENV === "development" ? "http://127.0.0.1:8000" : "")
    ).replace(/\/$/, "");

    return backendUrl
      ? [{
          source: "/svc/api/:path*",
          destination: `${backendUrl}/api/:path*`,
        }]
      : [];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
