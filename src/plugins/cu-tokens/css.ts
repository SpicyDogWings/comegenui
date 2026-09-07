import { darken, toHex, lighten, transparentize, mix } from 'color2k'
import { DEFAULTS, DEFAULT_COLORS, DEFAULT_OPACITIES, extractColors, extractShared } from './defaults'
import { hexToRgba } from '@/lib/colors'

let styleEl: HTMLStyleElement | null = null

export function colorVar(name: string, value: string, surface: string) {
  return `--cu-color-${name}: ${value};
    --cu-color-${name}-text: ${toHex(darken(value, 0.25))};
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
    --cu-color-${name}-subtle-border: ${transparentize(value, 0.5)};
    --cu-color-${name}-code: ${toHex(mix(value, surface, 0.4))};`
}

/* neutral es la tinta (texto/títulos del layout): debe contrastar con el
   surface. Si la paleta lo trae con la MISMA polaridad (tinta oscura sobre
   fondo oscuro o viceversa), se deriva del surface — una sola fuente de
   verdad: este generador (lib y ThemeBuilder usan colorsBlock). Si ya
   contrasta (ej. Nord #eceff4), se respeta tal cual. */
function luma01(hex: string): number {
  try {
    const h = toHex(hex)
    const r = parseInt(h.slice(1, 3), 16) / 255
    const g = parseInt(h.slice(3, 5), 16) / 255
    const b = parseInt(h.slice(5, 7), 16) / 255
    return 0.299 * r + 0.587 * g + 0.114 * b
  } catch {
    return 0.5
  }
}

export function resolveInk(surface: string, neutral?: string): string {
  const surfaceDark = luma01(surface) < 0.5
  if (neutral && (luma01(neutral) < 0.5) !== surfaceDark) return neutral
  return surfaceDark ? toHex(mix(surface, '#ffffff', 0.88)) : toHex(mix(surface, '#000000', 0.88))
}

export function colorsBlock(colors: any, themeName: string, opacities: Record<string, { shadow: number }>) {
  const ink = resolveInk(colors.surface, colors.neutral)
  const shadowOpacity = opacities[themeName]?.shadow ?? opacities.default?.shadow ?? 10
  const shadowRgba = hexToRgba(colors.shadow || '#000000', shadowOpacity)
  return `${colorVar('primary', colors.primary, colors.surface)}
    ${colorVar('secondary', colors.secondary, colors.surface)}
    ${colorVar('neutral', ink, colors.surface)}
    ${colorVar('success', colors.success, colors.surface)}
    ${colorVar('warning', colors.warning, colors.surface)}
    ${colorVar('danger', colors.danger, colors.surface)}
    --cu-color-surface: ${colors.surface};
    /* esquema de código: tokens dedicados (invierten con el tema) */
    --cu-code-bg: ${ink};
    --cu-code-text: ${colors.surface};
    --cu-code-faded: ${transparentize(colors.surface, 0.45)};
    /* per-theme shadow (color + opacidad 1-100) + border colors */
    --cu-shadow-color: ${shadowRgba};
    --cu-border-color: ${colors.default || '#d1d5db'};
    --cu-border-color-strong: ${colors.strong || '#6b7280'};
    --cu-border-color-focus: ${colors.focus || '#1774A4'};`
}

function shadowVar(name: string, value: string, color?: string) {
  if (/rgba?\(|hsla?\(|#[0-9a-f]{3,8}/i.test(value)) {
    return `--cu-shadow-${name}: ${value};`
  }
  return `--cu-shadow-${name}: ${value} var(--cu-shadow-color, ${color || '#000000'});`
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
    --cu-space-4xl: ${shared.spacing['4xl']};
    --cu-space-5xl: ${shared.spacing['5xl']};

    /* Border Radius */
    --cu-radius: ${shared.borderRadius.default};
    --cu-radius-none: ${shared.borderRadius.none};
    --cu-radius-sm: ${shared.borderRadius.sm};
    --cu-radius-md: ${shared.borderRadius.md};
    --cu-radius-lg: ${shared.borderRadius.lg};
    --cu-radius-full: ${shared.borderRadius.full};

    /* Shadows (sizes only — color is per-theme) */
    ${shadowVar('sm', shared.shadows.sm, 'currentColor')}
    ${shadowVar('md', shared.shadows.md, 'currentColor')}
    ${shadowVar('lg', shared.shadows.lg, 'currentColor')}
    ${shadowVar('xl', shared.shadows.xl, 'currentColor')}

    /* Borders (widths only — colors are per-theme) */
    --cu-border-none: ${shared.borders.width.none};
    --cu-border-thin: ${shared.borders.width.thin};
    --cu-border-medium: ${shared.borders.width.medium};
    --cu-border-thick: ${shared.borders.width.thick};

    /* Modal */
    --cu-modal-size-sm: ${shared.modal.size.sm};
    --cu-modal-size-md: ${shared.modal.size.md};
    --cu-modal-size-lg: ${shared.modal.size.lg};
    --cu-modal-size-xl: ${shared.modal.size.xl};
    --cu-modal-size-auto: ${shared.modal.size.auto};
    --cu-modal-size-full: ${shared.modal.size.full};
    --cu-modal-height-sm: ${shared.modal.height.sm};
    --cu-modal-height-md: ${shared.modal.height.md};
    --cu-modal-height-lg: ${shared.modal.height.lg};
    --cu-modal-height-xl: ${shared.modal.height.xl};
    --cu-modal-height-auto: ${shared.modal.height.auto};
    --cu-modal-height-full: ${shared.modal.height.full};`
}

function themeBlock(tokens: any, themeName: string, opacities: Record<string, { shadow: number }>) {
  let block = ''
  if (tokens.colors) block += colorsBlock(tokens.colors, themeName, opacities)
  block += sharedBlock(tokens)
  return block
}

// Generate themes.css: :root (first theme) + [data-theme] for each theme
export function generateThemesCSS(themes: Record<string, any>, shared: any, opacities: Record<string, { shadow: number }>) {
  const names = Object.keys(themes)
  const first = names[0]

  let css = ''

  // :root = first theme (default)
  if (first) {
    const merged = { ...shared, colors: themes[first].colors }
    css += `:root {\n${themeBlock(merged, first, opacities)}\n}`
  }

  // [data-theme] for each theme
  for (const [name, tokens] of Object.entries(themes)) {
    const merged = { ...shared, colors: tokens.colors }
    css += `\n\n[data-theme="${name}"] {\n${themeBlock(merged, name, opacities)}\n}`
  }

  return css
}

// Generate single theme CSS: [data-theme="{name}"] with all variables
export function generateThemeCSS(name: string, tokens: any, shared: any, opacities: Record<string, { shadow: number }>) {
  const merged = { ...shared, colors: tokens.colors }
  return `[data-theme="${name}"] {\n${themeBlock(merged, name, opacities)}\n}`
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
  // Skip if external CSS already defines --cu-color-primary on :root
  const existing = getComputedStyle(document.documentElement).getPropertyValue('--cu-color-primary').trim()
  if (existing) {
    return
  }

  const config = customConfig || {}

  let themes: Record<string, any> = {}
  let shared: any = {}
  const opacities = { ...DEFAULT_OPACITIES, ...config.opacities } as Record<string, { shadow: number }>

  if (config.themes && typeof config.themes === 'object') {
    // Multi-theme process
    const { themes: configThemes, ...configRest } = config
    const mergedShared = { ...DEFAULTS, ...configRest }
    shared = extractShared(mergedShared)
    const defaultColors = extractColors(DEFAULTS)

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

  const css = generateThemesCSS(themes, shared, opacities)
  inject(css)
}
