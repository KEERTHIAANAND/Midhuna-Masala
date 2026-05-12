import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages serves static sites (no Node server).
  // This outputs a fully static build to the `out/` directory.
  output: 'export',
  images: {
    // Next.js image optimizer requires a server; disable for static export.
    unoptimized: true,
    qualities: [75, 80, 90],
  },
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ],
};

export default nextConfig;
