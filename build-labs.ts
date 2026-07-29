import { build } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import fg from 'fast-glob'
import fs from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Generate CSS template from tokens
function generateCSSTemplate() {
  const { DEFAULTS } = require(resolve(__dirname, 'src/lib/tokens'))

  function colorVar(name: string, value: string) {
    const { darken, toHex, lighten, transparentize } = require('color2k')
    return `
    --cu-color-${name}: ${value};
    --cu-color-${name}-hover: ${toHex(darken(value, 0.1))};
    --cu-color-${name}-active: ${toHex(lighten(value, 0.1))};
    --cu-color-${name}-ghost-hover: ${toHex(transparentize(value, 0.9))};
    --cu-color-${name}-ghost-active: ${toHex(transparentize(value, 0.8))};
    --cu-color-${name}-soft: ${toHex(transparentize(value, 0.85))};
    --cu-color-${name}-soft-hover: ${toHex(transparentize(value, 0.75))};
    --cu-color-${name}-soft-active: ${toHex(transparentize(value, 0.65))};
    --cu-color-${name}-subtle: ${toHex(transparentize(value, 0.9))};
    --cu-color-${name}-subtle-hover: ${toHex(transparentize(value, 0.8))};
    --cu-color-${name}-subtle-active: ${toHex(transparentize(value, 0.7))};
    --cu-color-${name}-subtle-border: ${transparentize(value, 0.5)};`
  }

  const t = DEFAULTS

  const css = `:root {
    ${colorVar('primary', t.colors.primary)}
    ${colorVar('secondary', t.colors.secondary)}
    ${colorVar('neutral', t.colors.neutral)}
    ${colorVar('success', t.colors.success)}
    ${colorVar('warning', t.colors.warning)}
    ${colorVar('danger', t.colors.danger)}
    --cu-color-surface: ${t.colors.surface};

    /* Typography */
    --cu-font-sans: ${t.typography.fontFamily.sans};
    --cu-font-mono: ${t.typography.fontFamily.mono};
    --cu-font-size-xs: ${t.typography.fontSize.xs};
    --cu-font-size-sm: ${t.typography.fontSize.sm};
    --cu-font-size-md: ${t.typography.fontSize.md};
    --cu-font-size-lg: ${t.typography.fontSize.lg};
    --cu-font-size-xl: ${t.typography.fontSize.xl};
    --cu-font-size-2xl: ${t.typography.fontSize['2xl']};
    --cu-font-weight-normal: ${t.typography.fontWeight.normal};
    --cu-font-weight-medium: ${t.typography.fontWeight.medium};
    --cu-font-weight-semibold: ${t.typography.fontWeight.semibold};
    --cu-font-weight-bold: ${t.typography.fontWeight.bold};
    --cu-line-height-tight: ${t.typography.lineHeight.tight};
    --cu-line-height-normal: ${t.typography.lineHeight.normal};
    --cu-line-height-relaxed: ${t.typography.lineHeight.relaxed};

    /* Spacing */
    --cu-space-2xs: ${t.spacing['2xs']};
    --cu-space-xs: ${t.spacing.xs};
    --cu-space-sm: ${t.spacing.sm};
    --cu-space-md: ${t.spacing.md};
    --cu-space-lg: ${t.spacing.lg};
    --cu-space-xl: ${t.spacing.xl};
    --cu-space-2xl: ${t.spacing['2xl']};
    --cu-space-3xl: ${t.spacing['3xl']};

    /* Border Radius */
    --cu-radius-none: ${t.borderRadius.none};
    --cu-radius-sm: ${t.borderRadius.sm};
    --cu-radius-md: ${t.borderRadius.md};
    --cu-radius-lg: ${t.borderRadius.lg};
    --cu-radius-full: ${t.borderRadius.full};

    /* Shadows */
    --cu-shadow-sm: ${t.shadows.sm};
    --cu-shadow-md: ${t.shadows.md};
    --cu-shadow-lg: ${t.shadows.lg};
    --cu-shadow-xl: ${t.shadows.xl};

    /* Borders */
    --cu-border-none: ${t.borders.width.none};
    --cu-border-thin: ${t.borders.width.thin};
    --cu-border-medium: ${t.borders.width.medium};
    --cu-border-thick: ${t.borders.width.thick};
    --cu-border-color: ${t.borders.color.default};
    --cu-border-color-strong: ${t.borders.color.strong};
    --cu-border-color-focus: ${t.borders.color.focus};
  }`

  return css
}

async function buildLabs() {
  console.log('🧹 Cleaning dist/labs/...')
  const outDir = resolve(__dirname, 'dist/labs')
  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true })
  }
  fs.mkdirSync(outDir, { recursive: true })

  // Find all .ts files in src/lib/ (excluding tokens/)
  const files = fg.sync('./src/lib/**/*.ts', {
    ignore: [
      './src/lib/**/index.ts',
      './src/lib/tokens.ts',
    ],
  })

  console.log(`🚀 Building ${files.length} component(s)...`)

  for (const file of files) {
    const basename = file.split('/').pop()?.replace('.ts', '') || 'component'
    const name = 'Cu' + basename.charAt(0).toUpperCase() + basename.slice(1)

    console.log(`📦 Building ${name}...`)

    await build({
      configFile: false,
      define: { 'process.env.NODE_ENV': JSON.stringify('production') },
      plugins: [
        vue({ features: { customElement: true } }),
      ],
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

  // Generate CSS template
  console.log('🎨 Generating cu-tokens.css...')
  const css = generateCSSTemplate()
  fs.writeFileSync(resolve(outDir, 'cu-tokens.css'), css)

  console.log(`\n✅ Build complete! Output: dist/labs/`)
  console.log(`   - ${files.length} UMD component(s)`)
  console.log(`   - cu-tokens.css (CSS template)`)
}

buildLabs()
