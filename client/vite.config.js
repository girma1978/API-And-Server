import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'https://api-and-server-9sk2.onrender.com', // Change to your Render API base URL
        changeOrigin: true,
        secure: true,  // Use secure if the Render API is HTTPS
      },
    },
  },
});
