import { build } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
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

async function runBuilds() {
  console.log('🧹 Limpiando directorio dist...')
  const outDir = resolve(__dirname, 'dist')
  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true })
  }
  fs.mkdirSync(outDir, { recursive: true })

  console.log(`🚀 Building ${files.length} component(s)...`)

  for (const file of files) {
    const baseName = basename(file, extname(file))
    const name = 'Cu' + baseName.charAt(0).toUpperCase() + baseName.slice(1)

    console.log(`📦 Building ${name}...`)

    await build({
      configFile: false,
      define: { 'process.env.NODE_ENV': JSON.stringify('production') },
      plugins: [vue({ features: { customElement: true } }), UnoCSS({ mode: 'shadow-dom' })],
      build: {
        emptyOutDir: false,
        lib: {
          entry: resolve(__dirname, file),
          name: name,
          fileName: (format) => `${name}.${format}.js`,
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

  console.log(`\n✅ Build complete! Output: dist/`)
  for (const file of files) {
    const baseName = basename(file, extname(file))
    console.log(`   - ${baseName}.umd.js`)
  }
  console.log(`   - css/themes.css (${Object.keys(themes).length + 1} rules)`)
  for (const name of Object.keys(themes)) {
    console.log(`   - css/${name}.css`)
  }

  // Copy README-BUILD.md
  const readmeSource = resolve(__dirname, 'README-BUILD.md')
  const readmeDest = resolve(outDir, 'README-BUILD.md')
  if (fs.existsSync(readmeSource)) {
    let readmeContent = fs.readFileSync(readmeSource, 'utf-8')
    const version = process.argv[2] || packageJson.version
    readmeContent = readmeContent.replace(/version:\s*$/m, `version: ${version}`)
    fs.writeFileSync(readmeDest, readmeContent)
    console.log('📄 README-BUILD.md copiado')
  }
}

async function createZip() {
  console.log('\n📦 Creando zip...')
  const outDir = resolve(__dirname, 'dist')
  const version = process.argv[2] || packageJson.version
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

  // La salida final ES el zip: los archivos de la lib + el folder de la skill
  // de uso, al mismo nivel (sin dist/, sin docs/, sin zip anidado).
  // Add all UMD files (raíz del zip)
  const umdFiles = fs.readdirSync(outDir).filter(f => f.endsWith('.umd.js'))
  for (const file of umdFiles) {
    archive.file(resolve(outDir, file), { name: file })
  }

  // Add CSS folder
  const cssDir = resolve(outDir, 'css')
  if (fs.existsSync(cssDir)) {
    archive.directory(cssDir, 'css')
  }

  // Add README
  const readmePath = resolve(outDir, 'README-BUILD.md')
  if (fs.existsSync(readmePath)) {
    archive.file(readmePath, { name: 'README-BUILD.md' })
  }

  // Add skill de uso (SKILL.md + componentes/) — SIEMPRE en el zip, al lado de
  // los archivos de la lib. Solo la de uso; no la de desarrollo ni documentar.
  const docsDir = resolve(__dirname, 'docs/comegen-ui')
  if (fs.existsSync(docsDir)) {
    archive.directory(docsDir, 'comegen-ui')
    console.log('📚 Skill de uso agregada al zip: comegen-ui/')
  } else {
    console.log('⚠️  docs/comegen-ui no encontrada, se omite del zip')
  }

  // Add update.sh / update.ps1 (actualizador del proyecto huésped) — SIEMPRE en el zip
  const updateSh = resolve(__dirname, 'update.sh')
  if (fs.existsSync(updateSh)) {
    archive.file(updateSh, { name: 'update.sh' })
    console.log('🔁 update.sh agregado al zip')
  }
  const updatePs1 = resolve(__dirname, 'update.ps1')
  if (fs.existsSync(updatePs1)) {
    archive.file(updatePs1, { name: 'update.ps1' })
    console.log('🔁 update.ps1 agregado al zip')
  }
  const updateBat = resolve(__dirname, 'update.bat')
  if (fs.existsSync(updateBat)) {
    archive.file(updateBat, { name: 'update.bat' })
    console.log('🔁 update.bat agregado al zip')
  }

  await archive.finalize()
}

await runBuilds()
await createZip()
