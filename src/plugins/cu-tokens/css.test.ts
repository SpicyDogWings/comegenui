import { describe, it, expect } from 'vitest'
import { colorsBlock, colorVar, generateThemeCSS, generateThemesCSS, resolveInk } from './css'
import { DEFAULTS, extractShared } from './defaults'
import { stripShadowColor, parseShadow, composeShadow, normalizeShadow, normalizeShadowLength } from './shadow'

const COLORS = {
  primary: '#E73F1E',
  secondary: '#6366f1',
  neutral: '#1a1a1a',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  surface: '#eeeeee',
}

const COLOR_NAMES = ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger']

describe('resolveInk', () => {
  it('deriva la tinta cuando el neutral no contrasta con el surface (paleta oscura sin neutral claro)', () => {
    const ink = resolveInk('#1a1a1a', '#1a1a1a')
    const luma = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255
      const g = parseInt(hex.slice(3, 5), 16) / 255
      const b = parseInt(hex.slice(5, 7), 16) / 255
      return 0.299 * r + 0.587 * g + 0.114 * b
    }
    expect(luma(ink)).toBeGreaterThan(0.5)
  })

  it('respeta la tinta cuando ya contrasta (Nord)', () => {
    expect(resolveInk('#2e3440', '#eceff4')).toBe('#eceff4')
  })

  it('deriva tinta oscura sobre surface claro', () => {
    const ink = resolveInk('#eeeeee', '#eeeeee')
    expect(parseInt(ink.slice(1, 3), 16)).toBeLessThan(128)
  })
})

const OPACITIES = { default: { shadow: 10 } }

describe('colorsBlock', () => {
  it('genera --cu-color-{name}-code para cada color', () => {
    const css = colorsBlock(COLORS, 'light', OPACITIES)
    for (const name of COLOR_NAMES) {
      expect(css).toContain(`--cu-color-${name}-code:`)
    }
  })

  it('genera las 14 variantes por color', () => {
    const css = colorVar('primary', COLORS.primary, COLORS.surface)
    for (const variant of [
      '',
      '-text',
      '-hover',
      '-active',
      '-ghost-hover',
      '-ghost-active',
      '-soft',
      '-soft-hover',
      '-soft-active',
      '-subtle',
      '-subtle-hover',
      '-subtle-active',
      '-subtle-border',
      '-code',
    ]) {
      expect(css).toContain(`--cu-color-primary${variant}:`)
    }
  })

  it('genera el esquema de código --cu-code-* desde neutral/surface', () => {
    const css = colorsBlock(COLORS, 'light', OPACITIES)
    expect(css).toContain('--cu-code-bg: #1a1a1a')
    expect(css).toContain('--cu-code-text: #eeeeee')
    expect(css).toContain('--cu-code-faded: rgba(238,')
  })

  it('incluye --cu-color-surface', () => {
    expect(colorsBlock(COLORS, 'light', OPACITIES)).toContain('--cu-color-surface: #eeeeee')
  })
})

describe('generateThemesCSS / generateThemeCSS', () => {
  const shared = extractShared(DEFAULTS)

  it(':root y [data-theme] incluyen --cu-color-*-code y --cu-code-*', () => {
    const themes = {
      light: { colors: COLORS },
      dark: { colors: { ...COLORS, neutral: '#e5e5e5', surface: '#1c1c1c' } },
    }
    const css = generateThemesCSS(themes, shared, OPACITIES)
    const rootBlock = css.split('[data-theme')[0]
    const darkBlock = css.split('[data-theme="dark"')[1]

    expect(rootBlock).toContain('--cu-color-primary-code:')
    expect(rootBlock).toContain('--cu-code-bg: #1a1a1a')
    expect(rootBlock).toContain('--cu-code-text: #eeeeee')
    expect(darkBlock).toContain('--cu-color-primary-code:')
    expect(darkBlock).toContain('--cu-code-bg: #e5e5e5')
    expect(darkBlock).toContain('--cu-code-text: #1c1c1c')
  })

  it('generateThemeCSS emite el bloque completo de un tema', () => {
    const css = generateThemeCSS('light', { colors: COLORS }, shared, OPACITIES)
    expect(css).toContain('[data-theme="light"]')
    expect(css).toContain('--cu-color-danger-code:')
    expect(css).toContain('--cu-code-faded:')
  })
})

