import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  theme as pluginTheme,
  setTheme as pluginSetTheme,
  allThemes,
  builtInNames,
  type App as VueApp,
} from '@/plugins/cu-tokens'

export const useThemeStore = defineStore('theme', () => {
  const current = computed(() => pluginTheme.value)
  const themes = computed(() => allThemes.value)
  const builtIns = computed(() => builtInNames.value)
  const isBuiltIn = computed(() => builtInNames.value.includes(pluginTheme.value))

  function setTheme(name: string) {
    pluginSetTheme(name)
  }

  return {
    current,
    themes,
    builtIns,
    isBuiltIn,
    setTheme,
  }
})
