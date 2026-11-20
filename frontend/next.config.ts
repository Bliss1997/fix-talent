import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    serverActions: {
      // CV uploads are capped at 5 MB in the apply action; leave room for the other form fields.
      bodySizeLimit: "6mb",
    },
  },
};
export default nextConfig;
