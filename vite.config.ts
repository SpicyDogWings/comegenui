import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import khadgar from './src/plugins/khadgar/vite.mjs';

export default defineConfig({
  plugins: [
    vue({ template: { compilerOptions: { whitespace: 'preserve' } } }),
    vueDevTools({ launchEditor: 'zed' }),
    khadgar()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
