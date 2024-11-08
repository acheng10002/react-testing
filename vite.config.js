import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    // better to explicitly import the globals I'd need
    globals: true,
    setupFiles: "./src/tests/setup.js",
  },
});
