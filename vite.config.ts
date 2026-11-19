import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  const parsedPort = Number.parseInt(process.env.DEFAULT_APP_PORT?.trim() || '', 10);
  const port = Number.isInteger(parsedPort) && parsedPort > 0 && parsedPort <= 65535 ? parsedPort : 3000;

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
      port,
      allowedHosts: true as const,
      hmr: process.env.DISABLE_HMR !== "true",
    },
    build: {
      sourcemap: false,
    },
  };
});
