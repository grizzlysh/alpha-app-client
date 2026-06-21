import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "PharmaCare — Pharmacy Management System",
        short_name: "PharmaCare",
        description: "Modern pharmacy POS and inventory management system",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        // TODO: add pwa-192x192.png and pwa-512x512.png to /public before production deploy
        icons: [],
      },
      workbox: {
        // SPA fallback — all navigation requests get index.html
        navigateFallback: "/index.html",
        // Don't intercept API calls or files with extensions with the fallback
        navigateFallbackDenylist: [/^\/api/, /\.[^/]+$/],
        // Pre-cache the full app shell on install
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
        runtimeCaching: [
          {
            // Medicine catalog — show cached instantly, refresh in background
            urlPattern: /\/api\/medicines/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "api-medicines",
              expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Customers — tolerable to be slightly stale
            urlPattern: /\/api\/customers/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "api-customers",
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Stock/inventory — try network first, fall back to cache after 10s
            // (stock quantities are critical, we want fresh data when possible)
            urlPattern: /\/api\/(stock|inventory)/,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-stock",
              networkTimeoutSeconds: 10,
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 4 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Google Fonts — long-lived, cache aggressively
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("recharts") || id.includes("d3-")) return "charts";
          if (id.includes("@radix-ui")) return "radix";
          if (id.includes("@tanstack")) return "tanstack";
          if (id.includes("react-router") || id.includes("react-dom") || id.includes("/react/")) return "react-vendor";
          if (id.includes("react-hook-form") || id.includes("@hookform") || id.includes("zod")) return "forms";
          if (id.includes("@reduxjs") || id.includes("react-redux") || id.includes("redux")) return "redux";
          return "vendor";
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
