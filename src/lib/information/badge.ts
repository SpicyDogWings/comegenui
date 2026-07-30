import { defineCustomElement } from 'vue'
import Badge from '@/components/information/Badge.vue'
import { initTokens } from '@/plugins/cu-tokens/css'

initTokens()

const CuBadge = defineCustomElement(Badge)
customElements.define('cu-badge', CuBadge)

export default CuBadge
