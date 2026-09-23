// src/plugins/cu-tokens/shiki.ts — Genera temas de Shiki (syntax highlighting)
// a partir de los colores de un tema de ComegenUI.
//
// Mismo esquema que `colorsBlock` (css.ts): el fondo/foreground salen de
// `--cu-code-bg` / `--cu-code-text` / `--cu-code-faded`, y los acentos de los
// scopes de TextMate se derivan de los colores semánticos. Así el resaltado
// queda coherente con los tokens que consume el resto de la librería.
//
// Solo cubre el contrato *raw* de Shiki (`ThemeRegistration`): un objeto plano
// `{ name, type, colors, settings }`. No importa Shiki en runtime.
import { mix, toHex, transparentize } from 'color2k'
import type { ThemeRegistration } from 'shiki'
import { resolveInk } from './css'
import { DEFAULTS, extractColors } from './defaults'

type CuColors = {
  primary: string
  secondary: string
  neutral: string
  success: string
  warning: string
  danger: string
  surface: string
  [key: string]: string
}

interface ThemeSetting {
  scope: string[]
  settings: { foreground?: string; fontStyle?: string }
}

/**
 * Asignación color semántico → scopes de TextMate.
 * Orden importa: Shiki aplica la primera coincidencia, de lo más específico a
 * lo más general.
 */
function settingsOf(colors: CuColors, code: { bg: string; text: string; faded: string }): ThemeSetting[] {
  const { primary, secondary, success, warning, danger } = colors
  return [
    // Comentarios y meta: el token "atenuado" (invierte con el tema).
    { scope: ['comment', 'punctuation.definition.comment', 'string.comment'], settings: { foreground: code.faded, fontStyle: 'italic' } },
    // Keywords / control de flujo → primary.
    {
      scope: [
        'keyword',
        'keyword.control',
        'keyword.operator',
        'storage',
        'storage.type',
        'storage.modifier',
        'constant.language',
        'variable.language',
      ],
      settings: { foreground: primary },
    },
    // Strings → success.
    {
      scope: [
        'string',
        'string.quoted',
        'string.template',
        'punctuation.definition.string',
        'constant.other.symbol',
      ],
      settings: { foreground: success },
    },
    // Números y constantes → warning.
    {
      scope: ['constant.numeric', 'constant', 'constant.other', 'support.constant', 'punctuation.definition.constant'],
      settings: { foreground: warning },
    },
    // Tags / tipos / clases → danger.
    {
      scope: [
        'entity.name.tag',
        'support.class',
        'entity.name.type',
        'entity.name.class',
        'support.type',
        'punctuation.definition.tag',
      ],
      settings: { foreground: danger },
    },
    // Funciones / atributos / propiedades → secondary.
    {
      scope: [
        'entity.name.function',
        'support.function',
        'variable.function',
        'meta.function-call',
        'entity.other.attribute-name',
        'variable.other.property',
        'support.type.property-name',
        'entity.name.section',
      ],
      settings: { foreground: secondary },
    },
    // Invalid → danger con subrayado.
    {
      scope: ['invalid', 'invalid.illegal'],
      settings: { foreground: danger, fontStyle: 'underline' },
    },
  ]
}

function isDark(surface: string): boolean {
  return luma(resolveInk(surface)) > 0.5
}

/** Luminancia relativa (WCAG). */
function relLuma(hex: string): number {
  const h = toHex(hex).replace('#', '')
  const [r = 0, g = 0, b = 0] = [0, 2, 4]
    .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Luminancia simple (para decidir polaridad). */
function luma(hex: string): number {
  const h = toHex(hex).replace('#', '')
  const [r = 0, g = 0, b = 0] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
  return 0.299 * r + 0.587 * g + 0.114 * b
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [relLuma(a), relLuma(b)].sort((x, y) => y - x)
  return ((hi ?? 0) + 0.05) / ((lo ?? 0) + 0.05)
}

/**
 * Acento legible sobre `bg`: mezcla el color hacia la tinta (mismo bg) y, si
 * todavía no alcanza 4.5:1, sigue acercándolo a blanco/negro puro. Conserva el
 * matiz del color CU pero garantiza contraste en los 16 temas.
 */
function readable(color: string, bg: string, min = 4.5): string {
  const target = luma(bg) < 0.5 ? '#ffffff' : '#000000'
  let best = color
  for (let amount = 0.35; amount <= 1.0001; amount += 0.05) {
    best = toHex(mix(color, target, amount))
    if (contrast(best, bg) >= min) return best
  }
  return best
}

/**
 * Tema Shiki de un tema de ComegenUI.
 *
 * @param colors colores resueltos (los mismos que recibe `colorsBlock`).
 * @param name nombre del tema (ej: `light`, `nord-frost`).
 */
export function shikiTheme(colors: CuColors, name: string): ThemeRegistration {
  const ink = resolveInk(colors.surface, colors.neutral)
  const code = {
    bg: ink,
    text: colors.surface,
    faded: toHex(transparentize(colors.surface, 0.45)),
  }
  // Acentos legibles sobre el fondo de código (contraste WCAG ≥ 4.5:1).
  const accents: CuColors = { ...colors }
  for (const key of ['primary', 'secondary', 'success', 'warning', 'danger']) {
    const base = colors[key]
    if (base) accents[key] = readable(base, code.bg)
  }
  return {
    name: `cu-${name}`,
    type: isDark(colors.surface) ? 'dark' : 'light',
    colors: { 'editor.background': code.bg, 'editor.foreground': code.text },
    settings: settingsOf(accents, code),
  }
}

/**
 * Todos los temas Shiki de un `comegen.config.json` (multi-tema).
 * Los colores se completan con los defaults (como hace `initTokens`).
 */
export function generateShikiThemes(config: Record<string, any> = {}): Record<string, ThemeRegistration> {
  const themes: Record<string, any> = config.themes ?? {}
  const defaultColors = extractColors(DEFAULTS as any)
  const out: Record<string, ThemeRegistration> = {}
  for (const [name, tokens] of Object.entries(themes)) {
    const colors = (tokens as any)?.colors ?? tokens
    out[name] = shikiTheme({ ...defaultColors, ...colors }, name)
  }
  return out
}
