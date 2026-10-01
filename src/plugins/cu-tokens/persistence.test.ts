import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DEFAULTS } from './defaults'

const CONFIG = {
  themes: {
    light: {
      colors: {
        primary: '#E73F1E',
        secondary: '#6366f1',
        neutral: '#1a1a1a',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
        surface: '#eeeeee',
      },
    },
    dark: { colors: { surface: '#1a1a1a', neutral: '#e5e5e5' } },
  },
}

function stubEnv() {
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => CONFIG })))
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
    })),
  )
}

const SHARED = {
  typography: { ...DEFAULTS.typography, fontFamily: { sans: 'X', mono: 'Y' } },
  spacing: { ...DEFAULTS.spacing, md: '20px' },
  borderRadius: { ...DEFAULTS.borderRadius, default: '2px' },
  borders: { width: { ...DEFAULTS.borders.width, thin: '3px' } },
}

beforeEach(() => {
  localStorage.clear()
  vi.resetModules()
  stubEnv()
})

describe('persistencia del tema custom', () => {
  it('guarda colors + opacidad + shared (no solo los colores)', async () => {
    const mod = await import('./index')
    await mod.init()

    mod.registerTheme('custom', { primary: '#123456' }, { opacity: 42, shared: SHARED })

    const raw = JSON.parse(localStorage.getItem('cu-custom-themes') as string)
    expect(raw.custom.colors.primary).toBe('#123456')
    expect(raw.custom.opacity).toBe(42)
    expect(raw.custom.shared.spacing.md).toBe('20px')
  })

  it('restaura el tema custom completo al recargar (init)', async () => {
    const mod = await import('./index')
    await mod.init()
    mod.registerTheme('custom', { primary: '#123456' }, { opacity: 42, shared: SHARED })

    // Simula una recarga: módulo nuevo sobre el mismo localStorage.
    vi.resetModules()
    stubEnv()
    const reloaded = await import('./index')
    await reloaded.init()

    expect(reloaded.getThemeNames()).toContain('custom')
    expect(reloaded.allThemes.value.custom.colors.primary).toBe('#123456')
    expect(reloaded.opacities.value.custom?.shadow).toBe(42)
    expect(reloaded.getShared().spacing.md).toBe('20px')
    expect(reloaded.getShared().typography.fontFamily.sans).toBe('X')
  })

  it('persiste el import (applyFullConfig) sin depender de un edit posterior', async () => {
    const mod = await import('./index')
    await mod.init()

    mod.applyFullConfig({
      themes: { custom: { primary: '#abcdef' } },
      opacities: { custom: { shadow: 25 } },
      shared: SHARED,
    })

    vi.resetModules()
    stubEnv()
    const reloaded = await import('./index')
    await reloaded.init()

    expect(reloaded.allThemes.value.custom.colors.primary).toBe('#abcdef')
    expect(reloaded.opacities.value.custom?.shadow).toBe(25)
    expect(reloaded.getShared().spacing.md).toBe('20px')
  })

  it('migra el formato legacy (mapa plano de colores)', async () => {
    localStorage.setItem('cu-custom-themes', JSON.stringify({ custom: { primary: '#abcdef' } }))

    const mod = await import('./index')
    await mod.init()

    expect(mod.getThemeNames()).toContain('custom')
    expect(mod.allThemes.value.custom.colors.primary).toBe('#abcdef')
  })
})
