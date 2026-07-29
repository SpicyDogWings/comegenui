import { defineCustomElement } from 'vue'
import Button from '@/components/buttons/Button.vue'

const CuButton = defineCustomElement(Button)
customElements.define('cu-button', CuButton)

export default CuButton
