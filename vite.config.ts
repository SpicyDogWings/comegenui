import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          whitespace: 'condense',
          isCustomElement: (tag) => tag.startsWith('cu-'),
        }
      }
    }),
    vueDevTools({ launchEditor: 'zed' })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
