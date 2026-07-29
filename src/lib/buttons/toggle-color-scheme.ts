import { defineCustomElement } from 'vue'
import ToggleColorScheme from '@/components/buttons/ToggleColorSheme.vue'

const CuToggleColorScheme = defineCustomElement(ToggleColorScheme)
customElements.define('cu-toggle-color-scheme', CuToggleColorScheme)

export default CuToggleColorScheme
