import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: process.env.RENDER_ENV || 'http://localhost:3001', // Default to local if VITE_API_URL is not set
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
