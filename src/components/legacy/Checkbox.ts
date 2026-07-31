import { defineCustomElement } from "vue";
import Checkbox from "./Checkbox.ce.vue";

const CuCheckbox = defineCustomElement(Checkbox);
customElements.define("cu-checkbox", CuCheckbox);

export default CuCheckbox;
