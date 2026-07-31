import { defineCustomElement } from 'vue'
import Button from '@/components/buttons/Button.vue'
import { initTokens } from '@/plugins/cu-tokens/css'

initTokens()

const CuButton = defineCustomElement(Button)
customElements.define('cu-button', CuButton)

export default CuButton
