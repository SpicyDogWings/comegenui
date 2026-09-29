import { defineComegenElement } from '@/utils/comegen-element'
import DatePicker from '@/components/customElements/form/DatePicker.ce.vue'
import { initTokens } from '@/plugins/cu-tokens/css'

initTokens()

const CuDatePicker = defineComegenElement('cu-date-picker', DatePicker)

export default CuDatePicker
