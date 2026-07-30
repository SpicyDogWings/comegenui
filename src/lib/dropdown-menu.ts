import { defineCustomElement } from "vue";
import DropdownMenu from "@/components/customElements/DropdownMenu.ce.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const CuDropdownMenu = defineCustomElement(DropdownMenu);
customElements.define("cu-dropdown-menu", CuDropdownMenu);

export default CuDropdownMenu;
