import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import { DEFAULTS } from '@/plugins/cu-tokens/defaults'

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

const FULL_SHARED = {
  typography: DEFAULTS.typography,
  spacing: DEFAULTS.spacing,
  borderRadius: DEFAULTS.borderRadius,
  borders: { width: DEFAULTS.borders.width },
  shadows: DEFAULTS.shadows,
  modal: DEFAULTS.modal,
  sideover: DEFAULTS.sideover,
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

/** Módulos frescos + store lista, con el plugin ya cargado. */
async function boot() {
  const plugin = await import('@/plugins/cu-tokens')
  const { useThemeStore } = await import('@/stores/theme')
  setActivePinia(createPinia())
  const store = useThemeStore()
  await plugin.init()
  await nextTick()
  return { plugin, store }
}

beforeEach(() => {
  localStorage.clear()
  vi.resetModules()
  stubEnv()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('persistencia del tema custom (store)', () => {
  it('el plugin ya no escribe localStorage', async () => {
    const plugin = await import('@/plugins/cu-tokens')
    await plugin.init()

    plugin.registerTheme('custom', { primary: '#123456' }, { opacity: 42, shared: FULL_SHARED })
    plugin.applyFullConfig({ themes: { custom: { primary: '#abcdef' } } })
    plugin.setShared({ spacing: { md: '20px' } })

    expect(localStorage.getItem('cu-custom-themes')).toBeNull()
  })

  it('la store hidrata el custom desde localStorage y lo aplica al plugin', async () => {
    localStorage.setItem('cu-theme', 'custom')
    localStorage.setItem(
      'cu-custom-themes',
      JSON.stringify({
        custom: { colors: { primary: '#123456' }, opacity: 42, shared: { spacing: { md: '20px' } } },
      }),
    )

    const { plugin, store } = await boot()

    expect(plugin.getThemeNames()).toContain('custom')
    expect(plugin.allThemes.value.custom.colors.primary).toBe('#123456')
    expect(plugin.opacities.value.custom?.shadow).toBe(42)
    expect(plugin.getShared().spacing.md).toBe('20px')
    // El shared se completa con defaults (misma validación que un tema normal).
    expect(plugin.getShared().typography.fontSize.md).toBe(DEFAULTS.typography.fontSize.md)
    expect(store.isCustom).toBe(true)
  })

  it('la store persiste colors + opacidad + shared al registrar', async () => {
    const { store } = await boot()

    store.registerCustom({ primary: '#123456' }, FULL_SHARED, 42)

    const raw = JSON.parse(localStorage.getItem('cu-custom-themes') as string)
    expect(raw.custom.colors.primary).toBe('#123456')
    expect(raw.custom.opacity).toBe(42)
    expect(raw.custom.shared.spacing.md).toBe(DEFAULTS.spacing.md)
  })

  it('la store persiste lo importado, normalizando el shared parcial', async () => {
    const { plugin, store } = await boot()

    store.applyCustomFromImport({
      colors: { primary: '#abcdef' },
      shared: { ...FULL_SHARED, spacing: { ...DEFAULTS.spacing, md: '20px' } },
      opacities: { shadow: 25 },
    })

    const raw = JSON.parse(localStorage.getItem('cu-custom-themes') as string)
    expect(raw.custom.colors.primary).toBe('#abcdef')
    expect(raw.custom.opacity).toBe(25)
    expect(raw.custom.shared.spacing.md).toBe('20px')
    expect(plugin.opacities.value.custom?.shadow).toBe(25)
  })

  it('persiste e hidrata shadows, modal y sideover', async () => {
    const { store } = await boot()

    store.registerCustom({ primary: '#123456' }, {
      ...FULL_SHARED,
      shadows: { ...DEFAULTS.shadows, md: '0 0 8px' },
      modal: {
        size: { ...DEFAULTS.modal.size, lg: '42vw' },
        height: { ...DEFAULTS.modal.height, lg: '42vh' },
      },
      sideover: { size: { ...DEFAULTS.sideover.size, md: '480px' } },
    }, 10)

    const raw = JSON.parse(localStorage.getItem('cu-custom-themes') as string)
    expect(raw.custom.shared.shadows.md).toBe('0 0 8px')
    expect(raw.custom.shared.modal.size.lg).toBe('42vw')
    expect(raw.custom.shared.sideover.size.md).toBe('480px')

    // Recarga: módulo nuevo sobre el mismo localStorage.
    vi.resetModules()
    stubEnv()
    const reloaded = await import('@/plugins/cu-tokens')
    const { useThemeStore } = await import('@/stores/theme')
    setActivePinia(createPinia())
    const store2 = useThemeStore()
    await reloaded.init()
    await nextTick()

    expect(store2.customConfig?.shared.shadows.md).toBe('0 0 8px')
    expect(reloaded.getShared().modal.size.lg).toBe('42vw')
    expect(reloaded.getShared().sideover.size.md).toBe('480px')
  })

  it('migra sombras legacy con color embebido (deja geometría)', async () => {
    localStorage.setItem('cu-theme', 'custom')
    localStorage.setItem(
      'cu-custom-themes',
      JSON.stringify({
        custom: {
          colors: { primary: '#123456' },
          shared: { shadows: { sm: '0 1px 2px rgba(0,0,0,0.1)' } },
        },
      }),
    )

    const { plugin, store } = await boot()

    expect(store.customConfig?.shared.shadows.sm).toBe('0 1px 2px')
    expect(plugin.getShared().shadows.sm).toBe('0 1px 2px')
  })

  it('migra el formato legacy (mapa plano de colores)', async () => {
    localStorage.setItem('cu-theme', 'custom')
    localStorage.setItem('cu-custom-themes', JSON.stringify({ custom: { primary: '#abcdef' } }))

    const { plugin, store } = await boot()

    expect(plugin.allThemes.value.custom.colors.primary).toBe('#abcdef')
    // Colores parciales se completan con defaults.
    expect(store.customConfig?.colors.secondary).toBe(DEFAULTS.secondary)
  })

  it('descarta entradas inválidas', async () => {
    localStorage.setItem('cu-custom-themes', JSON.stringify({ custom: { colors: {} } }))

    const { store } = await boot()

    expect(store.customConfig).toBeNull()
  })
})
