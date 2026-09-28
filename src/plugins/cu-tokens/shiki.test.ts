import { describe, it, expect } from 'vitest'
import { generateShikiThemes, shikiTheme } from './shiki'

const COLORS = {
  primary: '#E73F1E',
  secondary: '#6366f1',
  neutral: '#1a1a1a',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  surface: '#eeeeee',
}

const relLuma = (hex: string) => {
  const h = hex.replace('#', '')
  const [r = 0, g = 0, b = 0] = [0, 2, 4]
    .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a: string, b: string) => {
  const [hi, lo] = [relLuma(a), relLuma(b)].sort((x, y) => y - x)
  return ((hi ?? 0) + 0.05) / ((lo ?? 0) + 0.05)
}

describe('shikiTheme', () => {
  it('nombra el tema con prefijo cu- y hereda la polaridad del fondo', () => {
    const light = shikiTheme(COLORS, 'light')
    expect(light.name).toBe('cu-light')
    expect(light.colors?.['editor.background']).toBe('#1a1a1a')
    expect(light.colors?.['editor.foreground']).toBe('#eeeeee')
  })

  it('mapea los scopes de TextMate a los colores CU', () => {
    const theme = shikiTheme(COLORS, 'light')
    const fgOf = (scope: string) =>
      theme.settings?.find((s) =>
        Array.isArray(s.scope) ? s.scope.includes(scope) : s.scope === scope,
      )?.settings.foreground
    for (const scope of [
      'keyword',
      'string',
      'constant.numeric',
      'entity.name.tag',
      'entity.name.function',
    ]) {
      expect(fgOf(scope), scope).toMatch(/^#[0-9a-f]{6}$/i)
    }
  })

  it('garantiza contraste WCAG >= 4.5:1 de los acentos sobre el fondo de código', () => {
    const theme = shikiTheme(COLORS, 'light')
    const bg = theme.colors!['editor.background'] as string
    for (const setting of theme.settings ?? []) {
      const fg = setting.settings.foreground
      expect(fg, JSON.stringify(setting.scope)).toBeTruthy()
      expect(contrast(fg as string, bg), JSON.stringify(setting.scope)).toBeGreaterThanOrEqual(4.5)
    }
  })
})

describe('generateShikiThemes', () => {
  it('genera un tema por cada tema del config', () => {
    const config = {
      themes: {
        light: { colors: COLORS },
        dark: { colors: { ...COLORS, neutral: '#e5e5e5', surface: '#1c1c1c' } },
      },
    }
    const themes = generateShikiThemes(config)
    expect(Object.keys(themes)).toEqual(['light', 'dark'])
    expect(themes.light?.name).toBe('cu-light')
    expect(themes.dark?.name).toBe('cu-dark')
  })
})
