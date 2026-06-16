import { defineCustomElement } from "vue";
import Dropdown from "./Dropdown.ce.vue";

const comegenDropdown = defineCustomElement(Dropdown);
customElements.define("cu-dropdown", comegenDropdown);

export default comegenDropdown;
