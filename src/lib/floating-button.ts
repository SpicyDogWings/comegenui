import { defineComegenElement } from '@/utils/comegen-element'
import FloatingButton from '@/components/buttons/FloatingButton.vue'
import { initTokens } from '@/plugins/cu-tokens/css'

initTokens()

const CuFloatingButton = defineComegenElement('cu-floating-button', FloatingButton)

export default CuFloatingButton
