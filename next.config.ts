import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: false, // Keep image optimization enabled
    
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sirius-portfolio.onrender.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  compress: true,

  experimental: {
    optimizeCss: true,
  },

  // Headers for better SEO and security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/docs/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Content-Type",
            value: "application/pdf",
          },
          {
            key: "Content-Disposition",
            value: "inline",
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/email",
        destination: "mailto:kumarchandan12345a@gmail.com",
        permanent: true,
      },
      {
        source: "/directresume",
        destination: "/docs/Chandan_Kumar_Behera.pdf",
        permanent: true,
      },
      {
        source: "/direct-resume",
        destination: "/docs/Chandan_Kumar_Behera.pdf",
        permanent: true,
      },
      {
        source: "/github",
        destination: "www.github.com/Sirius6907",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
