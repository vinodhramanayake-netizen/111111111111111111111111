/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a fully static site to `out/` on `next build` (no server runtime).
  output: 'export',
  // Static export cannot use the on-demand Image Optimization server.
  images: { unoptimized: true },
  // Emit `path/index.html` so static hosts (incl. Vercel) resolve routes cleanly.
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
