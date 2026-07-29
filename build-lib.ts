import { build } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import fg from 'fast-glob'
import fs from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

const { generateThemesCSS, generateThemeCSS } = await import('./src/plugins/cu-tokens/css')
const { DEFAULTS, DEFAULT_COLORS, DEFAULT_DARK_COLORS, extractColors, extractShared } = await import('./src/plugins/cu-tokens/defaults')

const configPath = resolve(__dirname, 'comegen.config.json')

let config: any
try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
} catch {
  console.log('⚠️  comegen.config.json no encontrado, usando defaults')
  config = {}
}

let themes: Record<string, any> = {}
let shared: any = {}

if (config.themes && typeof config.themes === 'object') {
  // Multi-theme process
  const { themes: configThemes, ...configRest } = config

  // Shared tokens: defaults + config overrides (no colors)
  const mergedShared = { ...DEFAULTS, ...configRest }
  shared = extractShared(mergedShared)

  // Default colors for fallback
  const defaultColors = extractColors(DEFAULTS)

  // Each theme: default colors + theme overrides
  for (const [name, tokens] of Object.entries(configThemes) as [string, any][]) {
    const themeColors = tokens.colors || tokens
    themes[name] = { colors: { ...defaultColors, ...themeColors } }
  }
} else {
  // Single theme process
  const merged = { ...DEFAULTS, ...config }
  const colors = extractColors(merged)
  shared = extractShared(merged)
  themes['light'] = { colors }
}

async function buildLabs() {
  console.log('🧹 Cleaning dist/labs/...')
  const outDir = resolve(__dirname, 'dist/labs')
  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true })
  }
  fs.mkdirSync(outDir, { recursive: true })

  const files = fg.sync('./src/lib/**/*.ts', {
    ignore: ['./src/lib/**/index.ts', './src/lib/tokens.ts'],
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

  const cssDir = resolve(outDir, 'css')
  fs.mkdirSync(cssDir, { recursive: true })

  const themesCSS = generateThemesCSS(themes, shared)
  fs.writeFileSync(resolve(cssDir, 'themes.css'), themesCSS)

  for (const [name, tokens] of Object.entries(themes)) {
    const themeCSS = generateThemeCSS(name, tokens, shared)
    fs.writeFileSync(resolve(cssDir, `${name}.css`), themeCSS)
  }

  console.log(`\n✅ Build complete! Output: dist/labs/`)
  console.log(`   - button-labs.umd.js`)
  console.log(`   - css/themes.css (${Object.keys(themes).length + 1} rules)`)
  for (const name of Object.keys(themes)) {
    console.log(`   - css/${name}.css`)
  }
}

buildLabs()
