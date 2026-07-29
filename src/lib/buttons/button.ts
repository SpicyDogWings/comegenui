import { defineCustomElement } from 'vue'
import { initTokens } from '../../plugins/cu-tokens/css'
import Button from '@/components/buttons/Button.vue'

// Initialize tokens (injects CSS variables)
if (typeof window !== 'undefined') {
  const config = (window as any).__CU_TOKENS__ || (window as any).__CU_CONFIG__
  initTokens(config)
}

// Register Custom Element
const CuButton = defineCustomElement(Button)
customElements.define('cu-button', CuButton)

export default CuButton
