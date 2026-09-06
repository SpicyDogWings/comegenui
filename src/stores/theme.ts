import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  theme as pluginTheme,
  setTheme as pluginSetTheme,
  registerTheme as pluginRegisterTheme,
  allThemes,
  builtInNames,
  getThemeNames as pluginGetThemeNames,
  getThemeCSS as pluginGetThemeCSS,
  getShared as pluginGetShared,
  setShared as pluginSetShared,
  applyFullConfig as pluginApplyFullConfig,
} from '@/plugins/cu-tokens'

export interface CustomThemeConfig {
  colors: Record<string, string>
  shared: {
    typography: Record<string, any>
    spacing: Record<string, string>
    borderRadius: Record<string, string>
    borders: { width: Record<string, string>, color?: Record<string, string> }
  }
  opacities: { shadow: number }
}

export const useThemeStore = defineStore('theme', () => {
  const customConfig = ref<CustomThemeConfig | null>(null)

  const current = computed(() => pluginTheme.value)

  const themeNames = computed(() => pluginGetThemeNames())

  const isCustom = computed(() => pluginTheme.value === 'custom')

  const isBuiltIn = computed(() => builtInNames.value.includes(pluginTheme.value))

  const showEditBtn = computed(() => !isCustom.value)

  const themes = computed(() => allThemes.value)

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
    const config: CustomThemeConfig = { colors, shared, opacities: { shadow: opacity } }
    customConfig.value = config

    pluginRegisterTheme('custom', colors, {
      opacity,
      shared: shared as any,
    })

    pluginSetTheme('custom')
  }

  function applyCustomFromImport(config: CustomThemeConfig) {
    customConfig.value = config

    pluginApplyFullConfig({
      themes: { custom: config.colors },
      opacities: { custom: config.opacities },
      shared: config.shared as any,
    })

    pluginSetTheme('custom')
  }

  function getCSS(name: string): string {
    return pluginGetThemeCSS(name)
  }

  function getShared(): any {
    return pluginGetShared()
  }

  function setShared(patch: any) {
    pluginSetShared(patch)
  }

  function resetCustomConfig() {
    customConfig.value = null
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
