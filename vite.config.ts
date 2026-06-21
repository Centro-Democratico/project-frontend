import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000', // Reemplaza con tu URL de Django
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Quita el prefijo '/api' al enviarlo a Django
      }
    }
  }
});
