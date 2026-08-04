import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Native tsconfig paths resolution — replaces vite-tsconfig-paths plugin
    tsconfigPaths: true,
  },
  test: {
    // Unit tests run in Node — lib/ functions use fs, process.cwd(), fetch
    environment: "node",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    // Exclude Playwright specs — those run via `npm run test:playwright`
    exclude: ["tests/**", "node_modules/**"],
  },
});
