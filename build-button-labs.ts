import { build } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function buildButton() {
  console.log('📦 Building CuButton UMD...')

  await build({
    configFile: false,
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
    plugins: [
      vue({ features: { customElement: true } }),
    ],
    build: {
      emptyOutDir: true,
      lib: {
        entry: resolve(__dirname, 'src/lib/buttons/button.ts'),
        name: 'CuButton',
        fileName: () => 'button-labs.umd.js',
        formats: ['umd'],
      },
      minify: false,
      outDir: resolve(__dirname, 'dist/button-labs'),
      rollupOptions: {
        output: {
          globals: {},
        },
      },
    },
  })

  console.log('✅ Build complete: dist/button-labs/button-labs.umd.js')
}

buildButton()
