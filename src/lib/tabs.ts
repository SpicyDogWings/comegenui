import { defineComegenElement } from '@/utils/comegen-element'
import Tabs from '@/components/customElements/Tabs.ce.vue'
import { initTokens } from '@/plugins/cu-tokens/css'

initTokens()

const CuTabs = defineComegenElement('cu-tabs', Tabs)

export default CuTabs
