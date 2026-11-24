import path from "path";
import { defineConfig } from "vitest/config";

// Unit tests run in Node; the app's Vite config (PWA, React plugin) is not needed here.
export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: { include: ["src/**/*.test.ts"], environment: "node" },
});
