import { build } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import fg from 'fast-glob'
import fs from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Reuse plugin's CSS generation
const { generateThemesCSS, generateThemeCSS } = await import('./src/plugins/cu-tokens/css')
const { DEFAULTS } = await import('./src/plugins/cu-tokens/defaults')

const configPath = resolve(__dirname, 'comegen.config.json')

let config: any
try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
} catch {
  console.log('⚠️  comegen.config.json no encontrado, usando defaults')
  config = DEFAULTS
}

// Extract themes and shared from config
const { themes: configThemes, ...configShared } = config

// Merge shared with defaults
const shared = { ...DEFAULTS, ...configShared }

// Build themes: each theme merges with shared
const themes: Record<string, any> = {}
if (configThemes && typeof configThemes === 'object') {
  for (const [name, tokens] of Object.entries(configThemes)) {
    themes[name] = { ...shared, ...tokens }
  }
} else {
  themes['light'] = shared
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

  console.log('🎨 Generating CSS files...')

  // themes.css: :root (first theme) + [data-theme] for each theme
  const themesCSS = generateThemesCSS(themes, shared)
  fs.writeFileSync(resolve(outDir, 'themes.css'), themesCSS)

  // One file per theme in css/ subfolder
  const cssDir = resolve(outDir, 'css')
  fs.mkdirSync(cssDir, { recursive: true })
  for (const [name, tokens] of Object.entries(themes)) {
    const themeCSS = generateThemeCSS(name, tokens, shared)
    fs.writeFileSync(resolve(cssDir, `${name}.css`), themeCSS)
  }

  console.log(`\n✅ Build complete! Output: dist/labs/`)
  console.log(`   - themes.css (${Object.keys(themes).length + 1} rules)`)
  for (const name of Object.keys(themes)) {
    console.log(`   - css/${name}.css`)
  }
}

buildLabs()
