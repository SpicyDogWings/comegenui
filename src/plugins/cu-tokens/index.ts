import { ref, type App } from 'vue'
import { DEFAULTS, DEFAULT_COLORS, DEFAULT_DARK_COLORS, extractColors, extractShared } from './defaults'
import { generateThemesCSS, inject } from './css'

const theme = ref('light')
const loaded = ref(false)
const themes = ref<Record<string, any>>({})
const shared = ref<any>({})
const themeNames = ref<string[]>([])
// Temas registrados en runtime (ej: el import del ThemeBuilder) — persisten
// en localStorage para sobrevivir recargas.
const customThemes = ref<Record<string, Record<string, string>>>({})
const CUSTOM_KEY = 'cu-custom-themes'

function detectTheme(): string {
  const saved = localStorage.getItem('cu-theme')
  if (saved && themeNames.value.includes(saved)) return saved
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
  return themeNames.value[0] || 'light'
}

function applyTheme(value: string) {
  document.documentElement.setAttribute('data-theme', value)
  localStorage.setItem('cu-theme', value)
  theme.value = value
}

function regenerateCSS() {
  inject(generateThemesCSS(themes.value, shared.value))
}

async function init() {
  try {
    const res = await fetch('/comegen.config.json')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const config = await res.json()

    if (config.themes && typeof config.themes === 'object') {
      // Multi-theme process
      const { themes: configThemes, ...configRest } = config

      // Shared tokens: defaults + config overrides (no colors)
      const mergedShared = { ...DEFAULTS, ...configRest }
      shared.value = extractShared(mergedShared)

      // Default colors for fallback
      const defaultColors = extractColors(DEFAULTS)

      // Each theme: default colors + theme overrides
      for (const [name, tokens] of Object.entries(configThemes) as [string, any][]) {
        const themeColors = tokens.colors || tokens
        themes.value[name] = { colors: { ...defaultColors, ...themeColors } }
      }
      themeNames.value = Object.keys(configThemes)
    } else {
      // Single theme process
      const merged = { ...DEFAULTS, ...config }
      const colors = extractColors(merged)
      shared.value = extractShared(merged)
      themes.value['light'] = { colors }
      themeNames.value = ['light']
    }

  } catch {
    console.warn('[Comegen] comegen.config.json no encontrado, usando defaults')
    shared.value = extractShared(DEFAULTS)
    themes.value = {
      light: { colors: { ...DEFAULT_COLORS } },
      dark: { colors: { ...DEFAULT_COLORS, ...DEFAULT_DARK_COLORS } }
    }
    themeNames.value = ['light', 'dark']
  } finally {
    restoreCustomThemes()
    loaded.value = true
    theme.value = detectTheme()
    applyTheme(theme.value)
    regenerateCSS()
  }
}

function setTheme(value: string) {
  if (themeNames.value.includes(value)) {
    applyTheme(value)
  }
}

function getThemeNames() {
  return themeNames.value
}

// Registra (o actualiza) un tema en runtime: queda en el theme chooser, su CSS
// se regenera con el resto y persiste en localStorage.
function registerTheme(name: string, colors: Record<string, string>) {
  const merged = { ...extractColors(DEFAULTS), ...colors }
  customThemes.value = { ...customThemes.value, [name]: colors }
  themes.value[name] = { colors: merged }
  if (!themeNames.value.includes(name)) themeNames.value = [...themeNames.value, name]
  try {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(customThemes.value))
  } catch {}
  regenerateCSS()
}

function restoreCustomThemes() {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY)
    if (!raw) return
    const stored = JSON.parse(raw) as Record<string, Record<string, string>>
    for (const [name, colors] of Object.entries(stored)) {
      customThemes.value = { ...customThemes.value, [name]: colors }
      themes.value[name] = { colors: { ...extractColors(DEFAULTS), ...colors } }
      if (!themeNames.value.includes(name)) themeNames.value = [...themeNames.value, name]
    }
  } catch {}
}

export default {
  install(app: App) {
    init()
  }
}

export { theme, loaded, setTheme, getThemeNames, registerTheme }
