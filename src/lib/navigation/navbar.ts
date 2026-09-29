import { defineComegenElement } from '@/utils/comegen-element'
import Navbar from '@/components/customElements/navigation/Navbar.ce.vue'
import { initTokens } from '@/plugins/cu-tokens/css'

initTokens()

const CuNavbar = defineComegenElement('cu-navbar', Navbar)

export default CuNavbar
