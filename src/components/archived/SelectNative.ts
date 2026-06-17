import { defineCustomElement } from "vue";
import Select from "./SelectNative.ce.vue";

const comegenSelect = defineCustomElement(Select);
customElements.define("cu-select-native", comegenSelect);

export default comegenSelect;
