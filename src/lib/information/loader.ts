import { defineCustomElement } from 'vue'
import Loader from '@/components/customElements/information/Loader.ce.vue'

const CuLoader = defineCustomElement(Loader)
customElements.define('cu-loader', CuLoader)

export default CuLoader
