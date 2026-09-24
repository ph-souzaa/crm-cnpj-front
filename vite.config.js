import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@emotion/react', '@emotion/styled'],
          graficos: ['recharts'],
        },
      },
    },
  },
  server: {
    port: 26073,
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET || 'http://localhost:26080',
        changeOrigin: true,
        rewrite: (caminho) => caminho.replace(/^\/api/, ''),
      },
    },
  },
  test: {
    environment: 'node',
  },
});
