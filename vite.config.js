// vite.config.js
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";

export default {
  plugins: [react(), tailwind()],
  build: { outDir: "dist", sourcemap: true }
};
