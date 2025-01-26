import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: process.env.RENDER_ENV === 'production' 
          ? 'https://api-and-server-9sk2.onrender.com' 
          : 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
