import { defineComegenElement } from '@/utils/comegen-element'
import Calendar from '@/components/customElements/controls/Calendar.ce.vue'
import { initTokens } from '@/plugins/cu-tokens/css'

initTokens()

const CuCalendar = defineComegenElement('cu-calendar', Calendar)

export default CuCalendar
