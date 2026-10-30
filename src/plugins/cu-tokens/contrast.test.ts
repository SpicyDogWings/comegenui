// Contraste WCAG de los tokens semánticos en TODOS los temas.
//
// Se generan los tokens con el mismo camino que producción (`colorsBlock` sobre
// las paletas de `comegen.config.json`) y se mide el par real que usa cada
// variante de Button/Badge/Alert: texto sobre el fondo que le toca (incluidos
// hover/active y los tintes soft/subtle/ghost) y bordes contra sus dos fondos
// adyacentes. Texto normal 12–18px: 4.5:1. Bordes no textuales: 3:1.
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  MIN_BORDER_CONTRAST,
  MIN_SUBTLE_CONTRAST,
  MIN_TEXT_CONTRAST,
  colorsBlock,
  compositeOver,
  contrastRatio,
  relativeLuminance,
} from './css'
import { DEFAULTS, DEFAULT_OPACITIES, extractColors, extractShared } from './defaults'

const CONFIG = JSON.parse(
  readFileSync(resolve(import.meta.dirname, '../../../comegen.config.json'), 'utf8'),
) as { themes: Record<string, Record<string, string>> }

const SHARED = extractShared(DEFAULTS)
const BASE_COLORS = extractColors(DEFAULTS)
const COLORS = ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger']
const OPACITIES = DEFAULT_OPACITIES

/** Bloques por tema tal como los emite el generador real. */
const THEMES = Object.entries(CONFIG.themes).map(([name, colors]) => {
  const merged = { ...BASE_COLORS, ...colors }
  return { name, merged, css: colorsBlock(merged, name, OPACITIES) }
})

function token(css: string, color: string, suffix: string): string {
  const match = new RegExp(`--cu-color-${color}${suffix}:\\s*([^;]+);`).exec(css)
  if (!match?.[1]) throw new Error(`falta --cu-color-${color}${suffix}`)
  return match[1].trim()
}

function themeSurface(css: string): string {
  const match = /--cu-color-surface:\s*([^;]+);/.exec(css)
  if (!match?.[1]) throw new Error('falta --cu-color-surface')
  return match[1].trim()
}

/** Un par texto/fondo que un componente pinta realmente. */
interface Pair {
  label: string
  fg: string
  bg: string
  min: number
}

function pairsOf(css: string, color: string): Pair[] {
  const surface = themeSurface(css)
  const base = token(css, color, '')
  const text = token(css, color, '-text')
  const tint = (tokenSuffix: string, alpha: number) =>
    compositeOver(token(css, color, tokenSuffix), surface, alpha)

  const pairs: Pair[] = [
    // solid / none: el texto es SIEMPRE el del tema (`surface`) y el fondo es
    // la variante ajustada por el generador.
    { label: `${color}/solid`, fg: surface, bg: token(css, color, '-solid'), min: MIN_TEXT_CONTRAST },
    { label: `${color}/solid:hover`, fg: surface, bg: token(css, color, '-solid-hover'), min: MIN_TEXT_CONTRAST },
    { label: `${color}/solid:active`, fg: surface, bg: token(css, color, '-solid-active'), min: MIN_TEXT_CONTRAST },
    // ghost / outlined / link: texto sobre la superficie
    { label: `${color}/ghost`, fg: text, bg: surface, min: MIN_TEXT_CONTRAST },
    { label: `${color}/outlined`, fg: text, bg: surface, min: MIN_TEXT_CONTRAST },
    { label: `${color}/link`, fg: text, bg: surface, min: MIN_TEXT_CONTRAST },
    // soft: texto sobre cada tinte (soft, hover, active)
    { label: `${color}/soft`, fg: text, bg: tint('-soft', 0.15), min: MIN_TEXT_CONTRAST },
    { label: `${color}/soft:hover`, fg: text, bg: tint('-soft-hover', 0.25), min: MIN_TEXT_CONTRAST },
    { label: `${color}/soft:active`, fg: text, bg: tint('-soft-active', 0.35), min: MIN_TEXT_CONTRAST },
    // subtle: texto sobre cada tinte
    { label: `${color}/subtle`, fg: text, bg: tint('-subtle', 0.1), min: MIN_TEXT_CONTRAST },
    { label: `${color}/subtle:hover`, fg: text, bg: tint('-subtle-hover', 0.2), min: MIN_TEXT_CONTRAST },
    { label: `${color}/subtle:active`, fg: text, bg: tint('-subtle-active', 0.3), min: MIN_TEXT_CONTRAST },
    // bordes: outlined sobre superficie; subtle contra el tinte y la superficie
    { label: `${color}/outlined:border`, fg: token(css, color, '-border'), bg: surface, min: MIN_BORDER_CONTRAST },
    { label: `${color}/subtle:border`, fg: token(css, color, '-subtle-border'), bg: tint('-subtle', 0.1), min: MIN_BORDER_CONTRAST },
    { label: `${color}/subtle:border-hover`, fg: token(css, color, '-subtle-border'), bg: tint('-subtle-hover', 0.2), min: MIN_BORDER_CONTRAST },
    { label: `${color}/subtle:border-active`, fg: token(css, color, '-subtle-border'), bg: tint('-subtle-active', 0.3), min: MIN_BORDER_CONTRAST },
    { label: `${color}/subtle:border-surface`, fg: token(css, color, '-subtle-border'), bg: surface, min: MIN_BORDER_CONTRAST },
  ]
  return pairs
}

