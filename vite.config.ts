import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    base: "/",
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: "0.0.0.0",
      port: Number(process.env.DEFAULT_APP_PORT) || 3000,
      allowedHosts: true as const,
      hmr: process.env.DISABLE_HMR !== "true",
    },
    build: {
      sourcemap: false,
    },
  };
});
