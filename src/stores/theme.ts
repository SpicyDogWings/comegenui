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
  removeTheme as pluginRemoveTheme,
  opacities,
  normalizeShadow,
} from '@/plugins/cu-tokens'
import { DEFAULTS, DEFAULT_OPACITIES, extractColors } from '@/plugins/cu-tokens/defaults'

export interface CustomThemeConfig {
  /** Nombre con el que el tema custom se registra y se exporta (`[data-theme="…"]`). */
  name: string
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

/** Resultado de renombrar el tema custom: el nombre vigente o el motivo del rechazo. */
export type RenameCustomResult =
  | { ok: true; name: string }
  | { ok: false; error: string }

// Persistencia del tema custom (solo los valores). El plugin sigue siendo la
// única fuente de verdad del estado; la store guarda/lee de localStorage y se
// lo aplica cuando terminó de cargar (init async). Misma forma y validación que
// un tema normal: colores mergeados sobre DEFAULTS, opacidad por tema y shared.
const CUSTOM_KEY = 'cu-custom-themes'

type ThemeEntryLike =
  | Record<string, string>
  | { name?: unknown; colors?: Record<string, string>; opacity?: unknown; shared?: any }

/**
 * Nombre canónico del tema custom: sólo minúsculas, números, guiones y puntos.
 * Es lo que va en `[data-theme="…"]` y en el nombre del archivo exportado, así
 * que se normaliza acá y no en cada punto de uso.
 */
export function normalizeThemeName(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]/g, '')
}

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
  const name = typeof raw.name === 'string' ? normalizeThemeName(raw.name) : ''

  return {
    name: name || 'custom',
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
    name: config.name,
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

/**
 * Tema activo persistido, leído al importar el módulo (antes de que init()
 * termine). detectTheme sólo reconoce nombres ya registrados, y el nombre
 * propio del custom todavía no existe: sin esta captura reescribiría `cu-theme`
 * con el fallback y el custom no volvería a quedar activo.
 */
const initialActiveTheme = typeof window !== 'undefined' ? localStorage.getItem('cu-theme') : null

export const useThemeStore = defineStore('theme', () => {
  const customConfig = ref<CustomThemeConfig | null>(readStoredConfig())

  const current = computed(() => pluginTheme.value)

  /** Nombre con el que está registrado el tema custom (el reservado si no hay). */
  const customName = computed(() => customConfig.value?.name ?? 'custom')

  const themeNames = computed(() => pluginGetThemeNames())

  const isCustom = computed(() => pluginTheme.value === customName.value)

  const isBuiltIn = computed(() => builtInNames.value.includes(pluginTheme.value))

  const showEditBtn = computed(() => !isCustom.value)

  const themes = computed(() => allThemes.value)

  /**
   * Config del custom cuando todavía no se editó nada: se toma del tema activo.
   * Es lo que permite renombrar (duplicar) un tema incluido sin haber entrado
   * en modo edición.
   */
  function snapshotActiveTheme(): CustomThemeConfig | null {
    const active = pluginTheme.value
    const activeColors = allThemes.value[active]?.colors
    if (!activeColors) return null
    return normalizeConfig({
      name: customName.value,
      colors: activeColors,
      opacity: opacities.value[active]?.shadow ?? DEFAULT_OPACITIES.default.shadow,
      shared: pluginGetShared(),
    })
  }

  // Aplica el custom restaurado cuando el plugin terminó de cargar el config
  // (init es async): recién ahí el shared quedó inicializado y el nombre del
  // custom puede registrarse sin pisar un tema incluido.
  let hydrated = false
  function hydrate() {
    if (hydrated) return
    hydrated = true
    const stored = customConfig.value
    if (!stored) return

    let name = stored.name
    if (builtInNames.value.includes(name)) {
      name = 'custom'
      customConfig.value = { ...stored, name }
      persistConfig(customConfig.value)
    }

    pluginApplyFullConfig({
      themes: { [name]: stored.colors },
      opacities: { [name]: stored.opacities },
      shared: stored.shared,
    })

    // ensureCustomTheme dejó el slot reservado; si el custom tiene nombre
    // propio, ese slot es un duplicado y no debe aparecer en el chooser.
    if (name !== 'custom') pluginRemoveTheme('custom')
    if (initialActiveTheme === name || initialActiveTheme === 'custom') pluginSetTheme(name)
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
    const name = customName.value
    const config: CustomThemeConfig = {
      name,
      colors: { ...extractColors(DEFAULTS), ...colors },
      shared: normalizedShared,
      opacities: { shadow: opacity },
    }
    customConfig.value = config

    pluginRegisterTheme(name, colors, {
      opacity,
      shared: normalizedShared,
    })

    pluginSetTheme(name)
    persistConfig(config)
  }

  /**
   * Cambia el nombre del tema custom (lo renombra o lo duplica desde el tema
   * activo si todavía no se editó) y lo registra con ese nombre. Un tema
   * incluido no se pisa: en ese caso devuelve el error y no cambia nada.
   */
  function renameCustom(rawName: string): RenameCustomResult {
    const name = normalizeThemeName(rawName)
    if (!name) return { ok: false, error: 'El nombre no puede quedar vacío' }

    const previous = customName.value
    if (name === previous) return { ok: true, name }
    if (builtInNames.value.includes(name)) {
      return { ok: false, error: `"${name}" es un tema incluido` }
    }

    const config = customConfig.value ?? snapshotActiveTheme()
    if (!config) return { ok: false, error: 'No hay un tema que renombrar' }

    const wasActive = pluginTheme.value === previous
    pluginRegisterTheme(name, config.colors, {
      opacity: config.opacities.shadow,
      shared: config.shared,
    })
    customConfig.value = { ...config, name }
    persistConfig(customConfig.value)

    if (wasActive) pluginSetTheme(name)
    if (previous !== name) pluginRemoveTheme(previous)
    return { ok: true, name }
  }

  function applyCustomFromImport(input: Omit<CustomThemeConfig, 'name'>) {
    const config = normalizeConfig({
      colors: input.colors,
      opacity: input.opacities?.shadow,
      shared: input.shared,
    })
    if (!config) return
    config.name = customName.value

    customConfig.value = config

    pluginApplyFullConfig({
      themes: { [config.name]: config.colors },
      opacities: { [config.name]: config.opacities },
      shared: config.shared,
    })

    pluginSetTheme(config.name)
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
    customName,
    themeNames,
    themes,
    isCustom,
    isBuiltIn,
    showEditBtn,
    setTheme,
    toggleLightDark,
    getThemeColor,
    registerCustom,
    renameCustom,
    applyCustomFromImport,
    getCSS,
    getShared,
    setShared,
    resetCustomConfig,
  }
})
