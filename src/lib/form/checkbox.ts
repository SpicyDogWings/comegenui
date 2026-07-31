import { defineCustomElement } from 'vue'
import Checkbox from '@/components/customElements/form/Checkbox.ce.vue'

const CuCheckbox = defineCustomElement(Checkbox)
customElements.define('cu-checkbox', CuCheckbox)

export default CuCheckbox
