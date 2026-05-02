import { defineCustomElement } from "vue";
import Input from "./Input.ce.vue";

const CuInput = defineCustomElement(Input);
customElements.define("cu-input", CuInput);

export default CuInput;
