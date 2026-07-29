import { build } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import fg from 'fast-glob'
import fs from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Reuse plugin's CSS generation
const { generateCSS } = await import('./src/plugins/cu-tokens/css')

const configPath = resolve(__dirname, 'comegen.config.json')
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))

const themes = {
  light: config.themes.light,
  dark: config.themes.dark,
}

async function buildLabs() {
  console.log('🧹 Cleaning dist/labs/...')
  const outDir = resolve(__dirname, 'dist/labs')
  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true })
  }
  fs.mkdirSync(outDir, { recursive: true })

  const files = fg.sync('./src/lib/**/*.ts', {
    ignore: ['./src/lib/**/index.ts'],
  })

  console.log(`🚀 Building ${files.length} component(s)...`)

  for (const file of files) {
    const basename = file.split('/').pop()?.replace('.ts', '') || 'component'
    const name = 'Cu' + basename.charAt(0).toUpperCase() + basename.slice(1)

    console.log(`📦 Building ${name}...`)

    await build({
      configFile: false,
      define: { 'process.env.NODE_ENV': JSON.stringify('production') },
      plugins: [vue({ features: { customElement: true } })],
      build: {
        emptyOutDir: false,
        lib: {
          entry: resolve(__dirname, file),
          name: name,
          fileName: () => `${basename}-labs.umd.js`,
          formats: ['umd'],
        },
        minify: false,
        outDir: outDir,
      },
    })
  }

  console.log('🎨 Generating cu-tokens.css...')
  const css = generateCSS(themes, 'light')
  fs.writeFileSync(resolve(outDir, 'cu-tokens.css'), css)

  console.log(`\n✅ Build complete! Output: dist/labs/`)
}

buildLabs()
