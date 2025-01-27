import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001'|| `https://api-and-server-9sk2.onrender.com`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
