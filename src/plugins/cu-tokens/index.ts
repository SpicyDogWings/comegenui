import { ref, type App } from 'vue'
import { DEFAULTS } from './defaults'
import { deepMerge } from './merge'
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
    const custom = await res.json()

    // Extract themes from config, rest is shared
    const { themes: customThemes, ...customShared } = custom

    // Merge shared tokens with defaults
    shared.value = deepMerge(DEFAULTS, customShared)

    // Build themes: each theme merges with shared defaults
    if (customThemes && typeof customThemes === 'object') {
      for (const [name, tokens] of Object.entries(customThemes)) {
        themes.value[name] = deepMerge(shared.value, tokens)
      }
      themeNames.value = Object.keys(customThemes)
    } else {
      // No themes defined, use shared as the only theme
      themes.value['light'] = shared.value
      themeNames.value = ['light']
    }

  } catch {
    console.warn('[Comegen] comegen.config.json no encontrado, usando defaults')
    const { themes: defaultThemes, ...defaultShared } = DEFAULTS
    shared.value = defaultShared
    themes.value = defaultThemes
    themeNames.value = Object.keys(defaultThemes)
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
