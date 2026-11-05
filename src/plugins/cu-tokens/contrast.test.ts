// Contraste WCAG de los tokens semánticos en TODOS los temas.
//
// Se generan los tokens con el mismo camino que producción (`colorsBlock` sobre
// las paletas de `comegen.config.json`) y se mide el par real que usa cada
// variante de Button/Badge/Alert: texto sobre el fondo que le toca (incluidos
// hover/active y los tintes soft/subtle/ghost) y bordes contra sus dos fondos
// adyacentes. Texto normal 12–18px: 4.5:1. Bordes no textuales: 3:1.
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { globSync } from 'glob'
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

/** `--cu-border-color`, `-strong` o `-focus` del bloque de un tema. */
function borderToken(css: string, suffix: string): string {
  const match = new RegExp(`--cu-border-color${suffix}:\\s*([^;]+);`).exec(css)
  if (!match?.[1]) throw new Error(`falta --cu-border-color${suffix}`)
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

describe('bordes y anillo de foco: no textuales ≥ 3:1 (WCAG 1.4.11)', () => {
  const ROOT = resolve(import.meta.dirname, '../../..')

  /** Selector de un estado de foco: `:focus`, `:focus-visible` o `:focus-within`. */
  const FOCUS_SELECTOR = /:focus(?:-visible|-within)?(?![-\w])/
  /** Color de acento crudo: no tiene piso de contraste como borde. */
  const ACCENT_COLOR = /var\(--cu-color-(?:primary|secondary|neutral|success|warning|danger)\)/
  /** Declaraciones que pintan el anillo (`outline`, `box-shadow`, `border-color`). */
  const RING_DECLARATION = /(?:outline|box-shadow|border-color)\s*:([^;{}]*)/g

  /** Reglas de los bloques `<style>` de un `.vue` (ignora `<script>` y `<template>`). */
  function styleRules(source: string) {
    const styles = [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)]
      .map((block) => block[1] ?? '')
      .join('\n')
    return [...styles.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((rule) => ({
      selector: (rule[1] ?? '').replace(/\s+/g, ' ').trim(),
      body: rule[2] ?? '',
    }))
  }

  /** Valores que realmente dibujan algo: `outline: none` de un trigger no es anillo. */
  function ringDeclarations(body: string) {
    return [...body.matchAll(RING_DECLARATION)]
      .map((declaration) => (declaration[1] ?? '').trim())
      .filter((value) => value !== '' && !/^(?:none|0|transparent)$/i.test(value))
  }

  it('--cu-border-color / -strong / -focus llegan a 3:1 contra la superficie en los 15 temas', () => {
    const failures: string[] = []

    for (const theme of THEMES) {
      const surface = themeSurface(theme.css)
      for (const suffix of ['', '-strong', '-focus'] as const) {
        const value = borderToken(theme.css, suffix)
        const ratio = contrastRatio(value, surface)
        if (ratio + 1e-9 < MIN_BORDER_CONTRAST) {
          failures.push(
            `${theme.name} --cu-border-color${suffix}: ${ratio.toFixed(2)} < ${MIN_BORDER_CONTRAST} (${value} sobre ${surface})`,
          )
        }
      }
    }

    expect(failures).toEqual([])
  })

  it('el borde normal y el foco son colores opacos (hex): no dependen de `opacity`', () => {
    for (const theme of THEMES) {
      for (const suffix of ['', '-focus'] as const) {
        expect(borderToken(theme.css, suffix), `${theme.name}${suffix}`).toMatch(/^#[0-9a-f]{6}$/i)
      }
    }
  })

  it('`-strong` sigue siendo más marcado que el borde normal', () => {
    const failures: string[] = []
    for (const theme of THEMES) {
      const surface = themeSurface(theme.css)
      const normal = contrastRatio(borderToken(theme.css, ''), surface)
      const strong = contrastRatio(borderToken(theme.css, '-strong'), surface)
      if (strong + 1e-9 < normal) {
        failures.push(`${theme.name}: strong ${strong.toFixed(2)} < normal ${normal.toFixed(2)}`)
      }
    }
    expect(failures).toEqual([])
  })

  it('el borde del checkbox desmarcado usa `--cu-border-color` (el token con piso 3:1)', () => {
    const checkbox = readFileSync(resolve(ROOT, 'src/components/form/Checkbox.vue'), 'utf8')
    const boxRule = /\.cu-checkbox-box\s*\{([^}]*)\}/.exec(checkbox)?.[1] ?? ''
    expect(boxRule).toContain('var(--cu-border-color)')
  })

  it('ninguna regla de foco pinta el anillo con un acento crudo (componentes y páginas)', () => {
    const files = globSync(['src/components/**/*.vue', 'src/pages/**/*.vue'], {
      cwd: ROOT,
      ignore: ['**/legacy/**', '**/archived/**'],
    })
    const offenders: string[] = []

    for (const file of files) {
      for (const rule of styleRules(readFileSync(resolve(ROOT, file), 'utf8'))) {
        if (!FOCUS_SELECTOR.test(rule.selector)) continue
        if (ringDeclarations(rule.body).some((value) => ACCENT_COLOR.test(value))) {
          offenders.push(`${file} { ${rule.selector} }`)
        }
      }
    }

    // Un acento (`--cu-color-primary`) no tiene piso de contraste como borde:
    // en nord-polar-night queda en 1.69:1. El foco usa `--cu-border-color-focus`
    // o un `-text` (4.5:1 garantizado).
    expect(offenders).toEqual([])
  })

  it('los campos y la lista de archivos dibujan el anillo con `--cu-border-color-focus`', () => {
    const consumers = [
      'src/components/form/Input.vue',
      'src/components/form/Textarea.vue',
      'src/components/form/Select.vue',
      'src/components/form/FileInput.vue',
      'src/components/form/FileInputZone.vue',
      'src/components/FileList.vue',
    ]
    const failures: string[] = []

    for (const file of consumers) {
      const rings = styleRules(readFileSync(resolve(ROOT, file), 'utf8')).filter(
        (rule) => FOCUS_SELECTOR.test(rule.selector) && ringDeclarations(rule.body).length > 0,
      )
      if (rings.length === 0) failures.push(`${file}: sin anillo de foco`)

      for (const rule of rings) {
        for (const declaration of ringDeclarations(rule.body)) {
          if (!declaration.includes('var(--cu-border-color-focus)')) {
            failures.push(`${file} { ${rule.selector} }: ${declaration}`)
          }
        }
      }
    }

    // Un solo color de anillo por control: mezclar el token de foco con el borde
    // de la variante dibuja dos anillos con colores distintos.
    expect(failures).toEqual([])
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

describe('usos atenuados de los consumidores (color, no opacity)', () => {
  /** Fondos reales: superficie, ghost-hover (10 %) y ghost-active/soft (15–20 %). */
  const backgrounds = (css: string, color: string) => {
    const surface = themeSurface(css)
    const base = token(css, color, '')
    return {
      surface,
      ghost: compositeOver(base, surface, 0.1),
      soft: compositeOver(base, surface, 0.15),
      active: compositeOver(base, surface, 0.2),
    }
  }

  it('placeholders, descripciones y estados llegan a 4.5:1 en los 15 temas', () => {
    const failures: string[] = []

    for (const theme of THEMES) {
      const bg = backgrounds(theme.css, 'neutral')
      const muted = token(theme.css, 'neutral', '-text-muted')
      const subtle = token(theme.css, 'neutral', '-text-subtle')

      // Cada par es un uso real del texto atenuado en la lib.
      const uses: [string, string, string][] = [
        ['input/textarea placeholder', muted, bg.soft],
        ['file-input placeholder/ícono/tamaño', muted, bg.soft],
        ['select empty', subtle, bg.surface],
        ['navbar empty', subtle, bg.surface],
        ['calendar weekday', subtle, bg.surface],
        ['cells-importer status', subtle, bg.surface],
        ['dropdown item disabled', muted, bg.surface],
        ['dropdown item disabled (hover)', muted, bg.ghost],
        ['dropdown chevron', muted, bg.surface],
        ['dropdown/menu icon', subtle, bg.ghost],
        ['select/autocomplete option disabled', muted, bg.active],
        ['modal description', muted, bg.surface],
        ['table empty', muted, bg.surface],
        ['tabs disabled', muted, bg.surface],
        ['command-palette badge', subtle, bg.ghost],
      ]

      for (const [label, fg, back] of uses) {
        const ratio = contrastRatio(fg, back)
        if (ratio + 1e-9 < MIN_TEXT_CONTRAST) {
          failures.push(`${theme.name} ${label}: ${ratio.toFixed(2)} < 4.5 (${fg} sobre ${back})`)
        }
      }
    }

    expect(failures).toEqual([])
  })

  it('ningún componente atenúa texto con `--cu-alpha-muted`/`-subtle`', () => {
    const root = resolve(import.meta.dirname, '../../..')
    const files = globSync('src/components/**/*.vue', {
      cwd: root,
      ignore: ['**/legacy/**', '**/archived/**'],
    })
    const offenders = files.filter((file) =>
      /--cu-alpha-(muted|subtle)/.test(readFileSync(resolve(root, file), 'utf8')),
    )
    // Los tokens alpha quedan para atenuar controles completos (disabled/faded).
    expect(offenders).toEqual([])
  })
})
