import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // YouTube thumbnails for project media entered as a YouTube URL.
      new URL("https://i.ytimg.com/vi/**"),
      // Images uploaded from the admin panel to Vercel Blob.
      new URL("https://*.public.blob.vercel-storage.com/**"),
    ],
  },
};

export default nextConfig;
