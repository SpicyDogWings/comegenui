import { defineCustomElement } from 'vue'
import SideOver from '@/components/customElements/overlay/SideOver.ce.vue'
import { initTokens } from '@/plugins/cu-tokens/css'

initTokens()

const CuSideOver = defineCustomElement(SideOver)
customElements.define('cu-side-over', CuSideOver)

export default CuSideOver