describe('sharedBlock: tokens completos', () => {
  const themes = { light: { colors: COLORS } }

  it('emite fontSize 3xl/4xl (los consumen Markdown h1/h2)', () => {
    const css = generateThemesCSS(themes, extractShared(DEFAULTS), OPACITIES)
    expect(css).toMatch(/--cu-font-size-3xl: [^;]+;/)
    expect(css).toMatch(/--cu-font-size-4xl: [^;]+;/)
  })

  it('completa las claves faltantes sobre DEFAULTS sin emitir undefined', () => {
    const partial = {
      ...extractShared(DEFAULTS),
      typography: { ...DEFAULTS.typography, fontSize: { xs: '0.5rem' } },
      spacing: { '2xs': '1px' },
    }
    const css = generateThemesCSS(themes, partial, OPACITIES)
    expect(css).not.toContain('undefined')
    expect(css).toContain('--cu-font-size-xs: 0.5rem')
    expect(css).toContain('--cu-font-size-3xl: 1.75rem')
    expect(css).toContain('--cu-space-2xs: 1px')
    expect(css).toContain('--cu-space-4xl: 64px')
    expect(css).toContain('--cu-space-5xl: 80px')
  })
})

describe('sombras: geometría + var(--cu-shadow-color)', () => {
  it('emite la geometría con el color del tema, sin rgba embebido', () => {
    const css = generateThemesCSS({ light: { colors: COLORS } }, extractShared(DEFAULTS), OPACITIES)
    expect(css).toContain('--cu-shadow-sm: 0px 1px 2px var(--cu-shadow-color')
    expect(css).toContain('--cu-shadow-xl: 0px 20px 25px var(--cu-shadow-color')
    expect(css).not.toMatch(/--cu-shadow-(?:sm|md|lg|xl):[^;]*(?:rgba|#)/)
  })

  it('--cu-shadow-color sale del color shadow + la opacidad del tema', () => {
    const themes = { light: { colors: { ...COLORS, shadow: '#102030' } } }
    const css = generateThemesCSS(themes, extractShared(DEFAULTS), { default: { shadow: 25 } })
    expect(css).toContain('--cu-shadow-color: rgba(16, 32, 48, 0.25)')
  })

  it('stripShadowColor saca el color legacy', () => {
    expect(stripShadowColor('0 4px 6px rgba(0,0,0,0.1)')).toBe('0 4px 6px')
    expect(stripShadowColor('0 1px 2px #000')).toBe('0 1px 2px')
  })

  it('parseShadow/composeShadow hacen round-trip', () => {
    expect(parseShadow('0 4px 6px rgba(0,0,0,0.1)')).toEqual({ x: '0', y: '4px', blur: '6px' })
    expect(parseShadow('')).toEqual({ x: '0', y: '0', blur: '0' })
    expect(composeShadow({ x: '0', y: '4px', blur: '6px' })).toBe('0 4px 6px')
  })

  it('normalizeShadowLength asume px cuando no hay unidad', () => {
    expect(normalizeShadowLength('0')).toBe('0px')
    expect(normalizeShadowLength('4')).toBe('4px')
    expect(normalizeShadowLength('.5')).toBe('.5px')
    expect(normalizeShadowLength('0rem')).toBe('0rem')
    expect(normalizeShadowLength('2em')).toBe('2em')
  })

  it('normalizeShadow deja geometría con unidad y sin color', () => {
    expect(normalizeShadow('0 4px 6px rgba(0,0,0,0.1)')).toBe('0px 4px 6px')
    expect(normalizeShadow('0rem 0 8')).toBe('0rem 0px 8px')
  })
})
