import { defineCustomElement } from 'vue'
import ColorPicker from '@/components/customElements/form/ColorPicker.ce.vue'

const CuColorPicker = defineCustomElement(ColorPicker)
customElements.define('cu-color-picker', CuColorPicker)

export default CuColorPicker
