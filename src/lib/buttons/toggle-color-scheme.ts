import { defineCustomElement } from 'vue'
import { initTokens } from '../../plugins/cu-tokens/css'
import ToggleColorScheme from '@/components/buttons/ToggleColorSheme.vue'

if (typeof window !== 'undefined') {
  const config = (window as any).__CU_TOKENS__ || (window as any).__CU_CONFIG__
  initTokens(config)
}

const CuToggleColorScheme = defineCustomElement(ToggleColorScheme)
customElements.define('cu-toggle-color-scheme', CuToggleColorScheme)

export default CuToggleColorScheme
