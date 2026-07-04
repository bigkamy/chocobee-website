import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // S3/upload URLs are content-addressed and effectively immutable, so let the
    // optimizer cache each variant for a month instead of re-optimizing often.
    minimumCacheTTL: 2592000,
    // Cards render at ~18–92vw; these breakpoints avoid generating oversized
    // variants for the small thumbnails the gallery/home grids actually show.
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536],
    imageSizes: [64, 96, 128, 200, 256, 384],
    localPatterns: [
      // Local, same-origin static files. `search` is omitted so cache-busting
      // query strings (e.g. ?v=2) are allowed — pinning a specific version here
      // breaks every image whose query doesn't match it at runtime.
      {
        pathname: "/Images/**",
      },
      {
        pathname: "/uploads/cakes/**",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      // Public-read S3 bucket that serves admin/customer image uploads.
      {
        protocol: "https",
        hostname: "chocobee-uploads-556311299862.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "chocobee-uploads-556311299862.s3.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
