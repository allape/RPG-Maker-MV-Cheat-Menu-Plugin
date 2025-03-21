import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

import Package from "./package.json";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
    legacy({
      targets: "chrome>=60",
    }),
  ],
  define: {
    __APP_VERSION__: `"v${Package.version}"`,
  },
  base: "/RPG-Maker-MV-Cheat-Menu-Plugin/",
  build: {
    outDir: "docs",
    rollupOptions: {
      output: {
        format: "commonjs",
      },
    },
  },
});
