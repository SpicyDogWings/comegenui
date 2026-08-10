import { defineCustomElement } from 'vue'
import Collapse from '@/components/customElements/overlay/Collapse.ce.vue'
import { initTokens } from '@/plugins/cu-tokens/css'

initTokens()

const CuCollapse = defineCustomElement(Collapse)
customElements.define('cu-collapse', CuCollapse)

export default CuCollapse
