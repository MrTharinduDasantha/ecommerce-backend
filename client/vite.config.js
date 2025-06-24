import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
  },
  define: {
    global: 'window', // ensures `global` is available
  },
  optimizeDeps: {
    include: ['buffer'], // pre-bundle buffer for use
  },
  resolve: {
    alias: {
      buffer: 'buffer', // alias `buffer` module
    },
  },
});
