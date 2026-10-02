import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import {
  theme as pluginTheme,
  loaded,
  setTheme as pluginSetTheme,
  registerTheme as pluginRegisterTheme,
  allThemes,
  builtInNames,
  getThemeNames as pluginGetThemeNames,
  getThemeCSS as pluginGetThemeCSS,
  getShared as pluginGetShared,
  setShared as pluginSetShared,
  applyFullConfig as pluginApplyFullConfig,
  normalizeShadow,
} from '@/plugins/cu-tokens'
import { DEFAULTS, DEFAULT_OPACITIES, extractColors } from '@/plugins/cu-tokens/defaults'

export interface CustomThemeConfig {
  colors: Record<string, string>
  shared: {
    typography: Record<string, any>
    spacing: Record<string, string>
    borderRadius: Record<string, string>
    borders: { width: Record<string, string>, color?: Record<string, string> }
    shadows: Record<string, string>
    modal: { size: Record<string, string>, height: Record<string, string> }
    sideover: { size: Record<string, string> }
  }
  opacities: { shadow: number }
}

// Persistencia del tema custom (solo los valores). El plugin sigue siendo la
// única fuente de verdad del estado; la store guarda/lee de localStorage y se
// lo aplica cuando terminó de cargar (init async). Misma forma y validación que
// un tema normal: colores mergeados sobre DEFAULTS, opacidad por tema y shared.
const CUSTOM_KEY = 'cu-custom-themes'

type ThemeEntryLike =
  | Record<string, string>
  | { colors?: Record<string, string>; opacity?: unknown; shared?: any }

/** Sombras canónicas: geometría con unidad (sin color), completadas sobre DEFAULTS. */
function normalizeShadowMap(source: Record<string, string | undefined> | undefined): Record<string, string> {
  return Object.fromEntries(
    Object.entries({ ...DEFAULTS.shadows, ...(source ?? {}) }).map(([key, value]) => [
      key,
      normalizeShadow(value),
    ]),
  )
}

/** Normaliza/valida una entrada (v2 `{colors,opacity,shared}` o legacy plano). */
function normalizeConfig(input: ThemeEntryLike | null | undefined): CustomThemeConfig | null {
  if (!input || typeof input !== 'object') return null
  const raw = input as any
  const colors = raw.colors ?? raw
  if (!colors || typeof colors !== 'object' || Array.isArray(colors)) return null

  const clean: Record<string, string> = {}
  for (const [key, value] of Object.entries(colors)) {
    if (typeof value === 'string' && value.trim()) clean[key] = value
  }
  if (Object.keys(clean).length === 0) return null

  const shadow = Number(raw.opacity)
  const s = raw.shared ?? {}

  return {
    colors: { ...extractColors(DEFAULTS), ...clean },
    shared: {
      typography: { ...DEFAULTS.typography, ...(s.typography ?? {}) },
      spacing: { ...DEFAULTS.spacing, ...(s.spacing ?? {}) },
      borderRadius: { ...DEFAULTS.borderRadius, ...(s.borderRadius ?? {}) },
      borders: { width: { ...DEFAULTS.borders.width, ...(s.borders?.width ?? {}) } },
      shadows: normalizeShadowMap(s.shadows),
      modal: {
        size: { ...DEFAULTS.modal.size, ...(s.modal?.size ?? {}) },
        height: { ...DEFAULTS.modal.height, ...(s.modal?.height ?? {}) },
      },
      sideover: { size: { ...DEFAULTS.sideover.size, ...(s.sideover?.size ?? {}) } },
    },
    opacities: {
      shadow: Number.isFinite(shadow) ? shadow : DEFAULT_OPACITIES.default.shadow,
    },
  }
}

function entryFromConfig(config: CustomThemeConfig) {
  return {
    colors: config.colors,
    opacity: config.opacities.shadow,
    shared: config.shared,
  }
}

