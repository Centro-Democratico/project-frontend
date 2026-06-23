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
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8000', //Cambiar por la URL de producción de Django cuando despliegue
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''), 
        },
      }
    },
  };
});
