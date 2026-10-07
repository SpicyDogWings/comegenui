import { build } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import esbuild from 'esbuild'
import { resolve, dirname, basename, extname } from 'path'
import { fileURLToPath } from 'url'
import fg from 'fast-glob'
import fs from 'fs'
import archiver from 'archiver'

const __dirname = dirname(fileURLToPath(import.meta.url))

const { generateThemesCSS, generateThemeCSS } = await import('./src/plugins/cu-tokens/css')
const { DEFAULTS, extractColors, extractShared } = await import('./src/plugins/cu-tokens/defaults')

const configPath = resolve(__dirname, 'comegen.config.json')
const packageJson = JSON.parse(fs.readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))
// Versión del bundle: `pnpm build:lib v5.0.0` la fuerza; si no, package.json.
// Viaja inyectada en cada UMD (`__COMEGEN_META__`) y en el banner del archivo.
const version: string = process.argv[2] || packageJson.version

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
  const { themes: configThemes, ...configRest } = config
  const mergedShared = { ...DEFAULTS, ...configRest }
  shared = extractShared(mergedShared)
  const defaultColors = extractColors(DEFAULTS)

  for (const [name, tokens] of Object.entries(configThemes) as [string, any][]) {
    const themeColors = tokens.colors || tokens
    themes[name] = { colors: { ...defaultColors, ...themeColors } }
  }
} else {
  const merged = { ...DEFAULTS, ...config }
  const colors = extractColors(merged)
  shared = extractShared(merged)
  themes['light'] = { colors }
}

const files = fg.sync('./src/lib/**/*.ts', {
  ignore: ['./src/lib/**/index.ts', './src/lib/tokens.ts'],
})

interface Bundle {
  file: string
  /** PascalCase real: date-picker → CuDatePicker (los snippets y las páginas
   * huésped cargan dist/CuDatePicker.core.umd.js; con solo capitalizar la
   * primera letra quedaba CuDate-picker.umd.js y el HTML viejo cargaba
   * 404/stale). */
  name: string
  tag: string
}

/**
 * Cada componente se publica en dos variantes:
 * - `core`:   Vue incluido en el UMD. Autocontenido, máxima compatibilidad:
 *             un `<script src>` suelto funciona sin cargar nada más.
 * - `shared`: Vue externo contra el global `__COMEGEN_VUE__`. Lo aporta
 *             `comegen-vue.global.js` (también en el zip). Pensada para hosts
 *             que cargan varios componentes y quieren un solo runtime.
 */
type Variant = 'core' | 'shared'
const VARIANTS: Variant[] = ['core', 'shared']

const bundles: Bundle[] = files.map((file) => {
  const baseName = basename(file, extname(file))
  const name = 'Cu' + baseName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
  return { file, name, tag: `cu-${baseName}` }
})

