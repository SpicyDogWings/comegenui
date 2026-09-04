import { describe, it, expect } from 'vitest'
import { colorsBlock, colorVar, generateThemeCSS, generateThemesCSS, resolveInk } from './css'
import { DEFAULTS, extractShared } from './defaults'

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

describe('colorsBlock', () => {
  it('genera --cu-color-{name}-code para cada color', () => {
    const css = colorsBlock(COLORS)
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
    const css = colorsBlock(COLORS)
    expect(css).toContain('--cu-code-bg: #1a1a1a')
    expect(css).toContain('--cu-code-text: #eeeeee')
    expect(css).toContain('--cu-code-faded: rgba(238,')
  })

  it('incluye --cu-color-surface', () => {
    expect(colorsBlock(COLORS)).toContain('--cu-color-surface: #eeeeee')
  })
})

describe('generateThemesCSS / generateThemeCSS', () => {
  const shared = extractShared(DEFAULTS)

  it(':root y [data-theme] incluyen --cu-color-*-code y --cu-code-*', () => {
    const themes = {
      light: { colors: COLORS },
      dark: { colors: { ...COLORS, neutral: '#e5e5e5', surface: '#1c1c1c' } },
    }
    const css = generateThemesCSS(themes, shared)
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
    const css = generateThemeCSS('light', { colors: COLORS }, shared)
    expect(css).toContain('[data-theme="light"]')
    expect(css).toContain('--cu-color-danger-code:')
    expect(css).toContain('--cu-code-faded:')
  })
})
