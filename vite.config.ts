import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    allowedHosts: [".loca.lt", ".trycloudflare.com", "hottest-coupons-against-political.trycloudflare.com"],
  },
  plugins: [
    tailwindcss(),
    ...tanstackStart({
      server: { entry: "server" },
    }),
    react(),
  ],
});
