/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow any HTTPS host so admins can paste any image URL when adding wines.
    remotePatterns: [
      { protocol: "https", hostname: "**" }
    ]
  }
};
export default nextConfig;
