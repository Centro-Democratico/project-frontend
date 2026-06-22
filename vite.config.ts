// vite.config.ts
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [vue(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // Configuración de proxy local para redirigir peticiones de /api a tu servidor Django (Port 8000 por defecto)
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8000', // Cambia esto por la URL de producción de Django cuando despliegues
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''), 
        },
      }
    },
  };
});
