import { defineCustomElement } from 'vue'
import DatePicker from '@/components/customElements/form/DatePicker.ce.vue'
import { initTokens } from '@/plugins/cu-tokens/css'

initTokens()

const CuDatePicker = defineCustomElement(DatePicker)
customElements.define('cu-date-picker', CuDatePicker)

export default CuDatePicker
