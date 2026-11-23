import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
      dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-dom/client',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'motion/react',
        'lucide-react',
        'recharts',
        'react-markdown',
        'd3',
        'd3-scale',
        'd3-selection',
        'canvas-confetti',
        'three',
        'three/addons/environments/RoomEnvironment.js',
        '@vercel/analytics',
        'firebase/app',
        'firebase/auth',
        'firebase/firestore',
        'gsap',
        'gsap/ScrollTrigger',
        'gsap/Flip',
      ],
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
