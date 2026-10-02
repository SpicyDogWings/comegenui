import { defineComegenElement } from '@/utils/comegen-element'
import Button from '@/components/buttons/Button.vue'
import { initTokens } from '@/plugins/cu-tokens/css'

initTokens()

const CuButton = defineComegenElement('cu-button', Button)

export default CuButton
