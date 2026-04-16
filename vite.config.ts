import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "date-fns/locale/fr": path.resolve(__dirname, "./node_modules/date-fns/locale/fr"),
      "date-fns/locale/en": path.resolve(__dirname, "./node_modules/date-fns/locale/en"),
      "date-fns/locale/pt": path.resolve(__dirname, "./node_modules/date-fns/locale/pt"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
    target: 'esnext',
    cssMinify: true,
  },
}));
