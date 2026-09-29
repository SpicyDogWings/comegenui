import { defineComegenElement } from '@/utils/comegen-element'
import Badge from '@/components/information/Badge.vue'
import { initTokens } from '@/plugins/cu-tokens/css'

initTokens()

const CuBadge = defineComegenElement('cu-badge', Badge)

export default CuBadge
