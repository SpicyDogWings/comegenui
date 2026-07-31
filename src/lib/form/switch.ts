import { defineCustomElement } from 'vue'
import Switch from '@/components/customElements/form/Switch.ce.vue'

const CuSwitch = defineCustomElement(Switch)
customElements.define('cu-switch', CuSwitch)

export default CuSwitch
