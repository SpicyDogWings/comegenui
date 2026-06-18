import { defineCustomElement } from "vue";
import Select from "./Select.ce.vue";

const comegenSelect = defineCustomElement(Select);
customElements.define("cu-select", comegenSelect);

export default comegenSelect;
