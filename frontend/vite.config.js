import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,         // keep same port as CRA
    open: true,         // auto-open browser
    proxy: {
      // Proxy /api calls to the Spring Boot backend to avoid CORS during dev
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'build',    // keep same output dir as CRA
  },
});