function readStoredConfig(): CustomThemeConfig | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(CUSTOM_KEY)
    if (!raw) return null
    const stored = JSON.parse(raw)
    return normalizeConfig(stored?.custom ?? stored)
  } catch {
    return null
  }
}

function persistConfig(config: CustomThemeConfig | null) {
  if (typeof window === 'undefined') return
  try {
    if (!config) {
      localStorage.removeItem(CUSTOM_KEY)
      return
    }
    localStorage.setItem(CUSTOM_KEY, JSON.stringify({ custom: entryFromConfig(config) }))
  } catch {}
}

export const useThemeStore = defineStore('theme', () => {
  const customConfig = ref<CustomThemeConfig | null>(readStoredConfig())

  const current = computed(() => pluginTheme.value)

  const themeNames = computed(() => pluginGetThemeNames())

  const isCustom = computed(() => pluginTheme.value === 'custom')

  const isBuiltIn = computed(() => builtInNames.value.includes(pluginTheme.value))

  const showEditBtn = computed(() => !isCustom.value)

  const themes = computed(() => allThemes.value)

  // Aplica el custom restaurado cuando el plugin terminó de cargar el config
  // (init es async): recién ahí `custom` existe y el shared quedó inicializado.
  let hydrated = false
  function hydrate() {
    if (hydrated) return
    hydrated = true
    if (!customConfig.value) return
    pluginApplyFullConfig({
      themes: { custom: customConfig.value.colors },
      opacities: { custom: customConfig.value.opacities },
      shared: customConfig.value.shared as any,
    })
    if (typeof window !== 'undefined' && localStorage.getItem('cu-theme') === 'custom') {
      pluginSetTheme('custom')
    }
  }

  watch(loaded, (value) => {
    if (value) hydrate()
  }, { immediate: true })

  function setTheme(name: string) {
    pluginSetTheme(name)
  }

  function toggleLightDark() {
    pluginSetTheme(pluginTheme.value === 'dark' ? 'light' : 'dark')
  }

  function getThemeColor(name: string): string {
    return allThemes.value[name]?.colors?.primary || '#888888'
  }

  function registerCustom(
    colors: Record<string, string>,
    shared: CustomThemeConfig['shared'],
    opacity: number,
  ) {
    const normalizedShared = { ...shared, shadows: normalizeShadowMap(shared.shadows) }
    const config: CustomThemeConfig = {
      colors: { ...extractColors(DEFAULTS), ...colors },
      shared: normalizedShared,
      opacities: { shadow: opacity },
    }
    customConfig.value = config

    pluginRegisterTheme('custom', colors, {
      opacity,
      shared: normalizedShared as any,
    })

    pluginSetTheme('custom')
    persistConfig(config)
  }

  function applyCustomFromImport(input: CustomThemeConfig) {
    const config = normalizeConfig({
      colors: input.colors,
      opacity: input.opacities?.shadow,
      shared: input.shared,
    })
    if (!config) return

    customConfig.value = config

    pluginApplyFullConfig({
      themes: { custom: config.colors },
      opacities: { custom: config.opacities },
      shared: config.shared as any,
    })

    pluginSetTheme('custom')
    persistConfig(config)
  }

  function getCSS(name: string): string {
    return pluginGetThemeCSS(name)
  }

  function getShared(): any {
    return pluginGetShared()
  }

  function setShared(patch: any) {
    pluginSetShared(patch)
    if (!customConfig.value) return
    customConfig.value = {
      ...customConfig.value,
      shared: { ...customConfig.value.shared, ...patch },
    }
    persistConfig(customConfig.value)
  }

  function resetCustomConfig() {
    customConfig.value = null
    persistConfig(null)
  }

  return {
    current,
    customConfig,
    themeNames,
    themes,
    isCustom,
    isBuiltIn,
    showEditBtn,
    setTheme,
    toggleLightDark,
    getThemeColor,
    registerCustom,
    applyCustomFromImport,
    getCSS,
    getShared,
    setShared,
    resetCustomConfig,
  }
})
