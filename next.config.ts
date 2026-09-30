import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Two root layouts (app/(en) and app/[lang]) need a routing-level 404 page.
    globalNotFound: true,
  },
  async redirects() {
    // Hungarian used to live at the root; its old URLs now point to /hu/….
    return [
      { source: "/pdf-bol-kep", destination: "/hu/pdf-bol-kep", permanent: true },
      { source: "/aszf", destination: "/hu/aszf", permanent: true },
      { source: "/adatvedelem", destination: "/hu/adatvedelem", permanent: true },
      { source: "/fiok", destination: "/hu/fiok", permanent: true },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // pdf.js assets live in a versioned folder (see scripts/copy-pdfjs-assets.mjs).
        source: "/pdfjs/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