describe('contraste de tokens en los 15 temas', () => {
  it('el config sigue teniendo los 15 temas auditados', () => {
    expect(THEMES.map((t) => t.name)).toEqual([
      'light',
      'dark',
      'nord-frost',
      'nord-aurora',
      'nord-snow-storm',
      'nord-polar-night',
      'gruvbox-dark',
      'gruvbox-light',
      'rose-pine',
      'rose-pine-moon',
      'rose-pine-dawn',
      'catppuccin-latte',
      'catppuccin-frappe',
      'catppuccin-macchiato',
      'catppuccin-mocha',
    ])
  })

  it('todo texto de Button/Badge/Alert llega a 4.5:1 y todo borde a 3:1', () => {
    const failures: string[] = []

    for (const theme of THEMES) {
      themeSurface(theme.css) // valida que el bloque salga completo
      for (const color of COLORS) {
        for (const pair of pairsOf(theme.css, color)) {
          const ratio = contrastRatio(pair.fg, pair.bg)
          if (ratio < pair.min) {
            failures.push(
              `${theme.name} ${pair.label}: ${ratio.toFixed(2)} < ${pair.min} (${pair.fg} sobre ${pair.bg})`,
            )
          }
        }
      }
    }

    expect(failures).toEqual([])
  })

  it('solid/none no eligen un texto negro/blanco por color (no existe -on)', () => {
    for (const theme of THEMES) {
      for (const color of COLORS) {
        expect(theme.css, `${theme.name}/${color}`).not.toContain(`--cu-color-${color}-on:`)
      }
    }
  })

  it('en temas claros, success/warning oscurecen el fondo y conservan el texto del tema', () => {
    const lightThemes = THEMES.filter((t) => relativeLuminance(themeSurface(t.css)) > 0.5)
    expect(lightThemes.length).toBeGreaterThanOrEqual(5)

    for (const theme of lightThemes) {
      const surface = themeSurface(theme.css)
      // El anti-patrón prohibido era voltear el texto a negro sobre success/warning.
      expect(surface, theme.name).not.toBe('#000000')
      expect(relativeLuminance(surface), theme.name).toBeGreaterThan(0.5)

      for (const color of ['success', 'warning']) {
        const solid = token(theme.css, color, '-solid')
        expect(contrastRatio(surface, solid), `${theme.name}/${color}`).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST)
        // Se ajustó el color (no el texto): el fondo queda más oscuro.
        expect(relativeLuminance(solid), `${theme.name}/${color}`).toBeLessThan(relativeLuminance(surface))
      }
    }
  })

  it('el fondo sólido se aclara en temas oscuros', () => {
    const darkThemes = THEMES.filter((t) => relativeLuminance(themeSurface(t.css)) < 0.5)
    expect(darkThemes.length).toBeGreaterThan(0)
    for (const theme of darkThemes) {
      const surface = themeSurface(theme.css)
      for (const color of COLORS) {
        const solid = token(theme.css, color, '-solid')
        expect(contrastRatio(surface, solid), `${theme.name}/${color}`).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST)
        expect(relativeLuminance(solid), `${theme.name}/${color}`).toBeGreaterThanOrEqual(relativeLuminance(surface))
      }
    }
  })
})

describe('texto atenuado: color con contraste real, no `opacity`', () => {
  /** Fondos reales donde se pinta un texto atenuado: superficie y tintes ghost/soft. */
  const tintsOf = (css: string, color: string) => {
    const surface = themeSurface(css)
    const base = token(css, color, '')
    return [surface, compositeOver(base, surface, 0.1), compositeOver(base, surface, 0.2)]
  }

  it('`-text-muted` llega a 4.5:1 y `-text-subtle` a 6:1 (o al máximo del texto) en los 15 temas', () => {
    const failures: string[] = []

    for (const theme of THEMES) {
      const surface = themeSurface(theme.css)
      for (const color of COLORS) {
        const text = token(theme.css, color, '-text')
        const tints = tintsOf(theme.css, color)
        const muted = token(theme.css, color, '-text-muted')
        const subtle = token(theme.css, color, '-text-subtle')
        const worstText = Math.min(...tints.map((bg) => contrastRatio(text, bg)))

        for (const [label, fg, min] of [
          ['muted', muted, MIN_TEXT_CONTRAST],
          ['subtle', subtle, Math.min(MIN_SUBTLE_CONTRAST, worstText)],
        ] as const) {
          const ratio = Math.min(...tints.map((bg) => contrastRatio(fg, bg)))
          if (ratio + 1e-9 < min) {
            failures.push(
              `${theme.name} ${color}/${label}: ${ratio.toFixed(2)} < ${min.toFixed(2)} (${fg})`,
            )
          }
        }

        // La jerarquía se conserva: subtle es al menos tan legible como muted.
        if (contrastRatio(subtle, surface) + 1e-9 < contrastRatio(muted, surface)) {
          failures.push(`${theme.name} ${color}: subtle (${subtle}) más tenue que muted (${muted})`)
        }
      }
    }

    expect(failures).toEqual([])
  })

  it('los atenuados son colores opacos (hex), no alfa: `opacity` no se puede auditar', () => {
    for (const theme of THEMES) {
      for (const color of COLORS) {
        for (const suffix of ['-text-muted', '-text-subtle']) {
          expect(token(theme.css, color, suffix), `${theme.name}/${color}${suffix}`).toMatch(
            /^#[0-9a-f]{6}$/i,
          )
        }
      }
    }
  })
})
