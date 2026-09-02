import { defineCustomElement } from 'vue'
import DatePickerRange from '@/components/customElements/form/DatePickerRange.ce.vue'
import { initTokens } from '@/plugins/cu-tokens/css'

initTokens()

const CuDatePickerRange = defineCustomElement(DatePickerRange)
customElements.define('cu-date-picker-range', CuDatePickerRange)

export default CuDatePickerRange
