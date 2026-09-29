import { defineComegenElement } from '@/utils/comegen-element'
import Collapse from '@/components/customElements/overlay/Collapse.ce.vue'
import { initTokens } from '@/plugins/cu-tokens/css'

initTokens()

const CuCollapse = defineComegenElement('cu-collapse', Collapse)

export default CuCollapse
