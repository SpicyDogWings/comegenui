import { defineCustomElement } from "vue";
import DropdownMenu from "./DropdownMenu.ce.vue";

const comegenDropdownMenu = defineCustomElement(DropdownMenu);
customElements.define("cu-dropdown-menu", comegenDropdownMenu);

export default comegenDropdownMenu;
