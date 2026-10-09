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

const packageJson = JSON.parse(fs.readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))
// Versión del bundle: `pnpm build:lib v5.0.0` la fuerza; si no, package.json.
// Viaja inyectada en cada bundle (`__COMEGEN_META__`) y en el banner del archivo.
const version: string = process.argv[2] || packageJson.version

const files = fg.sync('./src/lib/**/*.ts', {
  ignore: ['./src/lib/**/index.ts', './src/lib/tokens.ts'],
})

interface Bundle {
  file: string
  /** PascalCase real: date-picker → CuDatePicker. */
  name: string
  tag: string
}

/**
 * Cada componente se publica en cuatro configuraciones (formato × variante):
 * - `umd-core`:   UMD con Vue incluido. Un `<script src>` suelto funciona.
 * - `umd-shared`: UMD con Vue externo contra el global `__COMEGEN_VUE__`
 *                 (lo aporta `comegen-vue.global.js`, en su misma carpeta).
 * - `esm-core`:   ESM (`CuX.js`) con Vue incluido.
 * - `esm-shared`: ESM (`CuX.js`) con Vue externo por bare import (`import 'vue'`);
 *                 lo resuelve el bundler del host, o un import map que apunte a
 *                 `comegen-vue.js` (runtime incluido en su carpeta, para hosts
 *                 sin bundler, p. ej. PHP/vanilla).
 *
 * Cada configuración sale en su propia carpeta `dist-libs/<config>/` con su
 * propio zip `comegenui-<config>-v<version>.zip`.
 */
type Format = 'umd' | 'esm'
type Variant = 'core' | 'shared'

interface Config {
  name: string
  format: Format
  variant: Variant
}

const CONFIGS: Config[] = [
  { name: 'umd-core', format: 'umd', variant: 'core' },
  { name: 'umd-shared', format: 'umd', variant: 'shared' },
  { name: 'esm-core', format: 'esm', variant: 'core' },
  { name: 'esm-shared', format: 'esm', variant: 'shared' },
]

const OUT_ROOT = resolve(__dirname, 'dist-libs')

const bundles: Bundle[] = files.map((file) => {
  const baseName = basename(file, extname(file))
  const name = 'Cu' + baseName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
  return { file, name, tag: `cu-${baseName}` }
})

/** Nombre del archivo de bundle dentro de la carpeta de una configuración. */
function bundleFile(name: string, config: Config): string {
  // ESM: `CuX.js` (el host resuelve `vue`); UMD: `CuX.umd.js`.
  return `${name}${config.format === 'umd' ? '.umd' : ''}.js`
}

/** Runtime de Vue de cada `shared`: UMD (global) o ESM (para import map del host). */
function runtimeFile(config: Config): string | null {
  if (config.variant !== 'shared') return null
  return config.format === 'umd' ? 'comegen-vue.global.js' : 'comegen-vue.js'
}

/** Descripción humana de cómo resuelve Vue cada configuración (banner). */
function vueNote(config: Config): string {
  if (config.variant === 'core') return 'Vue incluido'
  return config.format === 'umd'
    ? 'Vue externo __COMEGEN_VUE__'
    : 'Vue externo (bare import)'
}

/** Escapa un texto para usarlo dentro de un `RegExp`. */
function escapeRe(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Verifica que todos los bundles de cada configuración hayan quedado con los
 * metadatos de versión y tipo inyectados (`<cu-x>.comegen`). Falla el build si no.
 */
function assertBundleMeta() {
  const missing: string[] = []
  for (const { file, name } of bundles) {
    const source = fs.readFileSync(file, 'utf-8')
    const registers =
      source.includes('defineComegenElement') || source.includes('customElements.define')
    if (!registers) continue
    for (const config of CONFIGS) {
      const relative = `${config.name}/${bundleFile(name, config)}`
      const code = fs.readFileSync(resolve(OUT_ROOT, relative), 'utf-8')
      const hasVersion = new RegExp(`"version"\\s*:\\s*"${escapeRe(version)}"`).test(code)
      const hasType = new RegExp(`"type"\\s*:\\s*"${escapeRe(config.name)}"`).test(code)
      if (!code.includes('comegen') || !hasVersion || !hasType) missing.push(relative)
    }
  }
  if (missing.length) {
    console.error(`❌ metadata de versión/tipo ausente en: ${missing.join(', ')}`)
    process.exit(1)
  }
}

/**
 * Construye un bundle (`umd` o `esm`, `core` o `shared`) de un componente.
 * - `shared` marca `vue` como externo: en UMD contra el global `__COMEGEN_VUE__`
 *   y en ESM como bare import (`import 'vue'`).
 */
async function buildComponent(bundle: Bundle, outDir: string, config: Config) {
  const shared = config.variant === 'shared'
  const isUmd = config.format === 'umd'
  await build({
    configFile: false,
    // No copiamos `public/` (ico/img) al output de la lib.
    publicDir: false,
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
      // Metadata del bundle: `defineComegenElement` la adjunta al componente.
      // Incluye el tipo de build, así cada archivo se identifica sin ejecutarlo.
      __COMEGEN_META__: JSON.stringify({
        version,
        format: config.format,
        variant: config.variant,
        type: config.name,
      }),
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
        entry: resolve(__dirname, bundle.file),
        name: bundle.name,
        fileName: () => bundleFile(bundle.name, config),
        formats: isUmd ? ['umd'] : ['es'],
      },
      rollupOptions: {
        // `shared` no lleva Vue: lo resuelve el host.
        external: shared ? ['vue'] : [],
        // Sólo el UMD necesita un global nombrado; el ESM conserva el bare import.
        output: {
          globals: shared && isUmd ? { vue: '__COMEGEN_VUE__' } : {},
          // El banner deja la identidad en el archivo: componente, tipo de build
          // y versión, sin ejecutarlo.
          banner: `/*! comegenui v${version} · ${bundle.name} (${bundle.tag}) · ${config.name} · ${vueNote(config)} */`,
        },
      },
      minify: false,
      outDir: outDir,
    },
  })
}

