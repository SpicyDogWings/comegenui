import { defineCustomElement } from 'vue'
import Alert from '@/components/customElements/information/Alert.ce.vue'

const CuAlert = defineCustomElement(Alert)
customElements.define('cu-alert', CuAlert)

export default CuAlert
