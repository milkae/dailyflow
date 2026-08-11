import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts", "./singleton.ts"],
    alias: {
      "server-only": "./test/server-only.ts",
    },
  },
  resolve: { tsconfigPaths: true },
});
