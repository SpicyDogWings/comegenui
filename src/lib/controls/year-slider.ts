import { defineCustomElement } from 'vue'
import YearSlider from '@/components/customElements/controls/YearSlider.ce.vue'
import { initTokens } from '@/plugins/cu-tokens/css'

initTokens()

const CuYearSlider = defineCustomElement(YearSlider)
customElements.define('cu-year-slider', CuYearSlider)

export default CuYearSlider
