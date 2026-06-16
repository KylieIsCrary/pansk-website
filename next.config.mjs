/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    qualities: [75, 88, 92],
  },
  reactStrictMode: true,
  trailingSlash: true,
};

export default nextConfig;
