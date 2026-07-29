import { defineCustomElement } from 'vue'
import { initTokens } from '../tokens'
import Button from '@/components/buttons/Button.vue'

// Initialize tokens (injects CSS variables)
initTokens()

// Register Custom Element
const CuButton = defineCustomElement(Button)
customElements.define('cu-button', CuButton)

export default CuButton
