import { defineComegenElement } from "@/utils/comegen-element";
import DropdownMenu from "@/components/customElements/controls/DropdownMenu.ce.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const CuDropdownMenu = defineComegenElement("cu-dropdown-menu", DropdownMenu);

export default CuDropdownMenu;
