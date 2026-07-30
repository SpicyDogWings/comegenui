import { defineCustomElement } from 'vue'
import Badge from '@/components/information/Badge.vue'

const CuBadge = defineCustomElement(Badge)
customElements.define('cu-badge', CuBadge)

export default CuBadge
