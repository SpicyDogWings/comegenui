import { defineCustomElement } from 'vue'
import FloatingButton from '@/components/customElements/FloatingButton.ce.vue'

const CuFloatingButton = defineCustomElement(FloatingButton)
customElements.define('cu-floating-button', CuFloatingButton)

export default CuFloatingButton
