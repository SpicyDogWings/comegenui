import { ref, type App } from 'vue'
import { DEFAULTS, DEFAULT_COLORS, extractColors, extractShared } from './defaults'
import { generateThemesCSS, inject } from './css'

const theme = ref('light')
const loaded = ref(false)
const themes = ref<Record<string, any>>({})
const shared = ref<any>({})
const themeNames = ref<string[]>([])

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

export default {
  install(app: App) {
    init()
  }
}

export { theme, loaded, setTheme, getThemeNames }
