/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Cloudinary CDN — used by the admin dashboard ImageUploader
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: `/nn1rgvs7/**`,
      },
    ],
  },
};


export default nextConfig;
