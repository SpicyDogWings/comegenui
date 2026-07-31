import { defineCustomElement } from 'vue'
import Tabs from '@/components/customElements/Tabs.ce.vue'
import { initTokens } from '@/plugins/cu-tokens/css'

initTokens()

const CuTabs = defineCustomElement(Tabs)
customElements.define('cu-tabs', CuTabs)

export default CuTabs
