import { defineCustomElement } from 'vue'
import Calendar from '@/components/customElements/controls/Calendar.ce.vue'
import { initTokens } from '@/plugins/cu-tokens/css'

initTokens()

const CuCalendar = defineCustomElement(Calendar)
customElements.define('cu-calendar', CuCalendar)

export default CuCalendar
