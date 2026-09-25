import { defineCustomElement } from 'vue'
import FloatingButton from '@/components/buttons/FloatingButton.vue'
import { initTokens } from '@/plugins/cu-tokens/css'

initTokens()

const CuFloatingButton = defineCustomElement(FloatingButton)
customElements.define('cu-floating-button', CuFloatingButton)

export default CuFloatingButton