/** Escapa un texto para usarlo dentro de un `RegExp`. */
function escapeRe(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Verifica que los UMD de cada componente (ambas variantes) hayan quedado con
 * los metadatos de versión inyectados (`<cu-x>.comegen`). Falla el build si no.
 */
function assertBundleMeta(outDir: string) {
  const missing: string[] = []
  for (const { file, name } of bundles) {
    const source = fs.readFileSync(file, 'utf-8')
    const registers =
      source.includes('defineComegenElement') || source.includes('customElements.define')
    if (!registers) continue
    for (const variant of VARIANTS) {
      const relative = `${name}.${variant}.umd.js`
      const code = fs.readFileSync(resolve(outDir, relative), 'utf-8')
      const hasVersion = new RegExp(`"version"\\s*:\\s*"${escapeRe(version)}"`).test(code)
      if (!code.includes('comegen') || !hasVersion) missing.push(relative)
    }
  }
  if (missing.length) {
    console.error(`❌ metadata de versión ausente en: ${missing.join(', ')}`)
    process.exit(1)
  }
}

/**
 * Construye una variante (`core` o `shared`) de un componente.
 * - `shared` marca `vue` como externo y lo resuelve contra el global
 *   `__COMEGEN_VUE__`, que aporta `comegen-vue.global.js`.
 */
async function buildComponent({ file, name, tag }: Bundle, outDir: string, variant: Variant) {
  const shared = variant === 'shared'
  await build({
    configFile: false,
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
      // Metadata del bundle: `defineComegenElement` la adjunta al componente.
      __COMEGEN_META__: JSON.stringify({ version }),
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    plugins: [vue({ features: { customElement: true } }), UnoCSS({ mode: 'shadow-dom' })],
    build: {
      emptyOutDir: false,
      lib: {
        entry: resolve(__dirname, file),
        name: name,
        fileName: () => `${name}.${variant}.umd.js`,
        formats: ['umd'],
      },
      rollupOptions: {
        // La variante shared no lleva Vue: lo resuelve el global `__COMEGEN_VUE__`.
        external: shared ? ['vue'] : [],
        output: {
          globals: shared ? { vue: '__COMEGEN_VUE__' } : {},
          // El banner deja la identidad en el archivo: si alguien copia un solo
          // UMD, sabe qué componente, qué variante y qué versión es sin ejecutarlo.
          banner: `/*! comegenui v${version} · ${name} (${tag}) · ${
            shared ? 'shared · Vue externo __COMEGEN_VUE__' : 'core · Vue incluido'
          } */`,
        },
      },
      minify: false,
      outDir: outDir,
    },
  })
}

/**
 * Genera `comegen-vue.global.js`: el runtime de Vue que consume la variante
 * `shared`. Se expone como `globalThis.__COMEGEN_VUE__` (namespace propio) para
 * no pisar ni depender de un `window.Vue` del host.
 */
async function buildSharedRuntime(outDir: string) {
  console.log('🧩 Generando runtime compartido (comegen-vue.global.js)...')
  await esbuild.build({
    stdin: {
      contents: `import * as Vue from 'vue'\nglobalThis.__COMEGEN_VUE__ = Vue\n`,
      resolveDir: __dirname,
      loader: 'ts',
    },
    bundle: true,
    format: 'iife',
    platform: 'browser',
    target: ['es2020'],
    minify: true,
    legalComments: 'inline',
    define: {
      'process.env.NODE_ENV': '"production"',
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
    },
    outfile: resolve(outDir, 'comegen-vue.global.js'),
  })
}

async function runBuilds() {
  console.log('🧹 Limpiando directorio dist-lib...')
  const outDir = resolve(__dirname, 'dist-lib')
  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true })
  }
  fs.mkdirSync(outDir, { recursive: true })

  console.log(`🚀 Building ${bundles.length} component(s) × ${VARIANTS.length} variante(s)...`)

  for (const bundle of bundles) {
    for (const variant of VARIANTS) {
      console.log(`📦 Building ${bundle.name} (${variant})...`)
      await buildComponent(bundle, outDir, variant)
    }
  }

  await buildSharedRuntime(outDir)

  assertBundleMeta(outDir)

  console.log('🎨 Generating CSS files...')

  const cssDir = resolve(outDir, 'css')
  fs.mkdirSync(cssDir, { recursive: true })

  const opacities = config.opacities || {}

  const themesCSS = generateThemesCSS(themes, shared, opacities)
  fs.writeFileSync(resolve(cssDir, 'themes.css'), themesCSS)

  for (const [name, tokens] of Object.entries(themes)) {
    const themeCSS = generateThemeCSS(name, tokens, shared, opacities)
    fs.writeFileSync(resolve(cssDir, `${name}.css`), themeCSS)
  }

  console.log(`\n✅ Build complete! Output: dist-lib/`)
  for (const { name } of bundles) {
    console.log(`   - ${name}.core.umd.js`)
    console.log(`   - ${name}.shared.umd.js`)
  }
  console.log(`   - comegen-vue.global.js (runtime de la variante shared)`)
  console.log(`   - css/themes.css (${Object.keys(themes).length + 1} rules)`)
  for (const name of Object.keys(themes)) {
    console.log(`   - css/${name}.css`)
  }
}

async function createZip() {
  console.log('\n📦 Creando zip...')
  const outDir = resolve(__dirname, 'dist-lib')
  const zipName = `comegenui-v${version}.zip`
  const outputPath = resolve(outDir, zipName)

  const output = fs.createWriteStream(outputPath)
  const archive = archiver('zip', { zlib: { level: 9 } })

  output.on('close', () => {
    console.log(`✅ Zip creado: ${zipName} (${archive.pointer()} bytes)`)
  })

  archive.on('error', (err) => {
    throw err
  })

  archive.pipe(output)

  // La salida final ES el zip: sólo los archivos de la lib, al mismo nivel
  // (sin dist/, sin docs/, sin zip anidado).
  // Add all UMD files (raíz del zip)
  const umdFiles = fs.readdirSync(outDir).filter(f => f.endsWith('.umd.js'))
  for (const file of umdFiles) {
    archive.file(resolve(outDir, file), { name: file })
  }

  // Runtime compartido de la variante `shared`
  const runtime = resolve(outDir, 'comegen-vue.global.js')
  if (fs.existsSync(runtime)) {
    archive.file(runtime, { name: 'comegen-vue.global.js' })
  }

  // Add CSS folder
  const cssDir = resolve(outDir, 'css')
  if (fs.existsSync(cssDir)) {
    archive.directory(cssDir, 'css')
  }

  await archive.finalize()
}

await runBuilds()
// El gate local no necesita el zip: `COMEGEN_NO_ZIP=1` saltea el empaquetado.
if (!process.env.COMEGEN_NO_ZIP) await createZip()
