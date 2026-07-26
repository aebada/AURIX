import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Shared hosting (no VPS, no Node runtime) — export plain static
  // HTML/CSS/JS that any web server can serve, deployed via FTP.
  output: "export",
  images: {
    unoptimized: true,
  },
  // Folder + index.html per route so plain Apache/Nginx static hosting
  // (no rewrite rules) serves clean URLs like /about/ correctly.
  trailingSlash: true,
};

export default nextConfig;
