import { defineComegenElement } from '@/utils/comegen-element'
import SideOver from '@/components/customElements/overlay/SideOver.ce.vue'
import { initTokens } from '@/plugins/cu-tokens/css'

initTokens()

const CuSideOver = defineComegenElement('cu-side-over', SideOver)

export default CuSideOver