/**
 * Build de la superficie **Vue** (paquete npm).
 *
 * A diferencia de `build-lib.ts` (custom elements, shadow DOM, sin CSS), este
 * build:
 * - compila `src/index.ts` a ESM con `vue` como external (lo aporta el host);
 * - extrae los estilos de los SFC a un único `style.css`;
 * - genera los `.d.ts` (vite-plugin-dts);
 * - escribe un `package.json` publicable en `dist-vue/`.
 *
 * Uso:  pnpm build:npm
 *       cd dist-vue && pnpm pack     (previsualizar el tarball)
 */
import { build } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(fs.readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))

const OUT = resolve(__dirname, 'dist-vue')

/**
 * Nombre publicable. Por defecto `comegenui`; se puede sobreescribir para probar
 * con un scope sin publicar el nombre final:
 *   COMEGEN_VUE_NAME=@tu-scope/comegenui pnpm build:npm
 */
const NAME = process.env.COMEGEN_VUE_NAME || 'comegenui'

/** Deps que NO se empaquetan: las resuelve el consumidor (peers / deps). */
const EXTERNAL = [
  'vue',
  /^@vueuse\/core/,
  'color2k',
  'marked',
  'dompurify',
  'highlight.js',
  'xlsx',
]

await build({
  configFile: false,
  publicDir: false,
  resolve: { alias: { '@': resolve(__dirname, 'src') } },
  plugins: [
    vue(),
    dts({
      outDir: OUT,
      entryRoot: 'src',
      include: ['src'],
      tsconfigPath: resolve(__dirname, 'tsconfig.app.json'),
      rollupTypes: true,
      insertTypesEntry: true,
    }),
  ],
  build: {
    emptyOutDir: true,
    minify: false,
    cssCodeSplit: false,
    outDir: OUT,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
      cssFileName: 'style',
    },
    rollupOptions: { external: EXTERNAL },
  },
})

/** Deja el `package.json` publicable al lado del bundle. */
const publishable = {
  name: NAME,
  version: pkg.version,
  description: 'ComegenUI — componentes Vue con sistema de tokens y temas.',
  license: 'MIT',
  repository: { type: 'git', url: 'git+https://github.com/SpicyDogWings/comegenui.git' },
  homepage: 'https://github.com/SpicyDogWings/comegenui#readme',
  keywords: ['vue', 'components', 'ui', 'design-system', 'custom-elements'],
  type: 'module',
  // `index.js` llama a `initTokens()` al importarse (side effect deliberado).
  sideEffects: ['./index.js', './style.css'],
  files: ['index.js', 'index.d.ts', 'style.css', 'LICENSE'],
  main: './index.js',
  module: './index.js',
  types: './index.d.ts',
  exports: {
    '.': { types: './index.d.ts', import: './index.js' },
    './style.css': './style.css',
    './package.json': './package.json',
  },
  // `vue` es la única peer obligatoria: la aporta el host.
  peerDependencies: {
    vue: '^3.5.0',
    // Pesadas y acotadas a un componente puntual: **opcionales**. Sólo hay que
    // instalarlas si usás el componente que las requiere (ver fichas de la doc:
    // `Markdown` → marked + dompurify + highlight.js · `CellsImporter` → xlsx).
    marked: '^18.0.0',
    dompurify: '^3.0.0',
    'highlight.js': '^11.0.0',
    xlsx: '^0.18.5',
  },
  peerDependenciesMeta: {
    marked: { optional: true },
    dompurify: { optional: true },
    'highlight.js': { optional: true },
    xlsx: { optional: true },
  },
  // Base de la galería: la usa la mayoría de los componentes (y `initTokens()`
  // usa `color2k` al importar el paquete), así que va como dependencia normal.
  dependencies: { '@vueuse/core': '^14.2.1', color2k: '^2.0.3' },
}

/** README del paquete (viaja en el tarball). */
const readme = [
  '# ComegenUI',
  '',
  `Componentes Vue con sistema de tokens y temas. \`${NAME}@${pkg.version}\`.`,
  '',
  '> Este paquete es la superficie **Vue** (componentes `.vue`). Para HTML plano,',
  '> sin build y sin Vue, usá los **custom elements** `<cu-*>` del paquete CE.',
  '',
  '## Instalación',
  '',
  '```bash',
  `pnpm add ${NAME}`,
  '```',
  '',
  '`vue` es **peer dependency**: lo aporta tu app.',
  '',
  '## Uso',
  '',
  '```ts',
  `import { CuButton, CuAlert } from '${NAME}'`,
  `import '${NAME}/style.css'`,
  '```',
  '',
  '```vue',
  '<template>',
  '  <CuButton color="primary" @loading-change="onLoading">Guardar</CuButton>',
  '  <CuAlert variant="soft">Hola</CuAlert>',
  '</template>',
  '```',
  '',
  'O registro global:',
  '',
  '```ts',
  `import ComegenUI from '${NAME}'`,
  `import '${NAME}/style.css'`,
  '',
  'app.use(ComegenUI)',
  '```',
  '',
  '## Temas',
  '',
  'Los tokens `--cu-*` se inyectan al importar el paquete y cambian con `data-theme`:',
  '',
  '```html',
  '<html data-theme="dark">',
  '```',
  '',
  '## Dependencias opcionales',
  '',
  '> ⚠️ Algunas librerías son **opcionales** para no inflar la instalación.',
  '> Solo las necesitás si usás el componente que las requiere:',
  '',
  '| Componente | Dependencia a instalar |',
  '| --- | --- |',
  '| `CuMarkdown` | `marked`, `dompurify` |',
  '| `CuMarkdown` (bloques de código) | `highlight.js` |',
  '| `CuCellsImporter` | `xlsx` |',
  '',
  `PoC: este paquete hoy exporta solo \`CuButton\` y \`CuAlert\`.`,
  '',
].join('\n')

fs.writeFileSync(resolve(OUT, 'README.md'), readme)

/** La licencia viaja en el tarball (npm la incluye siempre si está en la raíz del paquete). */
fs.copyFileSync(resolve(__dirname, 'LICENSE'), resolve(OUT, 'LICENSE'))

fs.writeFileSync(resolve(OUT, 'package.json'), `${JSON.stringify(publishable, null, 2)}\n`)

/** Deja solo lo publicable: el árbol intermedio de `.d.ts` no viaja. */
const KEEP = new Set(['index.js', 'index.d.ts', 'style.css', 'package.json', 'README.md', 'LICENSE'])
for (const entry of fs.readdirSync(OUT)) {
  if (KEEP.has(entry)) continue
  fs.rmSync(resolve(OUT, entry), { recursive: true, force: true })
}

const cssFile = fs.existsSync(resolve(OUT, 'style.css')) ? 'style.css' : '(sin css)'
console.log(`\n✅ Build Vue listo → dist-vue/  (${NAME}@${pkg.version})`)
console.log(`   index.js · index.d.ts · ${cssFile} · package.json · LICENSE`)
