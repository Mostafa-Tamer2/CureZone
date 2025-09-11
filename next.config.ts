import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["wpaoqrojlbpdqkzrgwqb.supabase.co", "placehold.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wpaoqrojlbpdqkzrgwqb.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
