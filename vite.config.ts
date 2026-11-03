/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  // Đường dẫn tương đối để deploy được cả vào thư mục con (vd. GitHub Pages).
  base: "./",
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg", "icon-180.png"],
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,json}"],
      },
      manifest: {
        name: "Học 3000 từ tiếng Anh",
        short_name: "3000 từ",
        lang: "vi",
        start_url: "./",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#2563eb",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
          { src: "icon.svg", sizes: "any", type: "image/svg+xml" },
        ],
      },
    }),
  ],
  test: {
    include: ["src/**/*.test.ts"],
  },
});
