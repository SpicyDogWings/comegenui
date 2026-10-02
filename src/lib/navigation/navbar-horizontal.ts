import { defineComegenElement } from '@/utils/comegen-element'
import NavbarHorizontal from '@/components/customElements/navigation/NavbarHorizontal.ce.vue'
import { initTokens } from '@/plugins/cu-tokens/css'

initTokens()

const CuNavbarHorizontal = defineComegenElement('cu-navbar-horizontal', NavbarHorizontal)

export default CuNavbarHorizontal