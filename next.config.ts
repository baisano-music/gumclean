import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the workspace root to this project so Next.js doesn't infer it from
    // a stray lockfile in a parent directory (e.g. ~/package-lock.json).
    root: process.cwd(),
  },
};

export default nextConfig;
