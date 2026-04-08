const path = require("path");
// dotenv ko config kar rahe hain root file ke liye
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// Terminal Debugging: Ye aapko VS Code ke terminal mein dikhega
console.log("-----------------------------------------");
console.log("NEXT_CONFIG DEBUG - Root .env check:");
console.log("API URL Found:", process.env.NEXT_PUBLIC_API_BASE_URL);
console.log("-----------------------------------------");

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Ye value root wali .env se uthayega aur frontend ko pass karega
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },

  images: {
    unoptimized: true,
    domains: ["nrislaw.rxchartsquare.com"],
  },

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

module.exports = nextConfig;
