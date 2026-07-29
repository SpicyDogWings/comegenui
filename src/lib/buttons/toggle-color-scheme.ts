import { defineCustomElement } from 'vue'
import { initTokens } from '../tokens'
import ToggleColorScheme from '@/components/buttons/ToggleColorSheme.vue'

// Initialize tokens (injects CSS variables)
initTokens()

// Register Custom Element
const CuToggleColorScheme = defineCustomElement(ToggleColorScheme)
customElements.define('cu-toggle-color-scheme', CuToggleColorScheme)

export default CuToggleColorScheme