/**
 * Genera `comegen-vue.global.js`: el runtime de Vue (IIFE) que consume el
 * `umd-shared`. Se expone como `globalThis.__COMEGEN_VUE__` (namespace propio)
 * para no pisar ni depender de un `window.Vue` del host.
 */
async function buildUmdRuntime(outDir: string) {
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

/**
 * Genera `comegen-vue.js`: el runtime ESM de Vue que consume el `esm-shared`
 * cuando el host no tiene bundler (p. ej. PHP/vanilla), vía import map
 * `{ "vue": "./comgen-vue.js" }`. Es un módulo ESM con Vue incluido.
 */
async function buildEsmRuntime(outDir: string) {
  await esbuild.build({
    stdin: {
      contents: `export * from 'vue'\n`,
      resolveDir: __dirname,
      loader: 'ts',
    },
    bundle: true,
    format: 'esm',
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
    outfile: resolve(outDir, 'comegen-vue.js'),
  })
}

async function runBuilds() {
  console.log('🧹 Limpiando dist-libs...')
  if (fs.existsSync(OUT_ROOT)) {
    fs.rmSync(OUT_ROOT, { recursive: true, force: true })
  }
  fs.mkdirSync(OUT_ROOT, { recursive: true })

  console.log(`🚀 Building ${bundles.length} component(s) × ${CONFIGS.length} configuración(es)...`)

  for (const config of CONFIGS) {
    const outDir = resolve(OUT_ROOT, config.name)
    fs.mkdirSync(outDir, { recursive: true })

    for (const bundle of bundles) {
      console.log(`📦 ${config.name} · ${bundle.name}`)
      await buildComponent(bundle, outDir, config)
    }

    if (config.variant === 'shared') {
      const runtime = runtimeFile(config)!
      console.log(`🧩 ${config.name} · runtime (${runtime})`)
      if (config.format === 'umd') await buildUmdRuntime(outDir)
      else await buildEsmRuntime(outDir)
    }
  }

  assertBundleMeta()

  console.log(`\n✅ Build complete! Output: dist-libs/`)
  for (const config of CONFIGS) {
    console.log(`   - ${config.name}/ (${bundles.length} bundles${runtimeFile(config) ? ` + ${runtimeFile(config)}` : ''})`)
  }
}

/**
 * Empaqueta una configuración en su propio zip: los bundles de su formato + su
 * runtime compartido (si aplica). Sin css, sin img, sin ico.
 */
async function createZip(config: Config) {
  const outDir = resolve(OUT_ROOT, config.name)
  const zipName = `comegenui-${config.name}-v${version}.zip`
  const outputPath = resolve(outDir, zipName)

  const output = fs.createWriteStream(outputPath)
  const archive = archiver('zip', { zlib: { level: 9 } })

  output.on('close', () => {
    console.log(`✅ ${config.name}: ${zipName} (${archive.pointer()} bytes)`)
  })

  archive.on('error', (err) => {
    throw err
  })

  archive.pipe(output)

  const ext = config.format === 'umd' ? '.umd.js' : '.js'
  const runtime = runtimeFile(config)
  const bundleFiles = fs.readdirSync(outDir).filter((f) => f.endsWith(ext) && f !== runtime)
  for (const file of bundleFiles) {
    archive.file(resolve(outDir, file), { name: file })
  }

  if (runtime) {
    const runtimePath = resolve(outDir, runtime)
    if (fs.existsSync(runtimePath)) archive.file(runtimePath, { name: runtime })
  }

  await archive.finalize()
}

await runBuilds()
// El gate local no necesita los zips: `COMEGEN_NO_ZIP=1` los saltea.
if (!process.env.COMEGEN_NO_ZIP) {
  console.log('\n📦 Creando zips...')
  for (const config of CONFIGS) {
    await createZip(config)
  }
}
