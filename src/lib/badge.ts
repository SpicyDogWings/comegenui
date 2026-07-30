import { defineCustomElement } from 'vue'
import Badge from '@/components/customElements/Badge.ce.vue'

const CuBadge = defineCustomElement(Badge)
customElements.define('cu-badge', CuBadge)

export default CuBadge
