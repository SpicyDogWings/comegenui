import { ref, computed, watch, onMounted } from 'vue'
import {
  allThemes, opacities,
} from '@/plugins/cu-tokens'
import { useThemeStore, type CustomThemeConfig } from '@/stores/theme'
import { DEFAULTS, DEFAULT_COLORS } from '@/plugins/cu-tokens/defaults'
import { hexToRgba } from '@/lib/colors'

// Motor del ThemeBuilder: estado editable (colors/shared/opacity), modo edición,
// import/export y la persistencia vía el store/plugin de temas.
// La página (ThemeBuilder.vue) solo consume estos refs y handlers; no hay lógica acá de UI.
export function useThemeBuilder() {
  const store = useThemeStore()

  const themeName = computed({
    get: () => store.current,
    set: (name: string) => store.setTheme(name),
  })

  const showEditBtn = computed(() => store.showEditBtn)
  const isEditing = ref(false)

  function resolveOpacity(name: string): number {
    return opacities.value[name]?.shadow ?? opacities.value.default?.shadow ?? 10
  }

  function initColorsFromTheme(name: string) {
    const themeColors = allThemes.value[name]?.colors
    if (themeColors) {
      const { shadowOpacity, ...rest } = themeColors
      colors.value = { ...colors.value, ...rest }
    }
  }

  const colors = ref({ ...DEFAULT_COLORS })

  initColorsFromTheme('light')

  const shadowOpacityRaw = ref(String(opacities.value.default?.shadow ?? 10))
  const typography = ref({ ...store.getShared()?.typography })
  const spacing = ref({ ...store.getShared()?.spacing })
  const borderRadius = ref({ ...store.getShared()?.borderRadius })
  const borders = ref({
    width: { ...store.getShared()?.borders?.width },
    color: { ...store.getShared()?.borders?.color },
  })

  const shadowPreview = computed(() =>
    hexToRgba(colors.value.shadow || '#000000', parseInt(shadowOpacityRaw.value) || 10),
  )

  // CSS de export: lo genera el plugin (colores + shared) — sin duplicación.
  const cssExport = computed(() => store.getCSS(themeName.value))

  function sharedSnapshot() {
    return {
      typography: JSON.parse(JSON.stringify(typography.value)),
      spacing: JSON.parse(JSON.stringify(spacing.value)),
      borderRadius: JSON.parse(JSON.stringify(borderRadius.value)),
      borders: { width: JSON.parse(JSON.stringify(borders.value.width)) },
    }
  }

  function exportConfig(): CustomThemeConfig {
    return {
      colors: { ...colors.value },
      opacities: { shadow: parseInt(shadowOpacityRaw.value) || 10 },
      ...sharedSnapshot(),
    }
  }

  function enableEditing() {
    const current = themeName.value
    const sourceColors = allThemes.value[current]?.colors
    if (sourceColors) {
      const { shadowOpacity, ...rest } = sourceColors
      colors.value = { ...colors.value, ...rest }
      shadowOpacityRaw.value = String(resolveOpacity(current))
    }
    isEditing.value = true
    store.registerCustom(
      { ...colors.value },
      sharedSnapshot(),
      parseInt(shadowOpacityRaw.value) || 10,
    )
    themeName.value = 'custom'
  }

  function resetToDefaults() {
    colors.value = {
      primary: '#E73F1E',
      secondary: '#6366f1',
      neutral: '#1a1a1a',
      success: '#22c55e',
      warning: '#f59e0b',
      danger: '#ef4444',
      surface: '#eeeeee',
      focus: '#1774A4',
      strong: '#6b7280',
      default: '#d1d5db',
      shadow: '#000000',
    }
    shadowOpacityRaw.value = '10'
    typography.value = {
      fontFamily: { sans: 'Inter, system-ui, sans-serif', mono: 'Fira Code, monospace' },
      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.75rem', '4xl': '2rem' },
      fontWeight: { normal: '400', medium: '500', semibold: '600', bold: '700' },
      lineHeight: { tight: '1.25', normal: '1.5', relaxed: '1.75' },
    }
    spacing.value = { '2xs': '2px', xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '24px', '2xl': '32px', '3xl': '48px', '4xl': '64px', '5xl': '80px' }
    borderRadius.value = { default: '8px', none: '0', sm: '4px', md: '8px', lg: '12px', full: '9999px' }
    borders.value = { width: { none: '0', thin: '1px', medium: '2px', thick: '4px' } }
  }

  function syncSharedFromPlugin() {
    const s = store.getShared()
    if (!s) return
    if (s.typography) typography.value = { ...typography.value, ...s.typography }
    if (s.spacing) spacing.value = { ...spacing.value, ...s.spacing }
    if (s.borderRadius) borderRadius.value = { ...borderRadius.value, ...s.borderRadius }
    if (s.borders) borders.value = { ...borders.value, ...s.borders }
  }

  const importedThemes = ref<string[]>([])
  const showImportPicker = ref(false)
  const lastImportedConfig = ref<any | null>(null)

  // Importa un config y decide el camino: multi-tema (picker) o tema plano.
  // Devuelve true si logró aplicarlo/encolarlo (la página puede cerrar su modal).
  function importConfig(config: any): boolean {
    const cfg = config as { themes?: Record<string, any>, colors?: Record<string, string> }
    const themeNames = Object.keys(cfg?.themes ?? {})

    if (themeNames.length > 0) {
      lastImportedConfig.value = cfg
      importedThemes.value = themeNames
      showImportPicker.value = true
      return true
    }

    // Config de un solo tema plano — el formato que exporta comegen.
    if (!cfg?.colors || typeof cfg.colors !== 'object' || Object.keys(cfg.colors).length === 0) {
      alert('No se encontraron temas en el archivo')
      return false
    }
    applyImportedTheme(cfg, 'custom')
    return true
  }

  function applyImportedTheme(cfg: any, name: string) {
    const themeColors = cfg?.themes?.[name]

    if (!themeColors) {
      applySingleTheme(cfg)
      return
    }

    // Multi-theme: aplica colores del tema elegido conservando el shared actual.
    const { shadowOpacity, ...rest } = themeColors

    store.applyCustomFromImport({
      colors: { ...rest },
      opacities: { shadow: cfg?.opacities?.[name]?.shadow ?? cfg?.opacities?.default?.shadow ?? 10 },
      ...sharedSnapshot(),
    })

    isEditing.value = true
    colors.value = { ...colors.value, ...rest }
    showImportPicker.value = false
  }

  // Aplica un tema plano (colores + opacidad + shared) fusionando los shared
  // sobre los DEFAULTS: "defaults + overrides del archivo", igual que init().
  function applySingleTheme(cfg: any) {
    const { shadowOpacity, ...rest } = cfg?.colors ?? {}
    const shadow =
      cfg?.opacities?.shadow ?? cfg?.opacities?.default?.shadow ?? (parseInt(shadowOpacityRaw.value) || 10)

    const merged = {
      typography: { ...DEFAULTS.typography, ...(cfg?.typography ?? {}) },
      spacing: { ...DEFAULTS.spacing, ...(cfg?.spacing ?? {}) },
      borderRadius: { ...DEFAULTS.borderRadius, ...(cfg?.borderRadius ?? {}) },
      borders: { width: { ...DEFAULTS.borders.width, ...(cfg?.borders?.width ?? {}) } },
    }

    store.applyCustomFromImport({
      colors: { ...rest },
      opacities: { shadow },
      shared: merged,
    })

    isEditing.value = true
    colors.value = { ...colors.value, ...rest }
    shadowOpacityRaw.value = String(shadow)
    typography.value = merged.typography
    spacing.value = merged.spacing
    borderRadius.value = merged.borderRadius
    borders.value = { ...borders.value, width: merged.borders.width }
    showImportPicker.value = false
  }

  function handleExport() {
    const config = exportConfig()
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `comegen-${themeName.value}-theme.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleCopyCSS() {
    navigator.clipboard.writeText(cssExport.value)
  }

  function handleDownloadCSS() {
    const blob = new Blob([cssExport.value], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `comegen-${themeName.value}-theme.css`
    a.click()
    URL.revokeObjectURL(url)
  }

  onMounted(() => {
    syncSharedFromPlugin()
    initColorsFromTheme(themeName.value)
    shadowOpacityRaw.value = String(resolveOpacity(themeName.value))
    isEditing.value = store.isCustom
  })

  // Detectar cambios → solo cuando está editando (isEditing)
  watch([colors, shadowOpacityRaw, typography, spacing, borderRadius, borders], () => {
    if (!isEditing.value) return
    store.registerCustom(
      { ...colors.value },
      sharedSnapshot(),
      parseInt(shadowOpacityRaw.value) || 10,
    )
    if (themeName.value !== 'custom') {
      themeName.value = 'custom'
    }
  }, { deep: true })

  return {
    themeName,
    showEditBtn,
    isEditing,
    enableEditing,
    colors,
    shadowOpacityRaw,
    typography,
    spacing,
    borderRadius,
    borders,
    shadowPreview,
    cssExport,
    exportConfig,
    importConfig,
    importedThemes,
    showImportPicker,
    lastImportedConfig,
    applyImportedTheme,
    handleExport,
    handleCopyCSS,
    handleDownloadCSS,
    resetToDefaults,
  }
}
