import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

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
  resolve: {
    tsconfigPaths: true,
    alias: {
      "server-only": resolve(__dirname, "test/server-only.ts"),
    },
  },
});
