import { darken, toHex, lighten, transparentize } from 'color2k'
import { DEFAULTS } from './defaults'

let styleEl: HTMLStyleElement | null = null

function colorVar(name: string, value: string) {
  return `--cu-color-${name}: ${value};
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

function colorsBlock(colors: any) {
  return `${colorVar('primary', colors.primary)}
    ${colorVar('secondary', colors.secondary)}
    ${colorVar('neutral', colors.neutral)}
    ${colorVar('success', colors.success)}
    ${colorVar('warning', colors.warning)}
    ${colorVar('danger', colors.danger)}
    --cu-color-surface: ${colors.surface};`
}

function sharedBlock(shared: any) {
  return `/* Typography */
    --cu-font-sans: ${shared.typography.fontFamily.sans};
    --cu-font-mono: ${shared.typography.fontFamily.mono};
    --cu-font-size-xs: ${shared.typography.fontSize.xs};
    --cu-font-size-sm: ${shared.typography.fontSize.sm};
    --cu-font-size-md: ${shared.typography.fontSize.md};
    --cu-font-size-lg: ${shared.typography.fontSize.lg};
    --cu-font-size-xl: ${shared.typography.fontSize.xl};
    --cu-font-size-2xl: ${shared.typography.fontSize['2xl']};
    --cu-font-weight-normal: ${shared.typography.fontWeight.normal};
    --cu-font-weight-medium: ${shared.typography.fontWeight.medium};
    --cu-font-weight-semibold: ${shared.typography.fontWeight.semibold};
    --cu-font-weight-bold: ${shared.typography.fontWeight.bold};
    --cu-line-height-tight: ${shared.typography.lineHeight.tight};
    --cu-line-height-normal: ${shared.typography.lineHeight.normal};
    --cu-line-height-relaxed: ${shared.typography.lineHeight.relaxed};

    /* Spacing */
    --cu-space-2xs: ${shared.spacing['2xs']};
    --cu-space-xs: ${shared.spacing.xs};
    --cu-space-sm: ${shared.spacing.sm};
    --cu-space-md: ${shared.spacing.md};
    --cu-space-lg: ${shared.spacing.lg};
    --cu-space-xl: ${shared.spacing.xl};
    --cu-space-2xl: ${shared.spacing['2xl']};
    --cu-space-3xl: ${shared.spacing['3xl']};

    /* Border Radius */
    --cu-radius-none: ${shared.borderRadius.none};
    --cu-radius-sm: ${shared.borderRadius.sm};
    --cu-radius-md: ${shared.borderRadius.md};
    --cu-radius-lg: ${shared.borderRadius.lg};
    --cu-radius-full: ${shared.borderRadius.full};

    /* Shadows */
    --cu-shadow-sm: ${shared.shadows.sm};
    --cu-shadow-md: ${shared.shadows.md};
    --cu-shadow-lg: ${shared.shadows.lg};
    --cu-shadow-xl: ${shared.shadows.xl};

    /* Borders */
    --cu-border-none: ${shared.borders.width.none};
    --cu-border-thin: ${shared.borders.width.thin};
    --cu-border-medium: ${shared.borders.width.medium};
    --cu-border-thick: ${shared.borders.width.thick};
    --cu-border-color: ${shared.borders.color.default};
    --cu-border-color-strong: ${shared.borders.color.strong};
    --cu-border-color-focus: ${shared.borders.color.focus};`
}

function themeBlock(tokens: any) {
  let block = ''
  if (tokens.colors) block += colorsBlock(tokens.colors)
  block += sharedBlock(tokens)
  return block
}

// Generate themes.css: :root (first theme) + [data-theme] for each theme
export function generateThemesCSS(themes: Record<string, any>, shared: any) {
  const names = Object.keys(themes)
  const first = names[0]

  let css = ''

  // :root = first theme (default)
  if (first) {
    const merged = { ...shared, colors: themes[first].colors }
    css += `:root {\n${themeBlock(merged)}\n}`
  }

  // [data-theme] for each theme
  for (const [name, tokens] of Object.entries(themes)) {
    const merged = { ...shared, colors: tokens.colors }
    css += `\n\n[data-theme="${name}"] {\n${themeBlock(merged)}\n}`
  }

  return css
}

// Generate single theme CSS: [data-theme="{name}"] with all variables
export function generateThemeCSS(name: string, tokens: any, shared: any) {
  const merged = { ...shared, colors: tokens.colors }
  return `[data-theme="${name}"] {\n${themeBlock(merged)}\n}`
}

export function inject(css: string) {
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = 'cu-tokens'
    document.head.appendChild(styleEl)
  }
  styleEl.textContent = css
}

// Standalone init for UMD builds
export function initTokens(customConfig?: any) {
  const { themes: customThemes, ...customShared } = customConfig || {}
  const { themes: defaultThemes, ...defaultShared } = DEFAULTS

  const shared = Object.keys(customShared).length ? customShared : defaultShared
  const themes = customThemes || defaultThemes

  const css = generateThemesCSS(themes, shared)
  inject(css)
}
