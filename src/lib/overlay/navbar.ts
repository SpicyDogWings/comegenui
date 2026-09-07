import { defineCustomElement } from 'vue'
import Navbar from '@/components/customElements/overlay/Navbar.ce.vue'
import { initTokens } from '@/plugins/cu-tokens/css'

initTokens()

const CuNavbar = defineCustomElement(Navbar)
customElements.define('cu-navbar', CuNavbar)

export default CuNavbar
