import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { nextTick, createApp, h } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import type { ThemeBuilderApi } from '@/composables/useThemeBuilder'

const CONFIG = {
  themes: {
    light: {
      colors: {
        primary: '#e73f1e',
        secondary: '#6366f1',
        neutral: '#1a1a1a',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
        surface: '#eeeeee',
      },
    },
    dark: {
      colors: {
        primary: '#60a5fa',
        secondary: '#818cf8',
        neutral: '#e5e5e5',
        success: '#4ade80',
        warning: '#fbbf24',
        danger: '#f87171',
        surface: '#1a1a1a',
      },
    },
  },
  opacities: {
    light: { shadow: 10 },
    dark: { shadow: 40 },
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

/** Plugin cargado + composable montado en un componente real. */
async function boot() {
  // Import dinámico a propósito: `vi.resetModules()` debe dar un plugin/store
  // frescos por test (refs de módulo singleton), un import estático los fijaría.
  const plugin = await import('@/plugins/cu-tokens')
  const { useThemeBuilder } = await import('@/composables/useThemeBuilder')
  setActivePinia(createPinia())
  await plugin.init()
  await nextTick()

  let api!: ThemeBuilderApi
  const app = createApp({
    setup() {
      api = useThemeBuilder()
      return () => h('div')
    },
  })
  const host = document.createElement('div')
  app.mount(host)
  await nextTick()

  return { plugin, api, unmount: () => app.unmount() }
}

beforeEach(() => {
  localStorage.clear()
  vi.resetModules()
  stubEnv()
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('useThemeBuilder: el form sigue al tema activo', () => {
  it('al cambiar de tema re-sincroniza los colores y la opacidad de sombra', async () => {
    const { plugin, api, unmount } = await boot()
    expect(api.colors.value.primary).toBe('#e73f1e')
    expect(api.shadowOpacityRaw.value).toBe('10')

    plugin.setTheme('dark')
    await nextTick()
    await nextTick()

    expect(api.colors.value.primary).toBe('#60a5fa')
    expect(api.colors.value.surface).toBe('#1a1a1a')
    expect(api.shadowOpacityRaw.value).toBe('40')
    unmount()
  })

  it('cambiar de tema mientras se edita sale del modo edición sin re-registrar el custom', async () => {
    const { plugin, api, unmount } = await boot()

    api.enableEditing()
    await nextTick()
    await nextTick()
    expect(api.isEditing.value).toBe(true)
    expect(plugin.theme.value).toBe('custom')

    plugin.setTheme('dark')
    await nextTick()
    await nextTick()

    expect(api.isEditing.value).toBe(false)
    expect(api.colors.value.primary).toBe('#60a5fa')
    // El watch profundo no debe devolver el tema a `custom` con los colores viejos.
    expect(plugin.theme.value).toBe('dark')
    unmount()
  })
})
