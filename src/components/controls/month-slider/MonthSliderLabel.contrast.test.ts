// Contraste WCAG del label del MonthSlider/YearSlider (y del header de Calendar)
// en los 15 temas.
//
// El label pinta texto del color semántico sobre el tinte soft/subtle, sobre la
// superficie (outlined/ghost) o sobre el solid. Con el color base (`--ms-accent`)
// el par soft daba 1.57–4.25:1; el par que usan los tokens (`-text` sobre el
// tinte) está garantizado ≥4.5:1. Este test mide ese par real y además exige que
// el CSS del label use esos tokens (si vuelve al color base, falla).
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  MIN_BORDER_CONTRAST,
  MIN_TEXT_CONTRAST,
  colorsBlock,
  compositeOver,
  contrastRatio,
} from '@/plugins/cu-tokens/css'
import { DEFAULTS, DEFAULT_OPACITIES, extractColors, extractShared } from '@/plugins/cu-tokens/defaults'

const CONFIG = JSON.parse(
  readFileSync(resolve(import.meta.dirname, '../../../../comegen.config.json'), 'utf8'),
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

const LABEL_CSS = readFileSync(
  resolve(import.meta.dirname, './MonthSliderLabel.vue'),
  'utf8',
)

// Los dos hosts del label (MonthSlider y YearSlider) deben declarar las mismas
// variables: si a uno le falta `--ms-solid`, la variante solid queda sin fondo.
const HOSTS = ['MonthSlider.vue', 'YearSlider.vue'].map((name) => ({
  name,
  css: readFileSync(resolve(import.meta.dirname, `../${name}`), 'utf8'),
}))

describe('MonthSliderLabel — contraste del label en los 15 temas', () => {
  it('el texto llega a 4.5:1 en cada variante y el borde outlined a 3:1', () => {
    const failures: string[] = []

    for (const theme of THEMES) {
      const surface = surfaceOf(theme.css)
      for (const color of COLORS) {
        const text = token(theme.css, color, '-text')
        const soft = (alpha: number) => compositeOver(token(theme.css, color, '-soft'), surface, alpha)
        const subtle = (alpha: number) => compositeOver(token(theme.css, color, '-subtle'), surface, alpha)
        const pairs: Array<[string, string, string, number]> = [
          [`${color}/soft`, text, soft(0.15), MIN_TEXT_CONTRAST],
          [`${color}/soft:hover`, text, soft(0.25), MIN_TEXT_CONTRAST],
          [`${color}/soft:active`, text, soft(0.35), MIN_TEXT_CONTRAST],
          [`${color}/subtle`, text, subtle(0.1), MIN_TEXT_CONTRAST],
          [`${color}/subtle:hover`, text, subtle(0.2), MIN_TEXT_CONTRAST],
          [`${color}/subtle:active`, text, subtle(0.3), MIN_TEXT_CONTRAST],
          [`${color}/outlined`, text, surface, MIN_TEXT_CONTRAST],
          [`${color}/ghost`, text, surface, MIN_TEXT_CONTRAST],
          [`${color}/solid`, surface, token(theme.css, color, '-solid'), MIN_TEXT_CONTRAST],
          [`${color}/solid:hover`, surface, token(theme.css, color, '-solid-hover'), MIN_TEXT_CONTRAST],
          [`${color}/outlined:border`, token(theme.css, color, '-border'), surface, MIN_BORDER_CONTRAST],
        ]
        for (const [label, fg, bg, min] of pairs) {
          const ratio = contrastRatio(fg, bg)
          if (ratio < min) {
            failures.push(`${theme.name} ${label}: ${ratio.toFixed(2)} < ${min} (${fg} sobre ${bg})`)
          }
        }
      }
    }

    expect(failures).toEqual([])
  })

  it('el CSS del label usa los tokens de texto accesibles (no el color base)', () => {
    // Texto de las variantes: siempre `-text` (o `surface` sobre solid).
    expect(LABEL_CSS).toContain('color: var(--ms-accent-text);')
    expect(LABEL_CSS).not.toContain('color: var(--ms-accent);')
    // Fondo del solid: la variante ajustada, no el color base.
    expect(LABEL_CSS).toContain('background-color: var(--ms-solid);')
    expect(LABEL_CSS).not.toContain('background-color: var(--ms-accent);')
    // Borde del outlined: el token de borde (≥3:1).
    expect(LABEL_CSS).toContain('border: var(--cu-border-thin) solid var(--ms-accent-border);')
  })
})

describe('MonthSliderLabel — variables que declaran sus hosts', () => {
  it('MonthSlider y YearSlider declaran las variables que el label usa', () => {
    const required = ['--ms-accent-text', '--ms-accent-border', '--ms-solid', '--ms-solid-hover', '--ms-soft', '--ms-subtle', '--ms-surface']
    for (const host of HOSTS) {
      for (const variable of required) {
        expect(host.css, `${host.name} sin ${variable}`).toContain(`'${variable}':`)
      }
    }
  })
})
