import { defineCustomElement } from 'vue'
import NavbarHorizontal from '@/components/customElements/overlay/NavbarHorizontal.ce.vue'
import { initTokens } from '@/plugins/cu-tokens/css'

initTokens()

const CuNavbarHorizontal = defineCustomElement(NavbarHorizontal)
customElements.define('cu-navbar-horizontal', CuNavbarHorizontal)

export default CuNavbarHorizontal