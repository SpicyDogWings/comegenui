import { ref, computed, watch, onMounted } from 'vue'
import {
  allThemes, opacities, loaded,
} from '@/plugins/cu-tokens'
import { useThemeStore } from '@/stores/theme'
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
  const typography = ref({ ...DEFAULTS.typography, ...store.getShared()?.typography })
  const spacing = ref({ ...DEFAULTS.spacing, ...store.getShared()?.spacing })
  const borderRadius = ref({ ...DEFAULTS.borderRadius, ...store.getShared()?.borderRadius })
  const borders = ref({
    width: { ...DEFAULTS.borders.width, ...store.getShared()?.borders?.width },
  })
  // Colores de borde: los resuelve el componente desde los tokens de color
  // (`default`/`strong`/`focus`), no hay grupo editable aparte.
  const shadowSizes = ['sm', 'md', 'lg', 'xl'] as const
  const shadows = ref(
    Object.fromEntries(
      shadowSizes.map((key) => [key, store.getShared()?.shadows?.[key] ?? DEFAULTS.shadows[key]]),
    ) as Record<(typeof shadowSizes)[number], string>,
  )
  const modal = ref({
    size: { ...DEFAULTS.modal.size, ...store.getShared()?.modal?.size },
    height: { ...DEFAULTS.modal.height, ...store.getShared()?.modal?.height },
  })
  const sideover = ref({
    size: { ...DEFAULTS.sideover.size, ...store.getShared()?.sideover?.size },
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
      shadows: JSON.parse(JSON.stringify(shadows.value)),
      modal: JSON.parse(JSON.stringify(modal.value)),
      sideover: JSON.parse(JSON.stringify(sideover.value)),
    }
  }

  // Formato plano (colores + opacidad + shared en la raíz): es el que consume
  // `applySingleTheme` al importar y el que se descarga/exporta.
  function exportConfig() {
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
    shadows.value = {
      sm: '0 1px 2px rgba(0,0,0,0.05)',
      md: '0 4px 6px rgba(0,0,0,0.1)',
      lg: '0 10px 15px rgba(0,0,0,0.1)',
      xl: '0 20px 25px rgba(0,0,0,0.1)',
    }
    modal.value = {
      size: { sm: '25vw', md: '30vw', lg: '35vw', xl: '40vw', auto: '50vw', full: '90vw' },
      height: { sm: '30vh', md: '40vh', lg: '50vh', xl: '60vh', auto: '50vh', full: '90vh' },
    }
    sideover.value = {
      size: { sm: '320px', md: '400px', lg: '512px', xl: '640px', full: '100%' },
    }
    // Reset explícito: persistir los defaults para que la recarga no recupere
    // la configuración anterior.
    store.registerCustom(
      { ...colors.value },
      sharedSnapshot(),
      parseInt(shadowOpacityRaw.value) || 10,
    )
  }

  function syncSharedFromPlugin() {
    const s = store.getShared()
    if (!s) return
    if (s.typography) typography.value = { ...typography.value, ...s.typography }
    if (s.spacing) spacing.value = { ...spacing.value, ...s.spacing }
    if (s.borderRadius) borderRadius.value = { ...borderRadius.value, ...s.borderRadius }
    if (s.borders?.width) borders.value = { width: { ...borders.value.width, ...s.borders.width } }
    if (s.shadows) shadows.value = { ...shadows.value, ...s.shadows }
    if (s.modal?.size) modal.value = { ...modal.value, size: { ...modal.value.size, ...s.modal.size } }
    if (s.modal?.height) modal.value = { ...modal.value, height: { ...modal.value.height, ...s.modal.height } }
    if (s.sideover?.size) sideover.value = { size: { ...sideover.value.size, ...s.sideover.size } }
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
      shared: sharedSnapshot(),
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
      shadows: { ...shadows.value, ...(cfg?.shadows ?? {}) },
      modal: {
        size: { ...DEFAULTS.modal.size, ...(cfg?.modal?.size ?? {}) },
        height: { ...DEFAULTS.modal.height, ...(cfg?.modal?.height ?? {}) },
      },
      sideover: { size: { ...DEFAULTS.sideover.size, ...(cfg?.sideover?.size ?? {}) } },
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
    shadows.value = merged.shadows
    modal.value = merged.modal
    sideover.value = merged.sideover
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

  // El plugin carga comegen.config.json de forma asíncrona; recién entonces
  // existen el tema custom restaurado de localStorage y su shared persistido.
  // Sin esto el form arranca en defaults aunque el tema ya esté aplicado.
  function syncFromPlugin() {
    syncSharedFromPlugin()
    initColorsFromTheme(themeName.value || 'light')
    shadowOpacityRaw.value = String(resolveOpacity(themeName.value))
    isEditing.value = store.isCustom
  }

  onMounted(syncFromPlugin)
  watch(loaded, (value) => {
    if (value) syncFromPlugin()
  })

  // Detectar cambios → solo cuando está editando (isEditing)
  watch([colors, shadowOpacityRaw, typography, spacing, borderRadius, borders, shadows, modal, sideover], () => {
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
    shadows,
    modal,
    sideover,
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
