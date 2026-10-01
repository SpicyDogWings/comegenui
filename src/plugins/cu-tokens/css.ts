import { darken, toHex, lighten, transparentize, mix } from 'color2k'
import { DEFAULTS, DEFAULT_COLORS, DEFAULT_OPACITIES, extractColors, extractShared } from './defaults'
import { hexToRgba } from '@/lib/colors'
import { normalizeShadow } from './shadow'

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
  // La sombra guarda solo geometría; el color/alfa sale de `--cu-shadow-color`
  // (color `shadow` + opacidad del tema). Se limpia cualquier color legacy.
  return `--cu-shadow-${name}: ${normalizeShadow(value)} var(--cu-shadow-color, ${color || '#000000'});`
}

function sharedBlock(shared: any) {
  // Cada grupo se completa sobre DEFAULTS: una config parcial (o que omita
  // claves como `fontSize.3xl`) igual emite todos los tokens, sin `undefined`.
  const fontFamily = { ...DEFAULTS.typography.fontFamily, ...(shared.typography?.fontFamily ?? {}) }
  const fontSize = { ...DEFAULTS.typography.fontSize, ...(shared.typography?.fontSize ?? {}) }
  const fontWeight = { ...DEFAULTS.typography.fontWeight, ...(shared.typography?.fontWeight ?? {}) }
  const lineHeight = { ...DEFAULTS.typography.lineHeight, ...(shared.typography?.lineHeight ?? {}) }
  const spacing = { ...DEFAULTS.spacing, ...(shared.spacing ?? {}) }
  const borderRadius = { ...DEFAULTS.borderRadius, ...(shared.borderRadius ?? {}) }
  const shadows = { ...DEFAULTS.shadows, ...(shared.shadows ?? {}) }
  const borders = { width: { ...DEFAULTS.borders.width, ...(shared.borders?.width ?? {}) } }
  const modal = {
    size: { ...DEFAULTS.modal.size, ...(shared.modal?.size ?? {}) },
    height: { ...DEFAULTS.modal.height, ...(shared.modal?.height ?? {}) },
  }
  const sideover = { size: { ...DEFAULTS.sideover.size, ...(shared.sideover?.size ?? {}) } }

  return `/* Typography */
    --cu-font-sans: ${fontFamily.sans};
    --cu-font-mono: ${fontFamily.mono};
    --cu-font-size-xs: ${fontSize.xs};
    --cu-font-size-sm: ${fontSize.sm};
    --cu-font-size-md: ${fontSize.md};
    --cu-font-size-lg: ${fontSize.lg};
    --cu-font-size-xl: ${fontSize.xl};
    --cu-font-size-2xl: ${fontSize['2xl']};
    --cu-font-size-3xl: ${fontSize['3xl']};
    --cu-font-size-4xl: ${fontSize['4xl']};
    --cu-font-weight-normal: ${fontWeight.normal};
    --cu-font-weight-medium: ${fontWeight.medium};
    --cu-font-weight-semibold: ${fontWeight.semibold};
    --cu-font-weight-bold: ${fontWeight.bold};
    --cu-line-height-tight: ${lineHeight.tight};
    --cu-line-height-normal: ${lineHeight.normal};
    --cu-line-height-relaxed: ${lineHeight.relaxed};

    /* Spacing */
    --cu-space-2xs: ${spacing['2xs']};
    --cu-space-xs: ${spacing.xs};
    --cu-space-sm: ${spacing.sm};
    --cu-space-md: ${spacing.md};
    --cu-space-lg: ${spacing.lg};
    --cu-space-xl: ${spacing.xl};
    --cu-space-2xl: ${spacing['2xl']};
    --cu-space-3xl: ${spacing['3xl']};
    --cu-space-4xl: ${spacing['4xl']};
    --cu-space-5xl: ${spacing['5xl']};

    /* Border Radius */
    --cu-radius: ${borderRadius.default};
    --cu-radius-none: ${borderRadius.none};
    --cu-radius-sm: ${borderRadius.sm};
    --cu-radius-md: ${borderRadius.md};
    --cu-radius-lg: ${borderRadius.lg};
    --cu-radius-full: ${borderRadius.full};

    /* Shadows (sizes only — color is per-theme) */
    ${shadowVar('sm', shadows.sm, 'currentColor')}
    ${shadowVar('md', shadows.md, 'currentColor')}
    ${shadowVar('lg', shadows.lg, 'currentColor')}
    ${shadowVar('xl', shadows.xl, 'currentColor')}

    /* Borders (widths only — colors are per-theme) */
    --cu-border-none: ${borders.width.none};
    --cu-border-thin: ${borders.width.thin};
    --cu-border-medium: ${borders.width.medium};
    --cu-border-thick: ${borders.width.thick};

    /* Modal */
    --cu-modal-size-sm: ${modal.size.sm};
    --cu-modal-size-md: ${modal.size.md};
    --cu-modal-size-lg: ${modal.size.lg};
    --cu-modal-size-xl: ${modal.size.xl};
    --cu-modal-size-auto: ${modal.size.auto};
    --cu-modal-size-full: ${modal.size.full};
    --cu-modal-height-sm: ${modal.height.sm};
    --cu-modal-height-md: ${modal.height.md};
    --cu-modal-height-lg: ${modal.height.lg};
    --cu-modal-height-xl: ${modal.height.xl};
    --cu-modal-height-auto: ${modal.height.auto};
    --cu-modal-height-full: ${modal.height.full};

    /* SideOver */
    --cu-sideover-size-sm: ${sideover.size.sm};
    --cu-sideover-size-md: ${sideover.size.md};
    --cu-sideover-size-lg: ${sideover.size.lg};
    --cu-sideover-size-xl: ${sideover.size.xl};
    --cu-sideover-size-full: ${sideover.size.full};`
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
