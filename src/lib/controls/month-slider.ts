import { defineCustomElement } from 'vue'
import MonthSlider from '@/components/customElements/controls/MonthSlider.ce.vue'
import { initTokens } from '@/plugins/cu-tokens/css'

initTokens()

const CuMonthSlider = defineCustomElement(MonthSlider)
customElements.define('cu-month-slider', CuMonthSlider)

export default CuMonthSlider
