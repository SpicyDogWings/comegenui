// Contraste WCAG del subtítulo de Card en los 15 temas.
//
// El subtítulo es texto secundario: no puede resolverse con `opacity` (diluye el
// color real y el contraste medido baja de 4.5:1 en varios temas). Se usa el
// token `-text-muted`, que el generador garantiza ≥4.5:1 contra el tinte real.
// Sobre `solid` no hay atenuado: el texto del tema ya contrasta.
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  MIN_TEXT_CONTRAST,
  colorsBlock,
  compositeOver,
  contrastRatio,
} from '@/plugins/cu-tokens/css'
import { DEFAULTS, DEFAULT_OPACITIES, extractColors, extractShared } from '@/plugins/cu-tokens/defaults'

const CONFIG = JSON.parse(
  readFileSync(resolve(import.meta.dirname, '../../../comegen.config.json'), 'utf8'),
) as { themes: Record<string, Record<string, string>> }

const BASE_COLORS = extractColors(DEFAULTS)
const SHARED = extractShared(DEFAULTS)
const COLORS = ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger']

const THEMES = Object.entries(CONFIG.themes).map(([name, colors]) => {
  const merged = { ...BASE_COLORS, ...SHARED, ...colors }
  return { name, css: colorsBlock(merged, name, DEFAULT_OPACITIES) }
})

function token(css: string, color: string, suffix: string): string {
  const match = new RegExp(`--cu-color-${color}${suffix}:\\s*([^;]+);`).exec(css)
  if (!match?.[1]) throw new Error(`falta --cu-color-${color}${suffix}`)
  return match[1].trim()
}

function surfaceOf(css: string): string {
  const match = /--cu-color-surface:\s*([^;]+);/.exec(css)
  if (!match?.[1]) throw new Error('falta --cu-color-surface')
  return match[1].trim()
}

const CARD_CSS = readFileSync(resolve(import.meta.dirname, './Card.vue'), 'utf8')

describe('Card — contraste del subtítulo en los 15 temas', () => {
  it('el subtítulo llega a 4.5:1 en cada variante y color', () => {
    const failures: string[] = []

    for (const theme of THEMES) {
      const surface = surfaceOf(theme.css)
      for (const color of COLORS) {
        const muted = token(theme.css, color, '-text-muted')
        const neutralMuted = token(theme.css, 'neutral', '-text-muted')
        const pairs: Array<[string, string, string]> = [
          // ghost: el subtítulo atenúa el texto neutro (ghost no usa el color).
          [`${color}/ghost`, neutralMuted, surface],
          [`${color}/outlined`, muted, surface],
          [`${color}/soft`, muted, compositeOver(token(theme.css, color, '-soft'), surface, 0.15)],
          [`${color}/subtle`, muted, compositeOver(token(theme.css, color, '-subtle'), surface, 0.1)],
          // solid: texto de máximo contraste sobre el color del tema (sin ajustar).
          [`${color}/solid`, token(theme.css, color, '-solid-text'), token(theme.css, color, '-solid')],
        ]
        for (const [label, fg, bg] of pairs) {
          const ratio = contrastRatio(fg, bg)
          if (ratio < MIN_TEXT_CONTRAST) {
            failures.push(`${theme.name} ${label}: ${ratio.toFixed(2)} < ${MIN_TEXT_CONTRAST} (${fg} sobre ${bg})`)
          }
        }
      }
    }

    expect(failures).toEqual([])
  })

  it('el CSS usa el token atenuado (no `opacity`) y el texto del tema sobre solid', () => {
    expect(CARD_CSS).toContain('color: var(--card-text-muted);')
    expect(CARD_CSS).not.toMatch(/\.cu-card-subtitle[^}]*opacity/)
    expect(CARD_CSS).toMatch(/\.cu-card--solid \.cu-card-subtitle\s*\{[^}]*color: var\(--card-solid-text\);/)
  })
})
